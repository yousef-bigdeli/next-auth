import { MongoClient } from "mongodb";

export async function connectDatabase() {
  const client = await MongoClient.connect(process.env.MONGO_URI);
  return client;
}

export async function insertDocument(client, collection, document) {
  const db = client.db(process.env.MONGO_DBNAME);
  const result = await db.collection(collection).insertOne(document);

  return result;
}

export async function getDocument(client, collection, filter = {}, sort = {}) {
  const db = client.db(process.env.MONGO_DBNAME);

  const results = await db
    .collection(collection)
    .find(filter)
    .sort(sort)
    .toArray();

  return results;
}
