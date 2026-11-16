import { readFileSync } from 'node:fs';
import { z } from 'zod';

const EnvSchema = z
  .object({
    PORT: z.coerce.number().int().positive().default(3000),
    GITHUB_APP_ID: z.coerce.number().int().positive(),
    GITHUB_WEBHOOK_SECRET: z.string().min(1),
    GITHUB_PRIVATE_KEY: z.string().min(1).optional(),
    GITHUB_PRIVATE_KEY_PATH: z.string().min(1).optional(),
    ANTHROPIC_API_KEY: z.string().min(1).optional(),
    ANTHROPIC_MODEL: z.string().min(1).default('claude-sonnet-5-5'),
    AI_MAX_FINDINGS: z.coerce.number().int().nonnegative().default(50),
    GITHUB_TOKEN: z.string().min(1).optional(),
    SCAN_API_KEY: z.string().min(16).optional(),
  })
  .refine(env => env.GITHUB_PRIVATE_KEY || env.GITHUB_PRIVATE_KEY_PATH, {
    message: 'Set GITHUB_PRIVATE_KEY (PEM or base64 PEM) or GITHUB_PRIVATE_KEY_PATH',
  });

export interface AppConfig {
  port: number;
  github: { appId: number; webhookSecret: string; privateKey: string };
  anthropic?: { apiKey: string; model: string; maxFindings: number };
  manualScan?: { token: string; apiKey: string };
}

export function decodePrivateKey(raw: string): string {
  if (raw.includes('-----BEGIN')) return raw.replace(/\\n/g, '\n');
  const decoded = Buffer.from(raw, 'base64').toString('utf8');
  if (!decoded.includes('-----BEGIN'))
    throw new Error('GITHUB_PRIVATE_KEY is neither a PEM nor a base64-encoded PEM');
  return decoded;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  const parsed = EnvSchema.safeParse(env);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map(i => `${i.path.join('.') || 'env'}: ${i.message}`)
      .join('\n  ');
    throw new Error(`Invalid configuration:\n  ${issues}`);
  }
  const e = parsed.data;
  const privateKey = e.GITHUB_PRIVATE_KEY
    ? decodePrivateKey(e.GITHUB_PRIVATE_KEY)
    : readFileSync(e.GITHUB_PRIVATE_KEY_PATH!, 'utf8');

  return {
    port: e.PORT,
    github: { appId: e.GITHUB_APP_ID, webhookSecret: e.GITHUB_WEBHOOK_SECRET, privateKey },
    anthropic: e.ANTHROPIC_API_KEY
      ? { apiKey: e.ANTHROPIC_API_KEY, model: e.ANTHROPIC_MODEL, maxFindings: e.AI_MAX_FINDINGS }
      : undefined,
    manualScan:
      e.GITHUB_TOKEN && e.SCAN_API_KEY
        ? { token: e.GITHUB_TOKEN, apiKey: e.SCAN_API_KEY }
        : undefined,
  };
}
