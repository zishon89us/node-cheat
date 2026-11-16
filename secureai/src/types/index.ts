export type Severity = 'critical' | 'high' | 'medium' | 'low';

export interface AIVerdict {
  verdict: 'true_positive' | 'false_positive';
  confidence: number;
  explanation: string;
}

export interface SecurityFinding {
  id: string;
  ruleId: string;
  severity: Severity;
  category: string;
  title: string;
  description: string;
  file: string;
  line: number;
  column: number;
  /** A few lines around the match; secrets are masked. */
  code: string;
  /** A wider window used for AI triage; secrets are masked. */
  context: string;
  recommendation: string;
  cwe?: string;
  references?: string[];
  ai?: AIVerdict;
}

export interface ScanResult {
  repositoryUrl: string;
  scannedAt: Date;
  filesScanned: number;
  totalFindings: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  findings: SecurityFinding[];
}

export interface ScannerRule {
  id: string;
  name: string;
  severity: Severity;
  category: string;
  /** Must carry the `g` flag. */
  pattern: RegExp | RegExp[];
  validate?: (match: RegExpMatchArray, fileContent: string, filePath: string) => boolean;
  getMessage: (match: RegExpMatchArray) => string;
  recommendation: string;
  /** Mask long token-like strings in snippets so the report never republishes a secret. */
  redact?: boolean;
  cwe?: string;
  references?: string[];
}

export interface SourceFile {
  path: string;
  content: string;
}
