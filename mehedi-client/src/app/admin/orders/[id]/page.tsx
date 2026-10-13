import Link from 'next/link';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { getSession } from '@/lib/session';
import { apiFetchSafe } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { formatDate } from '@/lib/utils';
import type { Order, ProjectActivity } from '@/shared';
import { OrderEditForm } from './order-edit-form';
import { ProjectHistory } from './project-history';

export const dynamic = 'force-dynamic';

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  const [{ data, error }, { data: historyData, error: historyError }] = await Promise.all([
    apiFetchSafe<{ order: Order | null }>(
      `/orders/${id}`,
      { order: null },
      { server: true, token: session?.apiToken },
    ),
    apiFetchSafe<{ activity: ProjectActivity[] }>(
      `/orders/${id}/activity`,
      { activity: [] },
      { server: true, token: session?.apiToken },
    ),
  ]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href="/admin/projects" className="inline-flex items-center gap-2 text-sm text-muted hover:text-body">
        <ArrowLeft className="h-4 w-4" /> All projects
      </Link>

      {error || !data.order ? (
        <EmptyState tone="warning" title="Order not found" description={error ?? undefined} />
      ) : (
        <>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {data.order.projectName ?? data.order.orderCode}
              </h1>
              <p className="mt-2 text-muted">
                {data.order.orderCode} · {data.order.clientName ?? 'Unknown client'} ·{' '}
                {data.order.clientEmail ?? '—'} · started {formatDate(data.order.createdAt)}
              </p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Project brief</CardTitle>
              <CardDescription>Project scope and delivery expectations.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex flex-wrap gap-2">
                <Badge>{data.order.serviceType}</Badge>
                <Badge>{data.order.budgetRange}</Badge>
                <Badge>{data.order.timeline}</Badge>
              </div>
              <p className="whitespace-pre-wrap text-body">{data.order.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Client contact</CardTitle>
              <CardDescription>Contact details linked to this project.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><span className="text-muted">Name:</span> {data.order.clientName ?? '—'}</p>
              <p><span className="text-muted">Email:</span> {data.order.clientEmail ?? '—'}</p>
              <p><span className="text-muted">WhatsApp:</span> {data.order.clientWhatsapp ?? '—'}</p>
              <Link
                href={`/admin/messages/${data.order.id}`}
                className="inline-flex items-center gap-2 pt-2 text-brand-400 hover:underline"
              >
                <MessageCircle className="h-4 w-4" /> Open client conversation
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project links</CardTitle>
              <CardDescription>Saved links for this project.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {[
                ['Main project', data.order.projectUrl],
                ['Live site', data.order.links?.live],
                ['Staging', data.order.links?.staging],
                ['Source repository', data.order.links?.repo],
                ['Figma / design', data.order.links?.figma],
                ['Documentation', data.order.links?.docs],
                ['Shared folder', data.order.links?.sharedFolder],
              ].map(([label, url]) =>
                url ? (
                  <p key={label}>
                    <span className="text-muted">{label}: </span>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="break-all text-brand-400 hover:underline">
                      {url}
                    </a>
                  </p>
                ) : null,
              )}
              {!data.order.projectUrl &&
              !Object.values(data.order.links ?? {}).some(Boolean) ? (
                <p className="text-muted">No project links saved yet.</p>
              ) : null}
              {data.order.internalInfo ? (
                <div className="mt-4 border-t border-app pt-4">
                  <p className="font-medium text-body">Private project information</p>
                  <p className="mt-2 whitespace-pre-wrap text-muted">{data.order.internalInfo}</p>
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Manage project</CardTitle>
              <CardDescription>Status, budget, links, and private project information.</CardDescription>
            </CardHeader>
            <CardContent>
              <OrderEditForm order={data.order} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project history</CardTitle>
              <CardDescription>Automatic changes and your project notes in one timeline.</CardDescription>
            </CardHeader>
            <CardContent>
              {historyError ? (
                <EmptyState tone="warning" title="Could not load history" description={historyError} />
              ) : (
                <ProjectHistory orderId={id} initial={historyData.activity} />
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
