// Vercel serverless entry point.
// Locally (`npm run dev`) the server runs as a long-lived Express process via
// src/server.ts. On Vercel, every HTTP request comes through this file.

import type { IncomingMessage, ServerResponse } from 'node:http';
import { createApp } from '../src/app.js';
import { connectDatabase } from '../src/config/db.js';

const app = createApp();

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  try {
    await connectDatabase();
  } catch (err) {
    res.statusCode = 503;
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify({ error: 'Database unavailable' }));
    return;
  }
  // Express instances are callable as `(req, res) => void`
  return app(req as never, res as never);
}
