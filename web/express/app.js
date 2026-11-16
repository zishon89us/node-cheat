// API methods with Express 5
// Run: node web/express/app.js [args...]

import express from 'express';
import { likeComment, unlikeComment } from './routes.js';

const app = express();
app.use(express.json());

console.log('CLI args:', process.argv.slice(2));

app.get('/live', (req, res) => {
  res.send('Yes I am breathing!');
});

app.post('/comment/:id/like', likeComment);
app.post('/comment/:id/unlike', unlikeComment);

app.use((err, req, res, _next) => {
  console.error(err);
  res.status(err.status ?? 500).json({ error: err.expose ? err.message : 'Internal server error' });
});

const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
