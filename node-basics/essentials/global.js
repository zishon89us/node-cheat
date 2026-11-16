//------------------------------------------------------
// Node.js essentials: globals and the current file/folder in ES modules
// Run: node global.js
//------------------------------------------------------

import path from 'node:path';

// globalThis works in Node, browsers and workers alike
console.log('I am console.log');
globalThis.console.log('I am globalThis.console.log');

// __dirname / __filename do not exist in ES modules; use import.meta instead
console.log(import.meta.dirname);
console.log(import.meta.filename);
console.log(import.meta.url);
console.log(`This is the file name only: ${path.basename(import.meta.filename)}`);
