//------------------------------------------------------
// Read a file through a stream with async iteration
// Run : node xml-streamer/main.js
//------------------------------------------------------

import { join } from 'node:path';
import { readStream } from './xml-streamer.js';

const xml = await readStream(join(import.meta.dirname, 'files', 'test.xml'));
console.log(`Read ${xml.length} characters`);
console.log(xml.slice(0, 200));
