// Express over HTTPS
// Run: SSL_KEY_PATH=key.pem SSL_CERT_PATH=cert.pem node HTTPS/express_https/server.js

import { createServer } from 'node:https';
import express from 'express';
import { loadTlsOptions } from '../tls.js';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const port = Number(process.env.PORT ?? 3000);
createServer(await loadTlsOptions(), app).listen(port, () => {
  console.log(`Listening on https://localhost:${port}`);
});
