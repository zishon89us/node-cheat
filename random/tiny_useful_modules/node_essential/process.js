//------------------------------------------------------
// Node.js essentials: process info and command-line arguments
// Run: node process.js --a hello --b world --verbose
//------------------------------------------------------

import { parseArgs } from 'node:util';

console.log(`PID: ${process.pid} Node: ${process.versions.node} Platform: ${process.platform}`);

const { values } = parseArgs({
  options: {
    a: { type: 'string' },
    b: { type: 'string', default: 'default-b' },
    verbose: { type: 'boolean', short: 'v', default: false },
  },
});

console.log(`This is value of flag A: ${values.a} & flag B: ${values.b} (verbose: ${values.verbose})`);
