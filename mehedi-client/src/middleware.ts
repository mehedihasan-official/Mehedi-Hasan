import { NextResponse, type NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SESSION_COOKIE = 'session';
const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdmin = pathname.startsWith('/admin');
  const isDash = pathname.startsWith('/dashboard');
  if (!isAdmin && !isDash) return NextResponse.next();

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  let role: string | null = null;
  if (token) {
    try {
      const { payload } = await jwtVerify(token, secret);
      role = (payload as { role?: string }).role ?? null;
    } catch {
      role = null;
    }
  }

  if (!role) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }
  if (isAdmin && role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  if (isDash && role === 'admin') {
    return NextResponse.redirect(new URL('/admin', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*'],
};
