# 🔧 SecureAI Setup Guide

Complete step-by-step guide to set up SecureAI as a GitHub App.

---

## Part 1: Local Development Setup

### Step 1: Clone and Install

```bash
git clone https://github.com/zishon89us/node-cheat.git
cd node-cheat/secureai
npm install
```

### Step 2: Get Anthropic API Key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up or log in
3. Navigate to API Keys
4. Create a new API key
5. Copy the key (starts with `sk-ant-api03-...`)

### Step 3: Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:
```env
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
GITHUB_TOKEN=ghp_your_personal_token_for_testing
PORT=3000
NODE_ENV=development
```

### Step 4: Test Locally

```bash
npm run dev
```

Visit http://localhost:3000 - you should see:
```json
{
  "name": "SecureAI",
  "version": "1.0.0",
  "status": "running"
}
```

### Step 5: Test Manual Scan

```bash
curl -X POST http://localhost:3000/scan \
  -H "Content-Type: application/json" \
  -d '{
    "repositoryUrl": "https://github.com/zishon89us/node-cheat"
  }'
```

---

## Part 2: Deploy to Production

Choose your preferred platform:

### Option A: Deploy to Vercel (Easiest)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   npm run build
   vercel
   ```

3. **Set Environment Variables** in Vercel Dashboard:
   - `ANTHROPIC_API_KEY`
   - `GITHUB_APP_ID` (will get this in Part 3)
   - `GITHUB_WEBHOOK_SECRET` (will set this in Part 3)
   - `GITHUB_PRIVATE_KEY_PATH` = `/tmp/private-key.pem`
   - `NODE_ENV` = `production`

4. **Note your deployment URL**: `https://secureai-xxx.vercel.app`

### Option B: Deploy to Railway

1. **Install Railway CLI**
   ```bash
   npm i -g @railway/cli
   ```

2. **Login and Deploy**
   ```bash
   railway login
   railway init
   railway up
   ```

3. **Set Environment Variables** in Railway Dashboard
4. **Note your deployment URL**

### Option C: Deploy with Docker

```bash
# Build image
docker build -t secureai .

# Run container
docker run -p 3000:3000 \
  -e ANTHROPIC_API_KEY=your-key \
  -e GITHUB_APP_ID=your-app-id \
  -e GITHUB_WEBHOOK_SECRET=your-secret \
  -v $(pwd)/private-key.pem:/app/private-key.pem \
  secureai
```

---

## Part 3: Create GitHub App

### Step 1: Register New GitHub App

1. Go to https://github.com/settings/apps
2. Click **"New GitHub App"**

### Step 2: Fill in Basic Information

- **GitHub App name**: `SecureAI` (or `YourName-SecureAI` if taken)
- **Description**: AI-powered security vulnerability scanner
- **Homepage URL**: `https://github.com/zishon89us/secureai`
- **Webhook URL**: `https://your-deployment-url.com/webhooks/github`
- **Webhook secret**: Generate a strong random string (32+ characters)
  ```bash
  # Generate webhook secret:
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

### Step 3: Set Permissions

**Repository permissions:**
- **Contents**: Read
- **Pull requests**: Read & Write
- **Checks**: Read & Write
- **Issues**: Read & Write (optional, for creating issues)

**Subscribe to events:**
- ✅ Pull request
- ✅ Push
- ✅ Check run

### Step 4: Create the App

1. Click **"Create GitHub App"**
2. **Note the App ID** (shown at top of settings page)

### Step 5: Generate Private Key

1. Scroll down to **"Private keys"** section
2. Click **"Generate a private key"**
3. A `.pem` file will download automatically
4. **Rename it to `private-key.pem`**

### Step 6: Update Environment Variables

Update your deployment's environment variables:

```env
GITHUB_APP_ID=123456
GITHUB_WEBHOOK_SECRET=the-secret-you-generated
GITHUB_PRIVATE_KEY_PATH=./private-key.pem
```

**For Vercel:** Upload `private-key.pem` content as environment variable:
```bash
# Read file and copy content
cat private-key.pem | pbcopy  # macOS
cat private-key.pem | xclip   # Linux

# In Vercel dashboard, create variable:
# Name: GITHUB_PRIVATE_KEY
# Value: (paste entire .pem content including BEGIN/END lines)
```

**Then update your code** to read from env var instead of file:
```typescript
// In src/webhook/handler.ts
const privateKey = process.env.GITHUB_PRIVATE_KEY ||
                   await fs.readFile(process.env.GITHUB_PRIVATE_KEY_PATH, 'utf-8');
```

### Step 7: Install App on Repository

1. Go to app settings: `https://github.com/settings/apps/your-app-name`
2. Click **"Install App"** in left sidebar
3. Choose **"Only select repositories"**
4. Select test repository (e.g., node-cheat)
5. Click **"Install"**

---

## Part 4: Test the Integration

### Test 1: Create a Test PR

1. Create a new branch in your test repository
2. Add a file with a vulnerability:

```javascript
// test-security.js
const AWS_ACCESS_KEY = "AKIAIOSFODNN7EXAMPLE";
const AWS_SECRET_KEY = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY";

const apiKey = "super-secret-key-12345";

function processUserInput() {
  const userInput = req.query.username;
  eval(userInput); // Dangerous!

  document.getElementById('output').innerHTML = userInput; // XSS!
}
```

3. Commit and push
4. Create a pull request

### Test 2: Wait for SecureAI

Within 30-60 seconds, you should see:
- ✅ Check run appear on the PR
- 📝 Comment from SecureAI with security report

### Test 3: Verify Report

The report should show:
- 🔴 Hardcoded AWS credentials (Critical)
- 🔴 Hardcoded API key (Critical)
- 🟠 eval() usage (High)
- 🟠 XSS via innerHTML (High)

---

## Part 5: Troubleshooting

### Webhook Not Firing

1. Check webhook deliveries:
   - Go to app settings → Advanced → Recent Deliveries
   - Look for failed deliveries
   - Check response codes

2. Verify webhook URL is accessible:
   ```bash
   curl https://your-deployment-url.com/health
   ```

3. Check webhook secret matches in:
   - GitHub App settings
   - Environment variable

### App Crashes on Webhook

Check logs:
```bash
# Vercel
vercel logs

# Railway
railway logs

# Docker
docker logs <container-id>
```

Common issues:
- Missing environment variables
- Private key not found
- Invalid API keys

### No Comments on PR

1. Check app permissions (Pull requests: Write)
2. Verify app is installed on repository
3. Check logs for errors
4. Test manual scan endpoint first

### AI Analysis Not Working

1. Verify `ANTHROPIC_API_KEY` is set correctly
2. Check API key has credits
3. Look for API errors in logs
4. Scanner will still work without AI (just more false positives)

---

## Part 6: Advanced Configuration

### Custom Security Rules

Add rules to `src/scanner/rules.ts`:

```typescript
{
  id: 'my-custom-rule',
  name: 'Custom Security Check',
  severity: 'high',
  category: 'Custom',
  description: 'Detects my specific pattern',
  pattern: /dangerous-pattern/gi,
  getMessage: (match) => `Found dangerous pattern`,
  getRecommendation: () => 'Use safe alternative',
}
```

Rebuild and redeploy:
```bash
npm run build
vercel --prod
```

### Webhook Secret Rotation

1. Generate new secret:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. Update GitHub App settings
3. Update deployment environment variables
4. Restart application

### Multiple Repositories

Install the app on additional repositories:
1. Go to app settings
2. Click "Install App"
3. Select additional repositories

Each repository gets automatic scanning!

---

## Part 7: Monitoring & Maintenance

### Monitor Webhook Health

Check regularly:
- https://github.com/settings/apps/your-app/advanced
- Look at Recent Deliveries
- Success rate should be >95%

### Update Dependencies

```bash
npm outdated
npm update
npm audit fix
```

### Monitor API Usage

**Anthropic API:**
- Check usage: https://console.anthropic.com
- Free tier: $5 credit
- Upgrade if needed

**GitHub API:**
- Rate limits: 5000 req/hour for apps
- Check headers: `X-RateLimit-Remaining`

---

## 🎉 You're Done!

SecureAI is now:
- ✅ Deployed and running
- ✅ Installed as GitHub App
- ✅ Scanning pull requests automatically
- ✅ Posting security reports

**Next Steps:**
1. Install on more repositories
2. Customize security rules
3. Share with your team
4. Star the repo! ⭐

---

## 📞 Need Help?

- 🐛 **Bug reports**: https://github.com/zishon89us/node-cheat/issues
- 💬 **Questions**: Open a discussion
- 📧 **Email**: [Your Email]

Happy secure coding! 🔒
