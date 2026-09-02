import type { User } from 'firebase/auth';
import type { SessionUser } from '@/shared';
import { apiFetch } from './api';

// Trades a verified Firebase identity for the app's own session: the Express
// API verifies the Firebase ID token, finds-or-creates the Mongo user, and
// returns its own JWT — which we then hand to /api/session to become an
// httpOnly cookie the Next.js middleware can read.
export async function exchangeFirebaseSession(firebaseUser: User, name?: string): Promise<SessionUser> {
  const idToken = await firebaseUser.getIdToken();
  const { token, user } = await apiFetch<{ token: string; user: SessionUser }>('/auth/firebase', {
    method: 'POST',
    body: JSON.stringify({ idToken, name }),
  });

  const res = await fetch('/api/session', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ apiToken: token }),
  });
  if (!res.ok) throw new Error('Failed to establish session');

  return user;
}
