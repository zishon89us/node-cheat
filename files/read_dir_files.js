// Read every file in a directory concurrently
// Run: node files/read_dir_files.js

import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const dir = join(import.meta.dirname, 'sample_files');

const entries = await readdir(dir, { withFileTypes: true });
const files = entries.filter((e) => e.isFile()).map((e) => join(dir, e.name));

const results = await Promise.allSettled(files.map((file) => readFile(file, 'utf8')));

results.forEach((result, i) => {
  if (result.status === 'fulfilled') console.log(files[i], `${result.value.length} chars`);
  else console.error(files[i], result.reason.message);
});
