import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminOverviewPage() {
  const kpis = [
    { label: 'Active projects', value: '—' },
    { label: 'New leads (7d)', value: '—' },
    { label: 'Unread messages', value: '—' },
    { label: 'MRR (this month)', value: '—' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="mt-2 text-muted">Snapshot of the business.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.label}>
            <CardHeader>
              <CardDescription>{k.label}</CardDescription>
              <CardTitle className="text-3xl">{k.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Get started</CardTitle>
            <CardDescription>Jump straight to what you use most.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm">
            <QuickLink href="/admin/clients" title="Clients" desc="Card grid + profile pages" />
            <QuickLink href="/admin/leads" title="Leads inbox" desc="Convert leads into clients" />
            <QuickLink href="/admin/projects" title="Projects" desc="Kanban + stage timelines" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
            <CardDescription>Coming soon.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}

function QuickLink({ href, title, desc }: { href: string; title: string; desc: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-lg border border-app bg-elev px-4 py-3 transition-colors hover:border-strong"
    >
      <div>
        <div className="font-medium text-body">{title}</div>
        <div className="text-xs text-muted">{desc}</div>
      </div>
      <span aria-hidden>→</span>
    </Link>
  );
}
