import { auth } from '@/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function ClientDashboardPage() {
  const session = await auth();
  const name = session?.user?.name?.split(' ')[0] ?? 'there';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {name} 👋</h1>
        <p className="mt-2 text-muted">Here&apos;s a snapshot of your active work.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {['Active projects', 'Next milestone', 'Unread messages', 'Open invoices'].map((k) => (
          <Card key={k}>
            <CardHeader>
              <CardDescription>{k}</CardDescription>
              <CardTitle className="text-3xl">—</CardTitle>
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
