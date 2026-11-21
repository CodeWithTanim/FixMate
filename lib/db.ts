import { MongoClient, Db } from "mongodb";

// Resilient MongoDB connection with production Atlas fallback
const defaultAtlasUri = [
  "mongodb://fixmate-assignment-9:z7nAo6XVmBnEWblg@",
  "ac-kkmkuw6-shard-00-00.3umsmo6.mongodb.net:27017,",
  "ac-kkmkuw6-shard-00-01.3umsmo6.mongodb.net:27017,",
  "ac-kkmkuw6-shard-00-02.3umsmo6.mongodb.net:27017/",
  "?ssl=true&replicaSet=atlas-34ki4c-shard-0&authSource=admin",
].join("");
const uri = process.env.MONGODB_URI || defaultAtlasUri;
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
  return mongoDb;
}
