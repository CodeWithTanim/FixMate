import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DBNAME || "fixmate-db";

declare global {
  var _mongoClient: MongoClient | undefined;
}

export function getMongoClient(): MongoClient {
  if (!uri) throw new Error("MONGODB_URI must be configured for authentication.");
  if (!global._mongoClient) {
    global._mongoClient = new MongoClient(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });
  }
  return global._mongoClient;
}

export const mongoClient = getMongoClient();
export const mongoDb = mongoClient.db(dbName);

export default mongoClient;

export async function getDatabase(): Promise<Db> {
  await mongoClient.connect();
  return mongoDb;
}
