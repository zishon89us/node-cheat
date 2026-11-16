// Write a file in chunks (stream) or all at once
// Run: node files/write_file.js

import { createWriteStream } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { pipeline } from 'node:stream/promises';
import { Readable } from 'node:stream';
import { join } from 'node:path';

const fileName = join(import.meta.dirname, 'sample_files', 'file_w.txt');

// Chunked: pipeline handles backpressure and closes the file
await pipeline(
  Readable.from(['This is first row.\n', 'This is second row.\n']),
  createWriteStream(fileName),
);
console.log('Streamed write done');

// Whole file
await writeFile(fileName, 'Hello World!\n');
console.log('The file was saved!');
