//------------------------------------------------------
// Four ways to read a file: callback, promisify, fs/promises, hand-rolled Promise
// Run: node callbacks_to_async.js
//------------------------------------------------------

import { readFile } from 'node:fs';
import { readFile as readFileAsync } from 'node:fs/promises';
import { promisify } from 'node:util';
import path from 'node:path';

const filePath = path.join(import.meta.dirname, 'files', 'file2.txt');

// Style 1: classic callback
readFile(filePath, 'utf-8', (err, data) => {
  if (err) return console.error(err);
  console.log(`Style 1 (callback): ${data}`);
});

// Style 2: util.promisify turns any (err, value) callback API into a promise
const readFilePromisified = promisify(readFile);
console.log(`Style 2 (promisify): ${await readFilePromisified(filePath, 'utf-8')}`);

// Style 3: built-in promise API (preferred)
console.log(`Style 3 (fs/promises): ${await readFileAsync(filePath, 'utf-8')}`);

// Style 4: wrap a callback API yourself
const readWithPromise = (file) =>
  new Promise((resolve, reject) => {
    readFile(file, 'utf-8', (err, data) => (err ? reject(err) : resolve(data)));
  });
console.log(`Style 4 (new Promise): ${await readWithPromise(filePath)}`);
