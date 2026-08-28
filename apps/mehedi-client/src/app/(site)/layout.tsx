import { SiteNav } from '@/components/site/site-nav';
import { SiteFooter } from '@/components/site/site-footer';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteNav />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
