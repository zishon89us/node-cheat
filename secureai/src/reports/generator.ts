import { ScanResult, SecurityFinding } from '../types/index.js';

export class ReportGenerator {
  /**
   * Generate a markdown report for GitHub comments
   */
  generateMarkdownReport(result: ScanResult, includeDetails = true): string {
    const { findings, totalFindings, criticalCount, highCount, mediumCount, lowCount } = result;

    if (totalFindings === 0) {
      return this.generateCleanReport();
    }

    const sections: string[] = [];

    // Header
    sections.push('# 🔒 SecureAI Security Scan Report\n');

    // Summary
    sections.push(this.generateSummarySection(result));

    // Critical findings (always show)
    if (criticalCount > 0) {
      const criticalFindings = findings.filter(f => f.severity === 'critical');
      sections.push(this.generateSeveritySection('Critical', criticalFindings, '🔴', true));
    }

    // High findings
    if (highCount > 0 && includeDetails) {
      const highFindings = findings.filter(f => f.severity === 'high');
      sections.push(this.generateSeveritySection('High', highFindings, '🟠', true));
    }

    // Medium and Low (collapsed)
    if (mediumCount > 0 && includeDetails) {
      const mediumFindings = findings.filter(f => f.severity === 'medium');
      sections.push(this.generateSeveritySection('Medium', mediumFindings, '🟡', false));
    }

    if (lowCount > 0 && includeDetails) {
      const lowFindings = findings.filter(f => f.severity === 'low');
      sections.push(this.generateSeveritySection('Low', lowFindings, '🔵', false));
    }

    // Footer with recommendations
    sections.push(this.generateFooter(result));

    return sections.join('\n\n');
  }

  /**
   * Generate summary section
   */
  private generateSummarySection(result: ScanResult): string {
    const { totalFindings, criticalCount, highCount, mediumCount, lowCount } = result;

    const parts = [];
    if (criticalCount > 0) parts.push(`🔴 **${criticalCount} Critical**`);
    if (highCount > 0) parts.push(`🟠 **${highCount} High**`);
    if (mediumCount > 0) parts.push(`🟡 ${mediumCount} Medium`);
    if (lowCount > 0) parts.push(`🔵 ${lowCount} Low`);

    return `## Summary

Found **${totalFindings}** security issue${totalFindings > 1 ? 's' : ''}: ${parts.join(' | ')}

${criticalCount > 0 ? '⚠️ **Action Required:** Critical vulnerabilities detected. Address immediately before merging.' : ''}`;
  }

  /**
   * Generate findings section by severity
   */
  private generateSeveritySection(
    severity: string,
    findings: SecurityFinding[],
    icon: string,
    expanded = true
  ): string {
    const header = `## ${icon} ${severity} Severity (${findings.length})`;

    if (!expanded) {
      const summary = findings.map(f => `- **${f.title}** in \`${f.file}:${f.line}\``).join('\n');
      return `${header}\n\n<details>\n<summary>Show ${findings.length} finding${findings.length > 1 ? 's' : ''}</summary>\n\n${summary}\n\n</details>`;
    }

    const items = findings.slice(0, 10).map((finding, idx) => {
      return this.generateFindingItem(finding, idx + 1);
    });

    let content = items.join('\n\n---\n\n');

    if (findings.length > 10) {
      content += `\n\n*... and ${findings.length - 10} more ${severity.toLowerCase()} severity finding${findings.length - 10 > 1 ? 's' : ''}*`;
    }

    return `${header}\n\n${content}`;
  }

  /**
   * Generate individual finding item
   */
  private generateFindingItem(finding: SecurityFinding, index: number): string {
    const parts = [];

    // Title
    parts.push(`### ${index}. ${finding.title}`);

    // Metadata
    const metadata = [
      `**File:** \`${finding.file}:${finding.line}\``,
      `**Category:** ${finding.category}`,
    ];
    if (finding.cwe) {
      metadata.push(`**CWE:** [${finding.cwe}](https://cwe.mitre.org/data/definitions/${finding.cwe.replace('CWE-', '')}.html)`);
    }
    parts.push(metadata.join(' | '));

    // Description
    parts.push(`**Description:** ${finding.description}`);

    // Code snippet
    if (finding.code) {
      parts.push('**Code:**\n```javascript\n' + finding.code + '\n```');
    }

    // Recommendation
    parts.push(`**💡 Recommendation:** ${finding.recommendation}`);

    // References
    if (finding.references && finding.references.length > 0) {
      const refLinks = finding.references.map(ref => `- ${ref}`).join('\n');
      parts.push(`**📚 References:**\n${refLinks}`);
    }

    return parts.join('\n\n');
  }

  /**
   * Generate clean report (no issues found)
   */
  private generateCleanReport(): string {
    return `# ✅ SecureAI Security Scan Report

## All Clear!

No security vulnerabilities detected in this code. Great job! 🎉

**Next Steps:**
- Continue following secure coding practices
- Run security scans on every pull request
- Keep dependencies updated

---

*Powered by SecureAI - AI-powered security scanning*`;
  }

  /**
   * Generate footer with recommendations
   */
  private generateFooter(result: ScanResult): string {
    return `---

## 📋 Recommended Actions

${result.criticalCount > 0 ? '1. 🔴 **Address all critical vulnerabilities immediately**\n' : ''}${result.highCount > 0 ? '2. 🟠 **Fix high-severity issues before merging**\n' : ''}3. 📖 Review CWE references for detailed vulnerability information
4. 🔄 Re-run scan after fixes to verify resolution
5. 🛡️ Consider implementing security headers and CSP

---

*Scanned at ${result.scannedAt.toISOString()} | Powered by **SecureAI** with Claude AI*`;
  }

  /**
   * Generate condensed report for PR comments (GitHub character limits)
   */
  generateCondensedReport(result: ScanResult): string {
    if (result.totalFindings === 0) {
      return '✅ **SecureAI Scan:** No security issues found!';
    }

    const parts = [];
    if (result.criticalCount > 0) parts.push(`🔴 ${result.criticalCount} critical`);
    if (result.highCount > 0) parts.push(`🟠 ${result.highCount} high`);
    if (result.mediumCount > 0) parts.push(`🟡 ${result.mediumCount} medium`);
    if (result.lowCount > 0) parts.push(`🔵 ${result.lowCount} low`);

    const topIssues = result.findings
      .slice(0, 3)
      .map(f => `- **${f.title}** in \`${f.file}:${f.line}\``)
      .join('\n');

    return `⚠️ **SecureAI Scan:** Found ${result.totalFindings} issue${result.totalFindings > 1 ? 's' : ''} (${parts.join(', ')})

**Top Issues:**
${topIssues}

See full report for details.`;
  }

  /**
   * Generate JSON report
   */
  generateJSONReport(result: ScanResult): string {
    return JSON.stringify(result, null, 2);
  }

  /**
   * Generate HTML report (for web dashboard)
   */
  generateHTMLReport(result: ScanResult): string {
    const markdown = this.generateMarkdownReport(result);
    // In a full implementation, you'd use a markdown-to-HTML library
    // For now, return markdown (can be rendered client-side)
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SecureAI Security Report</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 900px; margin: 40px auto; padding: 20px; }
    .critical { border-left: 4px solid #dc2626; padding-left: 16px; }
    .high { border-left: 4px solid #ea580c; padding-left: 16px; }
    .medium { border-left: 4px solid #ca8a04; padding-left: 16px; }
    .low { border-left: 4px solid #2563eb; padding-left: 16px; }
    code { background: #f3f4f6; padding: 2px 6px; border-radius: 3px; }
    pre { background: #1f2937; color: #f3f4f6; padding: 16px; border-radius: 6px; overflow-x: auto; }
  </style>
</head>
<body>
  <div id="content"></div>
  <script>
    // Render markdown on client side
    const markdown = ${JSON.stringify(markdown)};
    document.getElementById('content').innerHTML = '<pre>' + markdown + '</pre>';
  </script>
</body>
</html>`;
  }
}
