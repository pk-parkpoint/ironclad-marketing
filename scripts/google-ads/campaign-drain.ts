import {
  SITE_ORIGIN,
  STANDARD_HEADLINES,
  STANDARD_PROMOTION_DESCRIPTION,
  STANDARD_PROMOTION_HEADLINE,
  standardDescriptions,
} from "./manifest-shared";
import { exact, phrase, type CampaignSpec } from "./types";

export const DRAIN_SEWER: CampaignSpec = {
  key: "drain-sewer",
  name: "Drain & Sewer",
  budgetMicros: "15000000",
  cpcCapMicros: "18000000",
  launchEnabled: true,
  crossNegatives: ["emergency", "24 hour", "open now", "water heater", "tankless", "slab leak", "repipe"],
  residentialFilter: true,
  pinnedHeadline2: "Drain Cleaning for $69",
  headlines: STANDARD_HEADLINES,
  descriptions: standardDescriptions(
    "Drain and sewer experts who explain the issue and give you the best options for your home.",
    "Get expert drain cleaning for $69. Schedule anytime or call our 24/7 team.",
  ),
  adGroups: [
    {
      name: "Drain Cleaning & Drain Clearing",
      finalUrl: `${SITE_ORIGIN}/drain-cleaning`,
      pinnedHeadline: "Drain Cleaning Experts",
      keywords: [
        ...exact("drain cleaning", "drain cleaning near me", "drain cleaning austin", "drain clearing", "drain clearing service"),
        ...phrase("drain clearing near me", "drain cleaning service", "drain cleaning cost", "drain snaking", "snake a drain", "drain snake service", "rooter service", "drain rooter", "sewer rooter", "drain cleaning company"),
      ],
    },
    {
      name: "Clogged Drain",
      finalUrl: `${SITE_ORIGIN}/plumbing/clogged-drain`,
      pinnedHeadline: "Clogged Drain Experts",
      keywords: [
        ...exact("clogged drain plumber"),
        ...phrase("clogged kitchen sink plumber", "unclog drain plumber", "drain unclogging service", "clear clogged drain", "slow drain plumber", "clogged shower drain plumber", "clogged bathtub drain plumber", "sink wont drain"),
      ],
    },
    {
      name: "Sewer Line",
      finalUrl: `${SITE_ORIGIN}/plumbing/sewer-services`,
      pinnedHeadline: "Sewer Line Repair Experts",
      pinnedHeadline2: STANDARD_PROMOTION_HEADLINE,
      promotionDescription: STANDARD_PROMOTION_DESCRIPTION,
      keywords: [
        ...exact("sewer line repair", "sewer line replacement"),
        ...phrase("main line clog", "clogged main line", "main drain clog", "sewer line repair cost", "sewer line replacement cost", "sewer smell in house", "sewer line cleaning"),
      ],
    },
    {
      name: "Sewer Camera & Scope",
      finalUrl: `${SITE_ORIGIN}/plumbing/sewer-camera-inspection`,
      pinnedHeadline: "Sewer Camera Experts",
      pinnedHeadline2: STANDARD_PROMOTION_HEADLINE,
      promotionDescription: STANDARD_PROMOTION_DESCRIPTION,
      keywords: [
        ...exact("sewer camera inspection", "sewer scope inspection"),
        ...phrase("sewer camera inspection cost", "sewer inspection before buying house", "plumbing inspection home purchase", "sewer line camera", "sewer scope near me"),
      ],
    },
    {
      name: "Hydro Jetting",
      finalUrl: `${SITE_ORIGIN}/plumbing/hydro-jetting`,
      pinnedHeadline: "Hydro Jetting Experts",
      pinnedHeadline2: STANDARD_PROMOTION_HEADLINE,
      promotionDescription: STANDARD_PROMOTION_DESCRIPTION,
      keywords: [
        ...exact("hydro jetting"),
        ...phrase("hydro jetting near me", "hydro jetting cost", "hydro jet drain cleaning", "sewer jetting service"),
      ],
    },
    {
      name: "Trenchless",
      finalUrl: `${SITE_ORIGIN}/plumbing/trenchless-sewer-repair`,
      pinnedHeadline: "Trenchless Sewer Experts",
      pinnedHeadline2: STANDARD_PROMOTION_HEADLINE,
      promotionDescription: STANDARD_PROMOTION_DESCRIPTION,
      keywords: [
        ...exact("trenchless sewer repair"),
        ...phrase("trenchless sewer replacement", "trenchless pipe lining", "pipe bursting sewer", "trenchless sewer repair cost"),
      ],
    },
    {
      name: "Toilet Repair & Install",
      finalUrl: `${SITE_ORIGIN}/plumbing/toilet-repair-installation`,
      pinnedHeadline: "Toilet Repair Experts",
      pinnedHeadline2: STANDARD_PROMOTION_HEADLINE,
      promotionDescription: STANDARD_PROMOTION_DESCRIPTION,
      keywords: [
        ...exact("toilet repair", "toilet installation"),
        {
          finalUrl: `${SITE_ORIGIN}/plumbing/toilet-replacement`,
          matchType: "EXACT",
          text: "toilet replacement",
        },
        ...phrase("clogged toilet plumber", "toilet leaking at base", "toilet repair near me", "toilet installation cost", "install new toilet", "toilet wont flush plumber"),
      ],
    },
  ],
};
