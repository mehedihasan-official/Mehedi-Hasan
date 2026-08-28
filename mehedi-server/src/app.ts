import express, { type Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { pinoHttp } from 'pino-http';
import { corsOrigins } from './config/env.js';
import { logger } from './config/logger.js';
import authRouter from './routes/auth.js';
import clientsRouter from './routes/clients.js';
import leadsRouter from './routes/leads.js';
import meRouter from './routes/me.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

export function createApp(): Express {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: (origin, cb) => {
        if (!origin || corsOrigins.includes(origin)) return cb(null, true);
        cb(new Error('Origin not allowed'));
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

  app.get('/health', (_req, res) => res.json({ ok: true }));

  app.use('/auth', authLimiter, authRouter);
  app.use('/leads', publicLimiter, leadsRouter);
  app.use('/clients', clientsRouter);
  app.use('/me', meRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
