//------------------------------------------------------
// Get image size without downloading the whole file
// Supported image types=> JPG, GIF, PNG, WebP, AVIF, BMP, TIFF, PSD, ICO, SVG
// Output=> { width, height, type, mime, length, wUnits, hUnits, url }
// Run: node image_size.js
//------------------------------------------------------

import probe from 'probe-image-size';
import { createReadStream } from 'node:fs';
import path from 'node:path';

// By URL: only the first bytes are fetched
console.log(
  await probe('https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png'),
);

// From a local stream
const localImage = path.join(import.meta.dirname, 'sample.png');
const input = createReadStream(localImage);
try {
  console.log(await probe(input));
} finally {
  input.destroy();
}
