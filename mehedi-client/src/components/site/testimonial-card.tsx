import { Quote } from 'lucide-react';
import type { Testimonial } from '@/lib/portfolio-data';
import { initials } from '@/lib/utils';

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  if (testimonial.type === 'screenshot') {
    return (
      <figure className="overflow-hidden rounded-2xl border border-app bg-card">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/testimonials/${testimonial.image}`}
          alt={testimonial.alt}
          className="w-full"
          loading="lazy"
        />
        <figcaption className="border-t border-app p-4">
          <div className="font-medium text-body">{testimonial.author}</div>
          {testimonial.role || testimonial.country ? (
            <div className="text-xs text-subtle">
              {[testimonial.role, testimonial.country].filter(Boolean).join(' · ')}
            </div>
          ) : null}
        </figcaption>
      </figure>
    );
  }

  return (
    <figure className="flex h-full flex-col gap-4 rounded-2xl border border-app bg-card p-6">
      <Quote className="h-5 w-5 text-brand-500" aria-hidden />
      <blockquote className="flex-1 text-body leading-relaxed">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>
      <figcaption className="flex items-center gap-3 border-t border-app pt-4">
        <div className="grid h-10 w-10 place-items-center rounded-full gradient-brand text-sm font-semibold text-white">
          {initials(testimonial.author)}
        </div>
        <div>
          <div className="font-medium text-body">{testimonial.author}</div>
          {testimonial.role || testimonial.country ? (
            <div className="text-xs text-subtle">
              {[testimonial.role, testimonial.country].filter(Boolean).join(' · ')}
            </div>
          ) : null}
        </div>
      </figcaption>
    </figure>
  );
}
