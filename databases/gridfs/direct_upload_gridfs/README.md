# Direct upload to GridFS

Streams the request body into MongoDB GridFS using the driver's built-in `GridFSBucket` (the old `gridfs-stream` package is sunset).

## Run

```bash
npm i express mongodb
docker run --rm -p 27017:27017 mongo:8   # in another terminal
MONGODB_URI=mongodb://127.0.0.1:27017 node app.js
```

Optional env vars: `MONGODB_DB` (default `node-cheat-db`), `MAX_UPLOAD_BYTES` (default 10 MB), `PORT`.

## Upload

```bash
curl -X POST "http://localhost:3000/file?name=photo.png" \
  -H "Content-Type: image/png" --data-binary @photo.png
# {"id":"665f...","name":"photo.png"}
```

## Download

Open `http://localhost:3000/file/<id>` in a browser, or:

```bash
curl -OJ http://localhost:3000/file/<id>
```
