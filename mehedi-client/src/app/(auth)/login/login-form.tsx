'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { toast } from 'sonner';
import { loginInputSchema, type LoginInput } from '@/shared';
import { Button } from '@/components/ui/button';
import { Input, Label } from '@/components/ui/input';
import { auth } from '@/lib/firebase';
import { exchangeFirebaseSession } from '@/lib/auth-exchange';
import { firebaseErrorMessage } from '@/lib/firebase-errors';
import { GoogleIcon } from '@/components/icons/google-icon';
import { Spinner } from '@/components/ui/spinner';
import { useState } from 'react';

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get('callbackUrl') ?? '';
  const [googleLoading, setGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginInputSchema) });

  function destinationFor(role: string) {
    if (callbackUrl.startsWith('/admin') || callbackUrl.startsWith('/dashboard')) return callbackUrl;
    return role === 'admin' ? '/admin' : '/dashboard';
  }

  async function onSubmit(values: LoginInput) {
    try {
      const cred = await signInWithEmailAndPassword(auth, values.email, values.password);
      const user = await exchangeFirebaseSession(cred.user);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
      router.push(destinationFor(user.role));
      router.refresh();
    } catch (err) {
      toast.error(firebaseErrorMessage(err) || 'Login failed');
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    try {
      const cred = await signInWithPopup(auth, new GoogleAuthProvider());
      const user = await exchangeFirebaseSession(cred.user);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
      router.push(destinationFor(user.role));
      router.refresh();
    } catch (err) {
      const message = firebaseErrorMessage(err);
      if (message) toast.error(message);
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <div className="mt-8 space-y-5">
      <Button type="button" variant="outline" className="w-full" size="lg" onClick={handleGoogle} disabled={googleLoading}>
        {googleLoading ? <Spinner /> : <GoogleIcon className="h-4 w-4" />} Continue with Google
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
          {isSubmitting ? <Spinner /> : null} {isSubmitting ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
    </div>
  );
}
