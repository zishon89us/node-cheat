import { describe, expect, it } from 'vitest';
import { SecurityScanner, summarize } from '../scanner/engine.js';
import type { SecurityFinding } from '../types/index.js';
import { ReportGenerator, escapeHtml } from './generator.js';

const reports = new ReportGenerator();

function finding(overrides: Partial<SecurityFinding> = {}): SecurityFinding {
  return {
    id: 'eval-usage-abc',
    ruleId: 'eval-usage',
    severity: 'high',
    category: 'Code Injection',
    title: 'Dynamic Code Execution (eval)',
    description: 'eval() executes strings as code.',
    file: 'src/a.js',
    line: 3,
    column: 1,
    code: '>    3 | eval(x)',
    context: 'eval(x)',
    recommendation: 'Remove eval.',
    cwe: 'CWE-95',
    ...overrides,
  };
}

describe('ReportGenerator', () => {
  it('reports a clean scan', () => {
    const md = reports.generateMarkdownReport(summarize('repo', 4, []));
    expect(md).toContain('no security issues found');
    expect(md).toContain('Scanned 4 file(s)');
  });

  it('summarizes counts and asks for action on high findings', () => {
    const md = reports.generateMarkdownReport(
      summarize('repo', 2, [
        finding(),
        finding({ id: 'b', severity: 'low', title: 'Plain HTTP Server' }),
      ])
    );
    expect(md).toContain('Found **2** potential issue(s)');
    expect(md).toContain('🟠 1 high');
    expect(md).toContain('**Action required:**');
    expect(md).toContain('[CWE-95](https://cwe.mitre.org/data/definitions/95.html)');
    expect(md).toMatch(/<details>[\s\S]*Plain HTTP Server[\s\S]*<\/details>/);
  });

  it('caps detailed findings per severity', () => {
    const many = Array.from({ length: 13 }, (_, i) => finding({ id: `f${i}`, line: i + 1 }));
    expect(reports.generateMarkdownReport(summarize('repo', 1, many))).toContain(
      '…and 3 more high finding(s)'
    );
  });

  it('cannot be broken out of by backticks in scanned code', () => {
    const md = reports.generateMarkdownReport(
      summarize('repo', 1, [finding({ code: 'a ``` b ```` c' })])
    );
    expect(md).toContain('`````javascript\na ``` b ```` c\n`````');
  });

  it('escapes HTML coming from scanned files', () => {
    const md = reports.generateMarkdownReport(
      summarize('repo', 1, [finding({ description: '<img src=x onerror=alert(1)>' })])
    );
    expect(md).not.toContain('<img');
    expect(md).toContain('&lt;img');
  });

  it('includes AI triage notes when present', () => {
    const md = reports.generateMarkdownReport(
      summarize('repo', 1, [
        finding({
          ai: { verdict: 'true_positive', confidence: 0.92, explanation: 'Input reaches eval.' },
        }),
      ])
    );
    expect(md).toContain('**AI triage:** true positive (92%)');
  });

  it('renders HTML with the report escaped, not injected', () => {
    const html = reports.generateHTMLReport(
      summarize('repo', 1, [finding({ code: '</pre><script>alert(1)</script>' })])
    );
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;/pre&gt;&lt;script&gt;');
  });

  it('round-trips JSON', () => {
    const result = new SecurityScanner().scanFiles([{ path: 'a.js', content: 'eval(x)' }], 'repo');
    expect(JSON.parse(reports.generateJSONReport(result)).totalFindings).toBe(1);
  });

  it('escapeHtml covers the five special characters', () => {
    expect(escapeHtml(`<a href="x">'&'</a>`)).toBe(
      '&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;'
    );
  });
});
