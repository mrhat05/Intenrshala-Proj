import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

function requireMongoUri(value: string | undefined) {
  if (!value) {
    throw new Error("MONGODB_URI is not set");
  }

  return value;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseConnection: Promise<typeof mongoose> | undefined;
}

let cached = global.mongooseConnection;

export async function connectToDatabase() {
  if (!cached) {
    cached = mongoose.connect(requireMongoUri(MONGODB_URI));
    global.mongooseConnection = cached;
  }

  return cached;
}
