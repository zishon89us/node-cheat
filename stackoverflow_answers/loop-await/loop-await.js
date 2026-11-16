//------------------------------------------------------
// Await inside a loop - process lines one after another
// Run : node loop-await/loop-await.js
//------------------------------------------------------

import { open } from 'node:fs/promises';
import { join } from 'node:path';

async function processLine(thing1, thing2, thing3) {
  return { thing1, thing2, thing3 };
}

const file = await open(join(import.meta.dirname, 'file.txt'));

let index = 0;
for await (const line of file.readLines()) {
  if (!line.trim()) continue;
  const [thing1, thing2, thing3] = line.split(':');
  const result = await processLine(thing1, thing2, thing3);
  console.log(`Result of line ${index++}:`, result);
}

// For independent work, run in parallel instead:
// await Promise.all(lines.map((line) => processLine(...line.split(':'))));
