/* eslint-disable no-var */
// lib/mongoClient.ts
import { MongoClient } from "mongodb";
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}
const uri = process.env.MONGODB_URI!;
if (!uri) throw new Error("MONGODB_URI is not defined");

const options = {};

let clientPromise: Promise<MongoClient>;

// Use a global variable to maintain a cached connection in development

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = new MongoClient(uri, options).connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, avoid using global
  clientPromise = new MongoClient(uri, options).connect();
}

export default clientPromise;
