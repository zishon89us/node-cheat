import { createHash } from 'node:crypto';
import type {
  ScanResult,
  ScannerRule,
  SecurityFinding,
  Severity,
  SourceFile,
} from '../types/index.js';
import { MAX_FILE_BYTES, isProbablyBinary, shouldScanPath } from './filters.js';
import { securityRules } from './rules.js';

const SEVERITY_ORDER: Record<Severity, number> = { critical: 0, high: 1, medium: 2, low: 3 };
const TOKEN_LIKE = /[A-Za-z0-9+/=_\-.]{16,}/g;

export function maskSecrets(text: string): string {
  return text.replace(TOKEN_LIKE, token => `${token.slice(0, 4)}${'*'.repeat(8)}`);
}

export function summarize(
  repositoryUrl: string,
  filesScanned: number,
  findings: SecurityFinding[]
): ScanResult {
  const sorted = [...findings].sort(
    (a, b) =>
      SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity] ||
      a.file.localeCompare(b.file) ||
      a.line - b.line
  );
  const count = (s: Severity) => sorted.filter(f => f.severity === s).length;
  return {
    repositoryUrl,
    scannedAt: new Date(),
    filesScanned,
    totalFindings: sorted.length,
    criticalCount: count('critical'),
    highCount: count('high'),
    mediumCount: count('medium'),
    lowCount: count('low'),
    findings: sorted,
  };
}

export class SecurityScanner {
  constructor(private readonly rules: ScannerRule[] = securityRules) {
    for (const rule of rules) {
      for (const pattern of toArray(rule.pattern)) {
        if (!pattern.flags.includes('g'))
          throw new Error(`Rule ${rule.id} pattern must use the g flag`);
      }
    }
  }

  scanFiles(files: SourceFile[], repositoryUrl: string): ScanResult {
    const findings: SecurityFinding[] = [];
    let filesScanned = 0;
    for (const file of files) {
      if (
        !shouldScanPath(file.path) ||
        file.content.length > MAX_FILE_BYTES ||
        isProbablyBinary(file.content)
      ) {
        continue;
      }
      filesScanned++;
      findings.push(...this.scanFile(file));
    }
    return summarize(repositoryUrl, filesScanned, findings);
  }

  scanFile(file: SourceFile): SecurityFinding[] {
    const lines = file.content.split('\n');
    const lineStarts = computeLineStarts(file.content);
    const byId = new Map<string, SecurityFinding>();

    for (const rule of this.rules) {
      for (const pattern of toArray(rule.pattern)) {
        for (const match of file.content.matchAll(pattern)) {
          if (rule.validate && !rule.validate(match, file.content, file.path)) continue;

          const { line, column } = locate(lineStarts, match.index ?? 0);
          const id = findingId(rule.id, file.path, line);
          if (byId.has(id)) continue;

          const mask = rule.redact ? maskSecrets : (s: string) => s;
          byId.set(id, {
            id,
            ruleId: rule.id,
            severity: rule.severity,
            category: rule.category,
            title: rule.name,
            description: rule.getMessage(match),
            file: file.path,
            line,
            column,
            code: mask(snippet(lines, line, 2)),
            context: mask(snippet(lines, line, 15)),
            recommendation: rule.recommendation,
            cwe: rule.cwe,
            references: rule.references,
          });
        }
      }
    }
    return [...byId.values()];
  }
}

function toArray(pattern: RegExp | RegExp[]): RegExp[] {
  return Array.isArray(pattern) ? pattern : [pattern];
}

function computeLineStarts(content: string): number[] {
  const starts = [0];
  for (let i = 0; i < content.length; i++) {
    if (content.charCodeAt(i) === 10) starts.push(i + 1);
  }
  return starts;
}

function locate(lineStarts: number[], index: number): { line: number; column: number } {
  let lo = 0;
  let hi = lineStarts.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (lineStarts[mid] <= index) lo = mid;
    else hi = mid - 1;
  }
  return { line: lo + 1, column: index - lineStarts[lo] + 1 };
}

function snippet(lines: string[], lineNumber: number, radius: number): string {
  const start = Math.max(0, lineNumber - radius - 1);
  const end = Math.min(lines.length, lineNumber + radius);
  return lines
    .slice(start, end)
    .map((text, i) => {
      const n = start + i + 1;
      return `${n === lineNumber ? '>' : ' '} ${String(n).padStart(4)} | ${text}`;
    })
    .join('\n');
}

function findingId(ruleId: string, filePath: string, line: number): string {
  const hash = createHash('sha256')
    .update(`${ruleId}:${filePath}:${line}`)
    .digest('hex')
    .slice(0, 12);
  return `${ruleId}-${hash}`;
}
