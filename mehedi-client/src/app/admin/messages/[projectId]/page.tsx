import { Avatar } from "@/components/ui/avatar";
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
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ReplyForm } from "./reply-form";

export const dynamic = "force-dynamic";

type ConversationMessage = {
  id: string;
  fromUserId: string;
  senderName: string;
  senderAvatar: string | null;
  body: string;
  createdAt: string;
  readAt: string | null;
};
type Conversation = {
  order: { id: string; orderCode: string; serviceType: string };
  messages: ConversationMessage[];
};

export default async function AdminMessageConversationPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const session = await getSession();
  const { data, error } = await apiFetchSafe<Conversation>(
    `/messages/project/${projectId}`,
    { order: { id: projectId, orderCode: "", serviceType: "" }, messages: [] },
    { server: true, token: session?.apiToken },
  );
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/admin/messages"
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-body"
      >
        <ArrowLeft className="h-4 w-4" /> All messages
      </Link>
      {error ? (
        <EmptyState
          tone="warning"
          title="Can't load conversation"
          description={error}
        />
      ) : (
        <>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {data.order.orderCode}
            </h1>
            <p className="mt-2 text-muted">
              {data.order.serviceType.replace("_", " ")} conversation
            </p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Conversation history</CardTitle>
              <CardDescription>All messages about this order.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.messages.length ? (
                data.messages.map((message) => (
                  <div
                    key={message.id}
                    className="flex gap-3 rounded-xl border border-app p-4"
                  >
                    <Avatar
                      name={message.senderName}
                      src={message.senderAvatar}
                      size="sm"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <p className="font-medium text-body">
                          {message.senderName}
                        </p>
                        <time className="text-xs text-muted">
                          {formatDate(message.createdAt)}
                        </time>
                      </div>
                      <p className="mt-2 whitespace-pre-wrap text-sm text-body">
                        {message.body}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted">
                  No messages in this conversation.
                </p>
              )}
            </CardContent>
          </Card>
          <ReplyForm projectId={projectId} token={session?.apiToken ?? null} />
        </>
      )}
    </div>
  );
}
