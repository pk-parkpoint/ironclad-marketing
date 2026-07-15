import Image from "next/image";
import Link from "next/link";
import { Schibsted_Grotesk } from "next/font/google";
import type { ReactNode } from "react";
import { CalendarDays, CheckCircle2, Clock3, Home, Phone, ShieldCheck, Star } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { getPublicContactInfo } from "@/lib/contact";

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

const quickLinks = [
  { href: "/reviews", label: "Reviews" },
  { href: "/plumbing", label: "Plumbing" },
  { href: "/service-area", label: "Service Areas" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms" },
];

const serviceLinks = [
  { href: "/plumbing/drain-clearing", label: "Drain Clearing" },
  { href: "/plumbing/sewer-services", label: "Sewer Line Services" },
  { href: "/plumbing/hydro-jetting", label: "Hydro-Jetting" },
  { href: "/plumbing/water-heaters", label: "Water Heaters" },
  { href: "/plumbing/emergency", label: "Emergency Plumbing" },
];

const areaLinks = [
  { href: "/service-area/austin-tx", label: "Austin, TX" },
  { href: "/service-area/round-rock-tx", label: "Round Rock, TX" },
  { href: "/service-area/cedar-park-tx", label: "Cedar Park, TX" },
  { href: "/service-area/georgetown-tx", label: "Georgetown, TX" },
  { href: "/service-area", label: "View all areas ->" },
];

const schibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-local-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export function LocalStars() {
  return (
    <span className="local-stars" aria-label="5 star rating">
      {[0, 1, 2, 3, 4].map((index) => (
        <Star className="local-star-icon" fill="currentColor" key={index} strokeWidth={0} />
      ))}
    </span>
  );
}

export function LocalPageChrome({ bookingHref, children }: { bookingHref: string; children: ReactNode }) {
  const { phoneDisplay, phoneHref } = getPublicContactInfo();
  const year = new Date().getFullYear();

  return (
    <>
      <SiteHeader />
      <div className={`local-page-shell ${schibstedGrotesk.variable}`}>
        {children}
        <footer className="local-footer">
          <div className="local-footer-grid">
            <div className="local-footer-brand">
              <Link className="local-footer-logo" href="/" aria-label="Ironclad Plumbing home">
                <Image alt="Ironclad Plumbing" height={40} src="/media/logo/ironclad-logo-clear-light.svg" width={138} />
              </Link>
              <p>Austin&apos;s most trusted plumber. Fast response, fair price, fixed right, so you never call twice.</p>
              <a href={phoneHref}>
                <Phone className="local-icon-sticky" />
                {phoneDisplay}
              </a>
              <small>Available 24/7 - call or text</small>
            </div>
            <LocalFooterColumn links={quickLinks} title="Quick Links" />
            <LocalFooterColumn links={serviceLinks} title="Services" />
            <LocalFooterColumn links={areaLinks} title="Service Areas" />
          </div>
          <div className="local-footer-legal">
            <span>© {year} Ironclad Plumbing. All rights reserved.</span>
            <span>Texas Responsible Master Plumber RMP #39871</span>
          </div>
        </footer>
        <LocalStickyBar bookingHref={bookingHref} phoneDisplay={phoneDisplay} phoneHref={phoneHref} />
      </div>
    </>
  );
}

function LocalFooterColumn({ links, title }: { links: { href: string; label: string }[]; title: string }) {
  return (
    <section>
      <h2>{title}</h2>
      <ul>
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </section>
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
    <section className={`local-hero ${schibstedGrotesk.variable}`}>
      <div className="local-hero-inner">
        {parentLink ? (
          <nav aria-label="Breadcrumb" className="local-breadcrumb">
            <Link href="/service-area">Service Areas</Link>
            <span>/</span>
            <Link href={parentLink.href}>{parentLink.label}</Link>
          </nav>
        ) : null}

        <div data-entrance>
          <div className="local-hero-badge">
            <span className={parentLink ? "local-hero-eyebrow" : "local-hero-eyebrow local-hero-eyebrow-service"}>{eyebrow}</span>
            <span className="local-badge-div" aria-hidden="true" />
            <LocalStars />
            <span>4.9/5 · <span data-count="142">142</span> reviews</span>
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
            <a className="local-button local-button-call ic-cta" data-track-intent="phone" href={phoneHref}>
              <span className="ic-sheen" aria-hidden="true" />
              <Phone className="local-icon-button" /> Call {phoneDisplay}
            </a>
            <Link className="local-button local-button-light" data-track-intent="book" href={bookingHref}>
              <CalendarDays className="local-icon-button" /> Schedule Online
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function GuaranteeStrip() {
  return (
    <section className="local-band local-band-navy local-guarantee-strip" aria-label="Ironclad guarantees">
      <div className="local-inner">
        <h2 className="local-guarantee-heading" data-reveal>Our Ironclad Guarantee</h2>
        <div className="local-grid local-grid-4">
          {guarantees.map(({ body, icon: Icon, title }) => (
            <div data-reveal key={title}>
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
