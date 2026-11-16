import { createAppAuth } from '@octokit/auth-app';
import { Octokit } from '@octokit/rest';
import { MAX_FILE_BYTES, isProbablyBinary, shouldScanPath } from '../scanner/filters.js';
import type { ScanResult, SourceFile } from '../types/index.js';

const NAME = /^[A-Za-z0-9_.-]{1,100}$/;
const MAX_REPO_FILES = 2000;
const FETCH_CONCURRENCY = 8;
const REPORT_MARKER = '<!-- secureai-report -->';
const GITHUB_BODY_LIMIT = 65_000;

export interface RepoRef {
  owner: string;
  repo: string;
}

export function parseRepoUrl(input: string): RepoRef {
  const trimmed = input.trim();
  let parts: string[];
  if (/^https?:\/\//i.test(trimmed)) {
    const url = new URL(trimmed);
    if (url.hostname !== 'github.com' && url.hostname !== 'www.github.com') {
      throw new Error('Only github.com repository URLs are supported');
    }
    parts = url.pathname.split('/').filter(Boolean).slice(0, 2);
  } else {
    parts = trimmed.split('/');
  }
  if (parts.length !== 2) throw new Error('Expected a GitHub repository URL or "owner/repo"');
  const owner = parts[0];
  const repo = parts[1].replace(/\.git$/, '');
  if (!NAME.test(owner) || !NAME.test(repo) || repo === '.' || repo === '..') {
    throw new Error('Invalid GitHub owner or repository name');
  }
  return { owner, repo };
}

export function checkConclusion(result: ScanResult): 'success' | 'neutral' | 'failure' {
  if (result.criticalCount + result.highCount > 0) return 'failure';
  if (result.totalFindings > 0) return 'neutral';
  return 'success';
}

function truncate(body: string, limit = GITHUB_BODY_LIMIT): string {
  return body.length <= limit ? body : `${body.slice(0, limit)}\n\n_Report truncated._`;
}

async function mapLimit<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;
  const worker = async () => {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i]);
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

export class GitHubClient {
  constructor(readonly octokit: Octokit) {}

  static fromToken(token: string): GitHubClient {
    return new GitHubClient(new Octokit({ auth: token }));
  }

  static fromInstallation(appId: number, privateKey: string, installationId: number): GitHubClient {
    return new GitHubClient(
      new Octokit({ authStrategy: createAppAuth, auth: { appId, privateKey, installationId } })
    );
  }

  private async readBlob(
    { owner, repo }: RepoRef,
    path: string,
    sha: string
  ): Promise<SourceFile | null> {
    const { data } = await this.octokit.git.getBlob({ owner, repo, file_sha: sha });
    if ((data.size ?? 0) > MAX_FILE_BYTES) return null;
    const content = Buffer.from(data.content, 'base64').toString('utf8');
    return isProbablyBinary(content) ? null : { path, content };
  }

  /** Files of a branch (default branch when omitted), capped at MAX_REPO_FILES. */
  async getRepositoryFiles(ref: RepoRef, branch?: string): Promise<SourceFile[]> {
    const treeRef = branch ?? (await this.octokit.repos.get({ ...ref })).data.default_branch;
    const { data: tree } = await this.octokit.git.getTree({
      ...ref,
      tree_sha: treeRef,
      recursive: 'true',
    });
    const blobs = tree.tree
      .filter(
        e =>
          e.type === 'blob' &&
          e.path &&
          e.sha &&
          (e.size ?? 0) <= MAX_FILE_BYTES &&
          shouldScanPath(e.path)
      )
      .slice(0, MAX_REPO_FILES);
    const files = await mapLimit(blobs, FETCH_CONCURRENCY, e =>
      this.readBlob(ref, e.path!, e.sha!)
    );
    return files.filter((f): f is SourceFile => f !== null);
  }

  /** Only the files added or modified by a pull request, at the PR head. */
  async getPullRequestFiles(ref: RepoRef, pullNumber: number): Promise<SourceFile[]> {
    const changed = await this.octokit.paginate(this.octokit.pulls.listFiles, {
      ...ref,
      pull_number: pullNumber,
      per_page: 100,
    });
    const candidates = changed.filter(
      f => f.status !== 'removed' && f.sha && shouldScanPath(f.filename)
    );
    const files = await mapLimit(candidates, FETCH_CONCURRENCY, f =>
      this.readBlob(ref, f.filename, f.sha!)
    );
    return files.filter((f): f is SourceFile => f !== null);
  }

  async createCheckRun(
    ref: RepoRef,
    headSha: string,
    result: ScanResult,
    report: string
  ): Promise<void> {
    const conclusion = checkConclusion(result);
    await this.octokit.checks.create({
      ...ref,
      name: 'SecureAI Security Scan',
      head_sha: headSha,
      status: 'completed',
      conclusion,
      output: {
        title:
          result.totalFindings === 0
            ? 'No security issues found'
            : `${result.totalFindings} potential issue(s) (${result.criticalCount} critical, ${result.highCount} high)`,
        summary: `Scanned ${result.filesScanned} file(s).`,
        text: truncate(report),
      },
    });
  }

  /** Creates the report comment, or updates the one SecureAI already posted on this PR. */
  async upsertPullRequestComment(ref: RepoRef, pullNumber: number, report: string): Promise<void> {
    const body = truncate(`${REPORT_MARKER}\n${report}`);
    const comments = await this.octokit.paginate(this.octokit.issues.listComments, {
      ...ref,
      issue_number: pullNumber,
      per_page: 100,
    });
    const existing = comments.find(
      c => c.body?.startsWith(REPORT_MARKER) && c.user?.type === 'Bot'
    );
    if (existing) {
      await this.octokit.issues.updateComment({ ...ref, comment_id: existing.id, body });
    } else {
      await this.octokit.issues.createComment({ ...ref, issue_number: pullNumber, body });
    }
  }
}
