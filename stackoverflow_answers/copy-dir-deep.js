//------------------------------------------------------
// Copy files recursively without any extra package
// Web Link=> https://stackoverflow.com/questions/60304937/nodejs-move-multiple-files-from-nested-folders-into-other-folder/60305349#60305349
// Run : node copy-dir-deep.js [src] [dest]
//------------------------------------------------------

import { cp, mkdir, readdir, copyFile, readlink, symlink } from 'node:fs/promises';
import { join } from 'node:path';

// Manual version, to show how the recursion works
export async function copyDir(src, dest) {
  await mkdir(dest, { recursive: true });
  for (const entry of await readdir(src, { withFileTypes: true })) {
    const from = join(src, entry.name);
    const to = join(dest, entry.name);
    if (entry.isDirectory()) await copyDir(from, to);
    else if (entry.isSymbolicLink()) await symlink(await readlink(from), to);
    else await copyFile(from, to);
  }
}

const src = process.argv[2] ?? join(import.meta.dirname, 'a');
const dest = process.argv[3] ?? join(import.meta.dirname, 'b');

await copyDir(src, dest);

// One-liner since Node 16.7: fs.cp with recursive: true
await cp(src, `${dest}-cp`, { recursive: true, verbatimSymlinks: true });

console.log(`Copied ${src} -> ${dest} and ${dest}-cp`);
