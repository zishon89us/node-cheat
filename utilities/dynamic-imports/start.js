// Load every module in ./files at runtime and call its init()
// Run: node utilities/dynamic-imports/start.js

import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const dir = join(import.meta.dirname, 'files');
const files = (await readdir(dir)).filter((f) => f.endsWith('.js')).sort();

for (const file of files) {
  const mod = await import(pathToFileURL(join(dir, file)).href);
  await mod.init();
}
