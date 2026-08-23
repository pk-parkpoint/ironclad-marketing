import {
  SITE_ORIGIN,
  STANDARD_HEADLINES,
  STANDARD_PROMOTION_HEADLINE,
  standardDescriptions,
} from "./manifest-shared";
import { exact, phrase, type CampaignSpec } from "./types";

export const EMERGENCY: CampaignSpec = {
  key: "emergency",
  name: "Emergency",
  budgetMicros: "15000000",
  cpcCapMicros: "30000000",
  launchEnabled: true,
  crossNegatives: ["water heater", "tankless", "drain cleaning", "drain clearing", "leak detection", "repipe"],
  residentialFilter: true,
  pinnedHeadline2: STANDARD_PROMOTION_HEADLINE,
  headlines: STANDARD_HEADLINES,
  descriptions: standardDescriptions(
    "Emergency plumbing experts. Call now. We'll explain the problem and your options.",
  ),
  adGroups: [
    {
      name: "Emergency Plumber",
      finalUrl: `${SITE_ORIGIN}/emergency-plumbing`,
      pinnedHeadline: "Emergency Plumbing Experts",
      keywords: [
        ...exact("emergency plumber", "emergency plumber austin", "emergency plumber near me", "24 hour plumber", "plumber open now", "no water in house"),
        ...phrase("emergency plumbing service", "24 hour plumber near me", "active water leak", "water leak emergency", "emergency plumbing repair", "no water coming out of faucet"),
      ],
    },
    {
      name: "Burst Pipe",
      finalUrl: `${SITE_ORIGIN}/plumbing/burst-pipe-repair`,
      pinnedHeadline: "Burst Pipe Repair Experts",
      keywords: [
        ...exact("burst pipe repair"),
        ...phrase("burst pipe plumber", "pipe burst in house", "broken pipe emergency", "water pipe burst", "burst pipe repair cost"),
      ],
    },
    {
      name: "Sewer Backup",
      finalUrl: `${SITE_ORIGIN}/plumbing/sewer-services`,
      pinnedHeadline: "Sewer Backup Experts",
      keywords: phrase("sewer backup plumber", "sewage backup in house", "sewer backing up into shower", "raw sewage in house", "sewer backup emergency"),
    },
    {
      name: "Overflowing Toilet",
      finalUrl: `${SITE_ORIGIN}/plumbing/toilet-repair-installation`,
      pinnedHeadline: "Overflowing Toilet Experts",
      keywords: phrase("overflowing toilet plumber", "toilet overflowing wont stop", "toilet overflowing emergency"),
    },
    {
      name: "After-Hours & Weekend",
      finalUrl: `${SITE_ORIGIN}/emergency-plumbing`,
      pinnedHeadline: "After-Hours Plumbing Experts",
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
  crossNegatives: ["emergency", "24 hour", "open now", "drain", "sewer"],
  residentialFilter: true,
  pinnedHeadline2: "Up to $300 Off New Heaters",
  headlines: STANDARD_HEADLINES,
  descriptions: standardDescriptions(
    "Water heater repair and installation experts. We'll explain the problem and your options.",
    "New customers save up to $300 on a new water heater. Call Ironclad today.",
  ),
  adGroups: [
    {
      name: "Repair & No Hot Water",
      finalUrl: `${SITE_ORIGIN}/plumbing/water-heater-repair`,
      pinnedHeadline: "Water Heater Repair Experts",
      keywords: [
        ...exact("water heater repair", "water heater repair near me", "water heater repair austin"),
        ...phrase("hot water heater repair", "no hot water", "no hot water plumber", "water heater pilot light wont stay lit", "water heater not heating", "not enough hot water"),
      ],
    },
    {
      name: "Replacement",
      finalUrl: `${SITE_ORIGIN}/plumbing/water-heaters`,
      pinnedHeadline: "Water Heater Replacement",
      keywords: [
        ...exact("water heater replacement"),
        ...phrase("water heater replacement cost", "leaking water heater", "water heater leaking from bottom", "water heater not working", "replace water heater", "water heater replacement near me"),
      ],
    },
    {
      name: "Installation",
      finalUrl: `${SITE_ORIGIN}/plumbing/water-heater-installation`,
      pinnedHeadline: "Water Heater Installation",
      keywords: [
        ...exact("water heater installation"),
        ...phrase("new water heater installed", "40 gallon water heater installed", "50 gallon water heater installed", "water heater install cost", "water heater installation near me"),
      ],
    },
    {
      name: "Tankless",
      finalUrl: `${SITE_ORIGIN}/plumbing/tankless-water-heaters`,
      pinnedHeadline: "Tankless Water Heater Experts",
      keywords: [
        ...exact("tankless water heater repair", "tankless water heater installation"),
        ...phrase("tankless water heater installer near me", "tankless water heater cost installed", "tankless water heater replacement", "tankless water heater flush"),
      ],
    },
    {
      name: "Brand + Service",
      finalUrl: `${SITE_ORIGIN}/plumbing/water-heater-repair`,
      pinnedHeadline: "Water Heater Brand Experts",
      keywords: phrase("rheem water heater repair", "rinnai tankless repair", "navien tankless repair", "ao smith water heater repair", "bradford white water heater repair", "state water heater repair"),
    },
  ],
};
