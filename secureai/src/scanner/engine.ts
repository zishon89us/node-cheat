import { SecurityFinding, ScannerRule, GitHubFile, ScanResult } from '../types/index.js';
import { securityRules } from './rules.js';
import crypto from 'crypto';

export class SecurityScanner {
  private rules: ScannerRule[];

  constructor(customRules?: ScannerRule[]) {
    this.rules = customRules || securityRules;
  }

  /**
   * Scan multiple files for security vulnerabilities
   */
  async scanFiles(files: GitHubFile[], repositoryUrl: string): Promise<ScanResult> {
    const allFindings: SecurityFinding[] = [];

    for (const file of files) {
      // Skip binary files, images, and non-scannable files
      if (this.shouldSkipFile(file.path)) {
        continue;
      }

      const findings = await this.scanFile(file);
      allFindings.push(...findings);
    }

    // Sort findings by severity
    const sortedFindings = this.sortBySeverity(allFindings);

    return {
      repositoryUrl,
      scannedAt: new Date(),
      totalFindings: sortedFindings.length,
      criticalCount: sortedFindings.filter(f => f.severity === 'critical').length,
      highCount: sortedFindings.filter(f => f.severity === 'high').length,
      mediumCount: sortedFindings.filter(f => f.severity === 'medium').length,
      lowCount: sortedFindings.filter(f => f.severity === 'low').length,
      findings: sortedFindings,
    };
  }

  /**
   * Scan a single file for vulnerabilities
   */
  private async scanFile(file: GitHubFile): Promise<SecurityFinding[]> {
    const findings: SecurityFinding[] = [];
    const lines = file.content.split('\n');

    for (const rule of this.rules) {
      const patterns = Array.isArray(rule.pattern) ? rule.pattern : [rule.pattern];

      for (const pattern of patterns) {
        const matches = this.findMatches(file.content, pattern);

        for (const match of matches) {
          // Apply custom validation if provided
          if (rule.validate && !rule.validate(match, file.content, file.path)) {
            continue;
          }

          const position = this.getLineAndColumn(file.content, match.index!);
          const codeSnippet = this.getCodeSnippet(lines, position.line);

          const finding: SecurityFinding = {
            id: this.generateFindingId(rule.id, file.path, position.line),
            severity: rule.severity,
            category: rule.category,
            title: rule.name,
            description: rule.getMessage(match),
            file: file.path,
            line: position.line,
            column: position.column,
            code: codeSnippet,
            recommendation: rule.getRecommendation(),
            cwe: rule.cwe,
            references: rule.references,
          };

          findings.push(finding);
        }
      }
    }

    return findings;
  }

  /**
   * Find all matches of a pattern in content
   */
  private findMatches(content: string, pattern: RegExp): RegExpMatchArray[] {
    const matches: RegExpMatchArray[] = [];
    let match: RegExpMatchArray | null;

    // Reset regex state
    const regex = new RegExp(pattern.source, pattern.flags);

    while ((match = regex.exec(content)) !== null) {
      matches.push(match);
      // Prevent infinite loops on zero-width matches
      if (match.index === regex.lastIndex) {
        regex.lastIndex++;
      }
    }

    return matches;
  }

  /**
   * Get line and column number from string index
   */
  private getLineAndColumn(content: string, index: number): { line: number; column: number } {
    const beforeMatch = content.substring(0, index);
    const lines = beforeMatch.split('\n');
    return {
      line: lines.length,
      column: lines[lines.length - 1].length + 1,
    };
  }

  /**
   * Extract code snippet around the vulnerability
   */
  private getCodeSnippet(lines: string[], lineNumber: number, context = 2): string {
    const start = Math.max(0, lineNumber - context - 1);
    const end = Math.min(lines.length, lineNumber + context);
    const snippetLines = lines.slice(start, end);

    return snippetLines
      .map((line, idx) => {
        const actualLineNumber = start + idx + 1;
        const marker = actualLineNumber === lineNumber ? '> ' : '  ';
        return `${marker}${actualLineNumber.toString().padStart(4, ' ')} | ${line}`;
      })
      .join('\n');
  }

  /**
   * Generate unique ID for a finding
   */
  private generateFindingId(ruleId: string, filePath: string, line: number): string {
    const hash = crypto
      .createHash('sha256')
      .update(`${ruleId}-${filePath}-${line}`)
      .digest('hex')
      .substring(0, 12);
    return `${ruleId}-${hash}`;
  }

  /**
   * Sort findings by severity (critical > high > medium > low)
   */
  private sortBySeverity(findings: SecurityFinding[]): SecurityFinding[] {
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return findings.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
  }

  /**
   * Determine if a file should be skipped from scanning
   */
  private shouldSkipFile(filePath: string): boolean {
    const skipExtensions = [
      '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico',
      '.pdf', '.zip', '.tar', '.gz', '.exe', '.dll',
      '.so', '.dylib', '.woff', '.woff2', '.ttf', '.eot',
      '.mp4', '.avi', '.mov', '.mp3', '.wav',
    ];

    const skipDirectories = [
      'node_modules/',
      'dist/',
      'build/',
      '.git/',
      'coverage/',
      'vendor/',
      '__pycache__/',
    ];

    const lowerPath = filePath.toLowerCase();

    // Skip by extension
    if (skipExtensions.some(ext => lowerPath.endsWith(ext))) {
      return true;
    }

    // Skip by directory
    if (skipDirectories.some(dir => lowerPath.includes(dir))) {
      return true;
    }

    return false;
  }

  /**
   * Get statistics about scan results
   */
  getScanStatistics(result: ScanResult): string {
    const total = result.totalFindings;
    if (total === 0) {
      return '✅ No security issues found!';
    }

    const parts = [];
    if (result.criticalCount > 0) parts.push(`🔴 ${result.criticalCount} critical`);
    if (result.highCount > 0) parts.push(`🟠 ${result.highCount} high`);
    if (result.mediumCount > 0) parts.push(`🟡 ${result.mediumCount} medium`);
    if (result.lowCount > 0) parts.push(`🔵 ${result.lowCount} low`);

    return `Found ${total} security issue${total > 1 ? 's' : ''}: ${parts.join(', ')}`;
  }
}
