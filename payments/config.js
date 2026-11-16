// Shared payment configuration. Values come from the environment only.

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable ${name} (see .env.example)`);
  return value;
}

export const STRIPE_SECRET_KEY = requireEnv('STRIPE_SECRET_KEY');
export const STRIPE_PUBLISHABLE_KEY = requireEnv('STRIPE_PUBLISHABLE_KEY');
