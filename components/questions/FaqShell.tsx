import Link from "next/link";
import Image from "next/image";
import { Phone } from "lucide-react";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/layout/site-header";
import { IroncladMotionRoot } from "@/components/motion/ironclad-motion";

import styles from "./FaqCluster.module.css";
import { PHONE_DISPLAY, PHONE_TEL, allTopics, localHref, topicPath } from "./question-data";

const topicLinks = allTopics();

export default function FaqShell({ children }: { children: ReactNode }) {
  return (
    <IroncladMotionRoot as="div">
      <SiteHeader />
      <div className={styles.root}>
        {children}
        <FaqFooter />
      </div>
    </IroncladMotionRoot>
  );
}

function FaqFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerGrid}>
        <div className={styles.footerBrand}>
          <Image className={styles.footerLogo} src="/media/logo/ironclad-logo-white-dark.svg" alt="Ironclad Plumbing" width={180} height={48} />
          <p>Austin plumbing backed by clear pricing and written warranties.</p>
          <a className={styles.footerPhone} href={PHONE_TEL}><Phone className={styles.footerPhoneIcon} aria-hidden="true" />{PHONE_DISPLAY}</a>
          <p className={styles.footerAvailability}>24/7 emergency line · call or text</p>
        </div>
        <FooterColumn title="FAQ Topics" links={[
          ["All Topics", "/questions"],
          ["Leaks", "/questions/leaks"],
          ["Clogs & Drains", "/questions/clogs-and-drains"],
          ["Water Heaters", "/questions/water-heaters"],
        ]} />
        <FooterColumn title="Services" links={[
          ["Leak Detection", "/plumbing/leak-detection"],
          ["Drain Clearing", "/plumbing/drain-clearing"],
          ["Water Heaters", "/plumbing/water-heaters"],
          ["Emergency Plumbing", "/plumbing/emergency"],
        ]} />
        <FooterColumn title="Service Areas" links={[
          ["Austin, TX", "/service-area/austin-tx"],
          ["Round Rock, TX", "/service-area/round-rock-tx"],
          ["Cedar Park, TX", "/service-area/cedar-park-tx"],
          ["View all areas →", "/service-area"],
        ]} />
      </div>
      <div className={styles.legal}>
        <span>© {new Date().getFullYear()} Ironclad Plumbing. All rights reserved.</span>
        <span>Texas Responsible Master Plumber RMP #39871</span>
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
          <Link className={`${styles.chip} ${styles.chipInverse}`} href="/questions">All 200 questions →</Link>
        </div>
      </div>
    </section>
  );
}
