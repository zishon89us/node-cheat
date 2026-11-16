import { spawn } from 'node:child_process';
import { access, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';

export const sampleVideo = join(import.meta.dirname, 'files', 'sample.mp4');

// Generates a 10-second 720p test pattern on first use, so no video has to live in git.
export async function ensureSampleVideo() {
  try {
    await access(sampleVideo);
  } catch {
    await mkdir(dirname(sampleVideo), { recursive: true });
    await runFfmpeg([
      '-f',
      'lavfi',
      '-i',
      'testsrc2=duration=10:size=1280x720:rate=30',
      '-pix_fmt',
      'yuv420p',
      sampleVideo,
    ]);
  }
  return sampleVideo;
}

// Runs the ffmpeg binary with an argument array (no shell, so no injection).
export function runFfmpeg(args) {
  return new Promise((resolve, reject) => {
    const proc = spawn(
      process.env.FFMPEG_PATH ?? 'ffmpeg',
      ['-hide_banner', '-loglevel', 'error', '-y', ...args],
      {
        stdio: ['ignore', 'inherit', 'inherit'],
      },
    );
    proc.on('error', reject);
    proc.on('close', (code) =>
      code === 0 ? resolve() : reject(new Error(`ffmpeg exited with code ${code}`)),
    );
  });
}
