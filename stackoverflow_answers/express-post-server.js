//------------------------------------------------------
// Mount an Express router from another module
// Run : node express-post-server.js
//------------------------------------------------------

import express from 'express';
import bar from './express-post.js';

const app = express();
const port = Number(process.env.PORT) || 3000;

// curl http://localhost:3000/foo
app.get('/foo', (req, res) => {
  res.send('This is foo GET!');
});

app.use('/bar', bar);

app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
