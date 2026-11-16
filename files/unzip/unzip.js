//------------------------------------------------------
// Read, extract and download zip files
// Web Link=> https://github.com/cthackers/adm-zip
// Run: node unzip.js
//------------------------------------------------------

import AdmZip from 'adm-zip';
import { createWriteStream } from 'node:fs';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import path from 'node:path';

const here = import.meta.dirname;

// 1. Read entries of a local zip and extract one of them
const zip = new AdmZip(path.join(here, 'sample_files.zip'));
for (const entry of zip.getEntries()) {
  console.log(entry.entryName, '=>', zip.readAsText(entry));
}
// extractEntryTo(entry, targetPath, maintainEntryPath, overwrite); adm-zip blocks "../" zip-slip paths
zip.extractEntryTo('sample_files/file2.txt', path.join(here, 'sample_output'), false, true);

const zipUrl =
  'https://github.com/twbs/bootstrap/releases/download/v5.3.3/bootstrap-5.3.3-dist.zip';

// 2. Download a zip into memory and list its contents without touching disk
const res = await fetch(zipUrl);
if (!res.ok) throw new Error(`Download failed: ${res.status}`);
const remoteZip = new AdmZip(Buffer.from(await res.arrayBuffer()));
console.log(`${remoteZip.getEntries().length} entries in remote zip`);

// 3. Stream a download straight to a file (constant memory, good for large files)
const streamRes = await fetch(zipUrl);
if (!streamRes.ok) throw new Error(`Download failed: ${streamRes.status}`);
await pipeline(
  Readable.fromWeb(streamRes.body),
  createWriteStream(path.join(here, 'downloaded.zip')),
);
console.log('File written!');
