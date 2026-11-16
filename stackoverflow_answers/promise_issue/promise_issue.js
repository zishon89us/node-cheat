//------------------------------------------------------
// Promise issue - resolve only after async work completes
// Run : node promise_issue/promise_issue.js
// Test: curl -X POST localhost:3000/readList -H 'content-type: application/json' -d '{"path":"temp_dir"}'
//------------------------------------------------------

import express from 'express';
import { readdir } from 'node:fs/promises';
import { join, resolve, sep } from 'node:path';

const app = express();
app.use(express.json());

const ROOT = resolve(import.meta.dirname);

async function readList(relativeDir) {
  const dir = resolve(ROOT, relativeDir);
  if (dir !== ROOT && !dir.startsWith(ROOT + sep))
    throw new RangeError('Path outside allowed root');

  const entries = await readdir(dir, { withFileTypes: true });
  return entries.map((entry) => ({
    name: entry.name,
    filepath: join(relativeDir, entry.name),
    isFile: entry.isFile(),
    filetype: entry.isFile() ? 'far fa-file-alt' : 'fas fa-folder-open',
  }));
}

app.post('/readList', async (req, res) => {
  const { path = 'temp_dir' } = req.body ?? {};
  if (typeof path !== 'string') return res.status(400).json({ error: 'path must be a string' });
  try {
    res.json(await readList(path));
  } catch (err) {
    const status = err instanceof RangeError ? 400 : err.code === 'ENOENT' ? 404 : 500;
    res.status(status).json({ error: 'Could not list directory' });
  }
});

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
