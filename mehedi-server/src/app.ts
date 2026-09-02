import express, { type Express } from 'express';
import cors from 'cors';
import helmetPkg from 'helmet';
import rateLimitPkg from 'express-rate-limit';
import { pinoHttp } from 'pino-http';
import { allowAllOrigins, corsOrigins } from './config/env.js';
import { connectDatabase } from './config/db.js';
import { logger } from './config/logger.js';
import authRouter from './routes/auth.js';
import clientsRouter from './routes/clients.js';
import leadsRouter from './routes/leads.js';
import ordersRouter from './routes/orders.js';
import meRouter from './routes/me.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

// helmet uses `export = helmet` and express-rate-limit exposes both a default
// export and a named `rateLimit` export. Different TypeScript / bundler configs
// disagree on how to unwrap them, so grab .default when it exists and fall
// back to the imported value otherwise. Works locally and on Vercel.
type Callable = (...args: unknown[]) => unknown;
const helmet = ((helmetPkg as unknown as { default?: Callable }).default ??
  (helmetPkg as unknown as Callable)) as typeof import('helmet').default;
const rateLimit = ((rateLimitPkg as unknown as { default?: Callable; rateLimit?: Callable })
  .default ??
  (rateLimitPkg as unknown as { rateLimit?: Callable }).rateLimit ??
  (rateLimitPkg as unknown as Callable)) as typeof import('express-rate-limit').rateLimit;

export function createApp(): Express {
  const app = express();

  app.set('trust proxy', 1);
  app.use(helmet());
  app.use(
    cors({
      origin: (origin, cb) => {
        if (!origin) return cb(null, true);
        if (allowAllOrigins || corsOrigins.includes(origin)) return cb(null, true);
        if (corsOrigins.some((o) => o.endsWith('.vercel.app')) && origin.endsWith('.vercel.app')) {
          return cb(null, true);
        }
        cb(new Error(`Origin not allowed: ${origin}`));
      },
      credentials: true,
    }),
  );
  app.use(express.json({ limit: '1mb' }));
  app.use(
    pinoHttp({
      logger,
      autoLogging: { ignore: (req: { url?: string }) => req.url === '/health' },
    }),
  );

  const publicLimiter = rateLimit({ windowMs: 60 * 1000, max: 30 });
  const authLimiter = rateLimit({ windowMs: 60 * 1000, max: 10 });

  // Ensures the DB is connected (or the connection attempt has failed fast)
  // before any route runs — matters on serverless, where a cold function
  // hasn't necessarily connected yet. connectDatabase() caches its promise,
  // so this is a no-op on warm invocations.
  app.use((_req, res, next) => {
    connectDatabase()
      .then(() => next())
      .catch(() => res.status(503).json({ error: 'Database unavailable' }));
  });

  app.get('/', (_req, res) => res.json({ ok: true, service: 'mehedi-server' }));
  app.get('/health', (_req, res) => res.json({ ok: true }));

  app.use('/auth', authLimiter, authRouter);
  app.use('/leads', publicLimiter, leadsRouter);
  app.use('/clients', clientsRouter);
  app.use('/orders', ordersRouter);
  app.use('/me', meRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

// Vercel's "Express" framework preset auto-detects this file as the app
// entry and expects a default export that's a real Express app (not just
// the factory above) — see api/index.ts for why both exist.
export default createApp();
