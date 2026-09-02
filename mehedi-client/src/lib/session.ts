import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import type { SessionUser } from '@/shared';

export const SESSION_COOKIE = 'session';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export type Session = { user: SessionUser; apiToken: string };

export async function verifySessionToken(token: string): Promise<Session | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    const { id, role, name, email, avatar } = payload as unknown as SessionUser;
    if (!id || !role) return null;
    return { user: { id, role, name, email, avatar: avatar ?? null }, apiToken: token };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<Session | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}
