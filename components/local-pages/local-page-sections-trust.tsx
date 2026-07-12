import Link from "next/link";
import { ArrowRight, BadgeCheck, ChevronDown, MapPin } from "lucide-react";
import type { LocalReview, Pair } from "@/content/local-pages";
import { LocalStars } from "./local-page-shared";
import { SectionHeader } from "./local-section-header";

type NearbyLink = { name: string; path: string };

export function WhySection({ cityName }: { cityName: string }) {
  const items = [
    ["4.9 Stars on Google", `142 reviews from real ${cityName}-area homeowners.`],
    ["Licensed & Insured", "Verify our Texas Master Plumber license with the State Board anytime."],
    ["Locally Owned", `${cityName} neighbors, not a national call center or franchise.`],
    ["24/7 Emergency Service", "A backup at 2 AM still reaches a real person, not voicemail."],
  ];

  return (
    <section className="local-band local-band-proof">
      <div className="local-inner local-split">
        <div>
          <SectionHeader
            kicker="Why Ironclad"
            title={`Why ${cityName} Calls Ironclad`}
            lead="Every job is done right, priced upfront, and backed in writing."
          />
        </div>
        <div className="local-grid">
          {items.map(([title, body]) => (
            <div className="local-proof-item local-why-item" key={title}>
              <BadgeCheck className="local-icon-proof" />
              <div>
                <h3 className="local-proof-title">{title}</h3>
                <p className="local-proof-body">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ReviewsSection({ cityName, reviews }: { cityName: string; reviews: LocalReview[] }) {
  return (
    <section className="local-band local-band-reviews">
      <div className="local-inner">
        <div className="local-review-head">
          <div>
            <SectionHeader kicker="Reviews" title={`${cityName} Homeowners Trust Ironclad`} />
            <p className="local-review-meta">4.9/5 · 142 Google reviews</p>
          </div>
          <Link className="local-review-all" href="/reviews">
            Read all reviews <ArrowRight className="local-icon-sticky" />
          </Link>
        </div>
        <div className="local-grid local-grid-3">
          {reviews.map((review) => (
            <figure className="local-card local-review-card" key={`${review.name}-${review.loc}`}>
              <LocalStars />
              <blockquote className="local-review-quote">&ldquo;{review.text}&rdquo;</blockquote>
              <figcaption className="local-review-caption">
                <span className="local-review-avatar" aria-hidden="true">
                  {review.initial}
                </span>
                <span>
                  {review.name}
                  <span className="local-review-location">{review.loc}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function StatsStrip() {
  const stats = [
    ["4.9", "Google Rating"],
    ["142", "Reviews"],
    ["24/7", "Emergency Service"],
  ];

  return (
    <section className="local-stats-strip" aria-label="Ironclad local service proof">
      <div className="local-stats-grid">
        {stats.map(([value, label]) => (
          <div className="local-stat-item" key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function CoverageSection({
  body,
  items,
  links,
  title,
}: {
  title: string;
  body: string;
  items: string[];
  links?: Array<{ href: string; label: string }>;
}) {
  const linkByLabel = new Map(links?.map((link) => [link.label, link.href]));

  return (
    <section className="local-band local-band-coverage">
      <div className="local-inner local-split">
        <div className="local-area-visual-wrap" aria-hidden="true">
          <div className="local-area-visual" aria-hidden="true">
            <span className="local-area-ring local-area-ring-outer" />
            <span className="local-area-ring local-area-ring-mid" />
            <span className="local-area-ring local-area-ring-inner" />
            <MapPin className="local-icon-coverage" />
          </div>
        </div>
        <div className="local-area-copy">
          <SectionHeader kicker="Coverage" title={title} lead={body} />
          <ul className="local-chip-list">
            {items.map((item) => {
              const href = linkByLabel.get(item);
              return <li key={item}>{href ? <Link href={href}>{item}</Link> : <span>{item}</span>}</li>;
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function NearbySection({ label, pages }: { label: string; pages: NearbyLink[] }) {
  return (
    <section className="local-band local-band-nearby">
      <div className="local-inner">
        <SectionHeader kicker="Nearby" title={label} />
        <div className="local-grid local-grid-4">
          {pages.map((page) => (
            <Link className="local-card local-link-card local-near-card" href={page.path} key={page.path}>
              <strong className="local-near-title">{page.name}</strong>
              <span className="local-card-action">
                View page <ArrowRight className="local-icon-sticky" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FaqSection({ faqs, title }: { title: string; faqs: Pair[] }) {
  return (
    <section className="local-band local-band-faq">
      <div className="local-inner local-inner-narrow">
        <SectionHeader kicker="FAQ" title={title} />
        <div className="local-faq">
          {faqs.map(([question, answer], index) => (
            <details key={question} open={index === 0}>
              <summary>
                <span>{question}</span>
                <ChevronDown className="local-faq-chev" />
              </summary>
              <p data-speakable="faq-answer">{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalCta({
  bookingHref,
  body,
  phoneHref,
  title,
}: {
  title: string;
  body: string;
  bookingHref: string;
  phoneHref: string;
}) {
  return (
    <section className="local-band local-band-navy local-final">
      <div className="local-inner local-inner-narrow">
        <p className="local-final-badge">15% off your first service</p>
        <SectionHeader kicker="Book Service" title={title} lead={body} />
        <div className="local-hero-actions justify-center">
          <Link className="local-button local-button-primary" data-track-intent="book" href={bookingHref}>
            Schedule Online
          </Link>
          <a className="local-button local-button-secondary" data-track-intent="phone" href={phoneHref}>
            Call Now
          </a>
        </div>
      </div>
    </section>
  );
}
