export interface SecurityFinding {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  title: string;
  description: string;
  file: string;
  line: number;
  column?: number;
  code: string;
  recommendation: string;
  cwe?: string;
  references?: string[];
}

export interface ScanResult {
  repositoryUrl: string;
  scannedAt: Date;
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
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  description: string;
  pattern: RegExp | RegExp[];
  validate?: (match: RegExpMatchArray, fileContent: string, filePath: string) => boolean;
  getMessage: (match: RegExpMatchArray) => string;
  getRecommendation: () => string;
  cwe?: string;
  references?: string[];
}

export interface GitHubFile {
  path: string;
  content: string;
  sha: string;
}

export interface AIAnalysisRequest {
  finding: SecurityFinding;
  context: {
    fileContent: string;
    surroundingCode: string;
  };
}

export interface AIAnalysisResponse {
  isVulnerable: boolean;
  confidence: number;
  explanation: string;
  suggestedFix?: string;
  falsePositiveReason?: string;
}
