// Multipart upload streamed straight to S3 (no local disk) with Express 5, multer and AWS SDK v3.
// Run: AWS_REGION=us-east-1 S3_BUCKET=my-bucket node app.js  (credentials come from the default AWS provider chain)
// Original answer: https://stackoverflow.com/a/35902286/3539857

import { randomUUID } from 'node:crypto';
import path from 'node:path';
import express from 'express';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';

const bucket = process.env.S3_BUCKET;
if (!bucket) throw new Error('Set S3_BUCKET to the destination bucket name');

const s3 = new S3Client({ region: process.env.AWS_REGION ?? 'us-east-1' });

const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024, files: 25 },
  storage: multerS3({
    s3,
    bucket,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => cb(null, `uploads/${randomUUID()}${path.extname(file.originalname)}`),
  }),
});

const app = express();

app.get('/', (req, res) => {
  res.sendFile(path.join(import.meta.dirname, 'index.html'));
});

app.post('/upload', upload.array('upl', 25), (req, res) => {
  res.json({
    message: 'Uploaded!',
    files: req.files.map(({ location, key, mimetype, size }) => ({
      url: location,
      key,
      type: mimetype,
      size,
    })),
  });
});

app.use((err, req, res, _next) => {
  const status = err instanceof multer.MulterError ? 400 : 500;
  console.error(err);
  res.status(status).json({ error: status === 400 ? err.message : 'Upload failed' });
});

app.listen(3000, () => console.log('Open http://localhost:3000'));
