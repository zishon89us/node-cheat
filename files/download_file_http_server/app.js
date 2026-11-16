// Trigger a file download with plain node:http
// Run: node files/download_file_http_server/app.js

import { createServer } from 'node:http';

const port = Number(process.env.PORT ?? 3000);

createServer((req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Content-Disposition': 'attachment; filename="sample_file_name.txt"',
  });
  res.end('Hey! I just got downloaded from server\n');
}).listen(port, '127.0.0.1', () => console.log(`Server running at http://127.0.0.1:${port}/`));
