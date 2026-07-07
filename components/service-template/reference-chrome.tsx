import Link from "next/link";
import { ChevronDown, Phone } from "lucide-react";
import { SiteLogo } from "@/components/layout/site-logo";

type ReferenceChromeProps = {
  children: React.ReactNode;
  phoneDisplay: string;
  phoneHref: string;
};

const NAV_LINKS = [
  ["Plumbing", "/plumbing"],
  ["Service Areas", "/service-area"],
  ["Guides", "/guides"],
  ["About Us", "/about"],
] as const;
const QUICK_LINKS = [
  ["Reviews", "#reviews"],
  ["Guarantees", "#guarantees"],
  ["Service Areas", "#areas"],
  ["Privacy Policy", "/privacy"],
  ["Terms", "/terms"],
] as const;
const SERVICES = [
  ["Drain Cleaning", "/plumbing/drain-cleaning"],
  ["Sewer Line Services", "/plumbing/sewer-services"],
  ["Hydro Jetting", "/plumbing/hydro-jetting"],
  ["Water Heaters", "/plumbing/water-heaters"],
  ["Emergency Plumbing", "/plumbing/emergency"],
] as const;
const AREAS = [
  ["Austin, TX", "/service-area/austin-tx"],
  ["Round Rock, TX", "/service-area/round-rock-tx"],
  ["Cedar Park, TX", "/service-area/cedar-park-tx"],
  ["Georgetown, TX", "/service-area/georgetown-tx"],
  ["View all areas →", "/service-area"],
] as const;

function ChromeHeader({ phoneDisplay, phoneHref }: Pick<ReferenceChromeProps, "phoneDisplay" | "phoneHref">) {
  return (
    <div className="dc-chrome-sticky">
      <Link className="dc-chrome-promo" href="/book">
        First-time customer? Get 10% off your first service <span>→</span>
      </Link>
      <header className="dc-chrome-header">
        <div className="dc-chrome-header-inner">
          <Link aria-label="Ironclad Plumbing home" className="dc-chrome-logo" href="/">
            <SiteLogo priority theme="dark" />
          </Link>
          <nav aria-label="Primary" className="dc-chrome-nav">
            {NAV_LINKS.map(([label, href]) => (
              <Link href={href} key={label}>
                {label}
                <ChevronDown aria-hidden="true" />
              </Link>
            ))}
          </nav>
          <div className="dc-chrome-actions">
            <Link className="dc-chrome-outline" href="/book">
              Schedule Now <span className="dc-chrome-book-sep">|</span> 24/7
            </Link>
            <a className="dc-chrome-phone" href={phoneHref}>
              <Phone aria-hidden="true" />
              {phoneDisplay}
            </a>
          </div>
        </div>
      </header>
    </div>
  );
}

function ChromeFooter({ phoneDisplay, phoneHref }: Pick<ReferenceChromeProps, "phoneDisplay" | "phoneHref">) {
  return (
    <footer className="dc-chrome-footer">
      <div className="dc-chrome-footer-grid">
        <div>
          <SiteLogo theme="light" />
          <p>Austin&apos;s most trusted plumber. Fast response, fair price, fixed right, so you never call twice.</p>
          <a className="dc-chrome-footer-phone" href={phoneHref}>
            <Phone aria-hidden="true" />
            {phoneDisplay}
          </a>
          <div className="dc-chrome-footer-note">Available 24/7 · call or text</div>
        </div>
        <nav aria-label="Footer quick links">
          <h3>Quick Links</h3>
          {QUICK_LINKS.map(([label, href]) => (
            <Link href={href} key={label}>
              {label}
            </Link>
          ))}
        </nav>
        <nav aria-label="Footer services">
          <h3>Services</h3>
          {SERVICES.map(([label, href]) => (
            <Link href={href} key={label}>
              {label}
            </Link>
          ))}
        </nav>
        <nav aria-label="Footer service areas">
          <h3>Service Areas</h3>
          {AREAS.map(([label, href], index) => (
            <Link className={index === AREAS.length - 1 ? "dc-chrome-footer-accent" : undefined} href={href} key={label}>
              {label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="dc-chrome-legal-wrap">
        <div className="dc-chrome-legal">
          <span>© 2026 Ironclad Plumbing. All rights reserved.</span>
          <span>TX Master Plumber License #M-12345</span>
        </div>
      </div>
    </footer>
  );
}

export function ReferenceChrome({ children, phoneDisplay, phoneHref }: ReferenceChromeProps) {
  return (
    <>
      <ChromeHeader phoneDisplay={phoneDisplay} phoneHref={phoneHref} />
      {children}
      <ChromeFooter phoneDisplay={phoneDisplay} phoneHref={phoneHref} />
    </>
  );
}
