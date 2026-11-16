//------------------------------------------------------
// Node.js essentials: read, write, append, copy, rename, move and delete files
// Works on a temporary copy so the sample files in the repo stay untouched
// Run: node files.js
//------------------------------------------------------

import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const sampleDir = path.join(import.meta.dirname, 'sample_files');
const workDir = await fs.mkdtemp(path.join(os.tmpdir(), 'node-cheat-'));
await fs.cp(sampleDir, workDir, { recursive: true });

// read folder and files
const files = await fs.readdir(workDir);
console.log(files);
for (const file of files) {
  console.log(file, '=>', await fs.readFile(path.join(workDir, file), 'utf-8'));
}

// overwrite and append
await fs.writeFile(path.join(workDir, files[0]), 'Just a new line 1');
await fs.appendFile(path.join(workDir, files[1]), '\nJust a new line appended');

// create, read, rename, copy
const newFile = path.join(workDir, 'file3.txt');
const renamed = path.join(workDir, '_file3.txt');
await fs.writeFile(newFile, 'This is a new file.');
console.log('New file content:', await fs.readFile(newFile, 'utf-8'));
await fs.rename(newFile, renamed);
await fs.copyFile(renamed, newFile);

// create a directory if it does not exist, then move a file into it
const copyDir = path.join(workDir, 'sample_files_copy');
await fs.mkdir(copyDir, { recursive: true });
await fs.rename(newFile, path.join(copyDir, '__file3.txt'));

// delete a file
await fs.unlink(renamed);

// rename a directory
const renamedDir = path.join(workDir, 'archive');
await fs.rename(copyDir, renamedDir);
console.log('archive contains', await fs.readdir(renamedDir));

// delete a directory that has items
await fs.rm(workDir, { recursive: true, force: true });
console.log('Cleaned up', workDir);
