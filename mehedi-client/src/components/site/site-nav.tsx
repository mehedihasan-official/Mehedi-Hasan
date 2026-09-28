"use client";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/use-session";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/contact", label: "Contact" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);
  const menuLinks = session
    ? [
        {
          href: session.user.role === "admin" ? "/admin" : "/dashboard",
          label: "Dashboard",
        },
        ...links,
      ]
    : links;

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-app/60 backdrop-blur-xl bg-app/70">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold tracking-tight"
          >
            <span className="grid h-8 w-8 place-items-center rounded-lg gradient-brand text-sm font-bold text-white">
              M
            </span>
            <span className="hidden sm:inline">Mehedi Hasan</span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {menuLinks.map((l) => {
              const active = isActive(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative py-1 text-sm transition-colors after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-linear-to-r after:from-brand-500 after:to-accent-500 after:transition-transform after:duration-200",
                    active
                      ? "font-medium text-body after:scale-x-100"
                      : "text-muted hover:text-body hover:after:scale-x-100",
                  )}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex md:items-center md:gap-2">
            <ThemeToggle />
            {session ? (
              <Link
                href={session.user.role === "admin" ? "/admin" : "/dashboard"}
                aria-label="Your dashboard"
              >
                <Avatar
                  name={session.user.name}
                  src={session.user.avatar ?? undefined}
                  size="sm"
                />
              </Link>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/login">Log in</Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href="/register">Sign up</Link>
                </Button>
              </>
            )}
            <Button asChild size="sm">
              <Link href="/start-project">Start a Project</Link>
            </Button>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            {session ? (
              <Link
                href={session.user.role === "admin" ? "/admin" : "/dashboard"}
                aria-label="Your dashboard"
              >
                <Avatar
                  name={session.user.name}
                  src={session.user.avatar ?? undefined}
                  size="sm"
                />
              </Link>
            ) : null}
            <button
              className="grid h-10 w-10 place-items-center rounded-lg border border-app text-body"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={open}
              aria-controls="mobile-site-menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>
      <button
        type="button"
        aria-label="Close menu"
        onClick={() => setOpen(false)}
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <nav
        id="mobile-site-menu"
        aria-label="Mobile navigation"
        aria-hidden={!open}
        inert={!open}
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-[min(22rem,88vw)] flex-col border-l border-app bg-card p-5 shadow-2xl transition-transform duration-300 md:hidden",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="mb-5 flex items-center justify-between border-b border-app pb-4">
          <span className="font-semibold">Menu</span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="grid h-10 w-10 place-items-center rounded-lg border border-app text-body"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {menuLinks.map((l) => {
          const active = isActive(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "rounded-lg border-l-2 px-3 py-3 text-sm transition-colors",
                active
                  ? "border-brand-500 bg-elev font-medium text-body"
                  : "border-transparent text-body hover:bg-elev",
              )}
            >
              {l.label}
            </Link>
          );
        })}
        <div className="mt-auto grid grid-cols-2 gap-2 border-t border-app pt-5">
          {session ? (
            <SignOutButton className="col-span-2 justify-center border border-app" />
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link href="/login" onClick={() => setOpen(false)}>
                  Sign in
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/register" onClick={() => setOpen(false)}>
                  Sign up
                </Link>
              </Button>
            </>
          )}
          <Button asChild className="col-span-2">
            <Link href="/start-project" onClick={() => setOpen(false)}>
              Start
            </Link>
          </Button>
        </div>
      </nav>
    </>
  );
}
