import mongoose from "mongoose";
const MONGODB_URI = process.env.MONGODB_URI as string;
if (!MONGODB_URI) throw new Error("MONGODB_URI not found");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cached = (global as any).mongoose || { conn: null, promise: null };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).mongoose = cached;

export async function connectToDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: "t3chat",
        bufferCommands: false,
      })
      .then((mongoose) => {
        console.log("[✅ MongoDB] Connected!");
        return mongoose;
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
