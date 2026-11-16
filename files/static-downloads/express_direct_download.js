//------------------------------------------------------
// Express server that sends a file as a download
// Run: node express_direct_download.js, then open http://localhost:3000/file2.txt
//------------------------------------------------------

import express from 'express';
import path from 'node:path';

const app = express();
const publicDir = path.join(import.meta.dirname, 'public');
const SAFE_FILE_NAME = /^[\w.-]+$/;

app.get('/:fileName', (req, res) => {
  const { fileName } = req.params;
  if (!SAFE_FILE_NAME.test(fileName) || fileName.startsWith('.')) {
    return res.status(400).send('Invalid file name');
  }

  // `root` makes the lookup relative to publicDir and rejects paths that escape it
  res.download(fileName, { root: publicDir }, (err) => {
    if (err && !res.headersSent) res.status(404).send('File not found');
  });
});

app.listen(3000, () => console.log('Listening on http://localhost:3000'));
