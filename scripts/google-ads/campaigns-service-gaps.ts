import { SITE_ORIGIN } from "./manifest-shared";
import { exact, phrase, type AdGroupSpec } from "./types";

export const SERVICE_GAP_GROUP_NAMES = [
  "Water Softener Repair & Install",
  "Garbage Disposal Repair & Install",
] as const;

export const GENERAL_SERVICE_ROUTING_NEGATIVES = phrase(
  "water softener",
  "garbage disposal",
);

export const SERVICE_CAMPAIGN_ROUTING_NEGATIVES: Record<string, string[]> = {
  emergency: ["water softener", "garbage disposal"],
  "water-heater": ["water softener"],
  "drain-sewer": ["garbage disposal"],
  "leaks-lines": ["water softener", "garbage disposal"],
};

const waterSoftenerNegatives = [
  ...exact(
    "water softener",
    "best water softener",
    "water softener reviews",
    "water softener prices",
    "water softener cost",
  ),
  ...phrase(
    "buy water softener",
    "buy a water softener",
    "water softener for sale",
    "shop water softener",
    "water softener online",
    "used water softener",
    "refurbished water softener",
    "water softener salt",
    "softener salt",
    "salt pellets",
    "water softener resin",
    "resin beads",
    "water softener cleaner",
    "filter cartridge",
    "water softener installation kit",
    "water softener repair kit",
    "water softener troubleshooting",
    "water softener settings",
    "water softener regeneration",
    "water softener reset",
    "water hardness test kit",
    "water softener rental",
    "rent water softener",
  ),
];

const garbageDisposalNegatives = [
  ...exact(
    "garbage disposal",
    "best garbage disposal",
    "garbage disposal reviews",
    "garbage disposal prices",
    "garbage disposal cost",
  ),
  ...phrase(
    "buy garbage disposal",
    "buy a garbage disposal",
    "garbage disposal for sale",
    "shop garbage disposal",
    "garbage disposal online",
    "used garbage disposal",
    "refurbished garbage disposal",
    "garbage disposal installation kit",
    "garbage disposal repair kit",
    "garbage disposal mounting kit",
    "garbage disposal mounting ring",
    "garbage disposal sink flange",
    "garbage disposal gasket",
    "garbage disposal splash guard",
    "garbage disposal stopper",
    "garbage disposal power cord",
    "garbage disposal air switch",
    "garbage disposal reset button",
    "garbage disposal allen wrench",
    "garbage disposal hex wrench",
    "garbage disposal horsepower",
    "garbage disposal troubleshooting",
  ),
];

export const GENERAL_SERVICE_GAP_GROUPS: AdGroupSpec[] = [
  {
    name: SERVICE_GAP_GROUP_NAMES[0],
    finalUrl: `${SITE_ORIGIN}/plumbing/water-treatment`,
    primaryHeadline: "Water Softener Service",
    additionalHeadlines: [
      "Water Softener Repair",
      "Water Softener Install",
      "Water Softener Installer",
      "Repair or Replace Softener",
      "Austin Water Softener Help",
      "Hard Water Treatment",
      "Softener Not Working?",
      "New Softener Installation",
    ],
    outcomeDescription: "Repair or install the right softener without paying for what you do not need.",
    strictServiceIntent: true,
    negativeKeywords: waterSoftenerNegatives,
    keywords: exact(
      "water softener repair",
      "water softener repair near me",
      "water softener repair austin",
      "water softener installation",
      "water softener installation near me",
      "water softener installation austin",
      "water softener installer",
      "water softener installer near me",
      "water softener replacement",
      "water softener replacement near me",
    ),
  },
  {
    name: SERVICE_GAP_GROUP_NAMES[1],
    finalUrl: `${SITE_ORIGIN}/plumbing/garbage-disposal-repair-installation`,
    primaryHeadline: "Garbage Disposal Service",
    additionalHeadlines: [
      "Garbage Disposal Repair",
      "Garbage Disposal Install",
      "Garbage Disposal Plumber",
      "Repair or Replace Disposal",
      "Disposal Not Working?",
      "Jammed Disposal Repair",
      "Leaking Disposal Help",
      "New Disposal Installation",
    ],
    outcomeDescription: "Repair the disposal when it makes sense, or replace it when it does not.",
    strictServiceIntent: true,
    negativeKeywords: garbageDisposalNegatives,
    keywords: exact(
      "garbage disposal repair",
      "garbage disposal repair near me",
      "garbage disposal repair austin",
      "garbage disposal installation",
      "garbage disposal installation near me",
      "garbage disposal installation austin",
      "garbage disposal replacement",
      "garbage disposal replacement near me",
      "garbage disposal plumber",
      "garbage disposal plumber near me",
    ),
  },
];
