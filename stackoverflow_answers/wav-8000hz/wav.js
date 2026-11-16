//------------------------------------------------------
// Change WAV sample rate
// Web Link=> https://stackoverflow.com/questions/60426885/how-to-convert-wav-file-into-8000hz-using-nodejs/60427748#60427748
// Run : node stackoverflow_answers/wav-8000hz/wav.js [input.wav]
//------------------------------------------------------

import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import wavefile from 'wavefile';

const { WaveFile } = wavefile;

// With no input, synthesize a 5-second 440 Hz tone at 44.1 kHz / 16-bit to convert.
function sineWave({ hz = 440, seconds = 5, sampleRate = 44100 } = {}) {
  const samples = Int16Array.from({ length: seconds * sampleRate }, (_, i) =>
    Math.round(Math.sin((2 * Math.PI * hz * i) / sampleRate) * 0.5 * 32767),
  );
  const wav = new WaveFile();
  wav.fromScratch(1, sampleRate, '16', samples);
  return wav;
}

const inputPath = process.argv[2];
const wav = inputPath ? new WaveFile(await readFile(inputPath)) : sineWave();
console.log(`Input: ${wav.fmt.sampleRate} Hz`);

wav.toSampleRate(8000); // default: cubic interpolation
// wav.toSampleRate(8000, { method: 'sinc' });

const output = join(import.meta.dirname, 'target-file.wav');
await writeFile(output, wav.toBuffer());
console.log(`Wrote ${output} at ${wav.fmt.sampleRate} Hz`);
