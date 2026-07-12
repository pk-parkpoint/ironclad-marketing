import Link from "next/link";
import Image from "next/image";
import { Phone } from "lucide-react";

import styles from "./FaqCluster.module.css";
import FaqShell from "./FaqShell";
import {
  PHONE_DISPLAY,
  PHONE_TEL,
  allTopics,
  assetPath,
  postPath,
  topicPath,
  type FaqCta,
  type FaqPost,
} from "./question-data";

const mostAsked = [
  ["Toilets", "Why does my toilet keep running?", "running-toilet"],
  ["Costs", "Why is my water bill suddenly high?", "high-water-bill"],
  ["Water Heaters", "Why do I not have hot water?", "no-hot-water"],
  ["Drains", "Should you use chemical drain cleaner?", "chemical-drain-cleaner"],
  ["Pressure", "Why is my water pressure low?", "low-water-pressure"],
  ["Sewer", "How do I know if my sewer line is clogged?", "sewer-line-clogged"],
];

export default function FaqHub({ posts }: { posts: FaqPost[] }) {
  const postMap = Object.fromEntries(posts.map((post) => [post.key, post]));
  return (
    <FaqShell>
      <section className={styles.hero}>
        <div className={styles.heroInner} data-entrance>
          <div className={styles.badge}>Homeowner FAQ <span className={styles.dot} /> <span><span className="ic-count" data-count="200">200</span> questions · 11 topics</span></div>
          <h1>Plumbing answers that actually <span className="ic-underline">hold water.</span></h1>
          <p className={styles.heroSub}>
            Straight answers to the questions homeowners actually ask about{" "}
            <span className="ic-rot ic-rot-light">
              <span data-rotate='["weak pressure","leaks","clogs","water heaters","high bills"]'>weak pressure</span>
            </span>
            {": what it usually is, what to do next, and when it's time to call."}
          </p>
          <div className={styles.mostAskedLabel}>Most-asked questions</div>
          <div className={styles.glassGrid}>
            {mostAsked.map(([kicker, question, key]) => (
              <Link className={`${styles.glassCard} ic-glass`} key={key} href={postPath(postMap[key])}>
                <span><span className={styles.glassKicker}>{kicker}</span><span className={styles.glassQuestion}>{question}</span></span>
                <span aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className={styles.sectionTint}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionIntro}>
            <h2>Browse by topic</h2>
            <p>Every question comes with a quick answer and a what-to-do-next, written the way a good plumber explains it to a friend.</p>
          </div>
          <div className={styles.topicGrid}>
            {allTopics().map((topic) => (
              <Link className={styles.topicCard} data-reveal key={topic.key} href={topicPath(topic.key)}>
                <div className={styles.topicImage}>
                  <Image fill sizes="(max-width: 760px) 100vw, (max-width: 1080px) 50vw, 33vw" src={assetPath(topic.hero)} alt="" />
                  <span className={styles.countBadge}>{topic.questions.length} questions</span>
                </div>
                <div className={styles.topicBody}>
                  <h3>{topic.name}</h3>
                  <p>{topic.blurb}</p>
                  <span className={styles.linkArrow}>All {topic.questions.length} questions →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <CtaBand />
    </FaqShell>
  );
}

export function CtaBand({ cta }: { cta?: FaqCta }) {
  const copy = cta || {
    h: "Question turning into a problem?",
    p: "Skip the guesswork: get a licensed Austin plumber on it today, with an upfront price before any work begins.",
    btn: "Schedule Now",
    href: "/book?open=1",
  };
  return (
    <section className={styles.cta}>
      <div className={styles.ctaInner} data-reveal>
        <span className={styles.ctaBadge}>10% off your first service</span>
        <h2>{copy.h}</h2>
        <p>{copy.p}</p>
        <div className={styles.pills}>
          <Link className={`${styles.primaryButton} ic-cta`} href={copy.href.replace("https://ironcladtexas.com", "")}><span className="ic-sheen" aria-hidden="true" />{copy.btn} →</Link>
          <a className={styles.lightButton} href={PHONE_TEL}><Phone className={styles.ctaPhoneIcon} aria-hidden="true" />Call {PHONE_DISPLAY}</a>
        </div>
      </div>
    </section>
  );
}
