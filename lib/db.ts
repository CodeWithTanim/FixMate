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
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 10000,
      maxPoolSize: 10,
      minPoolSize: 0,
      maxIdleTimeMS: 60000,
    });
  }
  return global._mongoClient;
}

export const mongoClient = getMongoClient();
export const mongoDb = mongoClient.db(dbName);

export default mongoClient;

export async function getDatabase(): Promise<Db> {
  // Explicit connect also replaces a topology closed by a failed cold start.
  // Retrying here is safe: no application read or write has started yet.
  for (let attempt = 0; ; attempt++) {
    try {
      await mongoClient.connect();
      return mongoDb;
    } catch (error) {
      const name = error instanceof Error ? error.name : "";
      const retryable = ["MongoTopologyClosedError", "MongoNotConnectedError", "MongoNetworkError", "MongoNetworkTimeoutError", "MongoServerSelectionError"].includes(name);
      if (attempt !== 0 || !retryable) throw error;
    }
  }
}
