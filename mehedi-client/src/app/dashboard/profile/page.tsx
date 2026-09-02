import { getSession } from '@/lib/session';
import { apiFetchSafe } from '@/lib/api';
import { EmptyState } from '@/components/ui/empty-state';
import type { Client } from '@/shared';
import { ProfileForm } from './profile-form';

export const dynamic = 'force-dynamic';

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ welcome?: string }>;
}) {
  const { welcome } = await searchParams;
  const session = await getSession();
  const { data, error } = await apiFetchSafe<{ profile: Client | null }>(
    '/me',
    { profile: null },
    { server: true, token: session?.apiToken },
  );

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Your profile</h1>
        <p className="mt-2 text-muted">Contact details and account security.</p>
      </div>

      {error || !data.profile ? (
        <EmptyState tone="warning" title="Can't load your profile" description={error ?? undefined} />
      ) : (
        <ProfileForm profile={data.profile} showWelcome={welcome === '1'} />
      )}
    </div>
  );
}
