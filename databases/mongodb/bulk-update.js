// MongoDB bulk upsert: create documents that don't exist, replace those that do
// Web Link=> https://www.mongodb.com/docs/drivers/node/current/crud/bulk-write/
// Run: MONGODB_URI=mongodb://127.0.0.1:27017 node databases/mongodb/bulk-update.js

import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error('Set MONGODB_URI');

const client = new MongoClient(uri);
try {
  const users = client.db(process.env.MONGODB_DB ?? 'node-cheat-db').collection('users');
  await users.createIndex({ email: 1 }, { unique: true });

  const records = [
    { first: 'john', last: 'doe', email: 'john@doe.com' },
    { first: 'jack', last: 'doe', email: 'jack@doe.com' },
    { first: 'jill', last: 'doe_updated', email: 'jill@doe.com' },
  ];

  const result = await users.bulkWrite(
    records.map((doc) => ({
      replaceOne: { filter: { email: doc.email }, replacement: doc, upsert: true },
    })),
    { ordered: false },
  );

  console.log(`Inserted: ${result.upsertedCount}, Updated: ${result.modifiedCount}`);
} finally {
  await client.close();
}
