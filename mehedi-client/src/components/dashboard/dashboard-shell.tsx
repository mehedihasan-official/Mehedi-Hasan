'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard,
  Inbox,
  Package,
  FolderKanban,
  MessageCircle,
  Receipt,
  UserCircle,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { SignOutButton } from '@/components/auth/sign-out-button';
import { ThemeToggle } from '@/components/theme-toggle';

const nav = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/briefs', label: 'Briefs', icon: Inbox },
  { href: '/dashboard/orders', label: 'Orders', icon: Package },
  { href: '/dashboard/projects', label: 'Projects', icon: FolderKanban },
  { href: '/dashboard/messages', label: 'Messages', icon: MessageCircle },
  { href: '/dashboard/invoices', label: 'Invoices', icon: Receipt },
  { href: '/dashboard/profile', label: 'Profile', icon: UserCircle },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + '/');

  return (
    <div className="flex min-h-dvh flex-col md:flex-row">
      <aside className="hidden w-60 flex-col border-r border-app bg-elev md:flex">
        <Brand />
        <SidebarNav isActive={isActive} />
        <SidebarFooter />
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-app bg-app/80 px-4 backdrop-blur-xl md:hidden">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="grid h-7 w-7 place-items-center rounded-md gradient-brand text-xs font-bold text-white">M</span>
            Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button size="sm" variant="outline" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </header>

        {open ? (
          <div className="border-b border-app bg-elev md:hidden">
            <SidebarNav isActive={isActive} onClick={() => setOpen(false)} />
            <div className="p-3">
              <SignOutButton />
            </div>
          </div>
        ) : null}

        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}

function Brand() {
  return (
    <Link href="/" className="flex h-16 items-center gap-2 border-b border-app px-5 font-semibold">
      <span className="grid h-8 w-8 place-items-center rounded-lg gradient-brand text-sm font-bold text-white">M</span>
      Dashboard
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

function SidebarFooter() {
  return (
    <div className="flex items-center gap-2 p-3">
      <SignOutButton className="flex-1" />
      <ThemeToggle />
    </div>
  );
}
