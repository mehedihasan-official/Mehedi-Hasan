import { cn } from '@/lib/utils';

const tones = {
  neutral: 'bg-elev text-body',
  brand: 'bg-brand-500/15 text-[color-mix(in_oklab,var(--color-brand-500)_60%,white_40%)]',
  success: 'bg-emerald-500/15 text-emerald-300',
  warning: 'bg-amber-500/15 text-amber-300',
  danger: 'bg-red-500/15 text-red-300',
} as const;

type Tone = keyof typeof tones;

export function Badge({
  children,
  tone = 'neutral',
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-app px-2.5 py-0.5 text-xs font-medium',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
