import type { SitelinkSpec } from "./types";

export const SITE_ORIGIN = "https://ironcladtexas.com";
export const LICENSE_DESCRIPTION =
  "Licensed & insured Austin plumbers. RMP #39871. You approve the price before we start.";

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
    description2: "Call now for same-day dispatch.",
    finalUrl: `${SITE_ORIGIN}/emergency-plumbing`,
  },
  {
    text: "Water Heaters",
    description1: "Repair, replacement, tankless.",
    description2: "Gas and electric. Same-day.",
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
  "Same-Day Service",
  "Licensed & Insured",
  "Locally Owned",
  "5-Star Rated on Google",
  "Price Approved First",
  "Free Online Booking",
  "Camera Inspection",
  "Financing Available",
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
