"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label, Textarea } from "@/components/ui/input";
import { apiFetch } from "@/lib/api";
import { Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function ReplyForm({
  projectId,
  token,
}: {
  projectId: string;
  token: string | null;
}) {
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!body.trim()) return;
    setSending(true);
    try {
      await apiFetch("/messages", {
        method: "POST",
        body: JSON.stringify({ projectId, body }),
        token,
      });
      setBody("");
      toast.success("Reply sent");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Reply failed");
    } finally {
      setSending(false);
    }
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reply to client</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-reply">Message</Label>
            <Textarea
              id="admin-reply"
              rows={5}
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder="Write a reply..."
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={sending || !body.trim()}>
              <Send className="h-4 w-4" />
              {sending ? "Sending…" : "Send reply"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
