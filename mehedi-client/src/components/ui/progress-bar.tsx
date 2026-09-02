import { cn } from '@/lib/utils';

export function ProgressBar({ value, className }: { value: number; className?: string }) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div className={cn('space-y-1', className)}>
      <div className="h-2 w-full overflow-hidden rounded-full bg-elev">
        <div className="h-full gradient-brand transition-all" style={{ width: `${pct}%` }} />
      </div>
      <div className="text-right text-xs text-subtle">{pct}%</div>
    </div>
  );
}
