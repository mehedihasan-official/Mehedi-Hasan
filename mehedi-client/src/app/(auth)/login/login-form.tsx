'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';
import { loginInputSchema, type LoginInput } from '@/shared';
import { Button } from '@/components/ui/button';
import { Input, Label } from '@/components/ui/input';

const errorCopy: Record<string, string> = {
  NotInvited:
    "That Google account isn't linked to a client yet. Reach out on WhatsApp and I'll invite you.",
  NoEmail: "Couldn't read your email from Google. Try again or use email + password.",
  Configuration:
    "Auth isn't configured yet — NEXTAUTH_SECRET (and Google credentials if using Google) must be set in the environment.",
  OAuthSignin: 'Google login is temporarily unavailable. Please use email + password.',
  OAuthCallback: 'Google login failed. Please try again or use email + password.',
};

export function LoginForm({ googleConfigured }: { googleConfigured: boolean }) {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get('callbackUrl') ?? '/dashboard';
  const errorParam = params.get('error');
  const errorMessage = errorParam ? (errorCopy[errorParam] ?? 'Login failed. Please try again.') : null;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginInputSchema) });

  async function onSubmit(values: LoginInput) {
    const res = await signIn('credentials', { ...values, redirect: false });
    if (!res || res.error) {
      toast.error('Invalid email or password');
      return;
    }
    const dest =
      callbackUrl.startsWith('/admin') || callbackUrl.startsWith('/dashboard')
        ? callbackUrl
        : '/dashboard';
    router.push(dest);
    router.refresh();
  }

  function handleGoogle() {
    if (!googleConfigured) {
      toast.info(
        "Google login isn't set up on this deployment yet. Use email + password for now.",
      );
      return;
    }
    signIn('google', { callbackUrl });
  }

  return (
    <div className="mt-8 space-y-5">
      {errorMessage ? (
        <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-200">
          {errorMessage}
        </div>
      ) : null}

      <Button type="button" variant="outline" className="w-full" size="lg" onClick={handleGoogle}>
        <GoogleIcon className="h-4 w-4" /> Continue with Google
      </Button>

      <div className="relative flex items-center gap-3 text-xs text-subtle">
        <span className="h-px flex-1 bg-app" />
        <span>or use email</span>
        <span className="h-px flex-1 bg-app" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="login-email">Email</Label>
          <Input
            id="login-email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            {...register('email')}
          />
          {errors.email ? <p className="text-xs text-red-400">{errors.email.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="login-password">Password</Label>
          <Input
            id="login-password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            {...register('password')}
          />
          {errors.password ? (
            <p className="text-xs text-red-400">{errors.password.message}</p>
          ) : null}
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
    </div>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="#EA4335"
        d="M12 5.04c1.63 0 3.09.56 4.24 1.66l3.16-3.16C17.45 1.7 14.97.75 12 .75 7.35.75 3.35 3.42 1.4 7.27l3.68 2.86C6.04 7.24 8.79 5.04 12 5.04z"
      />
      <path
        fill="#4285F4"
        d="M23.25 12.26c0-.82-.07-1.6-.2-2.35H12v4.45h6.31c-.27 1.44-1.08 2.66-2.3 3.48l3.55 2.75c2.08-1.92 3.28-4.75 3.28-8.33z"
      />
      <path
        fill="#FBBC05"
        d="M5.08 14.13c-.24-.72-.38-1.5-.38-2.13s.14-1.41.38-2.13L1.4 7.01A11.24 11.24 0 0 0 .75 12c0 1.81.44 3.52 1.4 4.99l3.68-2.86z"
      />
      <path
        fill="#34A853"
        d="M12 23.25c3.24 0 5.96-1.07 7.94-2.9l-3.55-2.75c-1 .7-2.3 1.13-4.39 1.13-3.21 0-5.96-2.2-6.92-5.1L1.4 16.5c1.95 3.85 5.95 6.75 10.6 6.75z"
      />
    </svg>
  );
}
