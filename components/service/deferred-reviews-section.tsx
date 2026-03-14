"use client";

import dynamic from "next/dynamic";
import { ReviewsSectionFallback } from "@/components/service/reviews-section-fallback";

const ReviewsSection = dynamic(
  () => import("@/components/service/review-carousel").then((module) => module.ReviewsSection),
  {
    ssr: false,
    loading: () => <ReviewsSectionFallback />,
  },
);

export function DeferredReviewsSection() {
  return <ReviewsSection />;
}
