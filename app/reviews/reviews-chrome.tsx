import Image from "next/image";
import Link from "next/link";
import { getPublicContactInfo } from "@/lib/contact";
import styles from "./reviews-page.module.css";

const navLinks = [
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
  { href: "/service-area", label: "View all areas →" },
];

function PhoneIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.86.31 1.7.57 2.5a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.58-1.14a2 2 0 0 1 2.11-.45c.8.26 1.64.45 2.5.57a2 2 0 0 1 1.72 2.03Z" />
    </svg>
  );
}

export function ReviewsHeader() {
  const { phoneDisplay, phoneHref } = getPublicContactInfo();

  return (
    <div className={styles.chromeHeader}>
      <Link className={styles.promoBar} href="/book">
        Book Today and Get 10% Off Your First Service →
      </Link>
      <header className={styles.siteHeader}>
        <div className={styles.siteHeaderInner}>
          <Link className={styles.logoLink} href="/">
            <Image alt="Ironclad Plumbing" height={44} src="/media/logo/ironclad-logo-clear-dark.svg" width={151} />
          </Link>
          <nav aria-label="Primary reviews navigation" className={styles.reviewNav}>
            {navLinks.map((link) => (
              <Link href={link.href} key={link.href}>
                {link.label} <span>⌄</span>
              </Link>
            ))}
          </nav>
          <div className={styles.headerActions}>
            <Link className={styles.headerOutlineButton} href="/book">Schedule Now | 24/7</Link>
            <a className={styles.headerPhoneButton} href={phoneHref}><PhoneIcon />{phoneDisplay}</a>
          </div>
        </div>
      </header>
    </div>
  );
}

export function ReviewsFooter() {
  const { phoneDisplay, phoneHref } = getPublicContactInfo();
  const year = new Date().getFullYear();

  return (
    <footer className={styles.reviewChromeFooter}>
      <div className={styles.footerGrid}>
        <div className={styles.footerBrand}>
          <Link className={styles.footerLogo} href="/">
            <Image alt="Ironclad Plumbing" height={40} src="/media/logo/ironclad-logo-clear-light.svg" width={138} />
          </Link>
          <p>Austin&apos;s most trusted plumber. Fast response, fair price, fixed right, so you never call twice.</p>
          <a href={phoneHref}><PhoneIcon />{phoneDisplay}</a>
          <small>Available 24/7 · call or text</small>
        </div>
        <FooterColumn links={quickLinks} title="Quick Links" />
        <FooterColumn links={serviceLinks} title="Services" />
        <FooterColumn links={areaLinks} title="Service Areas" />
      </div>
      <div className={styles.footerLegal}>
        <span>© {year} Ironclad Plumbing. All rights reserved.</span>
        <span>Texas Responsible Master Plumber RMP #39871</span>
      </div>
    </footer>
  );
}

function FooterColumn({ links, title }: { links: { href: string; label: string }[]; title: string }) {
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
