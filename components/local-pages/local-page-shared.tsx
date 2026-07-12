import Image from "next/image";
import Link from "next/link";
import { Schibsted_Grotesk } from "next/font/google";
import type { ReactNode } from "react";
import { CalendarDays, CheckCircle2, Clock3, Home, Menu, Phone, ShieldCheck, Star } from "lucide-react";
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

const chromeNavLinks = [
  { href: "/plumbing", label: "Plumbing" },
  { href: "/service-area", label: "Service Areas" },
  { href: "/guides", label: "Guides" },
  { href: "/about", label: "About Us" },
];

const quickLinks = [
  { href: "/reviews", label: "Reviews" },
  { href: "/plumbing", label: "Plumbing" },
  { href: "/service-area", label: "Service Areas" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms" },
];

const serviceLinks = [
  { href: "/plumbing/drain-cleaning", label: "Drain Cleaning" },
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

export function LocalPageChrome({ children }: { children: ReactNode }) {
  const { phoneDisplay, phoneHref } = getPublicContactInfo();
  const year = new Date().getFullYear();

  return (
    <div className={`local-page-shell ${schibstedGrotesk.variable}`}>
      <div className="local-chrome-sticky">
        <Link className="local-promo-bar" data-track-intent="book" href="/book">
          Book Today and Get 10% Off Your First Service &gt;
        </Link>
        <header className="local-site-header">
          <div className="local-site-header-inner">
            <button className="local-menu-button" aria-label="Open navigation" type="button">
              <Menu className="local-menu-icon" />
            </button>
            <Link className="local-logo-link" href="/" aria-label="Ironclad Plumbing home">
              <Image alt="Ironclad Plumbing" height={44} priority src="/media/logo/ironclad-logo-clear-dark.svg" width={151} />
            </Link>
            <nav aria-label="Primary local navigation" className="local-chrome-nav">
              {chromeNavLinks.map((link) => (
                <Link className={link.href === "/service-area" ? "local-nav-active" : undefined} href={link.href} key={link.href}>
                  {link.label} <span>⌄</span>
                </Link>
              ))}
            </nav>
            <div className="local-header-actions">
              <Link className="local-header-outline" data-track-intent="book" href="/book">
                Schedule Now | 24/7
              </Link>
              <a className="local-header-phone" data-track-intent="phone" href={phoneHref}>
                <Phone className="local-icon-sticky" />
                {phoneDisplay}
              </a>
            </div>
          </div>
        </header>
      </div>
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
          <span>TX Master Plumber License #M-12345</span>
        </div>
      </footer>
    </div>
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
