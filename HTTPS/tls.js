import { readFile } from 'node:fs/promises';

export async function loadTlsOptions() {
  const { SSL_KEY_PATH, SSL_CERT_PATH } = process.env;
  if (!SSL_KEY_PATH || !SSL_CERT_PATH) {
    throw new Error('Set SSL_KEY_PATH and SSL_CERT_PATH (see HTTPS/README.md)');
  }
  const [key, cert] = await Promise.all([readFile(SSL_KEY_PATH), readFile(SSL_CERT_PATH)]);
  return { key, cert };
}
