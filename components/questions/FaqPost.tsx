import Link from "next/link";
import Image from "next/image";
import { Zap } from "lucide-react";

import styles from "./FaqCluster.module.css";
import { CtaBand } from "./FaqHub";
import FaqShell from "./FaqShell";
import {
  assetPath,
  formatNumber,
  nearestQuestions,
  topicPath,
  type FaqContentBlock,
  type FaqPost as FaqPostData,
  type FaqTopic,
} from "./question-data";

export default function FaqPost({ topic, post }: { topic: FaqTopic; post: FaqPostData }) {
  const stepsFirst = post.key === "burst-pipe" || post.key === "smell-gas";
  return (
    <FaqShell>
      <section className={`${styles.imageHero} ${styles.postImageHero}`}>
        <Image fill priority sizes="100vw" src={assetPath(post.hero)} alt="" />
        <div className={styles.postHeroInner}>
          <div className={styles.crumbBadge}>
            <Link href="/questions/">Plumbing FAQ</Link><span className={styles.dot} /><Link href={topicPath(topic.key)}>{topic.name}</Link>
          </div>
          <h1>{post.title}</h1>
          <p className={styles.postSub}>{post.sub}</p>
          <div className={styles.byline}>
            <div className={styles.avatar}>A</div>
            <div><div className={styles.bylineName}>By Auggie A.</div><div className={styles.bylineMeta}>Updated July 2026 · {post.read}</div></div>
          </div>
        </div>
      </section>
      <div className={styles.quickCardWrap}>
        <div className={styles.quickCard}>
          <div className={styles.quickCardLabel}>
            <Zap className={styles.quickCardIcon} aria-hidden="true" />
            <strong>Quick answer</strong>
          </div>
          <p>{post.quick}</p>
        </div>
      </div>
      <article className={styles.article}>
        {post.list ? <ListBlock list={post.list} /> : null}
        {stepsFirst && post.steps ? <StepsBlock steps={post.steps} /> : null}
        {post.sections.map((section) => (
          <section className={styles.articleSection} key={section.h}>
            <h2>{section.h}</h2>
            {section.ps.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </section>
        ))}
        {!stepsFirst && post.steps ? <StepsBlock steps={post.steps} /> : null}
        <blockquote className={styles.quote}>“{post.quote}”</blockquote>
        <section>
          <h2>The bottom line</h2>
          <p>{post.bottom}</p>
        </section>
      </article>
      <MoreQuestions topic={topic} post={post} />
      <CtaBand cta={post.cta} />
    </FaqShell>
  );
}

function StepsBlock({ steps }: { steps: FaqContentBlock }) {
  return (
    <section className={styles.stepsBlock}>
      <h2>{steps.h}</h2>
      <p>{steps.intro}</p>
      <div className={styles.stepGrid}>
        {steps.items.map((item, index) => (
          <div className={styles.stepCard} key={item.t}>
            <span className={styles.stepNum}>{index + 1}</span>
            <div><h3>{item.t}</h3><p>{item.d}</p></div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ListBlock({ list }: { list: FaqContentBlock }) {
  return (
    <section className={styles.listBlock}>
      <h2>{list.h}</h2>
      <p>{list.intro}</p>
      <div className={styles.listItems}>
        {list.items.map((item, index) => (
          <div className={styles.listItem} key={item.t}>
            <span className={styles.listNum}>{formatNumber(index + 1)}</span>
            <div><h3>{item.t}</h3><p>{item.d}</p></div>
          </div>
        ))}
      </div>
    </section>
  );
}

function MoreQuestions({ topic, post }: { topic: FaqTopic; post: FaqPostData }) {
  return (
    <section className={styles.postRelated}>
      <div className={styles.postRelatedInner}>
        <h2>More {topic.name} questions</h2>
        {nearestQuestions(topic, post.n).map((question) => (
          <Link className={styles.relatedRow} key={question.n} href={`${topicPath(topic.key)}#q-${question.n}`}>
            <span className={styles.num}>{formatNumber(question.n)}</span>
            <span>{question.q}</span>
            <span aria-hidden="true">→</span>
          </Link>
        ))}
        <Link className={styles.linkArrow} href={topicPath(topic.key)}>All {topic.name} questions →</Link>
      </div>
    </section>
  );
}
