import { MongoClient, Db } from "mongodb";

// Fallback to local MongoDB URI during static build if env var is not set yet in deployment settings
const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/fixmate-db";
const dbName = process.env.MONGODB_DBNAME || "fixmate-db";

declare global {
  var _mongoClient: MongoClient | undefined;
}

export function getMongoClient(): MongoClient {
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
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is required");
  }
  return mongoDb;
}
