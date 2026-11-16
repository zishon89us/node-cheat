#!/usr/bin/env node

import http from 'node:http';
import createDebug from 'debug';
import app from '../app.js';

const debug = createDebug('standalone-express-server:server');

const normalizePort = (val) => {
  const port = Number.parseInt(val, 10);
  if (Number.isNaN(port)) return val; // named pipe
  if (port >= 0) return port;
  return false;
};

const port = normalizePort(process.env.PORT ?? '3000');
app.set('port', port);

const server = http.createServer(app);

server.on('error', (error) => {
  if (error.syscall !== 'listen') throw error;

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;
  const messages = {
    EACCES: `${bind} requires elevated privileges`,
    EADDRINUSE: `${bind} is already in use`,
  };
  if (!messages[error.code]) throw error;
  console.error(messages[error.code]);
  process.exit(1);
});

server.on('listening', () => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  debug(`Listening on ${bind}`);
  console.log(`Listening on ${bind}`);
});

// Finish in-flight requests on Ctrl+C / container stop
const shutdown = () => server.close(() => process.exit(0));
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

server.listen(port);
