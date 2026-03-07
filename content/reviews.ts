export type ReviewEntry = {
  id: string;
  reviewerName: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  quote: string;
  date: string;
  source: "google";
  timeAgo: string;
  initial: string;
  avatarColor: string;
};

export const REVIEWS: ReviewEntry[] = [
  {
    id: "review-austin-john-d",
    reviewerName: "John D.",
    name: "John D.",
    location: "East Austin",
    rating: 5,
    text: "Called them for a leak under our kitchen sink. They showed up same day, found the problem fast, and had it fixed in under an hour. Price was exactly what they quoted. Will definitely use again.",
    quote:
      "Called them for a leak under our kitchen sink. They showed up same day, found the problem fast, and had it fixed in under an hour. Price was exactly what they quoted. Will definitely use again.",
    date: "2025-12-15",
    source: "google",
    timeAgo: "2 months ago",
    initial: "J",
    avatarColor: "#4285F4",
  },
  {
    id: "review-austin-sarah-m",
    reviewerName: "Sarah M.",
    name: "Sarah M.",
    location: "South Austin",
    rating: 5,
    text: "Our water heater died on a Sunday night. They answered the phone and had someone out Monday morning first thing. New tankless unit installed by lunch. These guys are the real deal.",
    quote:
      "Our water heater died on a Sunday night. They answered the phone and had someone out Monday morning first thing. New tankless unit installed by lunch. These guys are the real deal.",
    date: "2025-11-20",
    source: "google",
    timeAgo: "3 months ago",
    initial: "S",
    avatarColor: "#EA4335",
  },
  {
    id: "review-round-rock-mike-r",
    reviewerName: "Mike R.",
    name: "Mike R.",
    location: "Round Rock",
    rating: 5,
    text: "Had three other plumbers tell me I needed to dig up my yard for a sewer line issue. Ironclad did a camera inspection and fixed it with trenchless repair. Saved me thousands.",
    quote:
      "Had three other plumbers tell me I needed to dig up my yard for a sewer line issue. Ironclad did a camera inspection and fixed it with trenchless repair. Saved me thousands.",
    date: "2026-01-10",
    source: "google",
    timeAgo: "1 month ago",
    initial: "M",
    avatarColor: "#34A853",
  },
  {
    id: "review-cedar-park-lisa-k",
    reviewerName: "Lisa K.",
    name: "Lisa K.",
    location: "Cedar Park",
    rating: 5,
    text: "Finally a plumber who shows up on time and doesn't try to upsell you on things you don't need. Straightforward, fair pricing. Replaced two faucets and a garbage disposal.",
    quote:
      "Finally a plumber who shows up on time and doesn't try to upsell you on things you don't need. Straightforward, fair pricing. Replaced two faucets and a garbage disposal.",
    date: "2026-02-01",
    source: "google",
    timeAgo: "2 weeks ago",
    initial: "L",
    avatarColor: "#FBBC04",
  },
  {
    id: "review-round-rock-david-r",
    reviewerName: "David R.",
    name: "David R.",
    location: "Round Rock",
    rating: 5,
    text: "Fast scheduling, fair pricing, and the new water heater has been flawless. The tech explained all our options and never pushed the expensive route. Refreshing experience.",
    quote:
      "Fast scheduling, fair pricing, and the new water heater has been flawless. The tech explained all our options and never pushed the expensive route. Refreshing experience.",
    date: "2026-01-11",
    source: "google",
    timeAgo: "1 month ago",
    initial: "D",
    avatarColor: "#4285F4",
  },
  {
    id: "review-cedar-park-lena-t",
    reviewerName: "Lena T.",
    name: "Lena T.",
    location: "Cedar Park",
    rating: 5,
    text: "They diagnosed the real cause, not just the symptom. No more recurring clogs. The technician took the time to show us camera footage of the issue before recommending a fix.",
    quote:
      "They diagnosed the real cause, not just the symptom. No more recurring clogs. The technician took the time to show us camera footage of the issue before recommending a fix.",
    date: "2026-01-12",
    source: "google",
    timeAgo: "1 month ago",
    initial: "L",
    avatarColor: "#EA4335",
  },
  {
    id: "review-georgetown-marcus-l",
    reviewerName: "Marcus L.",
    name: "Marcus L.",
    location: "Georgetown",
    rating: 5,
    text: "Professional team, clear estimate, and they respected our schedule. They even laid down drop cloths and cleaned up everything when they were done. Top-notch service.",
    quote:
      "Professional team, clear estimate, and they respected our schedule. They even laid down drop cloths and cleaned up everything when they were done. Top-notch service.",
    date: "2026-01-13",
    source: "google",
    timeAgo: "1 month ago",
    initial: "M",
    avatarColor: "#34A853",
  },
  {
    id: "review-lakeway-priya-s",
    reviewerName: "Priya S.",
    name: "Priya S.",
    location: "Lakeway",
    rating: 5,
    text: "The fixture install was clean and precise. Great communication from booking to completion. They sent a text when the technician was on the way and arrived right on time.",
    quote:
      "The fixture install was clean and precise. Great communication from booking to completion. They sent a text when the technician was on the way and arrived right on time.",
    date: "2026-01-14",
    source: "google",
    timeAgo: "1 month ago",
    initial: "P",
    avatarColor: "#FBBC04",
  },
  {
    id: "review-buda-carlos-v",
    reviewerName: "Carlos V.",
    name: "Carlos V.",
    location: "Buda",
    rating: 5,
    text: "Camera inspection was thorough and saved us from an unnecessary full replacement. Honest assessment and fair price. Would recommend Ironclad to anyone in the Austin area.",
    quote:
      "Camera inspection was thorough and saved us from an unnecessary full replacement. Honest assessment and fair price. Would recommend Ironclad to anyone in the Austin area.",
    date: "2026-01-15",
    source: "google",
    timeAgo: "4 weeks ago",
    initial: "C",
    avatarColor: "#4285F4",
  },
  {
    id: "review-liberty-hill-amy-k",
    reviewerName: "Amy K.",
    name: "Amy K.",
    location: "Liberty Hill",
    rating: 5,
    text: "They tested our water and recommended a setup that actually matched our home and usage. No cookie-cutter solutions. The whole-house filtration system has made a huge difference.",
    quote:
      "They tested our water and recommended a setup that actually matched our home and usage. No cookie-cutter solutions. The whole-house filtration system has made a huge difference.",
    date: "2026-01-16",
    source: "google",
    timeAgo: "4 weeks ago",
    initial: "A",
    avatarColor: "#EA4335",
  },
  {
    id: "review-spicewood-jordan-p",
    reviewerName: "Jordan P.",
    name: "Jordan P.",
    location: "Spicewood",
    rating: 5,
    text: "Conversion to tankless was smooth. The team walked us through everything before leaving. Energy bill is already lower and we never run out of hot water anymore.",
    quote:
      "Conversion to tankless was smooth. The team walked us through everything before leaving. Energy bill is already lower and we never run out of hot water anymore.",
    date: "2026-01-17",
    source: "google",
    timeAgo: "3 weeks ago",
    initial: "J",
    avatarColor: "#34A853",
  },
  {
    id: "review-pflugerville-rachel-w",
    reviewerName: "Rachel W.",
    name: "Rachel W.",
    location: "Pflugerville",
    rating: 5,
    text: "Emergency call on a holiday weekend and they still showed up within two hours. Fixed a burst pipe in our garage before any real damage happened. Can't thank them enough.",
    quote:
      "Emergency call on a holiday weekend and they still showed up within two hours. Fixed a burst pipe in our garage before any real damage happened. Can't thank them enough.",
    date: "2026-02-05",
    source: "google",
    timeAgo: "1 week ago",
    initial: "R",
    avatarColor: "#FBBC04",
  },
];

export const FEATURED_REVIEWS: ReviewEntry[] = REVIEWS;
