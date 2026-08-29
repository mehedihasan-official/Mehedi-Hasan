import pino from 'pino';
import { env } from './env.js';

// `pino-pretty` uses a worker thread that Vercel's serverless bundler does
// not include, so any deploy where the transport is active crashes on the
// first request. Enable it ONLY when we're clearly running locally.
const runningOnVercel = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const useJsonOnly = env.NODE_ENV === 'production' || runningOnVercel;

export const logger = pino({
  level: useJsonOnly ? 'info' : 'debug',
  ...(useJsonOnly
    ? {}
    : {
        transport: {
          target: 'pino-pretty',
          options: { colorize: true, translateTime: 'HH:MM:ss', ignore: 'pid,hostname' },
        },
      }),
});
