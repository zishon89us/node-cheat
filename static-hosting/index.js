// Static hosting
// Local: serve ./public with Express. Run: node static-hosting/index.js
// Managed options: GitHub Pages, Cloudflare Pages, Netlify, Vercel, AWS S3 + CloudFront.

import { join } from 'node:path';
import express from 'express';

const app = express();
app.use(
  express.static(join(import.meta.dirname, 'public'), { dotfiles: 'ignore', index: 'index.html' }),
);

const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => console.log(`Static site on http://localhost:${port}`));
