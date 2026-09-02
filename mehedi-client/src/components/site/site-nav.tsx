'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/work', label: 'Work' },
  { href: '/contact', label: 'Contact' },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-app/60 backdrop-blur-xl bg-app/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-lg gradient-brand text-sm font-bold text-white">
            M
          </span>
          <span className="hidden sm:inline">Mehedi Hasan</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-muted transition-colors hover:text-body"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex md:items-center md:gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">Log in</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/register">Sign up</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/start-project">Start a Project</Link>
          </Button>
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-lg border border-app text-body md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div className={cn('overflow-hidden border-t border-app md:hidden', open ? 'max-h-96' : 'max-h-0')}>
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 text-sm text-body hover:bg-elev"
            >
              {l.label}
            </Link>
          ))}
          <div className="mt-2 grid grid-cols-3 gap-2">
            <Button asChild variant="ghost" className="col-span-1">
              <Link href="/login" onClick={() => setOpen(false)}>Log in</Link>
            </Button>
            <Button asChild variant="outline" className="col-span-1">
              <Link href="/register" onClick={() => setOpen(false)}>Sign up</Link>
            </Button>
            <Button asChild className="col-span-1">
              <Link href="/start-project" onClick={() => setOpen(false)}>Start</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
