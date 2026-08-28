import type { SitelinkSpec } from "./types";

export const SITE_ORIGIN = "https://ironcladtexas.com";
export const LICENSE_DESCRIPTION =
  "Local, family-owned Austin plumbers. Licensed and insured.";

export const STANDARD_PROMOTION_HEADLINE = "Up to $100 Off Plumbing";
export const STANDARD_PROMOTION_DESCRIPTION =
  "New customers save up to $100 on plumbing services. Call Ironclad today.";
export const STANDARD_AVAILABILITY_HEADLINE = "Available 24/7";
export const STANDARD_OUTCOME_DESCRIPTION =
  "Know what needs fixing—and what can wait—before you decide.";
export const STANDARD_AVAILABILITY_DESCRIPTION =
  "Call or book online. Our team is available nights and weekends.";

export const CORE_COMPETITOR_NEGATIVES = [
  "blue ribbon plumbing",
  "benjamin franklin plumbing",
] as const;

export const STANDARD_HEADLINES = [
  "Locally & Family Owned",
  "Licensed & Insured Plumbers",
  "Book Online",
  "Call Ironclad Plumbing",
];

export function standardDescriptions(promotion = STANDARD_PROMOTION_DESCRIPTION): string[] {
  return [LICENSE_DESCRIPTION, STANDARD_OUTCOME_DESCRIPTION, STANDARD_AVAILABILITY_DESCRIPTION, promotion];
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
  "jobs", "job application", "job applications", "hiring", "salary", "careers",
  "apprentice", "apprenticeship", "internship", "internships", "journeyman jobs",
  "master plumber jobs", "union jobs", "indeed", "glassdoor", "plumbing recruiter",
  "resume", "resumes",
  "school", "school project", "science project", "course", "certification", "ceu",
  "continuing education", "license exam", "exam prep", "practice test", "practice tests",
  "training", "trade school", "trade schools", "research paper", "textbook", "textbooks",
  "how to", "diy", "yourself", "tutorial", "youtube", "step by step", "wiki", "wikipedia",
  "manual", "manual pdf", "diagram", "error code", "plumbing code", "forum", "reddit",
  "plumbing blueprint", "plumbing blueprints", "plumbing cad", "autocad plumbing",
  "plumbing schematic", "plumbing schematics", "plumbing software", "plumbing calculator",
  "cost calculator", "estimate template", "invoice template", "how much to charge",
  "average cost", "how much does", "how much is", "price range",
  "home depot", "lowes", "amazon", "for sale", "menards", "ace hardware",
  "harbor freight", "walmart", "ebay", "temu", "craigslist", "abacus",
  "parts", "replacement parts", "plumbing supply", "supply store", "wholesale",
  "used plumbing fixtures", "used toilet", "used water heater", "warranty phone number",
  "tool rental", "auger rental", "drain snake rental", "rent a drain snake",
  "hydro jetter rental", "sewer camera rental",
  "water bill", "pay water bill", "pay austin water bill", "water utility",
  "city of austin utilities", "austin water login", "utility login", "water outage map",
  "water department phone number", "sewer department phone number", "call 311",
  "boil water notice",
  "plumbing logo", "clip art", "clipart", "stock photo", "stock photos",
  "porta potty", "portable toilet", "rv", "camper", "boat", "trailer",
  "home warranty", "american home shield", "choice home warranty", "handyman",
] as const;

export const RESIDENTIAL_NEGATIVES = [
  "commercial", "industrial", "construction", "new construction", "new build",
  "restaurant", "apartment complex", "multi family", "multifamily", "property management",
  "property manager", "facility maintenance", "facilities maintenance", "office building",
  "retail store", "warehouse", "hotel", "school district", "general contractor",
  "subcontractor", "construction bid", "plumbing bid", "request for proposal", "rfp",
  "tenant improvement",
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
