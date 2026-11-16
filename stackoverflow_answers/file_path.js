//------------------------------------------------------
// File path - write to the right folder no matter where the app is started from
// Web Link=> https://stackoverflow.com/questions/60208760/different-path-to-a-file
// Run : node file_path.js
//------------------------------------------------------

import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

// import.meta.dirname = folder of this file; process.cwd() = folder the process was started in
const dir =
  process.env.NODE_ENV === 'production'
    ? join(import.meta.dirname, 'other', 'files')
    : join(import.meta.dirname, 'main', 'files');

await mkdir(dir, { recursive: true });
const file = join(dir, `${Date.now()}.txt`);
await writeFile(file, 'Written relative to this module, not the cwd', 'utf8');
console.log(`Wrote ${file}`);
