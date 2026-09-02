'use client';

import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { LogOut } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { cn } from '@/lib/utils';

export function SignOutButton({ className }: { className?: string }) {
  const router = useRouter();

  async function handleSignOut() {
    await signOut(auth).catch(() => {});
    await fetch('/api/session', { method: 'DELETE' }).catch(() => {});
    router.push('/login');
    router.refresh();
  }

  return (
    <button
      onClick={handleSignOut}
      className={cn(
        'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted hover:bg-card hover:text-body',
        className,
      )}
    >
      <LogOut className="h-4 w-4" /> Sign out
    </button>
  );
}
