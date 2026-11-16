import 'dotenv/config';
import { WEBHOOK_PATH, createApp } from './app.js';
import { loadConfig } from './config.js';

let config;
try {
  config = loadConfig();
} catch (error) {
  console.error((error as Error).message);
  console.error('See .env.example for the required variables.');
  process.exit(1);
}

const server = createApp(config).listen(config.port, () => {
  console.log(`SecureAI listening on http://localhost:${config.port}`);
  console.log(`GitHub webhooks: ${WEBHOOK_PATH}`);
  console.log(
    `AI triage: ${config.anthropic ? `enabled (${config.anthropic.model})` : 'disabled (no ANTHROPIC_API_KEY)'}`
  );
  console.log(
    `Manual /scan endpoint: ${config.manualScan ? 'enabled' : 'disabled (set GITHUB_TOKEN and SCAN_API_KEY)'}`
  );
});

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
