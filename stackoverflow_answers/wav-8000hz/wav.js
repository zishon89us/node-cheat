//------------------------------------------------------
// Change WAV sample rate
// Web Link=> https://stackoverflow.com/questions/60426885/how-to-convert-wav-file-into-8000hz-using-nodejs/60427748#60427748
// Run : node wav-8000hz/wav.js   (npm i wavefile)
//------------------------------------------------------

import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import wavefile from 'wavefile';

const { WaveFile } = wavefile;

const input = join(import.meta.dirname, '440Hz_44100Hz_16bit_05sec.wav');
const output = join(import.meta.dirname, 'target-file.wav');

const wav = new WaveFile(await readFile(input));

wav.toSampleRate(8000); // default: cubic interpolation
// wav.toSampleRate(8000, { method: 'sinc' });

await writeFile(output, wav.toBuffer());
console.log(`Wrote ${output}`);
