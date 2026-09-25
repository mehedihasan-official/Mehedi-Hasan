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
  fromUserId: string;
  senderName: string;
  projectCode: string;
  projectService?: string | null;
  body: string;
  createdAt: string;
  unread: boolean;
};

type ConversationSummary = {
  projectId: string;
  projectCode: string;
  projectService?: string | null;
  senderName: string;
  latestBody: string;
  latestAt: string;
  unread: boolean;
  messageCount: number;
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
  const conversations = groupConversations(data.messages, session?.user.id);
  const unread = conversations.filter((conversation) => conversation.unread);
  const read = conversations.filter((conversation) => !conversation.unread);
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
          <MessageSection title="Unread" conversations={unread} />
          <MessageSection title="Read history" conversations={read} />
        </div>
      )}
    </div>
  );
}

function MessageSection({
  title,
  conversations,
}: {
  title: string;
  conversations: ConversationSummary[];
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
      {conversations.length ? (
        <div className="grid gap-3">
          {conversations.map((conversation) => (
            <Link
              key={conversation.projectId}
              href={`/admin/messages/${conversation.projectId}`}
            >
              <Card className="transition-colors hover:border-strong">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <MessageCircle className="h-4 w-4 text-brand-400" />
                        {conversation.senderName}
                      </CardTitle>
                      <CardDescription>
                        {conversation.projectCode} · ID:{" "}
                        {conversation.projectId}
                        {conversation.projectService
                          ? ` · ${conversation.projectService.replace("_", " ")}`
                          : ""}{" "}
                        · {formatDate(conversation.latestAt)} ·{" "}
                        {conversation.messageCount}{" "}
                        {conversation.messageCount === 1
                          ? "message"
                          : "messages"}
                      </CardDescription>
                    </div>
                    {conversation.unread ? (
                      <Badge tone="warning">Unread</Badge>
                    ) : (
                      <Badge>Read</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-2 text-sm text-body">
                    {conversation.latestBody}
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

function groupConversations(
  messages: AdminMessage[],
  adminId?: string,
): ConversationSummary[] {
  const groups = new Map<string, AdminMessage[]>();

  for (const message of messages) {
    const group = groups.get(message.projectId) ?? [];
    group.push(message);
    groups.set(message.projectId, group);
  }

  return [...groups.values()]
    .map((group) => {
      const latest = [...group].sort(
        (left, right) =>
          new Date(right.createdAt).getTime() -
          new Date(left.createdAt).getTime(),
      )[0];
      const clientMessage =
        group.find((message) => message.fromUserId !== adminId) ?? latest;

      return {
        projectId: latest.projectId,
        projectCode: latest.projectCode,
        projectService: latest.projectService,
        senderName: clientMessage.senderName,
        latestBody: latest.body,
        latestAt: latest.createdAt,
        unread: group.some((message) => message.unread),
        messageCount: group.length,
      };
    })
    .sort(
      (left, right) =>
        new Date(right.latestAt).getTime() - new Date(left.latestAt).getTime(),
    );
}
