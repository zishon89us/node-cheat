// Download files with Express 5, restricted to one directory
// Run: node files/express_server_download_file/app.js
// Try: /download/file1.txt   (../ paths are rejected)

import { join, resolve, sep } from 'node:path';
import express from 'express';

const app = express();
const filesRoot = resolve(import.meta.dirname, '..', 'sample_files');

app.get('/', (req, res) => {
  res.sendFile(join(import.meta.dirname, 'index.html'));
});

app.get('/download/:name', (req, res, next) => {
  const target = resolve(filesRoot, req.params.name);
  if (!target.startsWith(filesRoot + sep)) {
    res.status(400).json({ error: 'Invalid file name' });
    return;
  }
  res.download(target, (err) => {
    if (!err) return;
    if (res.headersSent) return next(err);
    res.status(err.code === 'ENOENT' ? 404 : 500).json({ error: 'File not available' });
  });
});

const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
