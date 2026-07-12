import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Phone } from "lucide-react";
import type { ReactNode } from "react";
import { IroncladMotionRoot } from "@/components/motion/ironclad-motion";

import styles from "./FaqCluster.module.css";
import { PHONE_DISPLAY, PHONE_TEL, allTopics, localHref, topicPath } from "./question-data";

const topicLinks = allTopics();

export default function FaqShell({ children }: { children: ReactNode }) {
  return (
    <IroncladMotionRoot as="div" className={styles.root}>
      <div className={styles.promo}>First-time customer? Get 10% off your first service <span className="ic-nudge">→</span></div>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/plumbing" aria-label="Ironclad Plumbing">
            <Image className={styles.logo} src="/media/logo/ironclad-logo-clear-dark.svg" alt="Ironclad Plumbing" width={180} height={48} />
          </Link>
          <nav className={styles.nav} aria-label="Primary">
            <Link href="/plumbing">Plumbing <ChevronDown className={styles.navChevron} aria-hidden="true" /></Link>
            <Link href="/service-area">Service Areas <ChevronDown className={styles.navChevron} aria-hidden="true" /></Link>
            <Link href="/questions">Guides <ChevronDown className={styles.navChevron} aria-hidden="true" /></Link>
            <Link href="/about">About Us <ChevronDown className={styles.navChevron} aria-hidden="true" /></Link>
          </nav>
          <div className={styles.headerActions}>
            <Link className={styles.schedulePill} href="/book?open=1"><span className="ic-pulse-dot" />Schedule Now | 24/7</Link>
            <a className={styles.phonePill} href={PHONE_TEL}><Phone className={styles.headerPhoneIcon} aria-hidden="true" />{PHONE_DISPLAY}</a>
          </div>
        </div>
        <div className={styles.mobileHeader}>
          <details>
            <summary className={styles.hamburger} aria-label="Open navigation"><span /></summary>
            <nav className={styles.mobileMenu} aria-label="Mobile">
              <Link href="/plumbing">Plumbing</Link>
              <Link href="/service-area">Service Areas</Link>
              <Link href="/questions">Guides</Link>
              <Link href="/about">About Us</Link>
              <Link href="/book?open=1">Schedule Now · 24/7</Link>
            </nav>
          </details>
          <Link href="/plumbing" aria-label="Ironclad Plumbing">
            <Image className={styles.logo} src="/media/logo/ironclad-logo-clear-dark.svg" alt="Ironclad Plumbing" width={180} height={48} />
          </Link>
          <span className={styles.mobileHeaderSpacer} aria-hidden="true" />
        </div>
      </header>
      {children}
      <div className={styles.stickyBar}>
        <a href={PHONE_TEL}><Phone className={styles.stickyPhoneIcon} aria-hidden="true" />{PHONE_DISPLAY}</a>
        <Link href="/book?open=1">Schedule Online</Link>
      </div>
      <FaqFooter />
    </IroncladMotionRoot>
  );
}

function FaqFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerGrid}>
        <div className={styles.footerBrand}>
          <Image className={styles.footerLogo} src="/media/logo/ironclad-logo-white-dark.svg" alt="Ironclad Plumbing" width={180} height={48} />
          <p>Austin&apos;s most trusted plumber. Fast response, fair price, fixed right, so you never call twice.</p>
          <a className={styles.footerPhone} href={PHONE_TEL}><Phone className={styles.footerPhoneIcon} aria-hidden="true" />{PHONE_DISPLAY}</a>
          <p className={styles.footerAvailability}>Available 24/7 · call or text</p>
        </div>
        <FooterColumn title="FAQ Topics" links={[
          ["All Topics", "/questions/"],
          ["Leaks", "/questions/leaks/"],
          ["Clogs & Drains", "/questions/clogs-and-drains/"],
          ["Water Heaters", "/questions/water-heaters/"],
        ]} />
        <FooterColumn title="Services" links={[
          ["Leak Detection", "/plumbing/leak-detection"],
          ["Drain Cleaning", "/plumbing/drain-cleaning"],
          ["Water Heaters", "/plumbing/water-heaters"],
          ["Emergency Plumbing", "/plumbing/emergency-plumbing"],
        ]} />
        <FooterColumn title="Service Areas" links={[
          ["Austin, TX", "/service-area/austin"],
          ["Round Rock, TX", "/service-area/round-rock-tx"],
          ["Cedar Park, TX", "/service-area/cedar-park-tx"],
          ["View all areas →", "/service-area"],
        ]} />
      </div>
      <div className={styles.legal}>
        <span>© {new Date().getFullYear()} Ironclad Plumbing. All rights reserved.</span>
        <span>TX Master Plumber License #M-12345</span>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: Array<[string, string]> }) {
  return (
    <div>
      <h3>{title}</h3>
      {links.map(([label, href]) => (
        <Link key={href} href={localHref(href)}>{label}</Link>
      ))}
    </div>
  );
}

export function RelatedTopics({ currentKey }: { currentKey: string }) {
  return (
    <section className={styles.related}>
      <div className={styles.relatedInner}>
        <h2>Related FAQ topics</h2>
        <div className={styles.chipRow}>
          {topicLinks.filter((topic) => topic.key !== currentKey).map((topic) => (
            <Link className={styles.chip} key={topic.key} href={topicPath(topic.key)}>
              {topic.name} <span>{topic.questions.length}</span>
            </Link>
          ))}
          <Link className={`${styles.chip} ${styles.chipInverse}`} href="/questions/">All 200 questions →</Link>
        </div>
      </div>
    </section>
  );
}
