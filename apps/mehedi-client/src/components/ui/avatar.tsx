import { cn } from '@/lib/utils';
import { initials } from '@/lib/utils';

type Props = {
  name: string;
  src?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
};

const sizes = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-base',
  xl: 'h-20 w-20 text-xl',
};

export function Avatar({ name, src, size = 'md', className }: Props) {
  return (
    <div
      className={cn(
        'relative inline-flex select-none items-center justify-center overflow-hidden rounded-full border border-app bg-elev font-semibold text-body',
        sizes[size],
        className,
      )}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name} className="h-full w-full object-cover" />
      ) : (
        <span aria-hidden>{initials(name) || '?'}</span>
      )}
    </div>
  );
}
