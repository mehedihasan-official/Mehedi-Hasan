import { ResponsiveCarousel } from "@/components/site/responsive-carousel";
import { TestimonialCard } from "@/components/site/testimonial-card";
import { TESTIMONIALS } from "@/lib/portfolio-data";

export function TestimonialSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
      <div className="max-w-2xl">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          What clients actually say
        </h2>
        <p className="mt-2 text-muted">
          Straight from WhatsApp, Fiverr, and email. No cherry-picking.
        </p>
      </div>

      <div className="mt-8">
        <ResponsiveCarousel
          label="Client testimonials"
          columnsClassName="md:grid-cols-2 lg:grid-cols-3"
        >
          {TESTIMONIALS.map((testimonial, index) => (
            <TestimonialCard
              key={`${testimonial.author}-${index}`}
              testimonial={testimonial}
            />
          ))}
        </ResponsiveCarousel>
      </div>
    </section>
  );
}
