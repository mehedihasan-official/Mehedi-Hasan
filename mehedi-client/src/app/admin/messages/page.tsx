import { Badge } from "@/components/ui/badge";
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
import { MessageCircle } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

type AdminMessage = {
  id: string;
  projectId: string;
  senderName: string;
  projectCode: string;
  projectService?: string | null;
  body: string;
  createdAt: string;
  unread: boolean;
};

export default async function AdminMessagesPage() {
  const session = await getSession();
  const { data, error } = await apiFetchSafe<{
    unread: number;
    messages: AdminMessage[];
  }>(
    "/messages",
    { unread: 0, messages: [] },
    { server: true, token: session?.apiToken },
  );
  const unread = data.messages.filter((message) => message.unread);
  const read = data.messages.filter((message) => !message.unread);
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
          <p className="mt-2 text-muted">
            Client conversations organized by sender and order.
          </p>
        </div>
        <Badge tone={data.unread ? "warning" : "success"}>
          {data.unread} unread
        </Badge>
      </div>
      {error ? (
        <EmptyState
          tone="warning"
          title="Can't reach the API"
          description={error}
        />
      ) : data.messages.length === 0 ? (
        <EmptyState
          title="No messages yet"
          description="Client messages will appear here."
        />
      ) : (
        <div className="space-y-8">
          <MessageSection title="Unread" messages={unread} />
          <MessageSection title="Read history" messages={read} />
        </div>
      )}
    </div>
  );
}

function MessageSection({
  title,
  messages,
}: {
  title: string;
  messages: AdminMessage[];
}) {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-muted">
          {title === "Unread"
            ? "Messages waiting for your attention."
            : "Previously opened client messages."}
        </p>
      </div>
      {messages.length ? (
        <div className="grid gap-3">
          {messages.map((message) => (
            <Link
              key={message.id}
              href={`/admin/messages/${message.projectId}`}
            >
              <Card className="transition-colors hover:border-strong">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <MessageCircle className="h-4 w-4 text-brand-400" />
                        {message.senderName}
                      </CardTitle>
                      <CardDescription>
                        {message.projectCode}
                        {message.projectService
                          ? ` · ${message.projectService.replace("_", " ")}`
                          : ""}{" "}
                        · {formatDate(message.createdAt)}
                      </CardDescription>
                    </div>
                    {message.unread ? (
                      <Badge tone="warning">Unread</Badge>
                    ) : (
                      <Badge>Read</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-2 text-sm text-body">
                    {message.body}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-app p-6 text-center text-sm text-muted">
          No {title.toLowerCase()} messages.
        </div>
      )}
    </section>
  );
}
