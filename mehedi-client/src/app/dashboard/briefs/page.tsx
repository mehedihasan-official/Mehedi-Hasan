import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { apiFetchSafe } from "@/lib/api";
import { getSession } from "@/lib/session";
import { formatDate } from "@/lib/utils";
import type { Brief } from "@/shared";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function MyBriefsPage() {
  const session = await getSession();
  const { data, error } = await apiFetchSafe<{ briefs: Brief[] }>(
    "/briefs/mine",
    { briefs: [] },
    { server: true, token: session?.apiToken },
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My briefs</h1>
          <p className="mt-2 text-muted">
            Project briefs you&apos;ve sent over.
          </p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/dashboard/orders/new">Place an order</Link>
        </Button>
      </div>

      {error ? (
        <EmptyState
          tone="warning"
          title="Can't reach the API"
          description={error}
        />
      ) : data.briefs.length === 0 ? (
        <EmptyState
          title="No briefs yet"
          description="Send a project brief and it'll show up here while we talk it through."
        />
      ) : (
        <div className="grid gap-3 sm:gap-4">
          {data.briefs.map((b) => (
            <Card key={b.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle>{b.serviceType.replace("_", " ")}</CardTitle>
                    <CardDescription>
                      Sent {formatDate(b.createdAt)}
                    </CardDescription>
                  </div>
                  <Badge
                    tone={
                      b.status === "converted"
                        ? "success"
                        : b.status === "lost"
                          ? "danger"
                          : "brand"
                    }
                  >
                    {b.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex flex-wrap gap-2">
                  <Badge>{b.budgetRange}</Badge>
                  <Badge>{b.timeline}</Badge>
                </div>
                {b.message ? (
                  <p className="whitespace-pre-wrap text-body">{b.message}</p>
                ) : null}
                {b.orderId ? (
                  <Link
                    href={`/dashboard/orders/${b.orderId}`}
                    className="inline-block text-brand-400 hover:underline"
                  >
                    View order →
                  </Link>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
