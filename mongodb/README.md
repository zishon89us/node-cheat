# MongoDB

Examples use the official `mongodb` driver (v7, promise API only).

| File             | Shows                                         |
| ---------------- | --------------------------------------------- |
| `bulk-update.js` | Bulk upsert with `bulkWrite` + a unique index |

Start a local server with `docker run --rm -p 27017:27017 mongo:8`, then:

```bash
MONGODB_URI=mongodb://127.0.0.1:27017 node mongodb/bulk-update.js
```

In production, use authenticated, TLS-enabled connection strings (e.g. MongoDB Atlas) supplied via environment variables.
