import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/session';

const MAX_AGE = 7 * 24 * 60 * 60; // 7 days, matches the backend JWT expiry

export async function GET() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return NextResponse.json({ user: null, apiToken: null }, { status: 200 });

  const session = await verifySessionToken(token);
  if (!session) return NextResponse.json({ user: null, apiToken: null }, { status: 200 });

  return NextResponse.json(session);
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { apiToken?: string } | null;
  const apiToken = body?.apiToken;
  if (!apiToken) return NextResponse.json({ error: 'Missing apiToken' }, { status: 400 });

  const session = await verifySessionToken(apiToken);
  if (!session) return NextResponse.json({ error: 'Invalid token' }, { status: 400 });

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, apiToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(SESSION_COOKIE);
  return res;
}
