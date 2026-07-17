import Link from "next/link";
import { CalendarClock, ChevronDown, Phone } from "lucide-react";
import { getPublicContactInfo } from "@/lib/contact";
import { SiteLogo } from "@/components/layout/site-logo";

const NAV_LINKS = [
  { href: "/plumbing", label: "Plumbing" },
  { href: "/service-area", label: "Service Areas" },
  { href: "/guides", label: "Guides", dataDesk: true },
  { href: "/about", label: "About Us" },
];

export function DataDeskHeader() {
  const { phoneDisplay, phoneHref } = getPublicContactInfo();

  return (
    <>
      <a className="dd-promo" href="#newsroom">
        Free, source-documented Austin home-systems data. Embed or reproduce with attribution.
        <span aria-hidden="true" className="ic-nudge">→</span>
      </a>
      <header className="dd-header">
        <div className="dd-header-inner">
          <Link aria-label="Ironclad Plumbing home" className="dd-logo" href="/">
            <SiteLogo priority theme="dark" />
          </Link>
          <nav aria-label="Primary" className="dd-nav">
            {NAV_LINKS.map((link) => (
              <span className="dd-nav-item" key={link.href}>
                <Link href={link.href}>{link.label}</Link>
                <ChevronDown aria-hidden="true" size={13} strokeWidth={2} />
                {link.dataDesk ? (
                  <span className="dd-nav-menu">
                    <Link href="/data">Austin Home Data Desk</Link>
                    <Link href="/guides">All homeowner guides</Link>
                  </span>
                ) : null}
              </span>
            ))}
          </nav>
          <div className="dd-header-actions">
            <Link className="dd-schedule" data-track-intent="book" href="/book">
              <CalendarClock aria-hidden="true" size={16} />
              <span className="ic-pulse-dot" aria-hidden="true" />
              Schedule Now <span aria-hidden="true">|</span> 24/7
            </Link>
            <Link className="dd-a11y-book" data-track-intent="book" href="/book">Schedule service online</Link>
            <a className="dd-phone" data-track-intent="phone" href={phoneHref}>
              <Phone aria-hidden="true" size={16} />
              {phoneDisplay}
            </a>
          </div>
        </div>
      </header>
    </>
  );
}
