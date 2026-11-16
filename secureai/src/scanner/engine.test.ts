import { describe, expect, it } from 'vitest';
import type { SourceFile } from '../types/index.js';
import { SecurityScanner, maskSecrets } from './engine.js';
import { securityRules } from './rules.js';

// Built at runtime so no credential-shaped literal lives in this file.
const FAKE_AWS_KEY_ID = 'AKIA' + 'Q7Z4'.repeat(4);
const FAKE_AWS_SECRET = 'wJalr' + 'XUtnF'.repeat(7);

const scanner = new SecurityScanner();
const scan = (path: string, content: string) => scanner.scanFiles([{ path, content }], 'test-repo');
const ruleIds = (path: string, content: string) => scan(path, content).findings.map(f => f.ruleId);

describe('hardcoded secrets', () => {
  it('detects AWS key IDs and secret keys', () => {
    const result = scan(
      'config.js',
      `const accessKeyId = "${FAKE_AWS_KEY_ID}";\nconst aws_secret_access_key = "${FAKE_AWS_SECRET}";`
    );
    const ids = result.findings.map(f => f.ruleId);
    expect(ids).toContain('aws-access-key-id');
    expect(ids).toContain('aws-secret-access-key');
    expect(result.criticalCount).toBeGreaterThanOrEqual(2);
  });

  it('never republishes the secret in the report snippet or AI context', () => {
    const result = scan('config.js', `const accessKeyId = "${FAKE_AWS_KEY_ID}";`);
    for (const f of result.findings) {
      expect(f.code).not.toContain(FAKE_AWS_KEY_ID);
      expect(f.context).not.toContain(FAKE_AWS_KEY_ID);
      expect(f.description).not.toContain(FAKE_AWS_KEY_ID);
    }
  });

  it('detects generic API keys and passwords', () => {
    expect(ruleIds('app.js', `const apiKey = "k9f8s7d6f5g4h3j2k1l0qwerty";`)).toContain(
      'hardcoded-credential'
    );
    expect(ruleIds('db.js', `const password = 'hunter2hunter2';`)).toContain(
      'hardcoded-credential'
    );
  });

  it('ignores placeholders, env lookups and .env.example files', () => {
    expect(ruleIds('app.js', `const apiKey = "your_api_key_goes_here_123";`)).toEqual([]);
    expect(ruleIds('app.js', `const password = process.env.DB_PASSWORD;`)).toEqual([]);
    expect(ruleIds('.env.example', `API_KEY="k9f8s7d6f5g4h3j2k1l0qwerty"`)).toEqual([]);
  });

  it('detects private keys and masks the key body', () => {
    const body = 'MIIEpAIBAAKCAQEA' + 'x'.repeat(48);
    const result = scan(
      'key.js',
      `const k = \`-----BEGIN RSA PRIVATE KEY-----\n${body}\n-----END RSA PRIVATE KEY-----\`;`
    );
    expect(result.findings[0].ruleId).toBe('private-key');
    expect(result.findings[0].code).not.toContain(body);
  });
});

describe('injection rules', () => {
  it('flags non-literal innerHTML but not literal strings or sanitized values', () => {
    expect(ruleIds('a.js', `el.innerHTML = userInput;`)).toContain('xss-innerhtml');
    expect(ruleIds('a.js', `el.innerHTML = '<b>hi</b>';`)).not.toContain('xss-innerhtml');
    expect(ruleIds('a.js', `el.innerHTML = DOMPurify.sanitize(userInput);`)).not.toContain(
      'xss-innerhtml'
    );
  });

  it('flags eval and new Function but not methods named eval', () => {
    expect(ruleIds('a.js', `eval(code);`)).toContain('eval-usage');
    expect(ruleIds('a.js', `const f = new Function('a', body);`)).toContain('eval-usage');
    expect(ruleIds('a.js', `page.eval(script);`)).not.toContain('eval-usage');
  });

  it('flags concatenated and interpolated SQL', () => {
    expect(
      ruleIds('db.js', `const q = "SELECT * FROM users WHERE id = '" + req.query.id + "'";`)
    ).toContain('sql-injection');
    expect(
      ruleIds('db.js', 'db.query(`SELECT * FROM users WHERE id = ${req.params.id}`);')
    ).toContain('sql-injection');
    expect(ruleIds('db.js', `db.query('SELECT * FROM users WHERE id = $1', [id]);`)).not.toContain(
      'sql-injection'
    );
  });

  it('flags shell commands built from request input', () => {
    expect(ruleIds('a.js', 'exec(`ls ${req.query.dir}`);')).toContain('command-injection');
    expect(ruleIds('a.js', `execFile('ls', ['-la']);`)).not.toContain('command-injection');
  });

  it('flags file paths built from request input', () => {
    expect(ruleIds('a.js', `fs.readFile('/uploads/' + req.query.name, cb);`)).toContain(
      'path-traversal'
    );
  });
});

describe('weak crypto and configuration', () => {
  it('flags MD5 and SHA-1', () => {
    expect(ruleIds('h.js', `crypto.createHash('md5')`)).toContain('weak-hash');
    expect(ruleIds('h.js', `crypto.createHash("SHA1")`)).toContain('weak-hash');
    expect(ruleIds('h.js', `crypto.createHash('sha256')`)).toEqual([]);
  });

  it('flags short literal session secrets', () => {
    expect(ruleIds('s.js', `app.use(session({ secret: 'simple-secret' }));`)).toContain(
      'weak-session-secret'
    );
  });

  it('flags remote MongoDB URLs without credentials only', () => {
    expect(ruleIds('m.js', `connect('mongodb://db.internal:27017/app')`)).toContain(
      'mongodb-no-auth'
    );
    expect(ruleIds('m.js', `connect('mongodb://user:pw@db.internal:27017/app')`)).not.toContain(
      'mongodb-no-auth'
    );
    expect(ruleIds('m.js', `connect('mongodb://localhost:27017/app')`)).not.toContain(
      'mongodb-no-auth'
    );
  });
});

describe('file handling', () => {
  it('skips vendored, binary, oversized and asset files', () => {
    const files: SourceFile[] = [
      { path: 'node_modules/pkg/index.js', content: 'eval(x)' },
      { path: 'dist/app.js', content: 'eval(x)' },
      { path: 'logo.png', content: 'eval(x)' },
      { path: 'bin.js', content: 'eval(x)\u0000' },
      { path: 'big.js', content: 'eval(x)' + ' '.repeat(1024 * 1024) },
    ];
    const result = scanner.scanFiles(files, 'test-repo');
    expect(result.totalFindings).toBe(0);
    expect(result.filesScanned).toBe(0);
  });

  it('reports correct line and column numbers', () => {
    const [finding] = scan('a.js', `const a = 1;\nconst b = 2;\n  eval(code);`).findings;
    expect(finding.line).toBe(3);
    expect(finding.column).toBe(3);
    expect(finding.code).toContain('>    3 |   eval(code);');
  });

  it('reports one finding per rule per line', () => {
    expect(scan('a.js', `eval(a); eval(b);`).totalFindings).toBe(1);
  });

  it('sorts findings by severity', () => {
    const result = scan(
      'mixed.js',
      [
        `http.createServer(handler);`,
        `crypto.createHash('md5');`,
        `el.innerHTML = x;`,
        `const apiKey = "k9f8s7d6f5g4h3j2k1l0qwerty";`,
      ].join('\n')
    );
    expect(result.findings.map(f => f.severity)).toEqual(['critical', 'high', 'medium', 'low']);
  });

  it('finds nothing in reasonable secure code', () => {
    const result = scan(
      'secure.js',
      `import { scryptSync, randomBytes } from 'node:crypto';
export function hash(password) {
  const salt = randomBytes(16);
  return scryptSync(password, salt, 64);
}
export const render = (el, text) => { el.textContent = text; };
export const find = (db, id) => db.query('SELECT * FROM users WHERE id = $1', [id]);`
    );
    expect(result.totalFindings).toBe(0);
  });
});

describe('robustness', () => {
  it('every rule pattern is global', () => {
    for (const rule of securityRules) {
      for (const p of Array.isArray(rule.pattern) ? rule.pattern : [rule.pattern]) {
        expect(p.flags, rule.id).toContain('g');
      }
    }
  });

  it('stays fast on adversarial input', () => {
    const hostile = [
      'SELECT ' + "'".repeat(50_000),
      'secret = "' + 'a'.repeat(50_000),
      'session({' + ' '.repeat(50_000),
      'exec(' + 'req.'.repeat(20_000),
      '.innerHTML = ' + '`'.repeat(50_000),
    ].join('\n');
    const start = performance.now();
    scan('hostile.js', hostile);
    expect(performance.now() - start).toBeLessThan(2000);
  });

  it('rejects non-global patterns', () => {
    expect(() => new SecurityScanner([{ ...securityRules[0], pattern: /x/ }])).toThrow(/g flag/);
  });

  it('maskSecrets keeps a short prefix only', () => {
    expect(maskSecrets(`key="${FAKE_AWS_KEY_ID}"`)).toBe('key="AKIA********"');
  });
});
