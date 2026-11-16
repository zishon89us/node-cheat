// Redis connection that retries with backoff until a limit is reached
// Run: REDIS_URL=redis://localhost:6379 node databases/redis/connect-retry.js

import { createClient } from 'redis';

const MAX_RETRIES = 10;

const client = createClient({
  url: process.env.REDIS_URL ?? 'redis://localhost:6379',
  socket: {
    reconnectStrategy: (retries, cause) => {
      if (retries >= MAX_RETRIES)
        return new Error(`Giving up after ${retries} retries: ${cause.message}`);
      const jitter = Math.floor(Math.random() * 100);
      return Math.min(2 ** retries * 50, 3000) + jitter;
    },
  },
});

for (const event of ['connect', 'ready', 'reconnecting', 'end']) {
  client.on(event, () => console.log(`connection ${event}`));
}
client.on('error', (err) => console.error('connection error:', err.message));

try {
  await client.connect();
  console.log('PING ->', await client.ping());
  // Pub/Sub needs its own connection: client.duplicate()
  client.destroy();
} catch (err) {
  console.error('Could not connect to Redis:', err.message);
  process.exitCode = 1;
}
