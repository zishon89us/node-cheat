// Production-ready shutdown handling for a Node.js HTTP server.
// Deploy behind a process manager (systemd, Docker, Kubernetes) that sends SIGTERM,
// and terminate TLS / load-balance at a reverse proxy (nginx, Caddy, cloud LB).
// Run: node deployment/2018_style.js

import { createServer } from 'node:http';

const server = createServer((req, res) => {
  if (req.url === '/healthz') {
    res.writeHead(200).end('ok');
    return;
  }
  res.writeHead(200, { 'Content-Type': 'text/plain' }).end('hello\n');
});

const port = Number(process.env.PORT ?? 3000);
server.listen(port, () => console.log(`Listening on http://localhost:${port}`));

const shutdown = (signal) => {
  console.log(`${signal} received, closing server`);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10_000).unref();
};
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
