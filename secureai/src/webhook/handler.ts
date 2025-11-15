import { Webhooks } from '@octokit/webhooks';
import { GitHubClient } from '../github/client.js';
import { SecurityScanner } from '../scanner/engine.js';
import { ClaudeAnalyzer } from '../ai/claude.js';
import { ReportGenerator } from '../reports/generator.js';

export class WebhookHandler {
  private webhooks: Webhooks;
  private scanner: SecurityScanner;
  private reportGenerator: ReportGenerator;
  private claudeAnalyzer?: ClaudeAnalyzer;

  constructor(webhookSecret: string, claudeApiKey?: string) {
    this.webhooks = new Webhooks({
      secret: webhookSecret,
    });

    this.scanner = new SecurityScanner();
    this.reportGenerator = new ReportGenerator();

    if (claudeApiKey) {
      this.claudeAnalyzer = new ClaudeAnalyzer(claudeApiKey);
    }

    this.setupHandlers();
  }

  /**
   * Get Express middleware for handling webhooks
   */
  getMiddleware() {
    return this.webhooks.middleware;
  }

  /**
   * Setup webhook event handlers
   */
  private setupHandlers() {
    // Handle pull request events (opened, synchronize, reopened)
    this.webhooks.on(['pull_request.opened', 'pull_request.synchronize', 'pull_request.reopened'], async (event) => {
      console.log(`Received PR event: ${event.name} for PR #${event.payload.pull_request.number}`);

      try {
        await this.handlePullRequest(event);
      } catch (error) {
        console.error('Error handling pull request:', error);
      }
    });

    // Handle push events to main/master branches
    this.webhooks.on('push', async (event) => {
      const branch = event.payload.ref.replace('refs/heads/', '');

      if (branch === 'main' || branch === 'master') {
        console.log(`Received push event to ${branch}`);

        try {
          await this.handlePush(event);
        } catch (error) {
          console.error('Error handling push:', error);
        }
      }
    });

    // Handle check run requests
    this.webhooks.on('check_run.requested_action', async (event) => {
      console.log('Received check run request');

      try {
        await this.handleCheckRun(event);
      } catch (error) {
        console.error('Error handling check run:', error);
      }
    });
  }

  /**
   * Handle pull request events
   */
  private async handlePullRequest(event: any) {
    const { repository, pull_request, installation } = event.payload;

    if (!installation) {
      console.error('No installation found in webhook payload');
      return;
    }

    // Create GitHub client for this installation
    const githubClient = await this.createGitHubClient(installation.id);

    // Get repository details
    const owner = repository.owner.login;
    const repo = repository.name;
    const prNumber = pull_request.number;
    const headSha = pull_request.head.sha;

    console.log(`Scanning PR #${prNumber} in ${owner}/${repo}`);

    // Fetch repository files
    const files = await githubClient.getRepositoryFiles(owner, repo, pull_request.head.ref);

    // Scan files for security issues
    const scanResult = await this.scanner.scanFiles(files, repository.html_url);

    // Use AI to reduce false positives (if available)
    let finalFindings = scanResult.findings;
    if (this.claudeAnalyzer && scanResult.findings.length > 0) {
      console.log('Running AI analysis to reduce false positives...');
      const fileContents = new Map(files.map(f => [f.path, f.content]));
      finalFindings = await this.claudeAnalyzer.batchAnalyze(scanResult.findings, fileContents);

      // Update scan result
      scanResult.findings = finalFindings;
      scanResult.totalFindings = finalFindings.length;
      scanResult.criticalCount = finalFindings.filter(f => f.severity === 'critical').length;
      scanResult.highCount = finalFindings.filter(f => f.severity === 'high').length;
      scanResult.mediumCount = finalFindings.filter(f => f.severity === 'medium').length;
      scanResult.lowCount = finalFindings.filter(f => f.severity === 'low').length;
    }

    // Generate report
    const report = this.reportGenerator.generateMarkdownReport(scanResult);

    // Comment on PR
    await githubClient.commentOnPullRequest(owner, repo, prNumber, report);

    // Create check run
    await githubClient.createCheckRun(owner, repo, headSha, scanResult.totalFindings);

    console.log(`Scan complete: found ${scanResult.totalFindings} issues`);
  }

  /**
   * Handle push events
   */
  private async handlePush(event: any) {
    const { repository, after, installation } = event.payload;

    if (!installation) {
      console.error('No installation found in webhook payload');
      return;
    }

    const githubClient = await this.createGitHubClient(installation.id);

    const owner = repository.owner.login;
    const repo = repository.name;
    const branch = event.payload.ref.replace('refs/heads/', '');

    console.log(`Scanning push to ${branch} in ${owner}/${repo}`);

    // Fetch repository files
    const files = await githubClient.getRepositoryFiles(owner, repo, branch);

    // Scan files
    const scanResult = await this.scanner.scanFiles(files, repository.html_url);

    // Create check run
    await githubClient.createCheckRun(owner, repo, after, scanResult.totalFindings);

    console.log(`Scan complete: found ${scanResult.totalFindings} issues`);
  }

  /**
   * Handle check run events
   */
  private async handleCheckRun(event: any) {
    console.log('Check run requested:', event.payload.check_run.name);
    // Can implement re-scans or additional checks here
  }

  /**
   * Create GitHub client for a specific installation
   */
  private async createGitHubClient(installationId: number): Promise<GitHubClient> {
    const appId = parseInt(process.env.GITHUB_APP_ID || '0');
    const privateKeyPath = process.env.GITHUB_PRIVATE_KEY_PATH || './private-key.pem';

    return await GitHubClient.createFromApp(appId, privateKeyPath, installationId);
  }

  /**
   * Verify webhook signature
   */
  async verify(payload: string, signature: string): Promise<boolean> {
    return await this.webhooks.verify(payload, signature);
  }
}
