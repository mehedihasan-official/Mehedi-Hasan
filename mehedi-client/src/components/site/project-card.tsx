import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { FeaturedProject } from '@/lib/portfolio-data';
import { Badge } from '@/components/ui/badge';

const gradients: Record<FeaturedProject['gradient'], string> = {
  brand: 'from-brand-500 to-accent-500',
  sunset: 'from-orange-500 to-pink-500',
  ocean: 'from-cyan-500 to-blue-600',
  forest: 'from-emerald-500 to-teal-600',
  plum: 'from-fuchsia-500 to-violet-600',
  coral: 'from-rose-500 to-orange-400',
};

export function ProjectCard({ project }: { project: FeaturedProject }) {
  const Card = project.liveUrl ? 'a' : 'div';
  const linkProps = project.liveUrl
    ? { href: project.liveUrl, target: '_blank', rel: 'noopener noreferrer' }
    : {};

  return (
    <Card
      {...linkProps}
      className="group flex flex-col overflow-hidden rounded-2xl border border-app bg-card transition-all hover:-translate-y-0.5 hover:border-strong hover:shadow-card"
    >
      <div
        className={`relative flex aspect-[16/10] items-end bg-gradient-to-br p-6 ${gradients[project.gradient]}`}
      >
        <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.3),transparent_50%)]" />
        <div className="relative">
          <div className="text-xs uppercase tracking-wider text-white/80">{project.category}</div>
          <div className="mt-1 text-xl font-semibold leading-tight text-white">{project.title}</div>
        </div>
        {project.liveUrl ? (
          <div className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-black/30 backdrop-blur-sm transition-transform group-hover:scale-110">
            <ArrowUpRight className="h-4 w-4 text-white" />
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center gap-2 text-xs text-subtle">
          <span>For {project.clientName}</span>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-subtle">The problem</div>
          <p className="mt-1 text-sm text-muted">{project.problem}</p>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-subtle">The outcome</div>
          <p className="mt-1 text-sm text-body">{project.outcome}</p>
        </div>
      </div>
    </Card>
  );
}
