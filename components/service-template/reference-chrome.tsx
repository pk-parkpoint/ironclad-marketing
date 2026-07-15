import Link from "next/link";
import { Phone } from "lucide-react";
import { SiteLogo } from "@/components/layout/site-logo";
import { SiteHeader } from "@/components/layout/site-header";

type ReferenceChromeProps = {
  children: React.ReactNode;
  phoneDisplay: string;
  phoneHref: string;
};

const QUICK_LINKS = [
  ["Reviews", "#reviews"],
  ["Guarantees", "#guarantees"],
  ["Service Areas", "#areas"],
  ["Privacy Policy", "/privacy-policy"],
  ["Terms", "/terms"],
] as const;
const SERVICES = [
  ["Drain Clearing", "/plumbing/drain-clearing"],
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

function ChromeFooter({ phoneDisplay, phoneHref }: Pick<ReferenceChromeProps, "phoneDisplay" | "phoneHref">) {
  return (
    <footer className="dc-chrome-footer">
      <div className="dc-chrome-footer-grid">
        <div>
          <SiteLogo theme="light" />
          <p>Austin plumbing backed by clear pricing and written warranties.</p>
          <a className="dc-chrome-footer-phone" href={phoneHref}>
            <Phone aria-hidden="true" />
            {phoneDisplay}
          </a>
          <div className="dc-chrome-footer-note">24/7 emergency line · call or text</div>
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
          <span>Texas Responsible Master Plumber RMP #39871</span>
        </div>
      </div>
    </footer>
  );
}

export function ReferenceChrome({ children, phoneDisplay, phoneHref }: ReferenceChromeProps) {
  return (
    <>
      <SiteHeader />
      <div className="dc-root" id="dc-root">
        {children}
        <ChromeFooter phoneDisplay={phoneDisplay} phoneHref={phoneHref} />
      </div>
    </>
  );
}
