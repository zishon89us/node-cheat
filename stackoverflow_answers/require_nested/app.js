//------------------------------------------------------
// Load modules from unknown child folders (ESM version of "require from nested folders")
// Web Link=> https://stackoverflow.com/a/49796481/3539857
// Run : node require_nested/app.js
//------------------------------------------------------

import { glob } from 'node:fs/promises';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const pattern = join(import.meta.dirname, 'plugins', '*', 'core', '*.js');

for await (const file of glob(pattern)) {
  const plugin = await import(pathToFileURL(file).href);
  console.log(`loaded ${plugin.name}`);
}

// import.meta.resolve turns a specifier into a URL without loading it
console.log(import.meta.resolve('./plugins/myplugin1/index.js'));
