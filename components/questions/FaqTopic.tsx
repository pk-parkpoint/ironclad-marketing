import Link from "next/link";
import Image from "next/image";
import { List } from "lucide-react";

import styles from "./FaqCluster.module.css";
import { CtaBand } from "./FaqHub";
import FaqShell, { RelatedTopics } from "./FaqShell";
import {
  assetPath,
  featuredPostForQuestion,
  formatNumber,
  postPath,
  type FaqQuestion,
  type FaqTopic as FaqTopicData,
} from "./question-data";

export default function FaqTopic({ topic }: { topic: FaqTopicData }) {
  return (
    <FaqShell>
      <section className={styles.imageHero}>
        <Image fill priority sizes="100vw" src={assetPath(topic.hero)} alt="" />
        <div className={styles.topicHeroInner}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/questions/">Plumbing FAQ</Link><span>/</span><span>{topic.name}</span>
          </nav>
          <h1>{topic.name}: every question, answered</h1>
          <p className={styles.topicSub}>{topic.blurb}</p>
          <div className={styles.topicMeta}>
            <span className={styles.metaPill}>{topic.questions.length} questions</span>
            <span className={styles.metaPill}>Updated July 2026</span>
          </div>
        </div>
      </section>
      <section className={styles.index}>
        <div className={styles.indexInner}>
          <div className={styles.sectionKicker}>
            <List className={styles.sectionKickerIcon} aria-hidden="true" />
            On this page
          </div>
          <div className={styles.indexGrid}>
            {topic.questions.map((question) => (
              <Link className={styles.indexLink} key={question.n} href={`#q-${question.n}`}>
                <span className={styles.num}>{formatNumber(question.n)}</span>
                <span>{question.q}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className={styles.qaList}>
        <div className={styles.qaInner}>
          {topic.questions.map((question) => (
            <QuestionArticle key={question.n} question={question} />
          ))}
        </div>
      </section>
      <CtaBand cta={topic.cta} />
      <RelatedTopics currentKey={topic.key} />
    </FaqShell>
  );
}

function QuestionArticle({ question }: { question: FaqQuestion }) {
  const post = featuredPostForQuestion(question.n);
  return (
    <article className={styles.qaArticle} id={`q-${question.n}`}>
      <div className={styles.qaNumber}>{formatNumber(question.n)}</div>
      <div>
        <h2>{question.q}</h2>
        <div className={styles.quickBlock}>
          <strong>Quick answer</strong>
          <p>{question.quick}</p>
        </div>
        <p className={styles.nextStep}><strong>What to do next: </strong>{question.next}</p>
        {post ? (
          <Link className={styles.linkArrow} href={postPath(post)}>Read the full guide →</Link>
        ) : null}
      </div>
    </article>
  );
}
