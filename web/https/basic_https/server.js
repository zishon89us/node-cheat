// Basic HTTPS server
// Run: SSL_KEY_PATH=key.pem SSL_CERT_PATH=cert.pem node web/https/basic_https/server.js

import { createServer } from 'node:https';
import { loadTlsOptions } from '../tls.js';

const port = Number(process.env.PORT ?? 8000);

createServer(await loadTlsOptions(), (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('hello world\n');
}).listen(port, () => console.log(`Listening on https://localhost:${port}`));
