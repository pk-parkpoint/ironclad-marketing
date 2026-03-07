import { REVIEWS } from "@/content/reviews";
import type { LocalProofData } from "@/content/local-proof";

type LocalProofProps = {
  cityName: string;
  data: LocalProofData;
};

export function LocalProof({ cityName, data }: LocalProofProps) {
  const testimonials = data.testimonialIds
    .map((id) => REVIEWS.find((review) => review.id === id))
    .filter((review): review is (typeof REVIEWS)[number] => Boolean(review))
    .slice(0, 3);

  return (
    <section className="section-block bg-soft-background">
      <div className="container-shell space-y-8">
        <div>
          <h2 className="h2-display">Local Proof in {cityName}</h2>
          <p className="mt-3 text-sm text-muted md:text-base">{data.emergencyResponseNote}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {data.projectCards.map((project) => (
            <article className="card-shell bg-background p-6" key={project.title}>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-cta-blue">{project.service}</p>
              <h3 className="mt-2 text-lg font-semibold text-ink">{project.title}</h3>
              <p className="mt-2 text-sm text-muted md:text-base">{project.summary}</p>
            </article>
          ))}
        </div>

        <div className="card-shell bg-background p-6">
          <h3 className="text-lg font-semibold text-ink">Neighborhood Coverage</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {data.neighborhoodBadges.map((badge) => (
              <span
                className="rounded-full border border-border bg-soft-background px-3 py-1 text-xs font-semibold text-ink"
                key={badge}
              >
                {badge}
              </span>
            ))}
          </div>
        </div>

        {testimonials.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <blockquote className="card-shell bg-background p-6" key={testimonial.id}>
                <p className="text-sm text-body md:text-base">&ldquo;{testimonial.quote}&rdquo;</p>
                <footer className="mt-4 text-xs font-semibold uppercase tracking-[0.08em] text-muted">
                  {testimonial.reviewerName} - {testimonial.location}
                </footer>
              </blockquote>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
