import { Octokit } from '@octokit/rest';
import { createAppAuth } from '@octokit/auth-app';
import { GitHubFile } from '../types/index.js';
import fs from 'fs/promises';

export class GitHubClient {
  private octokit: Octokit;
  private isApp: boolean;

  constructor(config: { token?: string; appId?: number; privateKeyPath?: string; installationId?: number }) {
    if (config.appId && config.privateKeyPath) {
      // GitHub App authentication
      this.isApp = true;
      this.octokit = new Octokit({
        authStrategy: createAppAuth,
        auth: {
          appId: config.appId,
          privateKey: '', // Will be loaded from file
          installationId: config.installationId,
        },
      });
    } else if (config.token) {
      // Personal Access Token authentication
      this.isApp = false;
      this.octokit = new Octokit({
        auth: config.token,
      });
    } else {
      throw new Error('Either provide token or appId + privateKeyPath');
    }
  }

  /**
   * Initialize GitHub App with private key from file
   */
  static async createFromApp(appId: number, privateKeyPath: string, installationId?: number): Promise<GitHubClient> {
    const privateKey = await fs.readFile(privateKeyPath, 'utf-8');

    const octokit = new Octokit({
      authStrategy: createAppAuth,
      auth: {
        appId,
        privateKey,
        installationId,
      },
    });

    const client = Object.create(GitHubClient.prototype);
    client.octokit = octokit;
    client.isApp = true;
    return client;
  }

  /**
   * Get all files from a repository
   */
  async getRepositoryFiles(owner: string, repo: string, ref = 'main'): Promise<GitHubFile[]> {
    const files: GitHubFile[] = [];

    try {
      // Get repository tree
      const { data: refData } = await this.octokit.git.getRef({
        owner,
        repo,
        ref: `heads/${ref}`,
      });

      const treeSha = refData.object.sha;

      const { data: tree } = await this.octokit.git.getTree({
        owner,
        repo,
        tree_sha: treeSha,
        recursive: 'true',
      });

      // Filter only blob (file) entries
      const fileEntries = tree.tree.filter(item => item.type === 'blob');

      // Fetch content for each file (with rate limiting consideration)
      const batchSize = 10;
      for (let i = 0; i < fileEntries.length; i += batchSize) {
        const batch = fileEntries.slice(i, i + batchSize);
        const filePromises = batch.map(async (item) => {
          if (!item.path || !item.sha) return null;

          try {
            const { data } = await this.octokit.git.getBlob({
              owner,
              repo,
              file_sha: item.sha,
            });

            // Decode base64 content
            const content = Buffer.from(data.content, 'base64').toString('utf-8');

            return {
              path: item.path,
              content,
              sha: item.sha,
            };
          } catch (error) {
            console.warn(`Failed to fetch ${item.path}:`, error);
            return null;
          }
        });

        const batchResults = await Promise.all(filePromises);
        files.push(...batchResults.filter((f): f is GitHubFile => f !== null));
      }

      return files;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch repository files: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Try multiple default branches
   */
  async getRepositoryFilesWithFallback(owner: string, repo: string): Promise<GitHubFile[]> {
    const branches = ['main', 'master', 'develop'];

    for (const branch of branches) {
      try {
        return await this.getRepositoryFiles(owner, repo, branch);
      } catch (error) {
        if (error instanceof Error && error.message.includes('Not Found')) {
          continue;
        }
        throw error;
      }
    }

    throw new Error(`Could not find any default branch (tried: ${branches.join(', ')})`);
  }

  /**
   * Get repository information
   */
  async getRepository(owner: string, repo: string) {
    const { data } = await this.octokit.repos.get({
      owner,
      repo,
    });
    return data;
  }

  /**
   * Create a check run for the scan results
   */
  async createCheckRun(owner: string, repo: string, headSha: string, findings: number) {
    const status = findings === 0 ? 'success' : 'failure';
    const conclusion = findings === 0 ? 'success' : 'neutral';

    await this.octokit.checks.create({
      owner,
      repo,
      name: 'SecureAI Security Scan',
      head_sha: headSha,
      status: 'completed',
      conclusion,
      output: {
        title: findings === 0 ? 'No security issues found' : `Found ${findings} security issue(s)`,
        summary: findings === 0
          ? '✅ No security vulnerabilities detected in this commit.'
          : `⚠️ Security scan found ${findings} potential vulnerabilities. Check the details below.`,
      },
    });
  }

  /**
   * Comment on a pull request
   */
  async commentOnPullRequest(owner: string, repo: string, pullNumber: number, body: string) {
    await this.octokit.issues.createComment({
      owner,
      repo,
      issue_number: pullNumber,
      body,
    });
  }

  /**
   * Parse repository URL to get owner and repo
   */
  static parseRepoUrl(url: string): { owner: string; repo: string } {
    // Handle various GitHub URL formats
    const patterns = [
      /github\.com\/([^\/]+)\/([^\/\.]+)/,
      /^([^\/]+)\/([^\/]+)$/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return {
          owner: match[1],
          repo: match[2].replace(/\.git$/, ''),
        };
      }
    }

    throw new Error('Invalid GitHub repository URL');
  }
}
