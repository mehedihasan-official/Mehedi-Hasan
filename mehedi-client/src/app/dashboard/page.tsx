import Link from 'next/link';
import { MessageCircle, Package } from 'lucide-react';
import { getSession } from '@/lib/session';
import { apiFetchSafe } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Order } from '@/shared';

export const dynamic = 'force-dynamic';

export default async function ClientDashboardPage() {
  const session = await getSession();
  const name = session?.user?.name?.split(' ')[0] ?? 'there';

  const { data } = await apiFetchSafe<{ orders: Order[] }>(
    '/orders',
    { orders: [] },
    { server: true, token: session?.apiToken },
  );
  const activeOrders = data.orders.filter((o) => !['delivered', 'cancelled'].includes(o.status)).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {name} 👋</h1>
        <p className="mt-2 text-muted">Here&apos;s a snapshot of your active work.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/contact"
          className="group flex items-center gap-4 rounded-2xl border border-app bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-strong hover:shadow-card"
        >
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl gradient-brand text-white">
            <MessageCircle className="h-6 w-6" />
          </span>
          <div>
            <div className="font-semibold text-body">Contact me</div>
            <div className="text-sm text-muted">Discuss your project directly.</div>
          </div>
        </Link>
        <Link
          href="/dashboard/orders/new"
          className="group flex items-center gap-4 rounded-2xl border border-app bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-strong hover:shadow-card"
        >
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl gradient-brand text-white">
            <Package className="h-6 w-6" />
          </span>
          <div>
            <div className="font-semibold text-body">Place an order</div>
            <div className="text-sm text-muted">Fill a quick form and get a tracking code.</div>
          </div>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { k: 'Active orders', v: String(activeOrders) },
          { k: 'Next milestone', v: '—' },
          { k: 'Unread messages', v: '—' },
          { k: 'Open invoices', v: '—' },
        ].map((item) => (
          <Card key={item.k}>
            <CardHeader>
              <CardDescription>{item.k}</CardDescription>
              <CardTitle className="text-3xl">{item.v}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your projects</CardTitle>
          <CardDescription>Full project list + stages coming next.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-dashed border-app p-8 text-center text-sm text-muted">
            Nothing here yet — new projects will show up automatically.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
