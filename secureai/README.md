# 🔒 SecureAI

**AI-Powered GitHub App for Automated Security Auditing**

SecureAI is an intelligent security scanner that automatically detects vulnerabilities in your GitHub repositories using pattern matching and Claude AI for context-aware analysis. Install it as a GitHub App to get automated security scans on every pull request.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## ✨ Features

### 🎯 Comprehensive Security Scanning
- **Hardcoded Secrets Detection**: AWS keys, API tokens, private keys, database credentials
- **Code Injection Vulnerabilities**: SQL injection, command injection, XSS attacks
- **Weak Cryptography**: MD5, SHA1, weak session secrets
- **Authentication Issues**: Missing auth, insecure connections, session management
- **Information Disclosure**: Error stack traces, excessive logging
- **OWASP Top 10 Coverage**: Aligned with industry-standard security risks

### 🤖 AI-Powered Analysis
- **False Positive Reduction**: Claude AI analyzes findings in context
- **Intelligent Fix Suggestions**: AI-generated code fixes for vulnerabilities
- **Confidence Scoring**: Each finding rated by AI confidence level
- **Context-Aware Detection**: Understands test code vs production code

### 🔧 GitHub Integration
- **Automated PR Scans**: Every pull request automatically scanned
- **Check Run Status**: Pass/fail status on commits
- **Inline Comments**: Security findings commented directly on PRs
- **Beautiful Reports**: Markdown-formatted security reports

### 📊 Security Reports
- Severity-based categorization (Critical, High, Medium, Low)
- CWE references for each vulnerability type
- Code snippets showing exact vulnerability location
- Actionable recommendations for fixing issues
- Export as Markdown, JSON, or HTML

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- GitHub account (for GitHub App setup)
- Anthropic API key (optional, for AI features)

### Installation

```bash
# Clone the repository
git clone https://github.com/zishon89us/node-cheat.git
cd node-cheat/secureai

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your credentials
# (See Configuration section below)

# Build TypeScript
npm run build

# Start the server
npm start
```

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file with the following variables:

```env
# GitHub App Configuration (for production)
GITHUB_APP_ID=123456
GITHUB_WEBHOOK_SECRET=your_webhook_secret_here
GITHUB_PRIVATE_KEY_PATH=./private-key.pem

# Anthropic Claude API (optional but recommended)
ANTHROPIC_API_KEY=sk-ant-api03-...

# Server Configuration
PORT=3000
NODE_ENV=production

# For testing without GitHub App
GITHUB_TOKEN=ghp_your_personal_access_token
```

### GitHub App Setup

1. **Create a GitHub App**
   - Go to Settings → Developer settings → GitHub Apps → New GitHub App
   - **Name**: SecureAI (or your preferred name)
   - **Homepage URL**: Your deployment URL
   - **Webhook URL**: `https://your-domain.com/webhooks/github`
   - **Webhook Secret**: Generate a secure random string

2. **Permissions** (Repository permissions):
   - Contents: Read
   - Pull requests: Read & Write
   - Checks: Read & Write

3. **Subscribe to events**:
   - Pull request
   - Push
   - Check run

4. **Generate Private Key**
   - After creating the app, generate a private key
   - Download and save as `private-key.pem` in project root

5. **Install App**
   - Install the app on your repositories
   - Note the Installation ID (found in URL)

### Get Anthropic API Key

1. Sign up at [console.anthropic.com](https://console.anthropic.com)
2. Create an API key
3. Add to `.env` as `ANTHROPIC_API_KEY`

---

## 📖 Usage

### As GitHub App (Recommended)

Once installed on your repository, SecureAI automatically:
- ✅ Scans every pull request
- ✅ Comments with security findings
- ✅ Creates check run status
- ✅ Scans pushes to main/master branches

**No manual action required!**

### Manual Scan via API

Test scanning without installing the app:

```bash
curl -X POST http://localhost:3000/scan \
  -H "Content-Type: application/json" \
  -d '{
    "repositoryUrl": "https://github.com/username/repo",
    "token": "ghp_your_github_token"
  }'
```

**Response:**
```json
{
  "success": true,
  "scanResult": {
    "totalFindings": 12,
    "criticalCount": 3,
    "highCount": 5,
    "mediumCount": 4,
    "lowCount": 0,
    "findings": [...]
  },
  "markdownReport": "# 🔒 SecureAI Security Scan Report..."
}
```

### CLI Usage (Coming Soon)

```bash
npx secureai scan https://github.com/username/repo
```

---

## 🏗️ Architecture

```
secureai/
├── src/
│   ├── scanner/
│   │   ├── engine.ts          # Core scanning engine
│   │   └── rules.ts           # Security rule definitions
│   ├── github/
│   │   └── client.ts          # GitHub API integration
│   ├── ai/
│   │   └── claude.ts          # Claude AI integration
│   ├── webhook/
│   │   └── handler.ts         # GitHub webhook handler
│   ├── reports/
│   │   └── generator.ts       # Report generation
│   ├── types/
│   │   └── index.ts           # TypeScript types
│   └── index.ts               # Main application server
├── package.json
├── tsconfig.json
└── .env.example
```

### Technology Stack

- **Runtime**: Node.js 18+ with TypeScript
- **Framework**: Express.js
- **GitHub Integration**: @octokit/rest, @octokit/webhooks
- **AI**: Anthropic Claude API
- **Security**: Pattern matching + AI analysis
- **Deployment**: Vercel, Railway, or any Node.js host

---

## 🔍 How It Works

### 1. Pattern-Based Detection
SecureAI uses regex patterns to detect common vulnerability signatures:
- Hardcoded API keys and secrets
- Unsafe function calls (eval, innerHTML)
- SQL string concatenation
- Command injection patterns
- Weak cryptographic algorithms

### 2. AI-Powered Verification
Claude AI analyzes each finding to:
- Verify if it's a real vulnerability (not a false positive)
- Understand the code context
- Determine if sanitization exists
- Generate specific fix suggestions

### 3. Intelligent Reporting
Findings are:
- Sorted by severity (Critical → Low)
- Deduplicated and grouped
- Enhanced with CWE references
- Formatted with actionable recommendations

---

## 🎨 Example Output

### Pull Request Comment

```markdown
# 🔒 SecureAI Security Scan Report

## Summary
Found **8** security issues: 🔴 **2 Critical** | 🟠 **3 High** | 🟡 3 Medium

⚠️ **Action Required:** Critical vulnerabilities detected. Address immediately before merging.

## 🔴 Critical Severity (2)

### 1. Hardcoded AWS Access Keys
**File:** `src/config.js:14` | **Category:** Hardcoded Secrets | **CWE:** [CWE-798](...)

**Description:** AWS access key found: AKIAJXXX...

**Code:**
```javascript
  12 | const config = {
  13 |   aws: {
> 14 |     accessKeyId: "AKIAJXXXXXXXXXXXXX",
  15 |     secretKey: "xxxxxxxZrkJbTxxxxxxxxx"
  16 |   }
```

**💡 Recommendation:** Use environment variables or AWS IAM roles...
```

---

## 🧪 Testing

Run the test suite:

```bash
npm test
```

Test specific components:

```bash
# Test scanner engine
npm test -- scanner.test.ts

# Test GitHub integration
npm test -- github.test.ts
```

---

## 🚀 Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# Update GitHub App webhook URL to Vercel URL
```

### Deploy to Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway init
railway up

# Set environment variables in Railway dashboard
```

### Deploy to Any Node.js Host

1. Build the project: `npm run build`
2. Set environment variables
3. Start: `npm start`
4. Point GitHub webhook to: `https://your-domain.com/webhooks/github`

---

## 📊 Supported Vulnerability Types

| Category | Severity | Examples |
|----------|----------|----------|
| Hardcoded Secrets | Critical | AWS keys, API tokens, private keys |
| SQL Injection | High | String concatenation in queries |
| Command Injection | High | User input in shell commands |
| XSS | High | innerHTML without sanitization |
| Weak Cryptography | Medium | MD5, SHA1 usage |
| Session Management | High | Weak session secrets |
| Path Traversal | High | User input in file paths |
| Information Disclosure | Medium | Error stack traces to client |
| Missing Input Validation | Medium | Unvalidated request parameters |
| Insecure Transport | Medium | HTTP without HTTPS |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Adding New Security Rules

Edit `src/scanner/rules.ts`:

```typescript
{
  id: 'my-new-rule',
  name: 'Descriptive Name',
  severity: 'high',
  category: 'Category Name',
  description: 'What this detects',
  pattern: /regex-pattern/gi,
  getMessage: (match) => `Found issue: ${match[1]}`,
  getRecommendation: () => 'How to fix it',
  cwe: 'CWE-XXX',
}
```

---

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with [Claude AI](https://www.anthropic.com/) by Anthropic
- GitHub API via [Octokit](https://github.com/octokit)
- Security rules inspired by [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- CWE references from [MITRE](https://cwe.mitre.org/)

---

## 📧 Contact

**Zeeshan Hassan Memon**
- GitHub: [@zishon89us](https://github.com/zishon89us)
- Email: [Your Email]

---

## 🗺️ Roadmap

- [ ] CLI tool for local scanning
- [ ] VS Code extension
- [ ] Custom rule configuration
- [ ] Auto-fix pull requests
- [ ] Dependency vulnerability scanning
- [ ] SARIF report format
- [ ] Integration with security dashboards
- [ ] Multi-language support (Python, Java, Go)

---

**⭐ If you find SecureAI useful, please star this repo!**
