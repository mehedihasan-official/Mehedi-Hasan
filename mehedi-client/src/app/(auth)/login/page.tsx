import { Suspense } from 'react';
import Link from 'next/link';
import { LoginForm } from './login-form';

export default function LoginPage() {
  const googleConfigured = Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
  );

  return (
    <div className="rounded-2xl border border-app bg-card p-8 shadow-card">
      <Link href="/" className="mb-6 flex items-center gap-2 text-sm text-muted hover:text-body">
        ← Back to site
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
      <p className="mt-1 text-sm text-muted">Log in to your dashboard.</p>

      <Suspense fallback={<div className="mt-8 h-64 animate-pulse rounded-lg bg-elev" />}>
        <LoginForm googleConfigured={googleConfigured} />
      </Suspense>

      <p className="mt-6 text-center text-xs text-subtle">
        Don&apos;t have an account?{' '}
        <Link href="/start-project" className="text-body hover:underline">
          Start a project
        </Link>{' '}
        — I&apos;ll invite you after our first chat.
      </p>
    </div>
  );
}
