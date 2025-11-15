import Anthropic from '@anthropic-ai/sdk';
import { SecurityFinding, AIAnalysisRequest, AIAnalysisResponse } from '../types/index.js';

export class ClaudeAnalyzer {
  private client: Anthropic;
  private model: string;

  constructor(apiKey: string, model = 'claude-3-5-sonnet-20241022') {
    this.client = new Anthropic({ apiKey });
    this.model = model;
  }

  /**
   * Analyze a security finding using Claude AI
   * Reduces false positives by understanding context
   */
  async analyzeFinding(request: AIAnalysisRequest): Promise<AIAnalysisResponse> {
    const prompt = this.buildAnalysisPrompt(request);

    try {
      const message = await this.client.messages.create({
        model: this.model,
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const response = message.content[0];
      if (response.type !== 'text') {
        throw new Error('Unexpected response type from Claude');
      }

      return this.parseResponse(response.text);
    } catch (error) {
      console.error('Claude API error:', error);
      // Return a default response if AI analysis fails
      return {
        isVulnerable: true,
        confidence: 0.5,
        explanation: 'AI analysis unavailable',
      };
    }
  }

  /**
   * Generate fix suggestions for a finding
   */
  async generateFixSuggestion(finding: SecurityFinding, fileContent: string): Promise<string> {
    const prompt = `You are a security expert helping developers fix vulnerabilities.

**Vulnerability Details:**
- Type: ${finding.category}
- Severity: ${finding.severity}
- Description: ${finding.description}
- File: ${finding.file}:${finding.line}

**Current Code:**
\`\`\`
${this.getCodeContext(fileContent, finding.line, 10)}
\`\`\`

**Task:**
Provide a concrete, implementable fix for this security vulnerability. Include:
1. Explanation of why this is vulnerable
2. Specific code changes needed (show before/after)
3. Any additional dependencies or configuration needed

Keep it concise and actionable. Focus on the exact fix, not general advice.`;

    try {
      const message = await this.client.messages.create({
        model: this.model,
        max_tokens: 2048,
        messages: [{ role: 'user', content: prompt }],
      });

      const response = message.content[0];
      return response.type === 'text' ? response.text : 'Unable to generate fix suggestion';
    } catch (error) {
      console.error('Error generating fix:', error);
      return finding.recommendation;
    }
  }

  /**
   * Batch analyze multiple findings to reduce false positives
   */
  async batchAnalyze(findings: SecurityFinding[], fileContents: Map<string, string>): Promise<SecurityFinding[]> {
    const analyzedFindings: SecurityFinding[] = [];

    // Process in smaller batches to avoid rate limits
    const batchSize = 5;
    for (let i = 0; i < findings.length; i += batchSize) {
      const batch = findings.slice(i, i + batchSize);

      const promises = batch.map(async (finding) => {
        const fileContent = fileContents.get(finding.file) || '';
        const surroundingCode = this.getCodeContext(fileContent, finding.line, 20);

        const analysis = await this.analyzeFinding({
          finding,
          context: {
            fileContent,
            surroundingCode,
          },
        });

        // Only include if AI confirms it's likely vulnerable
        if (analysis.isVulnerable && analysis.confidence >= 0.6) {
          return {
            ...finding,
            description: `${finding.description}\n\nAI Analysis: ${analysis.explanation}`,
          };
        }

        return null;
      });

      const results = await Promise.all(promises);
      analyzedFindings.push(...results.filter((f): f is SecurityFinding => f !== null));
    }

    return analyzedFindings;
  }

  /**
   * Generate a comprehensive security report summary
   */
  async generateReportSummary(findings: SecurityFinding[], repositoryUrl: string): Promise<string> {
    if (findings.length === 0) {
      return '✅ **Security Scan Complete** - No vulnerabilities detected!';
    }

    const criticalCount = findings.filter(f => f.severity === 'critical').length;
    const highCount = findings.filter(f => f.severity === 'high').length;
    const mediumCount = findings.filter(f => f.severity === 'medium').length;
    const lowCount = findings.filter(f => f.severity === 'low').length;

    const prompt = `Generate a concise executive summary for a security scan report.

**Repository:** ${repositoryUrl}
**Total Issues:** ${findings.length}
- 🔴 Critical: ${criticalCount}
- 🟠 High: ${highCount}
- 🟡 Medium: ${mediumCount}
- 🔵 Low: ${lowCount}

**Top Issues:**
${findings.slice(0, 5).map(f => `- ${f.severity.toUpperCase()}: ${f.title} in ${f.file}:${f.line}`).join('\n')}

Create a 3-4 sentence summary that:
1. Highlights the most critical issues
2. Mentions the overall security posture
3. Provides actionable next steps

Be direct and professional. Format in markdown.`;

    try {
      const message = await this.client.messages.create({
        model: this.model,
        max_tokens: 512,
        messages: [{ role: 'user', content: prompt }],
      });

      const response = message.content[0];
      return response.type === 'text' ? response.text : this.getDefaultSummary(findings);
    } catch (error) {
      return this.getDefaultSummary(findings);
    }
  }

  /**
   * Build analysis prompt for Claude
   */
  private buildAnalysisPrompt(request: AIAnalysisRequest): string {
    return `You are a security expert analyzing a potential vulnerability. Determine if this is a true security issue or a false positive.

**Finding:**
- Category: ${request.finding.category}
- Severity: ${request.finding.severity}
- Description: ${request.finding.description}
- File: ${request.finding.file}:${request.finding.line}

**Code Context:**
\`\`\`
${request.context.surroundingCode}
\`\`\`

**Analysis Task:**
Determine if this is a real vulnerability or false positive. Consider:
- Is user input actually reaching this code path?
- Are there sanitization/validation steps we're missing?
- Is this test/example code vs production code?
- Are there framework protections in place?

**Response Format (JSON):**
{
  "isVulnerable": true/false,
  "confidence": 0.0-1.0,
  "explanation": "brief explanation",
  "suggestedFix": "optional fix if vulnerable",
  "falsePositiveReason": "optional reason if false positive"
}

Respond ONLY with valid JSON.`;
  }

  /**
   * Parse Claude's JSON response
   */
  private parseResponse(text: string): AIAnalysisResponse {
    try {
      // Extract JSON from response (may have markdown code blocks)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);

      return {
        isVulnerable: parsed.isVulnerable ?? true,
        confidence: parsed.confidence ?? 0.8,
        explanation: parsed.explanation || 'No explanation provided',
        suggestedFix: parsed.suggestedFix,
        falsePositiveReason: parsed.falsePositiveReason,
      };
    } catch (error) {
      // Default to considering it vulnerable if parsing fails
      return {
        isVulnerable: true,
        confidence: 0.7,
        explanation: 'Unable to parse AI response',
      };
    }
  }

  /**
   * Get code context around a specific line
   */
  private getCodeContext(fileContent: string, lineNumber: number, contextLines = 10): string {
    const lines = fileContent.split('\n');
    const start = Math.max(0, lineNumber - contextLines - 1);
    const end = Math.min(lines.length, lineNumber + contextLines);

    return lines.slice(start, end)
      .map((line, idx) => {
        const actualLineNumber = start + idx + 1;
        const marker = actualLineNumber === lineNumber ? '>>> ' : '    ';
        return `${marker}${actualLineNumber.toString().padStart(4, ' ')} | ${line}`;
      })
      .join('\n');
  }

  /**
   * Default summary when AI is unavailable
   */
  private getDefaultSummary(findings: SecurityFinding[]): string {
    const critical = findings.filter(f => f.severity === 'critical').length;
    const high = findings.filter(f => f.severity === 'high').length;

    return `## 🔒 Security Scan Summary

Found **${findings.length}** security issue${findings.length > 1 ? 's' : ''} that require attention:
- 🔴 ${critical} critical
- 🟠 ${high} high priority

${critical > 0 ? '**Action Required:** Address critical vulnerabilities immediately.' : ''}
Review the detailed findings below and implement the recommended fixes.`;
  }
}
