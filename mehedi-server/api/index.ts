// Vercel serverless entry point.
// Locally (`npm run dev`) the server runs as a long-lived Express process via
// src/server.ts. On Vercel, every HTTP request comes through this file — or,
// since Vercel's "Express" framework preset also auto-detects src/app.ts
// directly, through that file's default export. Both resolve to the exact
// same Express app (DB-connection guard included as middleware), so it
// behaves correctly no matter which one Vercel decides to invoke.
export { default } from '../src/app.js';
