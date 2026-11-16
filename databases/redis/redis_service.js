// Small Redis store built on node-redis (promise API).
// Usage:
//   import { createClient } from 'redis';
//   const client = await createClient({ url: process.env.REDIS_URL }).connect();
//   const store = new RedisStore(client);

export class RedisStore {
  constructor(client) {
    this.client = client;
  }

  getList(label) {
    return this.client.lRange(label, 0, -1);
  }

  getDocument(label) {
    return this.client.hGetAll(label);
  }

  saveDocument(label, document) {
    return this.client.hSet(label, document);
  }

  saveList(label, ...values) {
    return this.client.rPush(label, values);
  }

  // Document is stored as a hash and its key appended to a list, atomically.
  saveListOfDocuments(documentLabel, listLabel, document) {
    return this.client.multi().hSet(documentLabel, document).rPush(listLabel, documentLabel).exec();
  }

  removeDocument(label) {
    return this.client.del(label);
  }

  removeList(label) {
    return this.client.del(label);
  }

  removeListItem(label, item) {
    return this.client.lRem(label, 0, item);
  }

  removeDocumentFromList(listLabel, documentLabel) {
    return this.client.multi().lRem(listLabel, 0, documentLabel).del(documentLabel).exec();
  }

  // Uses SCAN (non-blocking) instead of KEYS, and pipelines the HGETALLs.
  async findAllDocByKeyPrefix(labelPrefix) {
    const docs = [];
    for await (const keys of this.client.scanIterator({ MATCH: `${labelPrefix}:*`, COUNT: 100 })) {
      if (keys.length === 0) continue;
      const pipeline = this.client.multi();
      for (const key of keys) pipeline.hGetAll(key);
      docs.push(...(await pipeline.execAsPipeline()));
    }
    return docs;
  }
}
