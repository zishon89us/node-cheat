//------------------------------------------------------
// Node.js essentials: streams read/write data in chunks (files, network, processes)
// Run: node streams.js
//------------------------------------------------------

import { createReadStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { createGzip } from 'node:zlib';
import { Writable } from 'node:stream';
import path from 'node:path';

const source = path.join(import.meta.dirname, 'sample_files', 'file2.txt');

// Readable streams are async iterables
for await (const chunk of createReadStream(source, 'utf-8')) {
  console.log(`File chunk of ${chunk.length} chars read.`);
}
console.log('File reading complete.');

// pipeline() wires streams together and propagates errors + cleanup
let gzippedBytes = 0;
await pipeline(
  createReadStream(source),
  createGzip(),
  new Writable({
    write(chunk, _encoding, callback) {
      gzippedBytes += chunk.length;
      callback();
    },
  }),
);
console.log(`Gzipped size: ${gzippedBytes} bytes`);
