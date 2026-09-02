import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { AdminShell } from '@/components/admin/admin-shell';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect('/login?callbackUrl=/admin');
  if (session.user.role !== 'admin') redirect('/dashboard');
  return <AdminShell>{children}</AdminShell>;
}
