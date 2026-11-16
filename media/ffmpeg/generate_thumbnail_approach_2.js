// Several screenshots at fixed timestamps, run in parallel.
// Requires the ffmpeg binary. Run: node media/ffmpeg/generate_thumbnail_approach_2.js

import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { ensureSampleVideo, runFfmpeg } from './ffmpeg.js';

const input = await ensureSampleVideo();
const outDir = join(import.meta.dirname, 'thumbs');
await mkdir(outDir, { recursive: true });

const timemarks = ['00:00:02.000', '6'];
const files = await Promise.all(
  timemarks.map(async (time, i) => {
    const output = join(outDir, `screenshot_${i + 1}.png`);
    await runFfmpeg(['-ss', time, '-i', input, '-frames:v', '1', '-vf', 'scale=1280:-2', output]);
    return output;
  }),
);
console.log('Screenshots saved:', files.join(', '));
