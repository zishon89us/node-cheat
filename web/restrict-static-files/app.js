//------------------------------------------------------
// Middleware order around express.static: what runs before and after a static hit
// Run: node app.js, then open http://localhost:5000/hello.txt and http://localhost:5000
//------------------------------------------------------

import express from 'express';
import path from 'node:path';

const app = express();

app.use((req, res, next) => {
  console.log('Called before static middleware.');
  next();
});

// A matching static file ends the request here; dotfiles (.env etc.) are refused
app.use(express.static(path.join(import.meta.dirname, 'public'), { dotfiles: 'deny' }));

app.use((req, res, next) => {
  console.log('Called after static middleware (no static file matched).');
  next();
});

app.get('/', (req, res) => {
  res.send('Hi! I am a direct message from the server :)');
});

app.listen(5000, () => console.log('Listening on http://localhost:5000'));
