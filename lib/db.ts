import { MongoClient, Db } from "mongodb";

// Fallback to local MongoDB URI during static build if env var is not set yet in deployment settings
const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/fixmate-db";
const dbName = process.env.MONGODB_DBNAME || "fixmate-db";

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });
    global._mongoClientPromise = client.connect().catch((err) => {
      global._mongoClientPromise = undefined;
      throw err;
    });
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000,
  });
  clientPromise = client.connect().catch((err) => {
    throw err;
  });
}

export default clientPromise;

export async function getDatabase(): Promise<Db> {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is required");
  }
  const connectedClient = await clientPromise;
  return connectedClient.db(dbName);
}
