import type { SitelinkSpec } from "./types";

export const SITE_ORIGIN = "https://ironcladtexas.com";
export const LICENSE_DESCRIPTION =
  "Local, family-owned Austin plumbers. Licensed, insured and available 24/7.";

export const STANDARD_PROMOTION_HEADLINE = "Up to $100 Off Plumbing";
export const STANDARD_PROMOTION_DESCRIPTION =
  "New customers save up to $100 on plumbing services. Call Ironclad today.";
export const STANDARD_AVAILABILITY_DESCRIPTION =
  "Our plumbing team is available 24/7, including nights and weekends.";

export const STANDARD_HEADLINES = [
  "Austin Plumbing Experts",
  "Available 24/7",
  "Nights & Weekends",
  "Locally & Family Owned",
  "We Explain Your Options",
  "Fast Appointments",
  "Licensed & Insured Plumbers",
  "Book Online",
  "Call Ironclad Plumbing",
];

export function standardDescriptions(expertise: string, promotion = STANDARD_PROMOTION_DESCRIPTION): string[] {
  return [LICENSE_DESCRIPTION, expertise, STANDARD_AVAILABILITY_DESCRIPTION, promotion];
}

export const TARGET_CITIES = [
  "Austin",
  "Round Rock",
  "Pflugerville",
  "Cedar Park",
  "Leander",
  "Georgetown",
  "West Lake Hills",
  "Rollingwood",
  "Bee Cave",
  "Lakeway",
  "Sunset Valley",
  "Buda",
  "Kyle",
  "San Marcos",
  "Manor",
  "Del Valle",
  "Hutto",
  "Brushy Creek",
  "Wells Branch",
] as const;

export const SHARED_NEGATIVES = [
  "jobs", "hiring", "salary", "careers", "apprentice", "apprenticeship",
  "school", "course", "certification", "license exam", "training",
  "how to", "diy", "yourself", "tutorial", "youtube", "step by step",
  "manual", "manual pdf", "diagram", "error code", "plumbing code", "forum", "reddit",
  "home depot", "lowes", "amazon", "for sale", "menards",
  "parts", "replacement parts", "plumbing supply", "supply store", "wholesale", "warranty phone number",
  "water bill", "water utility", "city of austin utilities",
  "porta potty", "portable toilet", "rv", "camper", "boat", "trailer",
  "home warranty", "american home shield", "choice home warranty", "handyman",
] as const;

export const RESIDENTIAL_NEGATIVES = [
  "commercial", "construction", "new construction", "restaurant", "apartment complex",
] as const;

export const SITELINKS: SitelinkSpec[] = [
  {
    text: "Book Online",
    description1: "Pick your appointment window.",
    description2: "Same-day slots often available.",
    finalUrl: `${SITE_ORIGIN}/book-online`,
  },
  {
    text: "Emergency Plumbing",
    description1: "Burst pipes, backups, major leaks.",
    description2: "Call for a live arrival window.",
    finalUrl: `${SITE_ORIGIN}/emergency-plumbing`,
  },
  {
    text: "Water Heaters",
    description1: "Repair, replacement, tankless.",
    description2: "Gas and electric options.",
    finalUrl: `${SITE_ORIGIN}/water-heaters`,
  },
  {
    text: "Drain Cleaning",
    description1: "Clogs, slow drains, main lines.",
    description2: "Camera inspection available.",
    finalUrl: `${SITE_ORIGIN}/drain-cleaning`,
  },
  {
    text: "Leak Detection",
    description1: "Slab leaks and hidden leaks.",
    description2: "Found before we cut anything.",
    finalUrl: `${SITE_ORIGIN}/leak-detection`,
  },
  {
    text: "Service Area",
    description1: "Austin, Round Rock, Cedar Park.",
    description2: "Buda, Kyle, San Marcos and more.",
    finalUrl: `${SITE_ORIGIN}/service-area/austin-tx`,
  },
];

export const CALLOUTS = [
  "Fast Appointments",
  "24/7 Availability",
  "Nights & Weekends",
  "Locally Owned",
  "Family Owned",
  "Austin Plumbing Experts",
  "Options for Your Home",
  "New Customer Savings",
] as const;

export const STRUCTURED_SNIPPET_VALUES = [
  "Water Heaters",
  "Drain Cleaning",
  "Leak Detection",
  "Sewer Lines",
  "Gas Lines",
  "Repiping",
  "Emergency Plumbing",
] as const;
