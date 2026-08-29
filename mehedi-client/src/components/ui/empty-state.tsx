import { AlertCircle } from 'lucide-react';

type Props = {
  title: string;
  description?: string;
  tone?: 'neutral' | 'warning';
};

export function EmptyState({ title, description, tone = 'neutral' }: Props) {
  return (
    <div className="rounded-2xl border border-dashed border-app bg-card p-10 text-center">
      {tone === 'warning' ? (
        <AlertCircle className="mx-auto h-6 w-6 text-amber-400" />
      ) : null}
      <p className="mt-3 font-medium text-body">{title}</p>
      {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}
    </div>
  );
}
