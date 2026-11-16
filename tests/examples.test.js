import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { execFileSync } from 'node:child_process';
import { builtinModules } from 'node:module';

const root = join(import.meta.dirname, '..');
const skipDirs = new Set(['node_modules', '.git', 'secureai', 'coverage', 'public', 'views']);

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!skipDirs.has(entry.name)) walk(join(dir, entry.name), out);
    } else if (/\.(m?js)$/.test(entry.name) || entry.name === 'www') {
      out.push(join(dir, entry.name));
    }
  }
  return out;
}

const files = walk(root).filter((f) => !f.endsWith('.min.js'));

function nearestPackageJson(file) {
  let dir = dirname(file);
  while (!existsSync(join(dir, 'package.json'))) dir = dirname(dir);
  return JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'));
}

const builtins = new Set(builtinModules);

function bareImports(source) {
  const specs = new Set();
  const patterns = [
    /\bimport\s+(?:[^'"()]*?\s+from\s+)?['"]([^'"]+)['"]/g,
    /\bexport\s+[^'"]*?\s+from\s+['"]([^'"]+)['"]/g,
    /\bimport\(\s*['"]([^'"]+)['"]\s*\)/g,
  ];
  for (const re of patterns) {
    for (const [, spec] of source.matchAll(re)) {
      if (spec.startsWith('.') || spec.startsWith('/') || spec.startsWith('node:')) continue;
      specs.add(spec.startsWith('@') ? spec.split('/').slice(0, 2).join('/') : spec.split('/')[0]);
    }
  }
  return [...specs];
}

describe('examples', () => {
  it('finds example files', () => {
    expect(files.length).toBeGreaterThan(50);
  });

  describe.each(files.map((f) => [relative(root, f), f]))('%s', (_name, file) => {
    const source = readFileSync(file, 'utf8');

    it('parses as an ES module', () => {
      execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' });
    });

    it('uses no CommonJS require()', () => {
      const code = source
        .split('\n')
        .filter((line) => !line.trim().startsWith('//'))
        .join('\n');
      expect(code).not.toMatch(/(^|[^.\w])require\(\s*['"]/m);
    });

    it('declares every imported package', () => {
      const pkg = nearestPackageJson(file);
      const declared = { ...pkg.dependencies, ...pkg.devDependencies, ...pkg.optionalDependencies };
      const missing = bareImports(source).filter((s) => !builtins.has(s) && !(s in declared));
      expect(missing).toEqual([]);
    });
  });
});
