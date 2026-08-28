'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { LayoutDashboard, Users, FolderKanban, Inbox, Receipt, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const nav = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/admin/clients', label: 'Clients', icon: Users },
  { href: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { href: '/admin/leads', label: 'Leads', icon: Inbox },
  { href: '/admin/invoices', label: 'Invoices', icon: Receipt },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + '/');

  return (
    <div className="flex min-h-dvh flex-col md:flex-row">
      <aside className="hidden w-60 flex-col border-r border-app bg-elev md:flex">
        <SidebarBrand />
        <SidebarNav isActive={isActive} />
        <SidebarLogout />
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-app bg-app/80 px-4 backdrop-blur-xl md:hidden">
          <Link href="/admin" className="flex items-center gap-2 font-semibold">
            <span className="grid h-7 w-7 place-items-center rounded-md gradient-brand text-xs font-bold text-white">M</span>
            Admin
          </Link>
          <Button size="sm" variant="outline" onClick={() => setOpen((v) => !v)}>
            Menu
          </Button>
        </header>

        {open ? (
          <div className="border-b border-app bg-elev md:hidden">
            <SidebarNav isActive={isActive} onClick={() => setOpen(false)} />
            <div className="p-3">
              <SidebarLogout inline />
            </div>
          </div>
        ) : null}

        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}

function SidebarBrand() {
  return (
    <Link href="/admin" className="flex h-16 items-center gap-2 border-b border-app px-5 font-semibold">
      <span className="grid h-8 w-8 place-items-center rounded-lg gradient-brand text-sm font-bold text-white">M</span>
      Admin
    </Link>
  );
}

function SidebarNav({
  isActive,
  onClick,
}: {
  isActive: (href: string, exact?: boolean) => boolean;
  onClick?: () => void;
}) {
  return (
    <nav className="flex-1 space-y-1 p-3">
      {nav.map((n) => {
        const active = isActive(n.href, n.exact);
        return (
          <Link
            key={n.href}
            href={n.href}
            onClick={onClick}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
              active ? 'bg-card text-body shadow-card' : 'text-muted hover:bg-card hover:text-body',
            )}
          >
            <n.icon className="h-4 w-4" />
            {n.label}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarLogout({ inline }: { inline?: boolean } = {}) {
  return (
    <div className={cn(inline ? '' : 'p-3')}>
      <button
        onClick={() => signOut({ callbackUrl: '/login' })}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted hover:bg-card hover:text-body"
      >
        <LogOut className="h-4 w-4" /> Sign out
      </button>
    </div>
  );
}
