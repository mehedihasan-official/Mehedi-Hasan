import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { apiFetchSafe } from "@/lib/api";
import { getSession } from "@/lib/session";
import { formatDate } from "@/lib/utils";
import type { Brief } from "@/shared";
import Link from "next/link";

type AdminMessage = {
  id: string;
  projectId: string;
  senderName: string;
  projectCode: string;
  body: string;
  createdAt: string;
  unread: boolean;
};

export const dynamic = "force-dynamic";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export default async function AdminOverviewPage() {
  const session = await getSession();
  const token = session?.apiToken;

  const [activeProjects, briefs, messages] = await Promise.all([
    apiFetchSafe<{ total: number }>(
      "/orders?status=accepted,in_progress&limit=1",
      { total: 0 },
      { server: true, token },
    ),
    apiFetchSafe<{ briefs: Brief[] }>(
      "/briefs",
      { briefs: [] },
      { server: true, token },
    ),
    apiFetchSafe<{ unread: number; messages: AdminMessage[] }>(
      "/messages",
      { unread: 0, messages: [] },
      { server: true, token },
    ),
  ]);

  const newBriefs7d = briefs.data.briefs.filter(
    (b) => Date.now() - new Date(b.createdAt).getTime() < SEVEN_DAYS_MS,
  ).length;
  const recentBriefs = briefs.data.briefs.slice(0, 5);

  const kpis = [
    { label: "Active projects", value: String(activeProjects.data.total) },
    { label: "New briefs (7d)", value: String(newBriefs7d) },
    {
      label: "Unread messages",
      value: String(messages.data.unread),
      href: "/admin/messages",
    },
    { label: "MRR (this month)", value: "—" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="mt-2 text-muted">Snapshot of the business.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) =>
          k.href ? (
            <Link key={k.label} href={k.href}>
              <Card className="transition-colors hover:border-strong">
                <CardHeader>
                  <CardDescription>{k.label}</CardDescription>
                  <CardTitle className="text-3xl">{k.value}</CardTitle>
                </CardHeader>
              </Card>
            </Link>
          ) : (
            <Card key={k.label}>
              <CardHeader>
                <CardDescription>{k.label}</CardDescription>
                <CardTitle className="text-3xl">{k.value}</CardTitle>
              </CardHeader>
            </Card>
          ),
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Get started</CardTitle>
            <CardDescription>
              Jump straight to what you use most.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm">
            <QuickLink
              href="/admin/briefs"
              title="Briefs inbox"
              desc="Start orders from finalized briefs"
            />
            <QuickLink
              href="/admin/users"
              title="Users"
              desc="Registered people who aren't clients yet"
            />
            <QuickLink
              href="/admin/clients"
              title="Clients"
              desc="Card grid + profile pages"
            />
            <QuickLink
              href="/admin/orders"
              title="Orders"
              desc="Self-service orders + tracking codes"
            />
            <QuickLink
              href="/admin/messages"
              title="Messages"
              desc="Read and reply to client conversations"
            />
            <QuickLink
              href="/admin/projects"
              title="Projects"
              desc="Running + completed client projects"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent briefs</CardTitle>
            <CardDescription>
              Latest submissions from Start a Project.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {recentBriefs.length === 0 ? (
              <p className="text-muted">Nothing yet.</p>
            ) : (
              recentBriefs.map((b) => (
                <Link
                  key={b.id}
                  href="/admin/briefs"
                  className="flex items-center justify-between rounded-lg border border-app bg-elev px-3 py-2 hover:border-strong"
                >
                  <span className="truncate text-body">{b.name}</span>
                  <span className="shrink-0 text-xs text-subtle">
                    {formatDate(b.createdAt)}
                  </span>
                </Link>
              ))
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent messages</CardTitle>
            <CardDescription>
              Latest client conversations needing attention.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {messages.data.messages.length === 0 ? (
              <p className="text-muted">No messages yet.</p>
            ) : (
              messages.data.messages.slice(0, 5).map((message) => (
                <Link
                  key={message.id}
                  href={`/admin/messages/${message.projectId}`}
                  className="flex items-center justify-between gap-3 rounded-lg border border-app bg-elev px-3 py-2 hover:border-strong"
                >
                  <span className="min-w-0 truncate">
                    <span className="font-medium text-body">
                      {message.senderName}
                    </span>
                    <span className="text-muted"> · {message.projectCode}</span>
                    <span className="ml-2 text-subtle">{message.body}</span>
                  </span>
                  {message.unread ? (
                    <span className="shrink-0 rounded-full bg-brand-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                      NEW
                    </span>
                  ) : null}
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function QuickLink({
  href,
  title,
  desc,
}: {
  href: string;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-lg border border-app bg-elev px-4 py-3 transition-colors hover:border-strong"
    >
      <div>
        <div className="font-medium text-body">{title}</div>
        <div className="text-xs text-muted">{desc}</div>
      </div>
      <span aria-hidden>→</span>
    </Link>
  );
}
