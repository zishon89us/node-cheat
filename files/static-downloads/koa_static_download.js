//------------------------------------------------------
// Serve a folder of downloadable files with Koa
// Run: node koa_static_download.js, then open http://localhost:3000/file2.txt
//------------------------------------------------------

import Koa from 'koa';
import serve from 'koa-static';
import path from 'node:path';

const app = new Koa();

app.use(serve(path.join(import.meta.dirname, 'public')));

app.listen(3000, () => console.log('Listening on http://localhost:3000'));
