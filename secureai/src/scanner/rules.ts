import { ScannerRule } from '../types/index.js';

/**
 * Comprehensive security scanning rules
 * Based on OWASP Top 10, CWE, and common vulnerability patterns
 */
export const securityRules: ScannerRule[] = [
  // CRITICAL: Hardcoded Secrets and Credentials
  {
    id: 'hardcoded-aws-keys',
    name: 'Hardcoded AWS Access Keys',
    severity: 'critical',
    category: 'Hardcoded Secrets',
    description: 'AWS access keys found in code',
    pattern: [
      /(?:AWS_ACCESS_KEY_ID|aws_access_key_id|accessKeyId)\s*[:=]\s*["']?((?:A3T[A-Z0-9]|AKIA|AGPA|AIDA|AROA|AIPA|ANPA|ANVA|ASIA)[A-Z0-9]{16})["']?/gi,
      /(?:AWS_SECRET_ACCESS_KEY|aws_secret_access_key|secretAccessKey)\s*[:=]\s*["']?([A-Za-z0-9/+=]{40})["']?/gi,
    ],
    getMessage: (match) => `Hardcoded AWS credential found: ${match[1].substring(0, 8)}...`,
    getRecommendation: () =>
      'Use environment variables or AWS IAM roles. Never commit credentials to version control. Rotate exposed keys immediately.',
    cwe: 'CWE-798',
    references: ['https://owasp.org/www-community/vulnerabilities/Use_of_hard-coded_password'],
  },
  {
    id: 'hardcoded-api-keys',
    name: 'Hardcoded API Keys',
    severity: 'critical',
    category: 'Hardcoded Secrets',
    description: 'Generic API keys or secrets found in code',
    pattern: [
      /(?:api[_-]?key|apikey|api[_-]?secret)\s*[:=]\s*["']([a-zA-Z0-9_\-]{20,})["']/gi,
      /(?:secret|password|passwd|pwd)\s*[:=]\s*["'](?!.*\{.*\})([^"']{8,})["']/gi,
      /(?:token|auth[_-]?token)\s*[:=]\s*["']([a-zA-Z0-9_\-\.]{20,})["']/gi,
    ],
    validate: (match, fileContent, filePath) => {
      // Ignore if it's in .env.example or contains placeholder text
      if (filePath.includes('.env.example') || filePath.includes('example')) return false;
      const value = match[1] || match[0];
      const placeholders = ['xxx', 'your_', 'example', 'test', 'dummy', 'sample', 'placeholder', 'here'];
      return !placeholders.some(p => value.toLowerCase().includes(p));
    },
    getMessage: (match) => `Hardcoded secret found: ${match[1]?.substring(0, 10)}...`,
    getRecommendation: () =>
      'Store secrets in environment variables or a secrets management system (AWS Secrets Manager, HashiCorp Vault). Use .env files (gitignored) for local development.',
    cwe: 'CWE-798',
  },
  {
    id: 'hardcoded-private-keys',
    name: 'Private Keys in Code',
    severity: 'critical',
    category: 'Hardcoded Secrets',
    description: 'Private keys (RSA, SSH, etc.) found in code',
    pattern: /-----BEGIN (?:RSA |DSA |EC )?PRIVATE KEY-----/gi,
    getMessage: () => 'Private key found in source code',
    getRecommendation: () =>
      'Remove private keys from source code immediately. Store keys in secure locations with proper file permissions (0600). Use secrets management systems.',
    cwe: 'CWE-321',
  },

  // HIGH: Cross-Site Scripting (XSS)
  {
    id: 'xss-innerhtml',
    name: 'Unsafe innerHTML Usage',
    severity: 'high',
    category: 'Cross-Site Scripting (XSS)',
    description: 'innerHTML used without sanitization',
    pattern: /\.innerHTML\s*=\s*(?!["'`])/gi,
    validate: (match, fileContent) => {
      // Check if there's sanitization nearby
      const surroundingCode = fileContent.substring(
        Math.max(0, match.index! - 200),
        Math.min(fileContent.length, match.index! + 200)
      );
      return !/(sanitize|DOMPurify|escapeHtml)/i.test(surroundingCode);
    },
    getMessage: () => 'innerHTML assignment without sanitization detected',
    getRecommendation: () =>
      'Use textContent for plain text or sanitize HTML with DOMPurify before assigning to innerHTML. Implement Content Security Policy (CSP) headers.',
    cwe: 'CWE-79',
    references: ['https://owasp.org/www-community/attacks/xss/'],
  },
  {
    id: 'xss-eval',
    name: 'Dangerous eval() Usage',
    severity: 'high',
    category: 'Code Injection',
    description: 'eval() function can execute arbitrary code',
    pattern: /\beval\s*\(/gi,
    getMessage: () => 'Dangerous eval() usage detected',
    getRecommendation: () =>
      'Avoid eval(). Use JSON.parse() for JSON data, or safer alternatives like Function constructor with strict validation.',
    cwe: 'CWE-95',
  },

  // HIGH: SQL Injection
  {
    id: 'sql-injection',
    name: 'Potential SQL Injection',
    severity: 'high',
    category: 'SQL Injection',
    description: 'SQL query with string concatenation',
    pattern: [
      /(?:execute|query|exec)\s*\(\s*["'`](?:SELECT|INSERT|UPDATE|DELETE).*?\+/gi,
      /(?:SELECT|INSERT|UPDATE|DELETE).*?["'`]\s*\+\s*(?:req\.|params\.|query\.|body\.)/gi,
    ],
    getMessage: () => 'Potential SQL injection via string concatenation',
    getRecommendation: () =>
      'Use parameterized queries or prepared statements. Never concatenate user input into SQL queries. Use an ORM (Sequelize, TypeORM, Prisma) with built-in escaping.',
    cwe: 'CWE-89',
    references: ['https://owasp.org/www-community/attacks/SQL_Injection'],
  },

  // HIGH: Command Injection
  {
    id: 'command-injection',
    name: 'Command Injection Risk',
    severity: 'high',
    category: 'Command Injection',
    description: 'Shell command execution with user input',
    pattern: [
      /(?:exec|spawn|execSync|spawnSync)\s*\(\s*(?:req\.|params\.|query\.|body\.|process\.argv)/gi,
      /(?:exec|spawn)\s*\([^)]*\+[^)]*req\./gi,
    ],
    getMessage: () => 'Potential command injection via user input',
    getRecommendation: () =>
      'Avoid executing shell commands with user input. If necessary, use strict allowlisting, input validation, and escapeshellarg(). Consider safer alternatives.',
    cwe: 'CWE-78',
    references: ['https://owasp.org/www-community/attacks/Command_Injection'],
  },

  // HIGH: Weak Cryptography
  {
    id: 'weak-crypto-md5',
    name: 'Weak Cryptographic Hash (MD5)',
    severity: 'medium',
    category: 'Weak Cryptography',
    description: 'MD5 is cryptographically broken',
    pattern: /createHash\s*\(\s*["']md5["']\s*\)/gi,
    getMessage: () => 'MD5 hash algorithm is cryptographically broken',
    getRecommendation: () =>
      'Use SHA-256 or SHA-3 for cryptographic purposes. For passwords, use bcrypt, scrypt, or Argon2.',
    cwe: 'CWE-327',
  },
  {
    id: 'weak-crypto-sha1',
    name: 'Weak Cryptographic Hash (SHA1)',
    severity: 'medium',
    category: 'Weak Cryptography',
    description: 'SHA1 is deprecated for cryptographic use',
    pattern: /createHash\s*\(\s*["']sha1["']\s*\)/gi,
    getMessage: () => 'SHA1 is deprecated for security purposes',
    getRecommendation: () =>
      'Use SHA-256 or stronger. SHA1 is vulnerable to collision attacks.',
    cwe: 'CWE-327',
  },

  // MEDIUM: Insecure Session Configuration
  {
    id: 'weak-session-secret',
    name: 'Weak Session Secret',
    severity: 'high',
    category: 'Session Management',
    description: 'Session secret is too simple or hardcoded',
    pattern: /(?:session|Session)\s*\(\s*\{[^}]*secret\s*:\s*["']([a-zA-Z0-9\s-]{1,20})["']/gi,
    validate: (match) => {
      const secret = match[1];
      // Flag if secret is too short or contains common words
      return secret.length < 32 || /^[a-zA-Z\s-]+$/.test(secret);
    },
    getMessage: (match) => `Weak session secret detected: "${match[1]}"`,
    getRecommendation: () =>
      'Use a cryptographically random secret with minimum 32 bytes. Generate with crypto.randomBytes(32).toString("hex"). Store in environment variables.',
    cwe: 'CWE-331',
  },

  // MEDIUM: Missing Input Validation
  {
    id: 'missing-input-validation',
    name: 'Missing Input Validation',
    severity: 'medium',
    category: 'Input Validation',
    description: 'Direct use of request parameters without validation',
    pattern: /(?:req\.(?:query|params|body)\.[a-zA-Z_]+)(?!\s*(?:[&|]|===|!==|\|\||&&|\.validate|\.check))/g,
    validate: (match, fileContent) => {
      // Only flag if there's no validation in the next few lines
      const afterMatch = fileContent.substring(match.index!, match.index! + 300);
      return !/(validate|check|assert|typeof|instanceof|isNaN|parseInt|parseFloat)/i.test(afterMatch);
    },
    getMessage: () => 'Request parameter used without validation',
    getRecommendation: () =>
      'Validate and sanitize all user inputs. Use validation libraries like Joi, express-validator, or Zod. Check data types, ranges, and formats.',
    cwe: 'CWE-20',
  },

  // MEDIUM: Path Traversal
  {
    id: 'path-traversal',
    name: 'Path Traversal Risk',
    severity: 'high',
    category: 'Path Traversal',
    description: 'File path constructed with user input',
    pattern: /(?:readFile|writeFile|createReadStream|createWriteStream|unlink|rmdir)\s*\([^)]*(?:req\.|params\.|query\.|body\.)/gi,
    getMessage: () => 'Potential path traversal vulnerability',
    getRecommendation: () =>
      'Validate and sanitize file paths. Use path.resolve() and check if the resolved path is within allowed directories. Reject paths containing "..".',
    cwe: 'CWE-22',
  },

  // LOW: Information Disclosure
  {
    id: 'error-stack-exposure',
    name: 'Error Stack Trace Exposure',
    severity: 'medium',
    category: 'Information Disclosure',
    description: 'Error stack traces sent to client',
    pattern: /res\.(?:send|json)\s*\([^)]*(?:err|error)(?:\.stack)?/gi,
    getMessage: () => 'Error details potentially exposed to client',
    getRecommendation: () =>
      'Log errors server-side only. Return generic error messages to clients. Use error handling middleware in Express.',
    cwe: 'CWE-209',
  },

  // MEDIUM: Insecure HTTP
  {
    id: 'http-server',
    name: 'HTTP Server Without HTTPS',
    severity: 'medium',
    category: 'Insecure Transport',
    description: 'HTTP server used instead of HTTPS',
    pattern: /http\.createServer/gi,
    validate: (match, fileContent) => {
      // Only flag if there's no HTTPS setup nearby
      const surroundingCode = fileContent.substring(
        Math.max(0, match.index! - 500),
        Math.min(fileContent.length, match.index! + 500)
      );
      return !/(https|tls|ssl)/i.test(surroundingCode);
    },
    getMessage: () => 'HTTP server without HTTPS detected',
    getRecommendation: () =>
      'Use HTTPS in production. Implement TLS/SSL certificates. Use HSTS headers to enforce HTTPS.',
    cwe: 'CWE-319',
  },

  // CRITICAL: Database Connection Without Auth
  {
    id: 'mongodb-no-auth',
    name: 'MongoDB Connection Without Authentication',
    severity: 'high',
    category: 'Authentication',
    description: 'MongoDB connection without credentials',
    pattern: /mongodb:\/\/localhost(?::27017)?\/[^"'`\s]*/gi,
    validate: (match) => {
      return !match[0].includes('@'); // No username in connection string
    },
    getMessage: () => 'MongoDB connection without authentication',
    getRecommendation: () =>
      'Always use authentication for database connections. Enable SSL/TLS. Use connection strings with credentials from environment variables.',
    cwe: 'CWE-306',
  },

  // MEDIUM: Regex DoS
  {
    id: 'regex-dos',
    name: 'Regular Expression Denial of Service (ReDoS)',
    severity: 'medium',
    category: 'Denial of Service',
    description: 'Potentially catastrophic regex pattern',
    pattern: /new RegExp\([^)]*\([^)]*\+[^)]*\*[^)]*\)/gi,
    getMessage: () => 'Regex pattern vulnerable to ReDoS',
    getRecommendation: () =>
      'Avoid nested quantifiers and alternations in regex. Use simpler patterns or dedicated parsers. Test regex with safe-regex package.',
    cwe: 'CWE-1333',
  },

  // LOW: Console.log in Production
  {
    id: 'console-log-production',
    name: 'Console.log in Production Code',
    severity: 'low',
    category: 'Information Disclosure',
    description: 'console.log statements may leak sensitive information',
    pattern: /console\.log\(/gi,
    validate: (match, fileContent, filePath) => {
      // Only flag in production code, not in test files
      return !filePath.includes('test') && !filePath.includes('spec');
    },
    getMessage: () => 'console.log found in production code',
    getRecommendation: () =>
      'Use proper logging libraries (Winston, Bunyan, Pino) with log levels. Remove debug logging in production or use environment-based logging.',
    cwe: 'CWE-532',
  },
];
