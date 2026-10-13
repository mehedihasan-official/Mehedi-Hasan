import Link from 'next/link';
import { Plus } from 'lucide-react';
import { getSession } from '@/lib/session';
import { apiFetchSafe } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Pagination } from '@/components/ui/pagination';
import { formatDate } from '@/lib/utils';
import type { Order } from '@/shared';

export const dynamic = 'force-dynamic';

// A "project" is any order that's actually been started — pending/reviewing
// briefs aren't projects yet, and cancelled ones never became one.
const PROJECT_STATUSES = 'accepted,in_progress,delivered';

type OrdersResponse = { orders: Order[]; total: number; page: number; pages: number };

export default async function AdminProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const session = await getSession();
  const { data, error } = await apiFetchSafe<OrdersResponse>(
    `/orders?status=${PROJECT_STATUSES}&page=${page}&limit=20`,
    { orders: [], total: 0, page: 1, pages: 1 },
    { server: true, token: session?.apiToken },
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
        <p className="mt-2 text-muted">
          {data.total} client {data.total === 1 ? 'project' : 'projects'} — running and completed.
        </p>
      </div>
      <div>
        <Button asChild>
          <Link href="/admin/projects/new">
            <Plus className="h-4 w-4" /> Start project manually
          </Link>
        </Button>
      </div>

      {error ? (
        <EmptyState tone="warning" title="Can't reach the API" description={error} />
      ) : data.orders.length === 0 ? (
        <EmptyState
          title="No projects yet"
          description="Create a project for a client or manage projects that clients started."
        />
      ) : (
        <>
          <div className="grid gap-4">
            {data.orders.map((o) => {
              const running = o.status !== 'delivered';
              return (
                <Link key={o.id} href={`/admin/orders/${o.id}`}>
                  <Card className="transition-colors hover:border-strong">
                    <CardHeader>
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <CardTitle>{o.projectName ?? o.orderCode}</CardTitle>
                          <CardDescription>
                            {o.clientName ?? 'Unknown client'} · {o.orderCode} · started {formatDate(o.createdAt)}
                          </CardDescription>
                        </div>
                        <Badge tone={running ? 'warning' : 'success'}>
                          {running ? 'Running' : 'Completed'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div className="flex flex-wrap gap-2">
                        <Badge>{o.serviceType}</Badge>
                        <Badge tone="neutral">{o.status.replace('_', ' ')}</Badge>
                      </div>
                      <ProgressBar value={o.progress} />
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
          <Pagination page={data.page} pages={data.pages} basePath="/admin/projects" />
        </>
      )}
    </div>
  );
}
