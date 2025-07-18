// Extend the global object to include _mongoClientPromise
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

import { MongoClient } from 'mongodb';

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MONGODB_URI to environment variables');
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      tls: true,
      tlsInsecure: true, // Allow self-signed or untrusted certs in dev
    });
    global._mongoClientPromise = client.connect();
    console.log('MongoDB client connecting in development...');
  }
  clientPromise = global._mongoClientPromise as Promise<MongoClient>;
} else {
  client = new MongoClient(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    tls: true,
    // Optional: Disable strict certificate validation if certificate is untrusted
    rejectUnauthorized: false, // Insecure, use with caution in production
    // If you have a CA certificate, uncomment and provide it:
    // sslCA: [fs.readFileSync('/path/to/ca-cert.pem')],
  });
  clientPromise = client.connect();
  console.log('MongoDB client connecting in production...');
}

export async function connectToDatabase(): Promise<{ db: any }> {
  try {
    const client = await clientPromise;
    console.log('MongoDB connection established to database:', process.env.MONGODB_URI);
    return { db: client.db('recipe-viewer-db') };
  } catch (error: any) {
    console.error('MongoDB connection error:', {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });
    throw error;
  }
}