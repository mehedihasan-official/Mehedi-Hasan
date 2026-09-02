'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updatePassword, onAuthStateChanged, type User } from 'firebase/auth';
import { toast } from 'sonner';
import { meUpdateSchema, type Client, type MeUpdateInput } from '@/shared';
import { Button } from '@/components/ui/button';
import { Input, Label } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { apiFetch } from '@/lib/api';
import { auth } from '@/lib/firebase';
import { useSession } from '@/hooks/use-session';

export function ProfileForm({ profile, showWelcome }: { profile: Client; showWelcome: boolean }) {
  const { data: session } = useSession();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<MeUpdateInput>({
    resolver: zodResolver(meUpdateSchema),
    defaultValues: {
      name: profile.name,
      phone: profile.phone ?? '',
      whatsapp: profile.whatsapp ?? '',
      address: profile.address ?? '',
    },
  });

  async function onSubmitProfile(values: MeUpdateInput) {
    try {
      await apiFetch('/me', {
        method: 'PATCH',
        body: JSON.stringify(values),
        token: session?.apiToken ?? null,
      });
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Update failed');
    }
  }

  return (
    <div className="space-y-6">
      {showWelcome ? (
        <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-200">
          Welcome! Your dashboard is ready. For your security, please set a new password below — the
          temporary one won&apos;t work for long.
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Contact details</CardTitle>
          <CardDescription>{profile.emails[0]?.address}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmitProfile)} className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input {...register('name')} />
              {errors.name ? <p className="text-xs text-red-400">{errors.name.message}</p> : null}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input placeholder="+1 …" {...register('phone')} />
              </div>
              <div className="space-y-2">
                <Label>WhatsApp</Label>
                <Input placeholder="+1 …" {...register('whatsapp')} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input {...register('address')} />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting || !isDirty}>
                {isSubmitting ? 'Saving…' : 'Save changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <PasswordCard />
    </div>
  );
}

function PasswordCard() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error('Use at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    setSaving(true);
    try {
      const user = auth.currentUser ?? (await waitForFirebaseUser());
      if (!user) throw new Error('Not signed in');
      await updatePassword(user, newPassword);
      toast.success('Password updated');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      const code = (err as { code?: string } | undefined)?.code;
      if (code === 'auth/requires-recent-login') {
        toast.error('For security, please log out and log back in, then try again.');
      } else {
        toast.error(err instanceof Error ? err.message : 'Failed to update password');
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change password</CardTitle>
        <CardDescription>Set a new password for email/password sign-in.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={changePassword} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>New password</Label>
              <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Confirm password</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={saving || !newPassword}>
              {saving ? 'Saving…' : 'Update password'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function waitForFirebaseUser(): Promise<User | null> {
  return new Promise((resolve) => {
    const unsub = onAuthStateChanged(auth, (user) => {
      unsub();
      resolve(user);
    });
  });
}
