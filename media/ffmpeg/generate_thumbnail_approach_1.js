// Single thumbnail at 3s, 1280px wide, aspect ratio preserved.
// Requires the ffmpeg binary. Run: node media/ffmpeg/generate_thumbnail_approach_1.js

import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { ensureSampleVideo, runFfmpeg } from './ffmpeg.js';

const input = await ensureSampleVideo();
const outDir = join(import.meta.dirname, 'thumbs');
await mkdir(outDir, { recursive: true });

const output = join(outDir, `${Date.now()}.jpg`);
await runFfmpeg(['-ss', '3', '-i', input, '-frames:v', '1', '-vf', 'scale=1280:-2', output]);
console.log('Thumbnail saved:', output);
