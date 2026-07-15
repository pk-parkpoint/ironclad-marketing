import Link from "next/link";
import { StarRating } from "./service-template-parts";

const DEFAULT_RATING_LABEL = "4.9/5 · 142 reviews on Google, Yelp, & Nextdoor";

export function HeroMetaBadge({
  eyebrow,
  ratingLabel = DEFAULT_RATING_LABEL,
}: {
  eyebrow: string;
  ratingLabel?: string;
}) {
  return (
    <Link aria-label={`${eyebrow}. ${ratingLabel}`} className="dc-hero-meta-badge" href="/reviews">
      <span className="dc-hero-meta-keyword">{eyebrow}</span>
      <span aria-hidden="true" className="dc-hero-meta-divider" />
      <span className="dc-hero-meta-rating">
        <StarRating label="4.9 out of 5 stars" variant="google" />
        <span>{ratingLabel}</span>
      </span>
    </Link>
  );
}
