//------------------------------------------------------
// Simple Express server: send an HTML file, or render an EJS template
// Web Link=> http://stackoverflow.com/questions/36258158/expressjs-view-helpers-do-not-work/36258354#36258354
// Run: node app.js, then open http://localhost:5000 and http://localhost:5000/html
//------------------------------------------------------

import express from 'express';
import path from 'node:path';

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(import.meta.dirname, 'views'));

const logRequest = (req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
};

// EJS template; <%= %> escapes the value
app.get('/', logRequest, (req, res) => {
  res.render('index', { message: 'Hello World!' });
});

// Plain HTML file
app.get('/html', logRequest, (req, res) => {
  res.sendFile(path.join(import.meta.dirname, 'index.html'));
});

app.listen(5000, () => console.log('Listening on http://localhost:5000'));
