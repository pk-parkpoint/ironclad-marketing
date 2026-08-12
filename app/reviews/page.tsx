import Image from "next/image";
import Link from "next/link";
import { StructuredData } from "@/components/seo/structured-data";
import { PUBLISHED_REVIEW_SUMMARY, REVIEWS, type ReviewEntry } from "@/content/reviews";
import { getPublicContactInfo } from "@/lib/contact";
import { buildPageMetadata } from "@/lib/seo";
import {
  buildLocalBusinessSchema,
  buildOrganizationSchema,
  buildSchemaStack,
  buildWebSiteSchema,
} from "@/lib/structured-data";
import { ReviewsFooter, ReviewsHeader } from "./reviews-chrome";
import { getOrderedSliderReviews, type WallReview, wallReviews } from "./reviews-page-data";
import styles from "./reviews-page.module.css";

export const metadata = buildPageMetadata({
  title: "Customer Reviews | Ironclad Plumbing Austin",
  description:
    "Read customer feedback from Austin homeowners and see why Ironclad is trusted for fast response, fair pricing, and plumbing work done right.",
  path: "/reviews",
});

const orderedSliderReviews = getOrderedSliderReviews(REVIEWS);

function GoogleG({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 48 48">
      <path d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z" fill="var(--color-google-blue)" />
      <path d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z" fill="var(--color-google-green)" />
      <path d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34A21.99 21.99 0 0 0 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z" fill="var(--color-google-yellow)" />
      <path d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z" fill="var(--color-google-red)" />
    </svg>
  );
}

function StarRow({ compact = false, label = "5 out of 5 stars" }: { compact?: boolean; label?: string }) {
  return (
    <span className={compact ? styles.starsCompact : styles.stars} role="img" aria-label={label}>
      {Array.from({ length: 5 }).map((_, index) => (
        <svg aria-hidden="true" key={index} viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </span>
  );
}

function PhoneIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.86.31 1.7.57 2.5a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.58-1.14a2 2 0 0 1 2.11-.45c.8.26 1.64.45 2.5.57a2 2 0 0 1 1.72 2.03Z" />
    </svg>
  );
}

function SliderCard({ review, index }: { review: ReviewEntry; index: number }) {
  const avatarClass = [styles.avatarGreen, styles.avatarBlue, styles.avatarOrange, styles.avatarGold, styles.avatarPurple][index % 5];
  return (
    <article className={styles.sliderCard}>
      <div className={styles.cardHeader}>
        <div className={styles.reviewer}>
          <span className={`${styles.sliderAvatar} ${avatarClass}`}>{review.initial}</span>
          <span>
            <strong>{review.reviewerName}</strong>
            <small>{review.timeAgo}</small>
          </span>
        </div>
        <GoogleG className={styles.googleCardIcon} />
      </div>
      <StarRow />
      <p>{review.text}</p>
    </article>
  );
}

function WallCard({ review }: { review: WallReview }) {
  return (
    <article className={styles.wallCard} data-wall-review={review.id}>
      <div className={styles.wallCardHeader}>
        <div className={styles.reviewer}>
          <span className={`${styles.wallAvatar} ${styles[review.avatarClassKey]}`}>{review.initial}</span>
          <span>
            <strong>{review.reviewerName}</strong>
            <small>{review.timeAgo}</small>
          </span>
        </div>
        <StarRow compact />
      </div>
      <p>{review.text}</p>
    </article>
  );
}

export default function ReviewsPage() {
  const schemas = buildSchemaStack(
    buildWebSiteSchema(),
    buildOrganizationSchema(),
    buildLocalBusinessSchema("/reviews"),
  );
  const { phoneDisplay, phoneHref } = getPublicContactInfo();

  return (
    <div className={`${styles.root} reviews-page-root dc-root`}>
      <ReviewsHeader />
      <StructuredData data={schemas} id="ld-reviews-page" />
      <main className={styles.page}>
        <section className={styles.hero}>
          <Image alt="The Ironclad Plumbing team beside their service truck in Austin" className={styles.heroPhoto} fetchPriority="high" fill priority quality={84} src="/media/reviews/ironclad-team-2026-08-12.webp" sizes="100vw" />
          <div className={styles.heroScrim} />
          <div className={styles.heroGlow} />
          <div className={styles.heroInner}>
            <div className={styles.ratingBadge}>
              <span className={styles.badgeStars}><StarRow label={`${PUBLISHED_REVIEW_SUMMARY.ratingValue} out of 5 stars`} /></span>
              <span className={styles.badgeFull}>{PUBLISHED_REVIEW_SUMMARY.ratingValue} out of 5 · {PUBLISHED_REVIEW_SUMMARY.reviewCount} reviews across Google, Yelp, and Nextdoor</span>
              <span className={styles.badgeShort}>{PUBLISHED_REVIEW_SUMMARY.ratingValue} · {PUBLISHED_REVIEW_SUMMARY.reviewCount} reviews</span>
            </div>
            <h1>Water You Waiting For?<br /><span>Leak No Further.</span></h1>
            <p>We&apos;re locally owned and operated. Read what more than 100 Austin homeowners say about the Ironclad team.</p>
            <div className={styles.heroActions}>
              <a className={`${styles.button} ${styles.callButton} ${styles.heroButton}`} href={phoneHref}><PhoneIcon />{phoneDisplay}</a>
              <Link className={`${styles.button} ${styles.photoButton} ${styles.heroButton}`} href="/book">Schedule Now</Link>
            </div>
          </div>
        </section>

        <section className={styles.ratingSummary}>
          <div className={styles.ratingSummaryInner}>
            <div className={styles.scoreBlock}>
              <div className={styles.scoreRow}>
                <span className={styles.score}>{PUBLISHED_REVIEW_SUMMARY.ratingValue}</span>
                <span className={styles.scoreMeta}><StarRow label={`${PUBLISHED_REVIEW_SUMMARY.ratingValue} out of 5 stars`} /><span>Based on {PUBLISHED_REVIEW_SUMMARY.reviewCount} published reviews across Google, Yelp, and Nextdoor</span></span>
              </div>
              <p>The excerpts below are from Google; the published total combines Google, Yelp, and Nextdoor.</p>
            </div>
          </div>
        </section>

        <section className={styles.reviewsSection} id="reviews">
          <div className={styles.reviewsInner}>
            <div className={styles.sectionHead}>
              <p>{PUBLISHED_REVIEW_SUMMARY.reviewCount} PUBLISHED REVIEWS</p>
              <h2>What Our Customers Are Saying</h2>
            </div>
            <div className={styles.sliderWrap}>
              <button aria-label="Previous reviews" className={`${styles.sliderArrow} ${styles.sliderArrowPrev}`} type="button">‹</button>
              <button aria-label="Next reviews" className={`${styles.sliderArrow} ${styles.sliderArrowNext}`} type="button">›</button>
              <div className={styles.reviewTrack}>{orderedSliderReviews.map((review, index) => <SliderCard key={review.id} review={review} index={index} />)}</div>
            </div>
            <div className={styles.reviewFooter}>
              <Link className={`${styles.button} ${styles.inkButton}`} href="/book">Book your service <span>→</span></Link>
              <span className={styles.googleAllLink}><GoogleG className={styles.googleLinkIcon} />Google review excerpts; {PUBLISHED_REVIEW_SUMMARY.reviewCount} reviews across all published sources</span>
            </div>
          </div>
        </section>

        <section className={styles.bookingBand}>
          <div className={styles.bookingBandInner}>
            <div>
              <h2>Ready to join them?</h2>
              <p>Book online in 60 seconds or call our 24/7 emergency line across Austin.</p>
            </div>
            <div className={styles.bandActions}>
              <a className={`${styles.button} ${styles.callButton} ${styles.bandButton}`} href={phoneHref}><PhoneIcon />{phoneDisplay}</a>
              <Link className={`${styles.button} ${styles.whiteButton}`} href="/book">Schedule Now</Link>
            </div>
          </div>
        </section>

        <section className={styles.reviewWall}>
          <div className={styles.wallInner}>
            <div className={styles.wallHead}>
              <h2>More Reviews From Around Austin</h2>
              <p>Real jobs, real neighbors, real results.</p>
            </div>
            <div className={styles.wallGrid}>{wallReviews.map((review) => <WallCard key={review.id} review={review} />)}</div>
          </div>
        </section>

        <section className={styles.finalCta}>
          <div className={styles.finalCtaInner}>
            <span className={styles.offerBadge}>10% off your first service</span>
            <h2>Water You Waiting For?</h2>
            <p>Join Austin homeowners who choose Ironclad. Book today.</p>
            <div className={styles.finalActions}>
              <Link className={`${styles.button} ${styles.scheduleButton}`} href="/book">Schedule Now</Link>
              <a className={`${styles.button} ${styles.whiteBorderButton}`} href={phoneHref}><PhoneIcon />Call {phoneDisplay}</a>
            </div>
          </div>
        </section>

      </main>
      <ReviewsFooter />
      <div className={styles.stickyCta}>
        <a className={`${styles.button} ${styles.callButton}`} href={phoneHref}><PhoneIcon />{phoneDisplay}</a>
        <Link className={`${styles.button} ${styles.scheduleButton}`} href="/book">Schedule Now</Link>
      </div>
    </div>
  );
}
