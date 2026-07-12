import Link from "next/link";
import { ArrowRight, BadgeCheck, MapPin, Wrench } from "lucide-react";
import type { LocalReview, LocalService, Pair } from "@/content/local-pages";
import { getServiceHref } from "@/content/local-pages";
import { LocalStars } from "./local-page-shared";

type NearbyLink = { name: string; path: string };

function SectionHeader({
  kicker,
  lead,
  title,
}: {
  kicker: string;
  title: string;
  lead?: string;
}) {
  return (
    <>
      <p className="local-section-kicker">{kicker}</p>
      <h2 className="local-section-title">{title}</h2>
      {lead ? <p className="local-section-lead">{lead}</p> : null}
    </>
  );
}

export function LocalKnowledgeSection({
  body,
  name,
  traits,
}: {
  name: string;
  body: string;
  traits: Pair[];
}) {
  return (
    <section className="local-band local-band-sand">
      <div className="local-inner local-split">
        <div>
          <SectionHeader kicker="Local Knowledge" title={`What We Know About ${name} Homes`} lead={body} />
        </div>
        <div className="local-grid">
          {traits.map(([label, value]) => (
            <div className="local-card p-5" key={label}>
              <p className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-[var(--local-blue)]">
                {label}
              </p>
              <p className="mt-2 text-[18px] font-bold leading-snug">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function NumberedRowsSection({
  items,
  lead,
  title,
}: {
  title: string;
  lead: string;
  items: Pair[];
}) {
  return (
    <section className="local-band">
      <div className="local-inner">
        <SectionHeader kicker="Common Issues" title={title} lead={lead} />
        <div className="mt-8">
          {items.map(([itemTitle, body], index) => (
            <div className="local-row" key={itemTitle}>
              <div className="local-row-number">{String(index + 1).padStart(2, "0")}</div>
              <div>
                <h3 className="m-0 text-[20px] font-bold">{itemTitle}</h3>
                <p className="mt-2 text-[16px] leading-7 text-[var(--local-muted)]">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ServicesSection({
  cityName,
  services,
}: {
  cityName: string;
  services: LocalService[];
}) {
  return (
    <section className="local-band local-band-bone">
      <div className="local-inner">
        <SectionHeader
          kicker="Popular Services"
          title={`Most-Requested Services in ${cityName}`}
          lead={`The repairs and upgrades ${cityName} homeowners call us for most, all backed by upfront pricing and a written warranty.`}
        />
        <div className="local-grid local-grid-3">
          {services.map((service) => (
            <Link className="local-card local-link-card" href={getServiceHref(service)} key={service[0]}>
              <span className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-[var(--local-blue)]">
                Service
              </span>
              <strong className="mt-3 text-[21px] leading-tight">{service[0]}</strong>
              <span className="mt-3 text-[15px] leading-6 text-[var(--local-muted)]">{service[1]}</span>
              <span className="mt-5 inline-flex items-center gap-2 text-[14px] font-bold text-[var(--local-blue)]">
                View service <ArrowRight size={16} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProcessSection({ cityName }: { cityName: string }) {
  const steps = [
    ["Book in Minutes", `Call, text, or schedule online. Tell us what is happening at your ${cityName} home.`],
    ["Same-Day Dispatch", `A licensed Ironclad plumber heads to your ${cityName} address and calls ahead if timing changes.`],
    ["Upfront Diagnosis", "We inspect, explain the fix in plain language, and give a flat price before work begins."],
    ["Fixed & Guaranteed", "We complete the repair, clean up, and back the job in writing."],
  ];

  return (
    <section className="local-band local-band-navy-soft">
      <div className="local-inner">
        <SectionHeader kicker="Process" title={`Your ${cityName} Service, Step by Step`} />
        <div className="local-grid local-grid-4">
          {steps.map(([title, body], index) => (
            <div key={title}>
              <p className="text-[28px] font-black text-[#69aef0]">{String(index + 1).padStart(2, "0")}</p>
              <h3 className="mt-3 text-[20px] font-bold text-white">{title}</h3>
              <p className="mt-2 text-[15px] leading-7 text-slate-300">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WhySection({ cityName }: { cityName: string }) {
  const items = [
    ["4.9 Stars on Google", `142 reviews from real ${cityName}-area homeowners.`],
    ["Licensed & Insured", "Verify our Texas Master Plumber license with the State Board anytime."],
    ["Locally Owned", `${cityName} neighbors, not a national call center or franchise.`],
    ["24/7 Emergency Service", "A backup at 2 AM still reaches a real person, not voicemail."],
  ];

  return (
    <section className="local-band local-band-navy">
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
            <div className="grid grid-cols-[28px_1fr] gap-4" key={title}>
              <BadgeCheck color="#69aef0" size={24} />
              <div>
                <h3 className="m-0 text-[19px] font-bold text-white">{title}</h3>
                <p className="mt-1 text-[15px] leading-6 text-slate-300">{body}</p>
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
    <section className="local-band">
      <div className="local-inner">
        <SectionHeader kicker="Reviews" title={`${cityName} Homeowners Trust Ironclad`} />
        <div className="local-grid local-grid-3">
          {reviews.map((review) => (
            <figure className="local-card m-0 p-6" key={`${review.name}-${review.loc}`}>
              <LocalStars />
              <blockquote className="mt-4 text-[16px] leading-7 text-[var(--local-muted)]">&ldquo;{review.text}&rdquo;</blockquote>
              <figcaption className="mt-5 font-bold">
                {review.name}
                <span className="block text-[14px] font-semibold text-[var(--local-muted)]">{review.loc}</span>
              </figcaption>
            </figure>
          ))}
        </div>
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
    <section className="local-band">
      <div className="local-inner local-split">
        <div>
          <MapPin color="#2f8fe0" size={34} />
          <SectionHeader kicker="Coverage" title={title} lead={body} />
        </div>
        <ul className="local-chip-list">
          {items.map((item) => {
            const href = linkByLabel.get(item);
            return <li key={item}>{href ? <Link href={href}>{item}</Link> : <span>{item}</span>}</li>;
          })}
        </ul>
      </div>
    </section>
  );
}

export function NearbySection({ label, pages }: { label: string; pages: NearbyLink[] }) {
  return (
    <section className="local-band local-band-sand">
      <div className="local-inner">
        <SectionHeader kicker="Nearby" title={label} />
        <div className="local-grid local-grid-4">
          {pages.map((page) => (
            <Link className="local-card local-link-card" href={page.path} key={page.path}>
              <strong className="text-[18px]">{page.name}</strong>
              <span className="mt-6 inline-flex items-center gap-2 text-[14px] font-bold text-[var(--local-blue)]">
                View page <ArrowRight size={16} />
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
    <section className="local-band">
      <div className="local-inner local-inner-narrow">
        <SectionHeader kicker="FAQ" title={title} />
        <div className="local-faq">
          {faqs.map(([question, answer], index) => (
            <details key={question} open={index === 0}>
              <summary>{question}</summary>
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
        <Wrench color="#69aef0" size={32} />
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
