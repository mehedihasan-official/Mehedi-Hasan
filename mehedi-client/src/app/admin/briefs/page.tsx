import { getSession } from '@/lib/session';
import { apiFetchSafe } from '@/lib/api';
import { EmptyState } from '@/components/ui/empty-state';
import type { Brief } from '@/shared';
import { BriefsList } from './briefs-list';

export const dynamic = 'force-dynamic';

export default async function BriefsPage() {
  const session = await getSession();
  const { data, error } = await apiFetchSafe<{ briefs: Brief[] }>(
    '/briefs',
    { briefs: [] },
    { server: true, token: session?.apiToken },
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Briefs</h1>
        <p className="mt-2 text-muted">Inbox from the public Start a Project form.</p>
      </div>

      {error ? (
        <EmptyState tone="warning" title="Can't reach the API" description={error} />
      ) : data.briefs.length === 0 ? (
        <EmptyState title="No briefs yet" description="They'll show up here as soon as someone submits the Start a Project form." />
      ) : (
        <BriefsList initial={data.briefs} />
      )}
    </div>
  );
}
