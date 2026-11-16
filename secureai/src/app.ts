import { timingSafeEqual } from 'node:crypto';
import { createNodeMiddleware } from '@octokit/webhooks';
import express, { type Express, type Request } from 'express';
import { z } from 'zod';
import { ClaudeTriage } from './ai/claude.js';
import type { AppConfig } from './config.js';
import { GitHubClient, parseRepoUrl } from './github/client.js';
import { ReportGenerator } from './reports/generator.js';
import { SecurityScanner } from './scanner/engine.js';
import { createWebhooks, runScan } from './webhook/handler.js';

export const WEBHOOK_PATH = '/webhooks/github';

const ScanBody = z.object({ repositoryUrl: z.string().min(1).max(300) });

function bearerMatches(req: Request, expected: string): boolean {
  const header = req.get('authorization') ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function createApp(config: AppConfig): Express {
  const scanner = new SecurityScanner();
  const triage = config.anthropic ? new ClaudeTriage(config.anthropic) : undefined;
  const webhooks = createWebhooks({
    scanner,
    triage,
    webhookSecret: config.github.webhookSecret,
    clientForInstallation: id =>
      GitHubClient.fromInstallation(config.github.appId, config.github.privateKey, id),
  });

  const app = express();
  app.disable('x-powered-by');

  // Mounted before any body parser: signature verification needs the raw body.
  app.use(createNodeMiddleware(webhooks, { path: WEBHOOK_PATH }));

  app.get('/', (_req, res) => {
    res.json({
      name: 'SecureAI',
      status: 'running',
      features: { aiTriage: Boolean(triage), manualScan: Boolean(config.manualScan) },
    });
  });

  app.get('/health', (_req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
  });

  const manualScan = config.manualScan;
  if (manualScan) {
    const github = GitHubClient.fromToken(manualScan.token);
    const reports = new ReportGenerator();

    app.post('/scan', express.json({ limit: '10kb' }), async (req, res) => {
      if (!bearerMatches(req, manualScan.apiKey)) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const body = ScanBody.safeParse(req.body);
      if (!body.success) {
        res.status(400).json({ error: 'repositoryUrl is required' });
        return;
      }
      let ref;
      try {
        ref = parseRepoUrl(body.data.repositoryUrl);
      } catch (error) {
        res.status(400).json({ error: (error as Error).message });
        return;
      }
      const files = await github.getRepositoryFiles(ref);
      const result = await runScan(files, `https://github.com/${ref.owner}/${ref.repo}`, {
        scanner,
        triage,
      });
      res.json({ scanResult: result, markdownReport: reports.generateMarkdownReport(result) });
    });
  }

  app.use((_req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  app.use(
    (err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
      console.error('Request failed:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  );

  return app;
}
