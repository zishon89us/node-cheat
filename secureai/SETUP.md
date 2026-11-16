# SecureAI setup

This guide covers creating the GitHub App, running SecureAI locally against it, and deploying it.

## 1. Install

```bash
git clone https://github.com/zishon89us/node-cheat.git
cd node-cheat/secureai
npm ci
cp .env.example .env
```

Requires Node.js 22.12 or later.

## 2. Get a public URL for webhooks

GitHub has to reach your server. For local development, use a tunnel such as [smee.io](https://smee.io):

```bash
npx smee-client --url https://smee.io/<your-channel> --target http://localhost:3000/webhooks/github
```

In production, use your deployment's HTTPS URL.

## 3. Create the GitHub App

1. Go to **Settings → Developer settings → GitHub Apps → New GitHub App** (or your organization's equivalent).
2. Fill in:
   - **Webhook URL:** `https://<your-host>/webhooks/github` (or your smee URL)
   - **Webhook secret:** a long random string, for example from `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
3. **Repository permissions:**
   - Contents: Read-only
   - Metadata: Read-only
   - Pull requests: Read and write (for the report comment)
   - Checks: Read and write (for the check run)
4. **Subscribe to events:** Pull request, Push.
5. Create the app and note its **App ID**.
6. Under **Private keys**, click **Generate a private key** and save the `.pem` file outside the repository. `*.pem` is gitignored, but keep the key out of the project tree anyway.

`github-app-manifest.json` lists the same permissions and events, if you'd rather register the app through GitHub's [manifest flow](https://docs.github.com/en/apps/sharing-github-apps/registering-a-github-app-from-a-manifest).

## 4. Configure

Edit `.env`:

```env
GITHUB_APP_ID=123456
GITHUB_WEBHOOK_SECRET=<the secret from step 3>
GITHUB_PRIVATE_KEY_PATH=/absolute/path/to/your-app.private-key.pem
```

Optional:

```env
# Claude triage of findings
ANTHROPIC_API_KEY=<from console.anthropic.com>
# ANTHROPIC_MODEL=claude-sonnet-5-5

# Manual POST /scan endpoint
GITHUB_TOKEN=<a fine-grained token with read access to the repos you want to scan>
SCAN_API_KEY=<at least 16 random characters>
```

## 5. Run and install

```bash
npm run dev
curl http://localhost:3000/health
```

Install the app from its settings page (**Install App**) on one or more repositories. Open a pull request that adds, say, `el.innerHTML = userInput;`. Within a few seconds you should see a SecureAI comment and a **SecureAI Security Scan** check on the PR. Push another commit and the same comment is updated.

## 6. Deploy

The server is long-running and does scans in the background after acknowledging each webhook, so deploy it as a container rather than a serverless function.

**Docker**

```bash
docker build -t secureai .
docker run -p 3000:3000 \
  -e GITHUB_APP_ID=123456 \
  -e GITHUB_WEBHOOK_SECRET=... \
  -e GITHUB_PRIVATE_KEY="$(base64 -w0 your-app.private-key.pem)" \
  -e ANTHROPIC_API_KEY=... \
  secureai
```

**Railway**

`railway.json` builds from the Dockerfile and health-checks `/health`. Set the same variables in the Railway dashboard. Use `GITHUB_PRIVATE_KEY` (base64 or raw PEM) instead of a file path.

After deploying, update the app's webhook URL to `https://<your-host>/webhooks/github`.

## Troubleshooting

- **No comment or check on the PR:** open the app's settings, go to **Advanced → Recent Deliveries**, and look at the response code. `400`/`401` usually means the webhook secret doesn't match. A `200` followed by nothing means the background scan failed; the server log shows the error, often missing permissions or the app not being installed on that repository.
- **Server exits at startup:** it prints every missing or invalid variable. Compare against `.env.example`.
- **AI triage not running:** the startup log says `AI triage: disabled` when `ANTHROPIC_API_KEY` is unset. When a triage call fails, the server logs a warning and keeps the finding.
