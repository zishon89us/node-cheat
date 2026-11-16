// Running Redis locally (any OS):
//   docker run --rm -p 6379:6379 redis:8
// On Windows without Docker, use WSL2 and `sudo apt install redis-server`.
// (The old MicrosoftArchive Windows port is unmaintained.)
//
// Producer/consumer queue: the producer LPUSHes jobs, a worker BLMOVEs them
// into a "processing" list so a crash doesn't lose work.
// Run: REDIS_URL=redis://localhost:6379 node databases/redis/redis_windows.js

import { createClient } from 'redis';

const url = process.env.REDIS_URL ?? 'redis://localhost:6379';
const producer = await createClient({ url }).connect();
const worker = await producer.duplicate().connect();

await producer.lPush('jobs', JSON.stringify({ id: 1, task: 'send-email' }));

const raw = await worker.blMove('jobs', 'jobs:processing', 'RIGHT', 'LEFT', 5);
if (raw) {
  console.log('Processing', JSON.parse(raw));
  await worker.lRem('jobs:processing', 1, raw);
}

producer.destroy();
worker.destroy();

// Password: set `requirepass` in redis.conf (or ACL users) and put it in REDIS_URL,
// e.g. redis://default:<password>@host:6379 — never hard-code it.
