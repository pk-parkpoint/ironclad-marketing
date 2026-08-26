import {
  SITE_ORIGIN,
  STANDARD_HEADLINES,
  STANDARD_PROMOTION_HEADLINE,
  standardDescriptions,
} from "./manifest-shared";
import { exact, phrase, type CampaignSpec } from "./types";
import { SERVICE_CAMPAIGN_ROUTING_NEGATIVES } from "./campaigns-service-gaps";

export const LEAKS_LINES: CampaignSpec = {
  key: "leaks-lines",
  name: "Leaks & Lines",
  budgetMicros: "15000000",
  cpcCapMicros: "20000000",
  launchEnabled: false,
  crossNegatives: [
    "emergency", "24 hour", "open now", "water heater", "tankless", "drain cleaning",
    "drain clearing", "leak detection system", "leak detector", "water leak sensor",
    ...SERVICE_CAMPAIGN_ROUTING_NEGATIVES["leaks-lines"],
  ],
  residentialFilter: true,
  pinnedHeadline2: STANDARD_PROMOTION_HEADLINE,
  headlines: STANDARD_HEADLINES,
  descriptions: standardDescriptions(),
  adGroups: [
    {
      name: "Leak Detection",
      finalUrl: `${SITE_ORIGIN}/leak-detection`,
      pinnedHeadline: "Leak Detection Experts",
      outcomeDescription: "We'll pinpoint the leak and recommend the right repair.",
      keywords: [
        ...exact("leak detection", "leak detection near me"),
        ...phrase("water leak detection service", "high water bill leak", "leak detection cost", "water meter spinning", "hear water running in walls", "find water leak in house"),
      ],
    },
    {
      name: "Slab Leak",
      finalUrl: `${SITE_ORIGIN}/plumbing/slab-leak-repair`,
      pinnedHeadline: "Slab Leak Experts",
      outcomeDescription: "Find the slab leak before it causes more damage to your home.",
      keywords: [
        ...exact("slab leak repair", "slab leak detection"),
        ...phrase("slab leak repair cost", "warm spot on floor", "slab leak plumber", "foundation leak plumber"),
      ],
    },
    {
      name: "Water Line",
      finalUrl: `${SITE_ORIGIN}/plumbing/water-line-repair`,
      pinnedHeadline: "Water Line Repair Experts",
      outcomeDescription: "Find the break and restore reliable water service to your home.",
      keywords: [
        ...exact("water line repair"),
        ...phrase("main water line repair", "water line replacement", "water main leak", "wet spot in yard", "water line repair cost", "broken water line"),
      ],
    },
    {
      name: "Pipe Repair",
      finalUrl: `${SITE_ORIGIN}/plumbing/water-line-repair`,
      pinnedHeadline: "Pipe Repair Experts",
      outcomeDescription: "Fix the leaking or broken pipe before it causes more damage.",
      keywords: [
        ...exact("pipe repair"),
        ...phrase("pipe leak repair", "broken pipe repair", "copper pipe repair", "pinhole leak", "plumbing leak repair", "leaking pipe under sink", "pipe repair plumber"),
      ],
    },
    {
      name: "Gas Line",
      finalUrl: `${SITE_ORIGIN}/plumbing/gas-line-services`,
      pinnedHeadline: "Gas Line Service Experts",
      outcomeDescription: "Find the gas-line problem and get it repaired safely.",
      keywords: [
        ...exact("gas line repair", "gas line installation"),
        ...phrase("gas line plumber", "gas leak repair", "gas line for stove", "gas line for grill", "gas line installation cost", "smell gas in house plumber"),
      ],
    },
    {
      name: "Repiping",
      finalUrl: `${SITE_ORIGIN}/plumbing/repiping`,
      pinnedHeadline: "Whole Home Repiping Experts",
      outcomeDescription: "Know which pipes need replacing—and which ones do not.",
      keywords: [
        ...exact("whole house repipe"),
        ...phrase("repiping company", "repipe cost", "whole house repipe cost", "pex repipe", "repipe specialist", "replace old pipes house"),
      ],
    },
  ],
};
