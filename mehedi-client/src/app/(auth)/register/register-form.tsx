'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input, Label } from '@/components/ui/input';
import { auth } from '@/lib/firebase';
import { exchangeFirebaseSession } from '@/lib/auth-exchange';
import { firebaseErrorMessage } from '@/lib/firebase-errors';
import { GoogleIcon } from '@/components/icons/google-icon';

const registerSchema = z
  .object({
    name: z.string().min(1, 'Name is required').max(120),
    email: z.string().email(),
    password: z.string().min(6, 'Use at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type RegisterInput = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get('callbackUrl') ?? '';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  function destinationFor(role: string) {
    if (callbackUrl.startsWith('/admin') || callbackUrl.startsWith('/dashboard')) return callbackUrl;
    return role === 'admin' ? '/admin' : '/dashboard';
  }

  async function onSubmit(values: RegisterInput) {
    try {
      const cred = await createUserWithEmailAndPassword(auth, values.email, values.password);
      await updateProfile(cred.user, { displayName: values.name }).catch(() => {});
      const user = await exchangeFirebaseSession(cred.user, values.name);
      router.push(destinationFor(user.role));
      router.refresh();
    } catch (err) {
      toast.error(firebaseErrorMessage(err) || 'Registration failed');
    }
  }

  async function handleGoogle() {
    try {
      const cred = await signInWithPopup(auth, new GoogleAuthProvider());
      const user = await exchangeFirebaseSession(cred.user);
      router.push(destinationFor(user.role));
      router.refresh();
    } catch (err) {
      const message = firebaseErrorMessage(err);
      if (message) toast.error(message);
    }
  }

  return (
    <div className="mt-8 space-y-5">
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
          <Label htmlFor="register-name">Name</Label>
          <Input id="register-name" placeholder="Jane Doe" autoComplete="name" {...register('name')} />
          {errors.name ? <p className="text-xs text-red-400">{errors.name.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="register-email">Email</Label>
          <Input
            id="register-email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            {...register('email')}
          />
          {errors.email ? <p className="text-xs text-red-400">{errors.email.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="register-password">Password</Label>
          <Input
            id="register-password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            {...register('password')}
          />
          {errors.password ? (
            <p className="text-xs text-red-400">{errors.password.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="register-confirm">Confirm password</Label>
          <Input
            id="register-confirm"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            {...register('confirmPassword')}
          />
          {errors.confirmPassword ? (
            <p className="text-xs text-red-400">{errors.confirmPassword.message}</p>
          ) : null}
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account…' : 'Create account'}
        </Button>
      </form>
    </div>
  );
}
