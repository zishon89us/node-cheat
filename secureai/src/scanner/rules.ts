import type { ScannerRule } from '../types/index.js';

const PLACEHOLDER_HINTS = [
  'xxx',
  'your_',
  'your-',
  'changeme',
  'placeholder',
  'dummy',
  '<',
  '${',
  'process.env',
];

function isExampleFile(filePath: string): boolean {
  const lower = filePath.toLowerCase();
  return lower.endsWith('.example') || lower.includes('.env.example') || lower.includes('.sample');
}

function looksLikePlaceholder(value: string): boolean {
  const lower = value.toLowerCase();
  return PLACEHOLDER_HINTS.some(hint => lower.includes(hint));
}

function surrounding(content: string, index: number, radius: number): string {
  return content.slice(Math.max(0, index - radius), Math.min(content.length, index + radius));
}

/**
 * Patterns are kept linear: no nested quantifiers and no unbounded `.*` lookaheads,
 * so a hostile file cannot make the scanner backtrack catastrophically.
 */
export const securityRules: ScannerRule[] = [
  {
    id: 'aws-access-key-id',
    name: 'Hardcoded AWS Access Key ID',
    severity: 'critical',
    category: 'Hardcoded Secrets',
    pattern: /\b((?:AKIA|ASIA|AGPA|AIDA|AROA|AIPA|ANPA|ANVA)[A-Z0-9]{16})\b/g,
    validate: (_m, _c, filePath) => !isExampleFile(filePath),
    getMessage: () => 'An AWS access key ID is committed to the repository.',
    recommendation:
      'Remove the key, rotate it in IAM immediately, and load credentials from the environment or an IAM role.',
    redact: true,
    cwe: 'CWE-798',
  },
  {
    id: 'aws-secret-access-key',
    name: 'Hardcoded AWS Secret Access Key',
    severity: 'critical',
    category: 'Hardcoded Secrets',
    pattern:
      /(?:aws_?secret(?:_?access)?_?key|secretAccessKey)["']?\s*[:=]\s*["']([A-Za-z0-9/+=]{40})["']/gi,
    validate: (_m, _c, filePath) => !isExampleFile(filePath),
    getMessage: () => 'An AWS secret access key is committed to the repository.',
    recommendation:
      'Remove the key, rotate it in IAM immediately, and load credentials from the environment or an IAM role.',
    redact: true,
    cwe: 'CWE-798',
  },
  {
    id: 'hardcoded-credential',
    name: 'Hardcoded Credential',
    severity: 'critical',
    category: 'Hardcoded Secrets',
    pattern: [
      /\b(?:api[_-]?key|api[_-]?secret|client[_-]?secret|access[_-]?token|auth[_-]?token)["']?\s*[:=]\s*["']([A-Za-z0-9_\-.]{16,})["']/gi,
      /\b(?:secret|password|passwd|pwd)["']?\s*[:=]\s*["']([^"'\n{}]{8,})["']/gi,
    ],
    validate: (match, _c, filePath) =>
      !isExampleFile(filePath) && !looksLikePlaceholder(match[1] ?? ''),
    getMessage: () => 'A credential appears to be hardcoded in source.',
    recommendation:
      'Move the value to an environment variable or a secrets manager, and rotate it if it was ever real.',
    redact: true,
    cwe: 'CWE-798',
  },
  {
    id: 'private-key',
    name: 'Private Key in Repository',
    severity: 'critical',
    category: 'Hardcoded Secrets',
    pattern: /-----BEGIN (?:RSA |DSA |EC |OPENSSH |ENCRYPTED )?PRIVATE KEY-----/g,
    getMessage: () => 'A private key is committed to the repository.',
    recommendation:
      'Delete the key from the repository (and its history), revoke or rotate it, and load it from a secret store at runtime.',
    redact: true,
    cwe: 'CWE-321',
  },
  {
    id: 'xss-innerhtml',
    name: 'Unsanitized innerHTML Assignment',
    severity: 'high',
    category: 'Cross-Site Scripting (XSS)',
    pattern: /\.(?:innerHTML|outerHTML)\s*\+?=(?!\s*["'`][^"'`$\n]*["'`]\s*(?:;|\n|$))/g,
    validate: (match, content) =>
      !/(?:sanitize|DOMPurify|escapeHtml)/i.test(surrounding(content, match.index ?? 0, 200)),
    getMessage: () => 'A non-literal value is assigned to innerHTML without visible sanitization.',
    recommendation:
      'Use textContent for text, or sanitize HTML with DOMPurify before assigning it. Add a Content Security Policy.',
    cwe: 'CWE-79',
    references: ['https://owasp.org/www-community/attacks/xss/'],
  },
  {
    id: 'eval-usage',
    name: 'Dynamic Code Execution (eval)',
    severity: 'high',
    category: 'Code Injection',
    pattern: /(?<![\w.])eval\s*\(|\bnew\s+Function\s*\(/g,
    getMessage: () => 'eval() or new Function() executes strings as code.',
    recommendation:
      'Remove dynamic evaluation. Use JSON.parse for data or an explicit dispatch table for behavior.',
    cwe: 'CWE-95',
  },
  {
    id: 'sql-injection',
    name: 'SQL Built by String Concatenation',
    severity: 'high',
    category: 'SQL Injection',
    pattern: [
      /\b(?:SELECT|INSERT|UPDATE|DELETE)\b[^\n]{0,200}?["'`]\s*\+\s*(?:req\.|params\.|query\.|body\.|[a-zA-Z_]\w*\s*\+)/g,
      /\b(?:SELECT|INSERT|UPDATE|DELETE)\b[^\n`]{0,200}?\$\{(?:req\.|params\.|query\.|body\.)/g,
    ],
    getMessage: () => 'A SQL statement is assembled from concatenated or interpolated input.',
    recommendation: 'Use parameterized queries or a query builder/ORM that binds parameters.',
    cwe: 'CWE-89',
    references: ['https://owasp.org/www-community/attacks/SQL_Injection'],
  },
  {
    id: 'command-injection',
    name: 'Shell Command Built from Request Input',
    severity: 'high',
    category: 'Command Injection',
    pattern: [
      /\b(?:exec|execSync|spawn|spawnSync|execFile)\s*\(\s*(?:req\.|params\.|query\.|body\.)/g,
      /\b(?:exec|execSync)\s*\([^)\n]{0,200}\+\s*(?:req\.|params\.|query\.|body\.)/g,
      /\b(?:exec|execSync)\s*\(\s*`[^`\n]{0,200}\$\{(?:req\.|params\.|query\.|body\.)/g,
    ],
    getMessage: () => 'A shell command includes request-controlled input.',
    recommendation:
      'Avoid the shell. Use execFile/spawn with an argument array and an allowlist of permitted values.',
    cwe: 'CWE-78',
    references: ['https://owasp.org/www-community/attacks/Command_Injection'],
  },
  {
    id: 'path-traversal',
    name: 'File Path Built from Request Input',
    severity: 'high',
    category: 'Path Traversal',
    pattern:
      /\b(?:readFile|readFileSync|writeFile|writeFileSync|createReadStream|createWriteStream|unlink|unlinkSync|sendFile)\s*\([^)\n]{0,200}(?:req\.(?:query|params|body)\.)/g,
    getMessage: () => 'A filesystem path includes request-controlled input.',
    recommendation:
      'Resolve the path with path.resolve, verify it stays inside an allowed root, and reject anything else.',
    cwe: 'CWE-22',
  },
  {
    id: 'weak-hash',
    name: 'Weak Hash Algorithm',
    severity: 'medium',
    category: 'Weak Cryptography',
    pattern: /createHash\s*\(\s*["'](md5|sha1)["']\s*\)/gi,
    getMessage: match => `${match[1].toUpperCase()} is not collision resistant.`,
    recommendation: 'Use SHA-256 or better. For passwords use scrypt, Argon2 or bcrypt.',
    cwe: 'CWE-327',
  },
  {
    id: 'weak-session-secret',
    name: 'Weak Session Secret',
    severity: 'high',
    category: 'Session Management',
    pattern: /\bsession\s*\(\s*\{[^}]{0,300}?secret\s*:\s*["']([^"'\n]{1,31})["']/gi,
    getMessage: () => 'The session secret is a short literal.',
    recommendation:
      'Generate a random secret of at least 32 bytes (crypto.randomBytes(32).toString("hex")) and load it from the environment.',
    redact: true,
    cwe: 'CWE-331',
  },
  {
    id: 'error-details-exposed',
    name: 'Error Details Sent to Client',
    severity: 'medium',
    category: 'Information Disclosure',
    pattern: /\bres\.(?:send|json)\s*\([^)\n]{0,200}\b(?:err|error)\.stack\b/g,
    getMessage: () => 'A stack trace is returned in an HTTP response.',
    recommendation: 'Log errors server-side and return a generic message to clients.',
    cwe: 'CWE-209',
  },
  {
    id: 'plain-http-server',
    name: 'Plain HTTP Server',
    severity: 'low',
    category: 'Insecure Transport',
    pattern: /\bhttp\.createServer\s*\(/g,
    validate: (match, content) =>
      !/\bhttps\b|\btls\b/i.test(surrounding(content, match.index ?? 0, 500)),
    getMessage: () => 'An HTTP server is created without TLS.',
    recommendation:
      'Terminate TLS in front of the service (load balancer or reverse proxy) or use https.createServer.',
    cwe: 'CWE-319',
  },
  {
    id: 'mongodb-no-auth',
    name: 'MongoDB Connection Without Credentials',
    severity: 'medium',
    category: 'Authentication',
    pattern: /mongodb(?:\+srv)?:\/\/(?![^/\s"'`]*@)[^/\s"'`]+/g,
    validate: match => !/localhost|127\.0\.0\.1/.test(match[0]),
    getMessage: () => 'A remote MongoDB connection string has no credentials.',
    recommendation:
      'Enable authentication and TLS, and load the connection string from the environment.',
    cwe: 'CWE-306',
  },
];
