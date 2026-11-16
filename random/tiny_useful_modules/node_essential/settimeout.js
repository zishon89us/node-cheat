//------------------------------------------------------
// Node.js essentials: timers, with a terminal progress indicator
// Run: node settimeout.js
//------------------------------------------------------

import { setInterval as every } from 'node:timers/promises';

const waitTime = 5000;
const waitInterval = 500;

const writeLine = (text) => {
  if (process.stdout.isTTY) {
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write(text);
  } else {
    console.log(text);
  }
};

// Callback style
setTimeout(() => console.log('\n(callback timer fired)'), waitTime + 100);

// Promise style: async iterator over an interval
let elapsed = 0;
for await (const _ of every(waitInterval)) {
  elapsed += waitInterval;
  writeLine(`Progress ${Math.floor((elapsed / waitTime) * 100)}%`);
  if (elapsed >= waitTime) break;
}

writeLine('All done\n');
