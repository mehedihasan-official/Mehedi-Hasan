import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 chars'),
  CORS_ORIGINS: z.string().default('http://localhost:3000'),

  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().default('Mehedi Hasan <hello@mehedihasan.dev>'),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),

  ADMIN_EMAIL: z.string().email().default('skmehedihasan.jr1@gmail.com'),
  ADMIN_NAME: z.string().default('Mehedi Hasan'),
  ADMIN_PASSWORD: z.string().min(8).default('change-me-on-first-login'),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
export const corsOrigins = env.CORS_ORIGINS.split(',').map((s) => s.trim());
