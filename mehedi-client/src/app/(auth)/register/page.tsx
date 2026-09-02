import { Suspense } from 'react';
import Link from 'next/link';
import { RegisterForm } from './register-form';

export default function RegisterPage() {
  return (
    <div className="rounded-2xl border border-app bg-card p-8 shadow-card">
      <Link href="/" className="mb-6 flex items-center gap-2 text-sm text-muted hover:text-body">
        ← Back to site
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
      <p className="mt-1 text-sm text-muted">
        Get a dashboard to message me directly or place an order.
      </p>

      <Suspense fallback={<div className="mt-8 h-64 animate-pulse rounded-lg bg-elev" />}>
        <RegisterForm />
      </Suspense>

      <p className="mt-6 text-center text-xs text-subtle">
        Already have an account?{' '}
        <Link href="/login" className="text-body hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
