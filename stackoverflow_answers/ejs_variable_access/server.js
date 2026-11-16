//------------------------------------------------------
// Pass a variable from another module into an EJS view
// Run : npm install && npm start
//------------------------------------------------------

import express from 'express';
import { join } from 'node:path';
import { title } from './controllers/home.js';

const app = express();
app.set('views', join(import.meta.dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index', { title });
});

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
