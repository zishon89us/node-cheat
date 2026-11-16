//------------------------------------------------------
// Download a YouTube video with youtube-dl-exec (yt-dlp wrapper)
// Web Link=> https://github.com/microlinkhq/youtube-dl-exec
// Run: node download_script.js [url]
//------------------------------------------------------

import youtubedl from 'youtube-dl-exec';
import path from 'node:path';

const url = process.argv[2] ?? 'https://www.youtube.com/watch?v=90AiXO1pAiA';
if (!/^https:\/\/(www\.)?(youtube\.com|youtu\.be)\//.test(url)) throw new Error('Expected a YouTube URL');

const info = await youtubedl(url, { dumpSingleJson: true, noWarnings: true });
console.log(`Downloading "${info.title}" (${info.duration}s)`);

await youtubedl(url, {
  output: path.join(import.meta.dirname, 'downloads', '%(title)s-%(id)s.%(ext)s'),
  format: 'mp4/best',
});

console.log('Saved to downloads/');
