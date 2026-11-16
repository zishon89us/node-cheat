// Serve responses compressed with gzip/brotli using the `compression` middleware
// Run: node web/express/gzip/app.js

import express from 'express';
import compression from 'compression';

const app = express();
app.use(compression());

app.get('/', (req, res) => {
  res.send('Hello, compressed world! '.repeat(500));
});

const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
