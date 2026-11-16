// Read a file: promise API (preferred) and sync API (startup/config only)
// Run: node files/read_file.js

import { readFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const filePath = join(import.meta.dirname, 'sample_files', 'file1.txt');

console.log(await readFile(filePath, 'utf8'));

console.log(readFileSync(filePath, 'utf8'));
