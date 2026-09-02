import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 chars'),
  // Comma-separated list. Use "*" to allow any origin (only in early dev).
  CORS_ORIGINS: z.string().default('http://localhost:3000'),

  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().default('Mehedi Hasan <hello@mehedihasan.dev>'),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),

  ADMIN_EMAIL: z.string().email().default('skmehedihasan.jr1@gmail.com'),
  ADMIN_NAME: z.string().default('Mehedi Hasan'),

  // Firebase Admin SDK — Firebase Console -> Project Settings -> Service
  // Accounts -> Generate new private key.
  FIREBASE_PROJECT_ID: z.string().min(1, 'FIREBASE_PROJECT_ID is required'),
  FIREBASE_CLIENT_EMAIL: z.string().min(1, 'FIREBASE_CLIENT_EMAIL is required'),
  FIREBASE_PRIVATE_KEY: z.string().min(1, 'FIREBASE_PRIVATE_KEY is required'),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors);
  throw new Error('Invalid environment');
}

export const env = parsed.data;

const rawOrigins = env.CORS_ORIGINS.split(',')
  .map((s) => s.trim())
  .filter(Boolean);

export const corsOrigins = rawOrigins;
export const allowAllOrigins = rawOrigins.includes('*');
