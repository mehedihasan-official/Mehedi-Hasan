import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import type { FeaturedProject } from '@/lib/portfolio-data';

export function ProjectCard({ project }: { project: FeaturedProject }) {
  return (
    <a
      href={project.liveUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col overflow-hidden rounded-2xl border border-app bg-card transition-all hover:-translate-y-0.5 hover:border-strong hover:shadow-card"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-elev">
        <Image
          src={project.image}
          alt={`${project.title} website screenshot`}
          fill
          placeholder="blur"
          className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/60 via-black/0 to-black/0" />
        <div className="absolute top-3 left-3 rounded-full bg-black/50 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
          {project.category}
        </div>
        <div className="absolute top-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-black/40 backdrop-blur-sm transition-transform group-hover:scale-110">
          <ArrowUpRight className="h-4 w-4 text-white" />
        </div>
        <div className="absolute right-4 bottom-3 left-4 text-lg font-semibold leading-tight text-white">
          {project.title}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="text-xs text-subtle">For {project.clientName}</div>
        <div>
          <div className="text-xs uppercase tracking-wider text-subtle">The problem</div>
          <p className="mt-1 text-sm text-muted">{project.problem}</p>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-subtle">The outcome</div>
          <p className="mt-1 text-sm text-body">{project.outcome}</p>
        </div>
      </div>
    </a>
  );
}
