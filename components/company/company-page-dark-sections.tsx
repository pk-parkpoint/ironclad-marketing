import { Star } from "lucide-react";
import Link from "next/link";
import type { CompanyPageConfig } from "./company-page-types";
import styles from "./company-page.module.css";

function formatNumber(index: number) {
  return String(index + 1).padStart(2, "0");
}

export function CompanyProcess({ config }: { config: CompanyPageConfig }) {
  return (
    <section className={styles.processSection} data-company-section="process">
      <div aria-hidden="true" className={styles.processGlow} />
      <div className={styles.processInner}>
        <div className={styles.darkHeading}>
          <p className={styles.darkEyebrow}>{config.processEyebrow}</p>
          <h2>{config.processHeading}</h2>
        </div>
        <div className={styles.processGrid}>
          {config.process.map((step, index) => (
            <article className={styles.processStep} key={step.title}>
              <span aria-hidden="true" className={styles.stepDot} />
              <span className={styles.processNumber}>{formatNumber(index)}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CompanyWhy({ config }: { config: CompanyPageConfig }) {
  return (
    <section className={styles.whySection} data-company-section="why">
      <div aria-hidden="true" className={styles.whyGlow} />
      <div className={styles.whyInner}>
        <div className={styles.whyGrid}>
          <div className={styles.whyHeading}>
            <p className={styles.darkEyebrow}>{config.whyEyebrow}</p>
            <h2>{config.whyHeading}</h2>
            <p>{config.whyLead}</p>
          </div>
          <div className={styles.whyList}>
            {config.whyItems.map((item, index) => (
              <article className={styles.whyItem} key={item.title}>
                <span>{formatNumber(index)}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.statsStrip}>
        <div><strong>4.9</strong><span>Google Rating</span></div>
        <div><strong>142</strong><span>Reviews</span></div>
        <div><strong>24/7</strong><span>Emergency Service</span></div>
      </div>
    </section>
  );
}

function ReviewStars() {
  return (
    <span aria-label="5 out of 5 stars" className={styles.reviewStars} role="img">
      {Array.from({ length: 5 }, (_, index) => (
        <Star aria-hidden="true" fill="currentColor" key={index} size={17} strokeWidth={0} />
      ))}
    </span>
  );
}

export function CompanyReviews({ config }: { config: CompanyPageConfig }) {
  if (!config.reviews || !config.reviewsHeading) return null;

  return (
    <section className={styles.reviewsSection} data-company-section="reviews">
      <div className={styles.reviewsHeading}>
        <div>
          <h2>{config.reviewsHeading}</h2>
          <p>4.9 / 5 · 142 Google reviews</p>
        </div>
        <Link href="/reviews" prefetch={false}>Read all reviews →</Link>
      </div>
      <div className={styles.reviewsGrid}>
        {config.reviews.map((review) => (
          <article className={styles.reviewCard} key={`${review.name}-${review.location}`}>
            <ReviewStars />
            <blockquote>{review.quote}</blockquote>
            <footer>
              <span>{review.initial}</span>
              <div><strong>{review.name}</strong><small>{review.location}</small></div>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}
