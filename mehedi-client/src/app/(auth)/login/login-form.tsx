'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';
import { loginInputSchema, type LoginInput } from '@/shared';
import { Button } from '@/components/ui/button';
import { Input, Label } from '@/components/ui/input';

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get('callbackUrl') ?? '/dashboard';

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
    const dest = callbackUrl.startsWith('/admin') || callbackUrl.startsWith('/dashboard')
      ? callbackUrl
      : '/dashboard';
    router.push(dest);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
      <div className="space-y-2">
        <Label>Email</Label>
        <Input type="email" placeholder="you@example.com" autoComplete="email" {...register('email')} />
        {errors.email ? <p className="text-xs text-red-400">{errors.email.message}</p> : null}
      </div>
      <div className="space-y-2">
        <Label>Password</Label>
        <Input type="password" placeholder="••••••••" autoComplete="current-password" {...register('password')} />
        {errors.password ? <p className="text-xs text-red-400">{errors.password.message}</p> : null}
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
        {isSubmitting ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  );
}
