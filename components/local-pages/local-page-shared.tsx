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
        <Star fill="currentColor" key={index} size={15} strokeWidth={0} />
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
            <Home size={17} /> Locally Owned & Operated
          </span>
          <span>
            <ShieldCheck size={17} /> Licensed & Insured
          </span>
          <span>
            <Clock3 size={17} /> Same-Day Service
          </span>
        </div>

        <div className="local-hero-actions">
          <Link className="local-button local-button-primary" data-track-intent="book" href={bookingHref}>
            <CalendarDays size={18} /> Schedule Online
          </Link>
          <a className="local-button local-button-secondary" data-track-intent="phone" href={phoneHref}>
            <Phone size={18} /> Call {phoneDisplay}
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
              <Icon color="#69aef0" size={28} />
              <h2 className="mt-4 text-[18px] font-bold text-white">{title}</h2>
              <p className="mt-2 text-[14px] leading-6 text-slate-300">{body}</p>
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
        <Phone size={17} /> {phoneDisplay}
      </a>
      <Link className="local-button local-button-primary" data-track-intent="book" href={bookingHref}>
        Schedule Online
      </Link>
    </div>
  );
}
