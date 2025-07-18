// Augment the global scope to include _mongoClientPromise
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
let client;
let clientPromise: Promise<MongoClient>;

if (!uri) throw new Error('Please add your MongoDB URI to .env.local');

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, {
      tls: true,
      tlsAllowInvalidCertificates: process.env.NODE_ENV === 'development',
      serverSelectionTimeoutMS: 5000,
    });
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, {
    tls: true,
    serverSelectionTimeoutMS: 5000,
  });
  clientPromise = client.connect();
}

export async function connectToDatabase() {
  const client = await clientPromise;
  console.log('Connected to MongoDB successfully');
  const db = client.db('recipe_test');
  return { db, client };
}