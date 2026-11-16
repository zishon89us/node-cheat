import { Webhooks } from '@octokit/webhooks';
import type { ClaudeTriage } from '../ai/claude.js';
import { GitHubClient, type RepoRef } from '../github/client.js';
import { ReportGenerator } from '../reports/generator.js';
import { SecurityScanner, summarize } from '../scanner/engine.js';
import type { ScanResult, SourceFile } from '../types/index.js';

export interface ScanDeps {
  scanner: SecurityScanner;
  triage?: ClaudeTriage;
}

export async function runScan(
  files: SourceFile[],
  repositoryUrl: string,
  deps: ScanDeps
): Promise<ScanResult> {
  const result = deps.scanner.scanFiles(files, repositoryUrl);
  if (!deps.triage || result.findings.length === 0) return result;
  const findings = await deps.triage.filter(result.findings);
  return summarize(repositoryUrl, result.filesScanned, findings);
}

export interface WebhookDeps extends ScanDeps {
  webhookSecret: string;
  clientForInstallation: (installationId: number) => GitHubClient;
}

/**
 * Handlers acknowledge the delivery right away and scan in the background,
 * because GitHub gives up on a webhook after 10 seconds.
 */
export function createWebhooks(deps: WebhookDeps): Webhooks {
  const webhooks = new Webhooks({ secret: deps.webhookSecret });
  const reports = new ReportGenerator();

  const background = (label: string, task: () => Promise<void>) => {
    task().catch(error => console.error(`${label} failed:`, error));
  };

  webhooks.on(
    ['pull_request.opened', 'pull_request.synchronize', 'pull_request.reopened'],
    ({ payload }) => {
      const installationId = payload.installation?.id;
      if (!installationId) return;
      const ref: RepoRef = { owner: payload.repository.owner.login, repo: payload.repository.name };
      const pr = payload.pull_request;

      background(`Scan of ${ref.owner}/${ref.repo}#${pr.number}`, async () => {
        const github = deps.clientForInstallation(installationId);
        const files = await github.getPullRequestFiles(ref, pr.number);
        const result = await runScan(files, payload.repository.html_url, deps);
        const report = reports.generateMarkdownReport(result);
        await github.upsertPullRequestComment(ref, pr.number, report);
        await github.createCheckRun(ref, pr.head.sha, result, report);
        console.log(
          `Scanned ${ref.owner}/${ref.repo}#${pr.number}: ${result.totalFindings} finding(s)`
        );
      });
    }
  );

  webhooks.on('push', ({ payload }) => {
    const installationId = payload.installation?.id;
    const defaultBranch = payload.repository.default_branch;
    const owner = payload.repository.owner?.login;
    if (
      !installationId ||
      !owner ||
      payload.deleted ||
      payload.ref !== `refs/heads/${defaultBranch}`
    )
      return;
    const ref: RepoRef = { owner, repo: payload.repository.name };

    background(`Scan of ${ref.owner}/${ref.repo}@${defaultBranch}`, async () => {
      const github = deps.clientForInstallation(installationId);
      const files = await github.getRepositoryFiles(ref, payload.after);
      const result = await runScan(files, payload.repository.html_url, deps);
      await github.createCheckRun(
        ref,
        payload.after,
        result,
        reports.generateMarkdownReport(result)
      );
    });
  });

  webhooks.onError(error => console.error('Webhook error:', error.message));
  return webhooks;
}
