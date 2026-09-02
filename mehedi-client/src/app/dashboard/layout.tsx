import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import { SignOutButton } from '@/components/auth/sign-out-button';
import { LayoutDashboard, FolderKanban, Package, MessageCircle, Receipt } from 'lucide-react';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect('/login?callbackUrl=/dashboard');
  if (session.user.role === 'admin') redirect('/admin');

  return (
    <div className="flex min-h-dvh flex-col md:flex-row">
      <aside className="hidden w-60 flex-col border-r border-app bg-elev md:flex">
        <Link href="/dashboard" className="flex h-16 items-center gap-2 border-b border-app px-5 font-semibold">
          <span className="grid h-8 w-8 place-items-center rounded-lg gradient-brand text-sm font-bold text-white">M</span>
          Dashboard
        </Link>
        <nav className="flex-1 space-y-1 p-3">
          <SideLink href="/dashboard" icon={LayoutDashboard} label="Overview" />
          <SideLink href="/dashboard/orders" icon={Package} label="Orders" />
          <SideLink href="/dashboard/projects" icon={FolderKanban} label="Projects" />
          <SideLink href="/dashboard/messages" icon={MessageCircle} label="Messages" />
          <SideLink href="/dashboard/invoices" icon={Receipt} label="Invoices" />
        </nav>
        <div className="p-3">
          <SignOutButton />
        </div>
      </aside>

      <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
    </div>
  );
}

function SideLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted hover:bg-card hover:text-body"
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}
