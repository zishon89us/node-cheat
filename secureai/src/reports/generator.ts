import type { ScanResult, SecurityFinding, Severity } from '../types/index.js';

const ICON: Record<Severity, string> = { critical: '🔴', high: '🟠', medium: '🟡', low: '🔵' };
const LABEL: Record<Severity, string> = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};
const MAX_DETAILED = 10;

const LANG_BY_EXT: Record<string, string> = {
  js: 'javascript',
  mjs: 'javascript',
  cjs: 'javascript',
  jsx: 'jsx',
  ts: 'typescript',
  tsx: 'tsx',
  py: 'python',
  rb: 'ruby',
  go: 'go',
  java: 'java',
  php: 'php',
  json: 'json',
  yml: 'yaml',
  yaml: 'yaml',
  sh: 'bash',
};

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Inline text from scanned files must not be able to inject markdown or HTML into the report. */
function inline(text: string): string {
  return escapeHtml(text).replace(/([\\`*_[\]|])/g, '\\$1');
}

function codeSpan(text: string): string {
  return `\`${text.replace(/`/g, "'")}\``;
}

/** A fence one backtick longer than any run in the code, so code can't close it early. */
function fenced(code: string, file: string): string {
  const longestRun = Math.max(2, ...(code.match(/`+/g) ?? []).map(run => run.length));
  const fence = '`'.repeat(longestRun + 1);
  const lang = LANG_BY_EXT[file.split('.').pop()?.toLowerCase() ?? ''] ?? '';
  return `${fence}${lang}\n${code}\n${fence}`;
}

export class ReportGenerator {
  generateMarkdownReport(result: ScanResult): string {
    if (result.totalFindings === 0) {
      return `## ✅ SecureAI: no security issues found\n\nScanned ${result.filesScanned} file(s).`;
    }

    const sections = ['## 🔒 SecureAI security scan', this.summary(result)];
    for (const severity of ['critical', 'high', 'medium', 'low'] as const) {
      const group = result.findings.filter(f => f.severity === severity);
      if (group.length === 0) continue;
      sections.push(
        severity === 'critical' || severity === 'high'
          ? this.detailed(severity, group)
          : this.collapsed(severity, group)
      );
    }
    sections.push(
      `---\n_Scanned ${result.filesScanned} file(s) at ${result.scannedAt.toISOString()}._`
    );
    return sections.join('\n\n');
  }

  generateJSONReport(result: ScanResult): string {
    return JSON.stringify(result, null, 2);
  }

  generateHTMLReport(result: ScanResult): string {
    const markdown = this.generateMarkdownReport(result);
    return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>SecureAI Report</title>
<style>body{font-family:system-ui,sans-serif;max-width:960px;margin:2rem auto;padding:0 1rem}pre{white-space:pre-wrap;background:#f6f8fa;padding:1rem;border-radius:6px}</style>
</head>
<body>
<pre>${escapeHtml(markdown)}</pre>
</body>
</html>`;
  }

  private summary(result: ScanResult): string {
    const parts = (['critical', 'high', 'medium', 'low'] as const)
      .map(s => [s, result[`${s}Count` as const]] as const)
      .filter(([, n]) => n > 0)
      .map(([s, n]) => `${ICON[s]} ${n} ${LABEL[s].toLowerCase()}`);
    const action =
      result.criticalCount + result.highCount > 0
        ? '\n\n**Action required:** fix critical and high findings before merging.'
        : '';
    return `Found **${result.totalFindings}** potential issue(s): ${parts.join(' · ')}${action}`;
  }

  private detailed(severity: Severity, findings: SecurityFinding[]): string {
    const items = findings.slice(0, MAX_DETAILED).map((f, i) => this.item(f, i + 1));
    const more =
      findings.length > MAX_DETAILED
        ? `\n\n_…and ${findings.length - MAX_DETAILED} more ${severity} finding(s)._`
        : '';
    return `### ${ICON[severity]} ${LABEL[severity]} (${findings.length})\n\n${items.join('\n\n')}${more}`;
  }

  private collapsed(severity: Severity, findings: SecurityFinding[]): string {
    const rows = findings
      .map(f => `- **${inline(f.title)}** in ${codeSpan(`${f.file}:${f.line}`)}`)
      .join('\n');
    return `### ${ICON[severity]} ${LABEL[severity]} (${findings.length})\n\n<details>\n<summary>Show ${findings.length} finding(s)</summary>\n\n${rows}\n\n</details>`;
  }

  private item(f: SecurityFinding, n: number): string {
    const meta = [codeSpan(`${f.file}:${f.line}`), inline(f.category)];
    if (f.cwe) {
      meta.push(
        `[${f.cwe}](https://cwe.mitre.org/data/definitions/${f.cwe.replace('CWE-', '')}.html)`
      );
    }
    const lines = [
      `**${n}. ${inline(f.title)}** — ${meta.join(' · ')}`,
      inline(f.description),
      fenced(f.code, f.file),
      `**Fix:** ${inline(f.recommendation)}`,
    ];
    if (f.ai) {
      lines.push(
        `**AI triage:** ${f.ai.verdict.replace('_', ' ')} (${Math.round(f.ai.confidence * 100)}%) — ${inline(f.ai.explanation)}`
      );
    }
    if (f.references?.length) lines.push(f.references.map(r => `- ${r}`).join('\n'));
    return lines.join('\n\n');
  }
}
