//------------------------------------------------------
// DataTables rendered from a Pug (formerly Jade) template
// Web Link=> https://stackoverflow.com/questions/44604873/unable-to-get-datatables-to-work-with-jade
// Run : npm install && npm start
//------------------------------------------------------

import express from 'express';
import { join } from 'node:path';

const app = express();
app.set('views', join(import.meta.dirname, 'templates'));
app.set('view engine', 'pug');

const items = ['Apple', 'Banana', 'Carrot', 'Date', 'Egg'].map((name, i) => ({ id: i + 1, name }));

app.get('/', (req, res) => {
  res.render('index', { title: 'Node-Cheat', items });
});

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
