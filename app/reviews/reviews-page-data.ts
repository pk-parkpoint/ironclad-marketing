import type { ReviewEntry } from "@/content/reviews";

export type AvatarClassKey = "avatarGreen" | "avatarBlue" | "avatarOrange" | "avatarGold" | "avatarPurple";

export type WallReview = Pick<ReviewEntry, "id" | "reviewerName" | "timeAgo" | "text" | "initial"> & {
  avatarClassKey: AvatarClassKey;
};

export function getOrderedSliderReviews(reviews: ReviewEntry[]): ReviewEntry[] {
  return [
    reviews.find((review) => review.id === "review-round-rock-mike-r"),
    reviews.find((review) => review.id === "review-austin-john-d"),
    reviews.find((review) => review.id === "review-austin-sarah-m"),
    ...reviews.slice(0, 8),
  ]
    .filter((review, index, all): review is ReviewEntry => Boolean(review) && all.indexOf(review) === index)
    .map((review) => ({ ...review, text: sliderTextOverrides[review.id] ?? review.text }));
}

const sliderTextOverrides: Record<string, string> = {
  "review-round-rock-mike-r":
    "Had three other plumbers tell me I needed to dig up my yard for a sewer line issue. Ironclad did a camera inspection and fixed it with trenchless repair. Saved me thousands and a torn-up lawn.",
  "review-austin-john-d":
    "Called them for a leak under our kitchen sink. They showed up same day, found the problem fast, and had it fixed in under an hour. Price was exactly what they quoted, no surprises.",
  "review-austin-sarah-m":
    "Our water heater died on a Sunday night. They answered the phone and had someone out Monday morning first thing. New tankless unit installed and running by noon. Lifesavers.",
  "review-cedar-park-lisa-k":
    "Finally a plumber who shows up on time and doesn't try to upsell you on things you don't need. Straightforward, fair pricing, and genuinely friendly. Highly recommend.",
};

export const wallReviews: WallReview[] = [
  {
    id: "wall-brian-h",
    reviewerName: "Brian H.",
    timeAgo: "3 weeks ago",
    text: "Fast, fair, and honest. Fixed a running toilet and a slow drain in the same visit and didn't pad the bill. This is our plumber from now on.",
    initial: "B",
    avatarClassKey: "avatarBlue",
  },
  {
    id: "wall-grace-l",
    reviewerName: "Grace L.",
    timeAgo: "4 days ago",
    text: "Booked online, got a text confirmation, and they showed up in the window. Sounds simple but so many companies get it wrong. Ironclad nailed it.",
    initial: "G",
    avatarClassKey: "avatarPurple",
  },
  {
    id: "wall-nicole-f",
    reviewerName: "Nicole F.",
    timeAgo: "1 month ago",
    text: "They found a hidden slab leak that two other companies missed. The whole team was patient answering my questions. Rare to find this level of care.",
    initial: "N",
    avatarClassKey: "avatarGreen",
  },
  {
    id: "wall-tom-s",
    reviewerName: "Tom S.",
    timeAgo: "2 months ago",
    text: "Emergency shutoff valve burst at midnight. Real person answered, walked me through stopping the water, and had a tech out first thing. Absolute pros.",
    initial: "T",
    avatarClassKey: "avatarGold",
  },
  {
    id: "wall-carlos-m",
    reviewerName: "Carlos M.",
    timeAgo: "5 weeks ago",
    text: "Water pressure had been terrible for years. They diagnosed a failing regulator in ten minutes and swapped it out. Feels like a brand new house.",
    initial: "C",
    avatarClassKey: "avatarOrange",
  },
  {
    id: "wall-priya-n",
    reviewerName: "Priya N.",
    timeAgo: "1 month ago",
    text: "Upfront pricing meant zero surprises. The invoice matched the quote to the dollar. Refreshing to work with a company that does what it says.",
    initial: "P",
    avatarClassKey: "avatarBlue",
  },
  {
    id: "wall-wesley-b",
    reviewerName: "Wesley B.",
    timeAgo: "2 weeks ago",
    text: "Garbage disposal died mid dinner party. They squeezed me in the next morning and had a new one in fast. Friendly and quick, saved the weekend.",
    initial: "W",
    avatarClassKey: "avatarGreen",
  },
  {
    id: "wall-hannah-j",
    reviewerName: "Hannah J.",
    timeAgo: "6 weeks ago",
    text: "The technician put on shoe covers, laid down a mat, and cleaned up completely. You'd never know anyone was here except the drain finally works.",
    initial: "H",
    avatarClassKey: "avatarGold",
  },
  {
    id: "wall-frank-o",
    reviewerName: "Frank O.",
    timeAgo: "2 months ago",
    text: "I've used a lot of plumbers over 20 years in this house. Ironclad is the first one I've actually wanted to refer to my neighbors. That says it all.",
    initial: "F",
    avatarClassKey: "avatarPurple",
  },
];
