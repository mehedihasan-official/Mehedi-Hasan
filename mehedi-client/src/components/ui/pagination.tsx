import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Pagination({
  page,
  pages,
  basePath,
  extraQuery = '',
}: {
  page: number;
  pages: number;
  basePath: string;
  extraQuery?: string;
}) {
  if (pages <= 1) return null;

  const hrefFor = (p: number) => `${basePath}?page=${p}${extraQuery}`;
  const atStart = page <= 1;
  const atEnd = page >= pages;

  return (
    <div className="flex items-center justify-center gap-3">
      {atStart ? (
        <Button variant="outline" size="sm" disabled>
          ← Previous
        </Button>
      ) : (
        <Button asChild variant="outline" size="sm">
          <Link href={hrefFor(page - 1)}>← Previous</Link>
        </Button>
      )}
      <span className="text-sm text-muted">
        Page {page} of {pages}
      </span>
      {atEnd ? (
        <Button variant="outline" size="sm" disabled>
          Next →
        </Button>
      ) : (
        <Button asChild variant="outline" size="sm">
          <Link href={hrefFor(page + 1)}>Next →</Link>
        </Button>
      )}
    </div>
  );
}
