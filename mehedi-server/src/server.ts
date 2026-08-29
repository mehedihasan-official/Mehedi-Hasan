// Long-lived server entry — used for `npm run dev` and any host that runs
// Node processes (Railway, Fly, Render). On Vercel, api/index.ts is used
// instead and this file is not executed.

import { createApp } from './app.js';
import { connectDatabase } from './config/db.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';

async function main(): Promise<void> {
  await connectDatabase();
  const app = createApp();
  app.listen(env.PORT, () => {
    logger.info(`mehedi-server listening on http://localhost:${env.PORT}`);
  });
}

main().catch((err) => {
  logger.error({ err }, 'Fatal startup error');
  process.exit(1);
});
