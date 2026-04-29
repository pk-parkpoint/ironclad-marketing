export type StaticPageEntry = {
  path: string;
  titleTag: string;
  metaDescription: string;
  h1: string;
  section: string;
};

export const STATIC_PAGES: StaticPageEntry[] = [
  {
    path: "plumbing",
    titleTag: "Plumbing Services in Austin, TX | Ironclad Plumbing",
    metaDescription:
      "Full-service plumbing in Greater Austin with clear pricing and workmanship guarantees.",
    h1: "Austin Plumbing Services - Every Job, One Standard",
    section: "Plumbing Hub",
  },
  {
    path: "service-area",
    titleTag: "Areas We Serve | Ironclad Plumbing - Greater Austin, TX",
    metaDescription:
      "Ironclad Plumbing serves Austin and surrounding communities including Round Rock, Georgetown, and Cedar Park.",
    h1: "Plumbing Service Across Greater Austin",
    section: "Service Areas",
  },
  {
    path: "reviews",
    titleTag: "Customer Reviews | Ironclad Plumbing - Austin, TX",
    metaDescription:
      "See what Austin homeowners say about Ironclad Plumbing and the work delivered in their homes.",
    h1: "What Our Customers Say",
    section: "Social Proof",
  },
  {
    path: "about",
    titleTag: "About Ironclad Plumbing | Austin Plumber With Integrity",
    metaDescription:
      "Ironclad Plumbing gives Austin homeowners published pricing guidance, clear questions to ask, written guarantees, and licensed plumbing service.",
    h1: "We Built the Plumbing Company We'd Want to Hire",
    section: "Company",
  },
  {
    path: "our-process",
    titleTag: "How We Work | Ironclad Plumbing - Austin, TX",
    metaDescription:
      "From booking to cleanup, see exactly what to expect when you hire Ironclad Plumbing.",
    h1: "Our Process - What to Expect, Start to Finish",
    section: "Trust",
  },
  {
    path: "why-choose-us",
    titleTag: "Why Choose Ironclad Plumbing | Austin, TX",
    metaDescription:
      "Upfront pricing, on-time windows, written warranties, and professional communication on every visit.",
    h1: "Why Homeowners Choose Ironclad",
    section: "Trust",
  },
  {
    path: "warranties",
    titleTag: "Our Warranty | Ironclad Plumbing - Austin, TX",
    metaDescription:
      "Every Ironclad job is backed by a written workmanship warranty with clear terms.",
    h1: "The Ironclad Warranty - Our Work, Guaranteed",
    section: "Trust",
  },
  {
    path: "financing",
    titleTag: "Plumbing Financing Options | Ironclad Plumbing - Austin, TX",
    metaDescription:
      "Flexible financing options for major plumbing repairs, replacements, and upgrades.",
    h1: "Flexible Financing for Major Plumbing Work",
    section: "Trust",
  },
  {
    path: "guarantees",
    titleTag: "The Ironclad Guarantees | Ironclad Plumbing - Austin, TX",
    metaDescription:
      "Read the six written guarantees Ironclad Plumbing makes to Austin homeowners before any residential plumbing job begins.",
    h1: "The Ironclad Guarantee - In Writing, Not in Marketing Speak",
    section: "Trust",
  },
  {
    path: "special-offers",
    titleTag: "Plumbing Deals & Offers | Ironclad Plumbing Austin, TX",
    metaDescription:
      "Current promotions and seasonal discounts for Ironclad Plumbing customers.",
    h1: "Current Offers & Seasonal Deals",
    section: "Trust",
  },
  {
    path: "book",
    titleTag: "Book a Plumber Online | Ironclad Plumbing - Austin, TX",
    metaDescription:
      "Schedule your plumbing appointment in under a minute and get confirmation fast.",
    h1: "Book Your Service",
    section: "Conversion",
  },
  {
    path: "contact",
    titleTag: "Contact Ironclad Plumbing | Austin, TX",
    metaDescription:
      "Reach Ironclad Plumbing by phone, text, or booking form. Office hours and service-area support included.",
    h1: "Get in Touch",
    section: "Conversion",
  },
  {
    path: "faq",
    titleTag: "Plumbing FAQ | Ironclad Plumbing - Austin, TX",
    metaDescription:
      "Answers to common Austin plumbing questions, from slab leaks to hard-water maintenance.",
    h1: "Frequently Asked Questions",
    section: "Education",
  },
  {
    path: "faq/plumbing",
    titleTag: "Plumbing Service FAQs | Ironclad Plumbing - Austin, TX",
    metaDescription:
      "Straight answers from licensed plumbers about pricing, scheduling, leaks, and water heaters.",
    h1: "Plumbing FAQs - Honest Answers from Licensed Pros",
    section: "Education",
  },
  {
    path: "blog",
    titleTag: "Blog | Ironclad Plumbing - Austin, TX",
    metaDescription:
      "Plumbing tips, Austin-specific guidance, and behind-the-scenes updates from the Ironclad team.",
    h1: "The Ironclad Blog",
    section: "Education",
  },
  {
    path: "careers",
    titleTag: "Plumbing Careers in Austin, TX | Ironclad Plumbing",
    metaDescription:
      "Join a team that values precision, professionalism, and long-term growth in Austin plumbing.",
    h1: "Build Your Career at Ironclad",
    section: "Company",
  },
  {
    path: "licenses",
    titleTag: "Licenses & Insurance | Ironclad Plumbing - Austin, TX",
    metaDescription:
      "Ironclad Plumbing licensing and insurance details for homeowner confidence and accountability.",
    h1: "Licensed, Insured, Accountable",
    section: "Company",
  },
  {
    path: "privacy-policy",
    titleTag: "Privacy Policy | Ironclad Plumbing",
    metaDescription:
      "How Ironclad Plumbing collects, uses, and protects your personal information.",
    h1: "Privacy Policy",
    section: "Legal",
  },
  {
    path: "terms",
    titleTag: "Terms of Service | Ironclad Plumbing",
    metaDescription:
      "Service terms and customer responsibilities for Ironclad Plumbing engagements.",
    h1: "Terms of Service",
    section: "Legal",
  },
];

export const STATIC_PAGE_BY_PATH = new Map(
  STATIC_PAGES.map((entry) => [entry.path, entry]),
);
