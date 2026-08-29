import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from './logger.js';

// Cache the connection across serverless invocations (Vercel spins up new
// instances but keeps the module in memory between warm invocations).
let connectionPromise: Promise<typeof mongoose> | null = null;

export function connectDatabase(): Promise<typeof mongoose> {
  if (connectionPromise) return connectionPromise;

  mongoose.set('strictQuery', true);
  connectionPromise = mongoose
    .connect(env.MONGODB_URI, {
      autoIndex: env.NODE_ENV !== 'production',
      serverSelectionTimeoutMS: 10_000,
    })
    .then((m) => {
      logger.info('MongoDB connected');
      return m;
    })
    .catch((err) => {
      // Reset so next request retries instead of hanging on a rejected promise
      connectionPromise = null;
      logger.error({ err }, 'MongoDB connection failed');
      throw err;
    });

  return connectionPromise;
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
  connectionPromise = null;
}
