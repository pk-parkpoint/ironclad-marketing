import { REVIEWS } from "@/content/reviews";

export type TestimonialEntry = {
  reviewerDisplayName: string;
  city: string;
  serviceType: string;
  reviewSource: "google";
  reviewDate: string;
  excerpt: string;
  rating: number;
  featured: boolean;
  sourceUrl?: string;
};

export const TESTIMONIALS: TestimonialEntry[] = REVIEWS.map((review, index) => ({
  reviewerDisplayName: review.reviewerName,
  city: review.location,
  serviceType: index % 3 === 0 ? "Repairs" : index % 3 === 1 ? "Drain Cleaning" : "Water Heaters",
  reviewSource: "google",
  reviewDate: review.date,
  excerpt: review.text,
  rating: review.rating,
  featured: index < 6,
  sourceUrl: undefined,
}));

export const FEATURED_TESTIMONIALS = TESTIMONIALS.filter((entry) => entry.featured);
