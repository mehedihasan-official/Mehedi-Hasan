'use client';

import { useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import type { ProjectActivity } from '@/shared';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/input';
import { useSession } from '@/hooks/use-session';
import { apiFetch } from '@/lib/api';

export function ProjectHistory({
  orderId,
  initial,
}: {
  orderId: string;
  initial: ProjectActivity[];
}) {
  const [activity, setActivity] = useState(initial);
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { data: session } = useSession();

  async function addNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    try {
      const { entry } = await apiFetch<{ entry: ProjectActivity }>(
        `/orders/${orderId}/activity`,
        {
          method: 'POST',
          body: JSON.stringify({ content }),
          token: session?.apiToken ?? null,
        },
      );
      setActivity((current) => [entry, ...current]);
      setContent('');
      toast.success('Project history updated');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not save project update');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <form onSubmit={addNote} className="space-y-3">
        <Textarea
          rows={3}
          maxLength={4000}
          required
          placeholder="Add a project update, decision, or reminder…"
          value={content}
          onChange={(event) => setContent(event.target.value)}
        />
        <div className="flex justify-end">
          <Button type="submit" size="sm" disabled={isSaving || !content.trim()}>
            {isSaving ? 'Saving…' : 'Add to history'}
          </Button>
        </div>
      </form>

      {activity.length ? (
        <ol className="space-y-4 border-l border-app pl-4">
          {activity.map((entry) => (
            <li key={entry.id} className="relative">
              <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-brand-400" />
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
                <span className="font-medium text-body">{entry.authorName}</span>
                <span className="capitalize">{entry.kind}</span>
                <time dateTime={entry.createdAt}>
                  {new Date(entry.createdAt).toLocaleString()}
                </time>
              </div>
              <p className="mt-1 whitespace-pre-wrap text-sm text-body">{entry.content}</p>
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-sm text-muted">No project history recorded yet.</p>
      )}
    </div>
  );
}
