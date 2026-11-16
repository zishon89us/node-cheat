import { createHmac, generateKeyPairSync } from 'node:crypto';
import type { AddressInfo } from 'node:net';
import type { Server } from 'node:http';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { WEBHOOK_PATH, createApp } from './app.js';
import { decodePrivateKey, loadConfig, type AppConfig } from './config.js';

const { privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
const pem = privateKey.export({ type: 'pkcs1', format: 'pem' }).toString();
const SECRET = 'test-webhook-secret';

const config: AppConfig = {
  port: 0,
  github: { appId: 1, webhookSecret: SECRET, privateKey: pem },
  manualScan: { token: 'unused', apiKey: 'a'.repeat(32) },
};

let server: Server;
let base: string;

beforeAll(async () => {
  server = createApp(config).listen(0);
  await new Promise(resolve => server.once('listening', resolve));
  base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
});

afterAll(() => new Promise<void>(resolve => server.close(() => resolve())));

describe('HTTP app', () => {
  it('serves health', async () => {
    const res = await fetch(`${base}/health`);
    expect(res.status).toBe(200);
    expect(((await res.json()) as { status: string }).status).toBe('healthy');
  });

  it('rejects webhooks with a bad signature', async () => {
    const res = await fetch(`${base}${WEBHOOK_PATH}`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-github-event': 'ping',
        'x-github-delivery': '1',
        'x-hub-signature-256': 'sha256=' + '0'.repeat(64),
      },
      body: JSON.stringify({ zen: 'hi' }),
    });
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.status).toBeLessThan(500);
  });

  it('accepts webhooks with a valid signature', async () => {
    const body = JSON.stringify({ zen: 'Keep it logically awesome.', hook_id: 1 });
    const signature = 'sha256=' + createHmac('sha256', SECRET).update(body).digest('hex');
    const res = await fetch(`${base}${WEBHOOK_PATH}`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-github-event': 'ping',
        'x-github-delivery': '2',
        'x-hub-signature-256': signature,
      },
      body,
    });
    expect(res.status).toBe(200);
  });

  it('requires the bearer key on /scan', async () => {
    const res = await fetch(`${base}/scan`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ repositoryUrl: 'octo/hello' }),
    });
    expect(res.status).toBe(401);
  });

  it('validates the repository URL on /scan', async () => {
    const res = await fetch(`${base}/scan`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${'a'.repeat(32)}` },
      body: JSON.stringify({ repositoryUrl: 'https://evil.example/x/y' }),
    });
    expect(res.status).toBe(400);
  });

  it('returns JSON 404s', async () => {
    const res = await fetch(`${base}/nope`);
    expect(res.status).toBe(404);
  });
});

describe('config', () => {
  const env = { GITHUB_APP_ID: '12', GITHUB_WEBHOOK_SECRET: 's', GITHUB_PRIVATE_KEY: pem };

  it('loads a minimal config with AI and manual scan disabled', () => {
    const c = loadConfig(env);
    expect(c.github.appId).toBe(12);
    expect(c.anthropic).toBeUndefined();
    expect(c.manualScan).toBeUndefined();
  });

  it('enables AI triage with the default model', () => {
    expect(loadConfig({ ...env, ANTHROPIC_API_KEY: 'k' }).anthropic?.model).toBe(
      'claude-sonnet-5-5'
    );
  });

  it('requires a private key', () => {
    expect(() => loadConfig({ GITHUB_APP_ID: '12', GITHUB_WEBHOOK_SECRET: 's' })).toThrow(
      /PRIVATE_KEY/
    );
  });

  it('decodes base64 and escaped-newline PEMs', () => {
    expect(decodePrivateKey(Buffer.from(pem).toString('base64'))).toBe(pem);
    expect(decodePrivateKey(pem.replace(/\n/g, '\\n'))).toBe(pem);
    expect(() => decodePrivateKey('bm90IGEga2V5')).toThrow();
  });
});
