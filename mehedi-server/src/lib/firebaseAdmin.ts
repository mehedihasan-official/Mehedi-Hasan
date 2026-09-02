import { cert, getApps, initializeApp, type App } from 'firebase-admin/app';
import { getAuth, type DecodedIdToken } from 'firebase-admin/auth';
import { env } from '../config/env.js';

function getFirebaseApp(): App {
  const existing = getApps()[0];
  if (existing) return existing;
  return initializeApp({
    credential: cert({
      projectId: env.FIREBASE_PROJECT_ID,
      clientEmail: env.FIREBASE_CLIENT_EMAIL,
      // .env stores the key with literal \n escapes; Firebase needs real newlines.
      privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
}

export async function verifyFirebaseToken(idToken: string): Promise<DecodedIdToken> {
  return getAuth(getFirebaseApp()).verifyIdToken(idToken);
}

// Creates a Firebase account for someone who submitted a brief without being
// logged in. If the email already has a Firebase account (e.g. a partial
// sign-up that never finished), reuse it instead of erroring.
export async function createOrGetFirebaseUser(
  email: string,
  password: string,
  displayName: string,
): Promise<{ uid: string }> {
  const auth = getAuth(getFirebaseApp());
  try {
    const created = await auth.createUser({ email, password, displayName });
    return { uid: created.uid };
  } catch (err) {
    if ((err as { code?: string }).code === 'auth/email-already-exists') {
      const existing = await auth.getUserByEmail(email);
      return { uid: existing.uid };
    }
    throw err;
  }
}
