// Show a PDF file in the browser
// Run: node media/pdf/pdf_browser/app.js  (place a PDF at media/pdf/pdf_browser/files/my_pdf_file.pdf)

import { join } from 'node:path';
import express from 'express';

const app = express();
const pdfPath = join(import.meta.dirname, 'files', 'my_pdf_file.pdf');

app.get('/', (req, res, next) => {
  res.setHeader('Content-Disposition', 'inline; filename="my_pdf_file.pdf"');
  res.sendFile(pdfPath, { headers: { 'Content-Type': 'application/pdf' } }, (err) => {
    if (!err) return;
    if (res.headersSent) return next(err);
    res.removeHeader('Content-Disposition');
    res.status(err.code === 'ENOENT' ? 404 : 500).json({ error: 'PDF not available' });
  });
});

const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
