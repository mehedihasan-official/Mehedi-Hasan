import NextAuth, { type NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { loginInputSchema, type SessionUser } from '@mehedi/shared';
import { apiFetch } from '@/lib/api';

declare module 'next-auth' {
  interface Session {
    user: SessionUser & { image?: string | null };
    apiToken: string;
  }

  interface User {
    role?: SessionUser['role'];
    apiToken?: string;
  }
}

export const authConfig: NextAuthConfig = {
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(raw) {
        const parsed = loginInputSchema.safeParse(raw);
        if (!parsed.success) return null;
        try {
          const { token, user } = await apiFetch<{ token: string; user: SessionUser }>(
            '/auth/login',
            {
              method: 'POST',
              body: JSON.stringify(parsed.data),
              server: true,
            },
          );
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.avatar ?? undefined,
            role: user.role,
            apiToken: token,
          };
        } catch {
          return null;
        }
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = (user.id ?? token.sub) as string;
        token.role = (user.role ?? 'client') as SessionUser['role'];
        token.apiToken = (user.apiToken ?? '') as string;
        token.picture = user.image ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      const userId = (token.userId as string | undefined) ?? token.sub ?? '';
      const role = ((token.role as string | undefined) ?? 'client') as SessionUser['role'];
      const apiToken = (token.apiToken as string | undefined) ?? '';
      session.user = {
        ...(session.user ?? {}),
        id: userId,
        name: session.user?.name ?? '',
        email: session.user?.email ?? '',
        role,
        avatar: (token.picture as string | null | undefined) ?? null,
        emailVerified: null,
      } as typeof session.user;
      session.apiToken = apiToken;
      return session;
    },
    authorized({ auth, request }) {
      const path = request.nextUrl.pathname;
      const isAdmin = path.startsWith('/admin');
      const isDash = path.startsWith('/dashboard');
      if (!isAdmin && !isDash) return true;
      if (!auth) return false;
      if (isAdmin && auth.user.role !== 'admin') {
        return Response.redirect(new URL('/dashboard', request.nextUrl));
      }
      if (isDash && auth.user.role === 'admin') {
        return Response.redirect(new URL('/admin', request.nextUrl));
      }
      return true;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
