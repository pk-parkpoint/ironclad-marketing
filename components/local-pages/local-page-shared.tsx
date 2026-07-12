import Link from "next/link";
import { CalendarDays, CheckCircle2, Clock3, Home, Phone, ShieldCheck, Star } from "lucide-react";

type LocalHeroProps = {
  eyebrow: string;
  title: string;
  intro: string;
  bookingHref: string;
  phoneDisplay: string;
  phoneHref: string;
  parentLink?: { href: string; label: string };
};

const guarantees = [
  {
    icon: CheckCircle2,
    title: "Fixed Right the First Time",
    body: "If it comes back, so do we.",
  },
  {
    icon: ShieldCheck,
    title: "Upfront Pricing, No Surprises",
    body: "You approve the price before we start.",
  },
  {
    icon: Clock3,
    title: "On Time or We Call Ahead",
    body: "Late means a call, every time.",
  },
  {
    icon: CalendarDays,
    title: "Written Warranty on Every Job",
    body: "In writing, not just a handshake.",
  },
];

export function LocalStars() {
  return (
    <span className="local-stars" aria-label="5 star rating">
      {[0, 1, 2, 3, 4].map((index) => (
        <Star className="local-star-icon" fill="currentColor" key={index} strokeWidth={0} />
      ))}
    </span>
  );
}

export function LocalHero({
  bookingHref,
  eyebrow,
  intro,
  parentLink,
  phoneDisplay,
  phoneHref,
  title,
}: LocalHeroProps) {
  return (
    <section className="local-hero">
      <div className="local-hero-inner">
        {parentLink ? (
          <nav aria-label="Breadcrumb" className="local-breadcrumb">
            <Link href="/service-area">Service Areas</Link>
            <span>/</span>
            <Link href={parentLink.href}>{parentLink.label}</Link>
          </nav>
        ) : null}

        <div className="local-hero-badge">
          <span className="local-hero-eyebrow">{eyebrow}</span>
          <LocalStars />
          <span>4.9/5 - 142 reviews</span>
        </div>

        <h1>{title}</h1>
        <p className="local-hero-subtitle" data-speakable="hero">
          {intro}
        </p>

        <div className="local-trust-row" aria-label="Trust signals">
          <span>
            <Home className="local-icon-trust" /> Locally Owned & Operated
          </span>
          <span>
            <ShieldCheck className="local-icon-trust" /> Licensed & Insured
          </span>
          <span>
            <Clock3 className="local-icon-trust" /> Same-Day Service
          </span>
        </div>

        <div className="local-hero-actions">
          <Link className="local-button local-button-primary" data-track-intent="book" href={bookingHref}>
            <CalendarDays className="local-icon-button" /> Schedule Online
          </Link>
          <a className="local-button local-button-secondary" data-track-intent="phone" href={phoneHref}>
            <Phone className="local-icon-button" /> Call {phoneDisplay}
          </a>
        </div>
      </div>
    </section>
  );
}

export function GuaranteeStrip() {
  return (
    <section className="local-band local-band-navy" aria-label="Ironclad guarantees">
      <div className="local-inner">
        <div className="local-grid local-grid-4">
          {guarantees.map(({ body, icon: Icon, title }) => (
            <div key={title}>
              <Icon className="local-icon-guarantee" />
              <h2 className="local-guarantee-title">{title}</h2>
              <p className="local-guarantee-body">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LocalStickyBar({
  bookingHref,
  phoneDisplay,
  phoneHref,
}: {
  bookingHref: string;
  phoneDisplay: string;
  phoneHref: string;
}) {
  return (
    <div className="local-sticky-bar" aria-label="Mobile booking actions">
      <a className="local-button local-button-primary" data-track-intent="phone" href={phoneHref}>
        <Phone className="local-icon-sticky" /> {phoneDisplay}
      </a>
      <Link className="local-button local-button-primary" data-track-intent="book" href={bookingHref}>
        Schedule Online
      </Link>
    </div>
  );
}
