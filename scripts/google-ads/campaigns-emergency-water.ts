import {
  SITE_ORIGIN,
  STANDARD_HEADLINES,
  STANDARD_PROMOTION_HEADLINE,
  standardDescriptions,
} from "./manifest-shared";
import { exact, phrase, type CampaignSpec } from "./types";
import { SERVICE_CAMPAIGN_ROUTING_NEGATIVES } from "./campaigns-service-gaps";

export const EMERGENCY: CampaignSpec = {
  key: "emergency",
  name: "Emergency",
  budgetMicros: "15000000",
  cpcCapMicros: "30000000",
  launchEnabled: true,
  crossNegatives: ["water heater", "tankless", "drain cleaning", "drain clearing", "leak detection", "repipe", ...SERVICE_CAMPAIGN_ROUTING_NEGATIVES.emergency],
  residentialFilter: true,
  pinnedHeadline2: STANDARD_PROMOTION_HEADLINE,
  headlines: STANDARD_HEADLINES,
  descriptions: standardDescriptions(),
  adGroups: [
    {
      name: "Emergency Plumber",
      finalUrl: `${SITE_ORIGIN}/emergency-plumbing`,
      pinnedHeadline: "Emergency Plumbing Experts",
      outcomeDescription: "Stop the damage fast and get the right repair for your home.",
      keywords: [
        ...exact("emergency plumber", "emergency plumber austin", "emergency plumber near me", "24 hour plumber", "plumber open now", "no water in house"),
        ...phrase("emergency plumbing service", "24 hour plumber near me", "active water leak", "water leak emergency", "emergency plumbing repair", "no water coming out of faucet"),
      ],
    },
    {
      name: "Burst Pipe",
      finalUrl: `${SITE_ORIGIN}/plumbing/burst-pipe-repair`,
      pinnedHeadline: "Burst Pipe Repair Experts",
      outcomeDescription: "Stop the water fast and get the broken pipe repaired.",
      keywords: [
        ...exact("burst pipe repair"),
        ...phrase("burst pipe plumber", "pipe burst in house", "broken pipe emergency", "water pipe burst", "burst pipe repair cost"),
      ],
    },
    {
      name: "Sewer Backup",
      finalUrl: `${SITE_ORIGIN}/plumbing/sewer-services`,
      pinnedHeadline: "Sewer Backup Experts",
      outcomeDescription: "Clear the backup and find the cause before it happens again.",
      keywords: phrase("sewer backup plumber", "sewage backup in house", "sewer backing up into shower", "raw sewage in house", "sewer backup emergency"),
    },
    {
      name: "Overflowing Toilet",
      finalUrl: `${SITE_ORIGIN}/plumbing/toilet-repair-installation`,
      pinnedHeadline: "Overflowing Toilet Experts",
      outcomeDescription: "Stop the overflow and get your toilet working again.",
      keywords: phrase("overflowing toilet plumber", "toilet overflowing wont stop", "toilet overflowing emergency"),
    },
    {
      name: "After-Hours & Weekend",
      finalUrl: `${SITE_ORIGIN}/emergency-plumbing`,
      pinnedHeadline: "After-Hours Plumbing Experts",
      outcomeDescription: "Get the plumbing problem handled tonight or this weekend.",
      keywords: [
        ...exact("weekend plumber", "sunday plumber", "after hours plumber"),
        ...phrase("plumber open sunday", "plumber open on weekend", "late night plumber", "plumber open saturday", "plumber open late"),
      ],
    },
  ],
};

export const WATER_HEATER: CampaignSpec = {
  key: "water-heater",
  name: "Water Heater",
  budgetMicros: "15000000",
  cpcCapMicros: "22000000",
  launchEnabled: true,
  crossNegatives: [
    "emergency", "24 hour", "open now", "drain", "sewer",
    "110 volt", "110v", "calculator", "gallons per minute", "gpm", "kw",
    "model number", "model numbers", "spex3012", "lowe's",
    ...SERVICE_CAMPAIGN_ROUTING_NEGATIVES["water-heater"],
  ],
  exactCrossNegatives: [
    "best non condensing tankless water heater",
    "navien electric tankless water heater",
    "rinnai tankless water heater",
  ],
  residentialFilter: true,
  pinnedHeadline2: "Up to $300 Off New Heaters",
  headlines: STANDARD_HEADLINES,
  descriptions: standardDescriptions(
    "New customers save up to $300 on a new water heater. Call Ironclad today.",
  ),
  adGroups: [
    {
      name: "Repair & No Hot Water",
      finalUrl: `${SITE_ORIGIN}/plumbing/water-heater-repair`,
      pinnedHeadline: "Water Heater Repair Experts",
      outcomeDescription: "Know whether you need a water heater repair or replacement before you decide.",
      keywords: [
        ...exact("water heater repair", "water heater repair near me", "water heater repair austin"),
        ...phrase("hot water heater repair", "no hot water", "no hot water plumber", "water heater pilot light wont stay lit", "water heater not heating", "not enough hot water"),
      ],
    },
    {
      name: "Replacement",
      finalUrl: `${SITE_ORIGIN}/plumbing/water-heaters`,
      pinnedHeadline: "Water Heater Replacement",
      outcomeDescription: "Choose the right water heater for your home and your hot-water needs.",
      keywords: [
        ...exact("water heater replacement"),
        ...phrase("water heater replacement cost", "leaking water heater", "water heater leaking from bottom", "water heater not working", "replace water heater", "water heater replacement near me"),
      ],
    },
    {
      name: "Installation",
      finalUrl: `${SITE_ORIGIN}/plumbing/water-heater-installation`,
      pinnedHeadline: "Water Heater Installation",
      outcomeDescription: "Get the right water heater installed correctly for your home.",
      keywords: [
        ...exact("water heater installation"),
        ...phrase("new water heater installed", "40 gallon water heater installed", "50 gallon water heater installed", "water heater install cost", "water heater installation near me"),
      ],
    },
    {
      name: "Tankless",
      finalUrl: `${SITE_ORIGIN}/plumbing/tankless-water-heaters`,
      pinnedHeadline: "Tankless Water Heater Experts",
      outcomeDescription: "Find out whether a tankless water heater is right for your home.",
      keywords: [
        ...exact("tankless water heater repair", "tankless water heater installation"),
        ...phrase("tankless water heater installer near me", "tankless water heater cost installed", "tankless water heater replacement", "tankless water heater flush"),
      ],
    },
    {
      name: "Brand + Service",
      finalUrl: `${SITE_ORIGIN}/plumbing/water-heater-repair`,
      pinnedHeadline: "Water Heater Brand Experts",
      outcomeDescription: "Get the right repair for your water heater brand and model.",
      keywords: phrase("rheem water heater repair", "rinnai tankless repair", "navien tankless repair", "ao smith water heater repair", "bradford white water heater repair", "state water heater repair"),
    },
  ],
};
