import express from 'express';
import dotenv from 'dotenv';
import { WebhookHandler } from './webhook/handler.js';
import { GitHubClient } from './github/client.js';
import { SecurityScanner } from './scanner/engine.js';
import { ClaudeAnalyzer } from './ai/claude.js';
import { ReportGenerator } from './reports/generator.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Verify required environment variables
const requiredVars = ['GITHUB_APP_ID', 'GITHUB_WEBHOOK_SECRET', 'GITHUB_PRIVATE_KEY_PATH'];
const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingVars.join(', '));
  console.error('Please check your .env file against .env.example');
  process.exit(1);
}

// Initialize webhook handler
const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET!;
const claudeApiKey = process.env.ANTHROPIC_API_KEY;

if (!claudeApiKey) {
  console.warn('⚠️  ANTHROPIC_API_KEY not set. AI-powered analysis will be disabled.');
}

const webhookHandler = new WebhookHandler(webhookSecret, claudeApiKey);

// Middleware
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'SecureAI',
    version: '1.0.0',
    status: 'running',
    features: {
      githubApp: true,
      aiAnalysis: !!claudeApiKey,
    },
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// GitHub App webhook endpoint
app.post('/webhooks/github', webhookHandler.getMiddleware());

// Manual scan endpoint (for testing without GitHub App)
app.post('/scan', async (req, res) => {
  try {
    const { repositoryUrl, token } = req.body;

    if (!repositoryUrl) {
      return res.status(400).json({ error: 'repositoryUrl is required' });
    }

    const useToken = token || process.env.GITHUB_TOKEN;
    if (!useToken) {
      return res.status(400).json({
        error: 'GitHub token required. Provide in request body or GITHUB_TOKEN env var',
      });
    }

    console.log(`Manual scan requested for: ${repositoryUrl}`);

    // Parse repository URL
    const { owner, repo } = GitHubClient.parseRepoUrl(repositoryUrl);

    // Create GitHub client
    const githubClient = new GitHubClient({ token: useToken });

    // Fetch files
    const files = await githubClient.getRepositoryFilesWithFallback(owner, repo);

    // Scan files
    const scanner = new SecurityScanner();
    const scanResult = await scanner.scanFiles(files, repositoryUrl);

    // Optional: AI analysis
    if (claudeApiKey && scanResult.findings.length > 0) {
      console.log('Running AI analysis...');
      const analyzer = new ClaudeAnalyzer(claudeApiKey);
      const fileContents = new Map(files.map(f => [f.path, f.content]));
      const analyzedFindings = await analyzer.batchAnalyze(scanResult.findings, fileContents);

      scanResult.findings = analyzedFindings;
      scanResult.totalFindings = analyzedFindings.length;
      scanResult.criticalCount = analyzedFindings.filter(f => f.severity === 'critical').length;
      scanResult.highCount = analyzedFindings.filter(f => f.severity === 'high').length;
      scanResult.mediumCount = analyzedFindings.filter(f => f.severity === 'medium').length;
      scanResult.lowCount = analyzedFindings.filter(f => f.severity === 'low').length;
    }

    // Generate report
    const reportGenerator = new ReportGenerator();
    const markdownReport = reportGenerator.generateMarkdownReport(scanResult);

    res.json({
      success: true,
      scanResult,
      markdownReport,
    });
  } catch (error) {
    console.error('Scan error:', error);
    res.status(500).json({
      error: 'Scan failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════╗
║                                           ║
║   🔒 SecureAI - Security Scanner v1.0    ║
║                                           ║
╚═══════════════════════════════════════════╝

✅ Server running on http://localhost:${PORT}
✅ GitHub App webhooks: http://localhost:${PORT}/webhooks/github
${claudeApiKey ? '✅ AI-powered analysis: ENABLED' : '⚠️  AI-powered analysis: DISABLED'}

Ready to scan repositories for security vulnerabilities!
`);
});

export default app;
