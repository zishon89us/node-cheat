// Stream uploads straight into MongoDB GridFS (no temp files on disk)
// Run: MONGODB_URI=mongodb://127.0.0.1:27017 node gridfs/direct_upload_gridfs/app.js
// See README.md for curl examples.

import { pipeline } from 'node:stream/promises';
import { Transform } from 'node:stream';
import express from 'express';
import { GridFSBucket, MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error('Set MONGODB_URI');
const MAX_BYTES = Number(process.env.MAX_UPLOAD_BYTES ?? 10 * 1024 * 1024);

const client = await new MongoClient(uri).connect();
const bucket = new GridFSBucket(client.db(process.env.MONGODB_DB ?? 'node-cheat-db'));
const app = express();

const limitSize = (max) => {
  let seen = 0;
  return new Transform({
    transform(chunk, _enc, cb) {
      seen += chunk.length;
      if (seen > max) cb(Object.assign(new Error('File too large'), { status: 413 }));
      else cb(null, chunk);
    },
  });
};

// POST /file?name=report.pdf   (raw body = file bytes)
app.post('/file', async (req, res) => {
  const name = String(req.query.name ?? '');
  if (!/^[\w.-]{1,100}$/.test(name)) {
    res.status(400).json({ error: 'Query param "name" must be 1-100 chars of [A-Za-z0-9_.-]' });
    return;
  }
  const upload = bucket.openUploadStream(name, { metadata: { contentType: req.get('content-type') } });
  try {
    await pipeline(req, limitSize(MAX_BYTES), upload);
  } catch (err) {
    await bucket.delete(upload.id).catch(() => {});
    throw err;
  }
  res.status(201).json({ id: upload.id.toString(), name });
});

// GET /file/:id
app.get('/file/:id', async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json({ error: 'Invalid id' });
    return;
  }
  const id = new ObjectId(req.params.id);
  const [file] = await bucket.find({ _id: id }).limit(1).toArray();
  if (!file) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  res.type(file.metadata?.contentType ?? 'application/octet-stream');
  res.attachment(file.filename);
  await pipeline(bucket.openDownloadStream(id), res);
});

app.use((err, req, res, _next) => {
  console.error(err);
  if (!res.headersSent) res.status(err.status ?? 500).json({ error: err.status ? err.message : 'Internal server error' });
});

const port = Number(process.env.PORT ?? 3000);
const server = app.listen(port, () => console.log(`All set! Start uploading on http://localhost:${port}`));

process.on('SIGTERM', () => server.close(() => client.close()));
