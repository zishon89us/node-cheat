# SecureAI

A GitHub App that scans pull requests for common security issues and reports them as a PR comment and a check run. Findings come from a set of regex rules; if you configure an Anthropic API key, Claude triages each finding and drops confident false positives.

[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-22.12%2B-green)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

## What it does

- **On every pull request** (opened, reopened, new commits) it scans only the files the PR adds or changes, then:
  - posts one report comment and updates it in place on later pushes, instead of adding a new comment each time;
  - creates a check run that fails on critical or high findings, is neutral on medium or low ones, and succeeds when nothing is found.
- **On pushes to the default branch** it scans the repository (up to 2,000 files) and records a check run.
- **Secrets are masked** in reports and in anything sent to Claude: token-like strings keep only their first four characters.
- **Claude triage (optional):** each finding goes to Claude with about 30 lines of masked context and comes back as a `true_positive` or `false_positive` verdict with a confidence score. Findings judged false positive with at least 80% confidence are removed. If the API call fails or the model declines, the finding is kept. Only the first `AI_MAX_FINDINGS` findings (default 50) are triaged, to bound cost.

Files over 1 MB, binary files, lockfiles, and vendored or build directories (`node_modules/`, `dist/`, `build/`, `vendor/`, …) are skipped.

## Rules

| Rule | Severity | CWE |
|------|----------|-----|
| AWS access key ID / secret access key | Critical | CWE-798 |
| Hardcoded API key, token, secret or password | Critical | CWE-798 |
| Private key in the repository | Critical | CWE-321 |
| Non-literal `innerHTML`/`outerHTML` with no visible sanitizer | High | CWE-79 |
| `eval()` / `new Function()` | High | CWE-95 |
| SQL built by concatenation or `${}` interpolation of request input | High | CWE-89 |
| Shell command built from request input | High | CWE-78 |
| File path built from request input | High | CWE-22 |
| Short literal session secret | High | CWE-331 |
| MD5 / SHA-1 via `createHash` | Medium | CWE-327 |
| Stack trace sent in an HTTP response | Medium | CWE-209 |
| Remote MongoDB URL without credentials | Medium | CWE-306 |
| `http.createServer` with no TLS nearby | Low | CWE-319 |

These are line-oriented pattern rules, not data-flow analysis. They miss input that reaches a sink through variables or function parameters. [`examples/vulnerable-code.js`](./examples/vulnerable-code.js) shows what they catch (10 findings) and what they miss. The patterns are bounded so hostile input can't trigger catastrophic regex backtracking, and a test checks this.

## Quick start

Requires Node.js 22.12 or later.

```bash
cd secureai
npm ci
cp .env.example .env   # then fill it in, see SETUP.md
npm run dev            # or: npm run build && npm start
```

`GET /health` returns `{"status":"healthy"}`. GitHub sends webhooks to `POST /webhooks/github`.

### Configuration

| Variable | Required | Purpose |
|----------|----------|---------|
| `GITHUB_APP_ID` | yes | Your GitHub App's ID |
| `GITHUB_WEBHOOK_SECRET` | yes | Used to verify webhook signatures |
| `GITHUB_PRIVATE_KEY_PATH` or `GITHUB_PRIVATE_KEY` | yes (one of them) | App private key, as a file path or as the PEM itself (raw, `\n`-escaped, or base64) |
| `ANTHROPIC_API_KEY` | no | Turns on Claude triage |
| `ANTHROPIC_MODEL` | no | Defaults to `claude-sonnet-5-5` |
| `AI_MAX_FINDINGS` | no | Maximum findings to triage per scan (default 50) |
| `GITHUB_TOKEN` + `SCAN_API_KEY` | no | Together they turn on the manual `/scan` endpoint |
| `PORT` | no | Defaults to 3000 |

The server checks its configuration at startup and exits with a list of problems if anything is missing.

### Manual scan endpoint

When `GITHUB_TOKEN` and `SCAN_API_KEY` are both set, you can scan a repository's default branch without installing the app:

```bash
curl -X POST http://localhost:3000/scan \
  -H "Authorization: Bearer $SCAN_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"repositoryUrl": "https://github.com/owner/repo"}'
```

The response contains `scanResult` (JSON) and `markdownReport`. The endpoint accepts only `github.com` URLs or `owner/repo`, and it always uses the server's own token. It requires a bearer key because every call spends the server's GitHub rate limit, and Anthropic credits too if triage is on.

## Deployment

The app is a long-running Express server. It acknowledges webhooks immediately and scans in the background, because GitHub times out deliveries after 10 seconds. That makes it a poor fit for serverless functions. Run it in a container instead:

- **Docker:** `docker build -t secureai . && docker run -p 3000:3000 --env-file .env secureai`
- **Railway:** `railway.json` builds from the Dockerfile and uses `/health` as the health check.

In container deployments, pass the key as `GITHUB_PRIVATE_KEY` rather than mounting a file. See [SETUP.md](./SETUP.md) for creating the GitHub App.

## Development

```bash
npm run type-check
npm run lint
npm test
npm run build
```

The tests cover the rules (including adversarial input), secret masking, report escaping, URL parsing, check-run conclusions, configuration loading, webhook signature handling over real HTTP, and the triage filter against a stubbed Claude client. No test makes network calls.

## Layout

```
src/
  server.ts            entry point: loads config, starts listening
  app.ts               Express app: webhook middleware, /health, /scan
  config.ts            environment validation (zod)
  webhook/handler.ts   pull_request and push handlers, runScan()
  github/client.ts     Octokit wrapper: PR files, repo tree, comment upsert, check runs
  scanner/             rules, engine, file filters
  ai/claude.ts         Claude triage with structured output
  reports/generator.ts Markdown / JSON / HTML reports
```

## License

MIT. See [LICENSE](./LICENSE).
