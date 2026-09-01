import {
  CORE_COMPETITOR_NEGATIVES,
  SITE_ORIGIN,
  STANDARD_HEADLINES,
  STANDARD_PROMOTION_HEADLINE,
  standardDescriptions,
} from "./manifest-shared";
import { desiredAd } from "./ad-groups";
import { exact, phrase, type CampaignSpec, type KeywordSpec } from "./types";

export const MAX_CLICKS_PILOT_KEY = "max-clicks-pilot";
export const MAX_CLICKS_PILOT_NAME = "Max Clicks Pilot | Exact Service Intent";
export const MAX_CLICKS_PILOT_BUDGET_MICROS = "20000000";
export const MAX_CLICKS_PILOT_CPC_CAP_MICROS = "10000000";

const generalNegatives: KeywordSpec[] = phrase(
  "emergency", "24 hour", "open now", "water heater", "tankless", "sewer",
  "drain cleaning", "clogged drain", "hydro jetting", "leak detection", "slab leak",
  "gas line", "repipe", "toilet", "garbage disposal", "faucet", "water softener",
  "commercial", "jobs", "diy", "how to",
);

const heaterReplacementNegatives: KeywordSpec[] = phrase(
  "tankless", "repair", "pilot light", "thermocouple", "heating element", "anode rod",
  "thermostat", "flush", "drain valve", "reset button", "error code", "manual", "parts",
  "replacement parts", "install yourself", "diy", "how to", "used water heater", "rv",
  "camper", "sewer", "commercial",
);

const tanklessInstallationNegatives: KeywordSpec[] = phrase(
  "repair", "flush", "descale", "descaling", "maintenance", "error code", "manual", "parts",
  "replacement parts", "install yourself", "diy", "how to", "110 volt", "110v", "portable",
  "under sink", "point of use", "rv", "camper", "sewer", "commercial",
);

const sewerRepairNegatives: KeywordSpec[] = phrase(
  "cleaning", "camera", "inspection", "scope", "clog", "backup", "rooter", "snake",
  "hydro jet", "jetting", "lining", "pipe bursting", "diy", "how to", "diagram", "parts",
  "sewer map", "city sewer", "sewer department", "water heater", "commercial",
);

export const MAX_CLICKS_PILOT: CampaignSpec = {
  key: MAX_CLICKS_PILOT_KEY,
  name: MAX_CLICKS_PILOT_NAME,
  budgetMicros: MAX_CLICKS_PILOT_BUDGET_MICROS,
  cpcCapMicros: MAX_CLICKS_PILOT_CPC_CAP_MICROS,
  launchEnabled: true,
  crossNegatives: [
    "emergency", "24 hour", "open now", "water softener", "water filter",
    "toilet", "garbage disposal", "faucet", "shower", "sink",
    "drain cleaning", "drain clearing", "clogged drain", "hydro jetting",
    "sewer camera", "sewer inspection", "sewer cleaning", "sewer backup",
    "water heater repair", "water heater parts", "water heater element",
    "water heater thermostat", "water heater pilot light", "tankless repair", "tankless flush",
    ...CORE_COMPETITOR_NEGATIVES,
  ],
  residentialFilter: true,
  promotionHeadline: STANDARD_PROMOTION_HEADLINE,
  headlines: STANDARD_HEADLINES,
  descriptions: standardDescriptions(),
  adGroups: [
    {
      name: "General & City Exact",
      finalUrl: `${SITE_ORIGIN}/service-area/austin-tx`,
      primaryHeadline: "Austin Plumber Near Me",
      additionalHeadlines: [
        "Plumber Near Me", "Local Austin Plumber", "Plumbing Repair Near Me",
        "Residential Plumbing", "Licensed Local Plumber", "Austin Plumbing Company",
        "Plumber for Your Home", "Local Plumbing Repairs",
      ],
      outcomeDescription: "Get a straight answer and the right plumbing repair for your home.",
      negativeKeywords: generalNegatives,
      strictServiceIntent: true,
      keywords: [
        { ...exact("plumber near me")[0], finalUrl: `${SITE_ORIGIN}/plumbing` },
        { ...exact("austin plumber")[0], finalUrl: `${SITE_ORIGIN}/service-area/austin-tx` },
        { ...exact("plumbing repair near me")[0], finalUrl: `${SITE_ORIGIN}/plumbing/repairs` },
      ],
    },
    {
      name: "Water Heater Replacement",
      finalUrl: `${SITE_ORIGIN}/plumbing/water-heaters`,
      primaryHeadline: "Water Heater Replacement",
      additionalHeadlines: [
        "Replace Your Water Heater", "Austin Water Heater Help", "Gas & Electric Options",
        "Installed for Your Home", "Choose the Right Heater", "Local Heater Replacement",
        "Book a Replacement Visit", "Water Heater Near Me",
      ],
      outcomeDescription: "Choose the right replacement water heater for your home and hot-water needs.",
      negativeKeywords: heaterReplacementNegatives,
      strictServiceIntent: true,
      keywords: exact("water heater replacement"),
    },
    {
      name: "Tankless Installation",
      finalUrl: `${SITE_ORIGIN}/plumbing/tankless-water-heaters`,
      primaryHeadline: "Tankless Water Heater",
      additionalHeadlines: [
        "Tankless Installation", "Tankless Installer Near Me", "Austin Tankless Installer",
        "Is Tankless Right for You?", "Right Size for Your Home", "Professional Installation",
        "High-Efficiency Hot Water", "Get a Tankless Quote",
      ],
      outcomeDescription: "Find out whether a professionally installed tankless heater fits your home.",
      negativeKeywords: tanklessInstallationNegatives,
      strictServiceIntent: true,
      keywords: exact("tankless water heater installation"),
    },
    {
      name: "Sewer Line Repair",
      finalUrl: `${SITE_ORIGIN}/plumbing/sewer-services`,
      primaryHeadline: "Sewer Line Repair",
      additionalHeadlines: [
        "Repair a Broken Sewer Line", "Sewer Repair Near Me", "Austin Sewer Line Plumber",
        "Find the Sewer Line Break", "Camera-First Diagnosis", "Repair or Replace the Line",
        "Less-Disruptive Options", "Local Sewer Repair",
      ],
      outcomeDescription: "Find the break and choose the right sewer-line repair for your home.",
      negativeKeywords: sewerRepairNegatives,
      strictServiceIntent: true,
      keywords: exact("sewer line repair near me"),
    },
  ],
};

function requireCondition(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`pilot manifest invalid: ${message}`);
}

export function validateMaxClicksPilot() {
  const spec = MAX_CLICKS_PILOT;
  requireCondition(spec.budgetMicros === MAX_CLICKS_PILOT_BUDGET_MICROS, "daily budget must be $20");
  requireCondition(spec.cpcCapMicros === MAX_CLICKS_PILOT_CPC_CAP_MICROS, "CPC ceiling must be $10");
  requireCondition(spec.adGroups.length === 4, "expected General/City plus three service groups");
  requireCondition(spec.adGroups.flatMap((group) => group.keywords).length === 6, "expected six exact keywords");
  requireCondition(spec.adGroups.every((group) => group.keywords.every((keyword) => keyword.matchType === "EXACT")), "all pilot keywords must be exact match");
  requireCondition(spec.adGroups.every((group) => (group.negativeKeywords || []).length >= 20), "each group needs at least 20 negatives");
  requireCondition(spec.crossNegatives.length >= 25, "campaign negative layer is incomplete");
  requireCondition(new Set(spec.crossNegatives.map((text) => text.toLowerCase())).size === spec.crossNegatives.length, "duplicate campaign negative");
  for (const group of spec.adGroups) {
    const ad = desiredAd(spec, group);
    requireCondition(ad.responsiveSearchAd.headlines.length === 15, `${group.name} must have 15 headlines`);
    requireCondition(ad.responsiveSearchAd.headlines.every(({ text }) => text.length <= 30), `${group.name} headline exceeds 30 characters`);
    requireCondition(ad.responsiveSearchAd.descriptions.every(({ text }) => text.length <= 90), `${group.name} description exceeds 90 characters`);
    const positive = new Set(group.keywords.map((keyword) => keyword.text.toLowerCase()));
    requireCondition(!(group.negativeKeywords || []).some((negative) => [...positive].some((text) =>
      negative.matchType === "EXACT" ? text === negative.text.toLowerCase() : text.includes(negative.text.toLowerCase()),
    )), `${group.name} negative blocks a positive keyword`);
  }
}
