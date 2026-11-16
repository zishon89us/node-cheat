//------------------------------------------------------
// Serve a folder of downloadable files with express.static
// Run: node express_static_download.js
//------------------------------------------------------

import express from 'express';
import path from 'node:path';

const app = express();

app.use(express.static(path.join(import.meta.dirname, 'public'), { dotfiles: 'deny' }));

app.get('/', (req, res) => {
  res.send('Open: http://localhost:3000/file2.txt');
});

app.listen(3000, () => console.log('Listening on http://localhost:3000'));
