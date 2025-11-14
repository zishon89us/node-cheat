import { describe, it, expect } from 'vitest';
import { SecurityScanner } from './engine.js';
import { GitHubFile } from '../types/index.js';

describe('SecurityScanner', () => {
  const scanner = new SecurityScanner();

  describe('Hardcoded Secrets Detection', () => {
    it('should detect hardcoded AWS keys', async () => {
      const files: GitHubFile[] = [
        {
          path: 'config.js',
          content: `
            const AWS_ACCESS_KEY = "AKIAIOSFODNN7EXAMPLE";
            const AWS_SECRET_KEY = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY";
          `,
          sha: 'abc123',
        },
      ];

      const result = await scanner.scanFiles(files, 'test-repo');

      expect(result.totalFindings).toBeGreaterThan(0);
      expect(result.findings.some(f => f.id.includes('hardcoded-aws-keys'))).toBe(true);
      expect(result.criticalCount).toBeGreaterThan(0);
    });

    it('should detect hardcoded API keys', async () => {
      const files: GitHubFile[] = [
        {
          path: 'app.js',
          content: `
            const apiKey = "super-secret-api-key-12345678901234567890";
          `,
          sha: 'def456',
        },
      ];

      const result = await scanner.scanFiles(files, 'test-repo');

      expect(result.findings.some(f => f.category === 'Hardcoded Secrets')).toBe(true);
    });

    it('should NOT flag .env.example files', async () => {
      const files: GitHubFile[] = [
        {
          path: '.env.example',
          content: `
            API_KEY=your_api_key_here
            SECRET=your_secret_here
          `,
          sha: 'ghi789',
        },
      ];

      const result = await scanner.scanFiles(files, 'test-repo');

      // Should have low or no findings for example files
      expect(result.criticalCount).toBe(0);
    });
  });

  describe('XSS Detection', () => {
    it('should detect unsafe innerHTML usage', async () => {
      const files: GitHubFile[] = [
        {
          path: 'script.js',
          content: `
            const userInput = getUserInput();
            document.getElementById('output').innerHTML = userInput;
          `,
          sha: 'jkl012',
        },
      ];

      const result = await scanner.scanFiles(files, 'test-repo');

      expect(result.findings.some(f => f.id.includes('xss-innerhtml'))).toBe(true);
      expect(result.highCount).toBeGreaterThan(0);
    });

    it('should detect eval() usage', async () => {
      const files: GitHubFile[] = [
        {
          path: 'eval-test.js',
          content: `
            function processInput(code) {
              eval(code);
            }
          `,
          sha: 'mno345',
        },
      ];

      const result = await scanner.scanFiles(files, 'test-repo');

      expect(result.findings.some(f => f.id.includes('xss-eval'))).toBe(true);
    });
  });

  describe('SQL Injection Detection', () => {
    it('should detect SQL injection via string concatenation', async () => {
      const files: GitHubFile[] = [
        {
          path: 'database.js',
          content: `
            const query = "SELECT * FROM users WHERE id = '" + req.query.id + "'";
            db.execute(query);
          `,
          sha: 'pqr678',
        },
      ];

      const result = await scanner.scanFiles(files, 'test-repo');

      expect(result.findings.some(f => f.category === 'SQL Injection')).toBe(true);
    });
  });

  describe('Weak Cryptography Detection', () => {
    it('should detect MD5 usage', async () => {
      const files: GitHubFile[] = [
        {
          path: 'crypto.js',
          content: `
            const crypto = require('crypto');
            const hash = crypto.createHash('md5').update(password).digest('hex');
          `,
          sha: 'stu901',
        },
      ];

      const result = await scanner.scanFiles(files, 'test-repo');

      expect(result.findings.some(f => f.id.includes('weak-crypto-md5'))).toBe(true);
    });

    it('should detect weak session secrets', async () => {
      const files: GitHubFile[] = [
        {
          path: 'server.js',
          content: `
            app.use(session({ secret: 'simple-secret' }));
          `,
          sha: 'vwx234',
        },
      ];

      const result = await scanner.scanFiles(files, 'test-repo');

      expect(result.findings.some(f => f.id.includes('weak-session-secret'))).toBe(true);
    });
  });

  describe('File Filtering', () => {
    it('should skip node_modules', async () => {
      const files: GitHubFile[] = [
        {
          path: 'node_modules/package/index.js',
          content: `const secret = "AKIAIOSFODNN7EXAMPLE";`,
          sha: 'yz1',
        },
      ];

      const result = await scanner.scanFiles(files, 'test-repo');

      expect(result.totalFindings).toBe(0);
    });

    it('should skip binary files', async () => {
      const files: GitHubFile[] = [
        {
          path: 'image.png',
          content: 'binary data',
          sha: 'ab2',
        },
      ];

      const result = await scanner.scanFiles(files, 'test-repo');

      expect(result.totalFindings).toBe(0);
    });
  });

  describe('Severity Sorting', () => {
    it('should sort findings by severity', async () => {
      const files: GitHubFile[] = [
        {
          path: 'mixed.js',
          content: `
            const apiKey = "secret-key-12345678901234567890";
            console.log("debug info");
            document.body.innerHTML = userInput;
            crypto.createHash('md5');
          `,
          sha: 'cd3',
        },
      ];

      const result = await scanner.scanFiles(files, 'test-repo');

      if (result.findings.length > 1) {
        // First finding should be highest severity
        const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        for (let i = 0; i < result.findings.length - 1; i++) {
          const currentSeverity = severityOrder[result.findings[i].severity];
          const nextSeverity = severityOrder[result.findings[i + 1].severity];
          expect(currentSeverity).toBeLessThanOrEqual(nextSeverity);
        }
      }
    });
  });

  describe('Clean Repository', () => {
    it('should return zero findings for secure code', async () => {
      const files: GitHubFile[] = [
        {
          path: 'secure.js',
          content: `
            import crypto from 'crypto';

            export function hashPassword(password) {
              const salt = crypto.randomBytes(16);
              return crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha256');
            }

            export function sanitizeInput(input) {
              return input.replace(/<[^>]*>/g, '');
            }
          `,
          sha: 'ef4',
        },
      ];

      const result = await scanner.scanFiles(files, 'test-repo');

      expect(result.totalFindings).toBe(0);
      expect(result.criticalCount).toBe(0);
      expect(result.highCount).toBe(0);
    });
  });

  describe('Statistics', () => {
    it('should generate correct statistics message', () => {
      const result = {
        repositoryUrl: 'test',
        scannedAt: new Date(),
        totalFindings: 5,
        criticalCount: 2,
        highCount: 2,
        mediumCount: 1,
        lowCount: 0,
        findings: [],
      };

      const stats = scanner.getScanStatistics(result);

      expect(stats).toContain('5');
      expect(stats).toContain('critical');
      expect(stats).toContain('high');
    });

    it('should show success message for clean scan', () => {
      const result = {
        repositoryUrl: 'test',
        scannedAt: new Date(),
        totalFindings: 0,
        criticalCount: 0,
        highCount: 0,
        mediumCount: 0,
        lowCount: 0,
        findings: [],
      };

      const stats = scanner.getScanStatistics(result);

      expect(stats).toContain('No security issues');
    });
  });
});
