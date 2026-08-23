import {
  SITE_ORIGIN,
  STANDARD_HEADLINES,
  STANDARD_PROMOTION_HEADLINE,
  standardDescriptions,
} from "./manifest-shared";
import { exact, phrase, type CampaignSpec, type KeywordSpec } from "./types";

export const LEAKS_LINES: CampaignSpec = {
  key: "leaks-lines",
  name: "Leaks & Lines",
  budgetMicros: "15000000",
  cpcCapMicros: "20000000",
  launchEnabled: true,
  crossNegatives: ["emergency", "24 hour", "open now", "water heater", "tankless", "drain cleaning", "drain clearing"],
  residentialFilter: true,
  pinnedHeadline2: STANDARD_PROMOTION_HEADLINE,
  headlines: STANDARD_HEADLINES,
  descriptions: standardDescriptions(
    "Leak and line experts who explain the issue and give you the best options for your home.",
  ),
  adGroups: [
    {
      name: "Leak Detection",
      finalUrl: `${SITE_ORIGIN}/leak-detection`,
      pinnedHeadline: "Leak Detection Experts",
      keywords: [
        ...exact("leak detection", "leak detection near me"),
        ...phrase("water leak detection service", "high water bill leak", "leak detection cost", "water meter spinning", "hear water running in walls", "find water leak in house"),
      ],
    },
    {
      name: "Slab Leak",
      finalUrl: `${SITE_ORIGIN}/plumbing/slab-leak-repair`,
      pinnedHeadline: "Slab Leak Experts",
      keywords: [
        ...exact("slab leak repair", "slab leak detection"),
        ...phrase("slab leak repair cost", "warm spot on floor", "slab leak plumber", "foundation leak plumber"),
      ],
    },
    {
      name: "Water Line",
      finalUrl: `${SITE_ORIGIN}/plumbing/water-line-repair`,
      pinnedHeadline: "Water Line Repair Experts",
      keywords: [
        ...exact("water line repair"),
        ...phrase("main water line repair", "water line replacement", "water main leak", "wet spot in yard", "water line repair cost", "broken water line"),
      ],
    },
    {
      name: "Pipe Repair",
      finalUrl: `${SITE_ORIGIN}/plumbing/water-line-repair`,
      pinnedHeadline: "Pipe Repair Experts",
      keywords: [
        ...exact("pipe repair"),
        ...phrase("pipe leak repair", "broken pipe repair", "copper pipe repair", "pinhole leak", "plumbing leak repair", "leaking pipe under sink", "pipe repair plumber"),
      ],
    },
    {
      name: "Gas Line",
      finalUrl: `${SITE_ORIGIN}/plumbing/gas-line-services`,
      pinnedHeadline: "Gas Line Service Experts",
      keywords: [
        ...exact("gas line repair", "gas line installation"),
        ...phrase("gas line plumber", "gas leak repair", "gas line for stove", "gas line for grill", "gas line installation cost", "smell gas in house plumber"),
      ],
    },
    {
      name: "Repiping",
      finalUrl: `${SITE_ORIGIN}/plumbing/repiping`,
      pinnedHeadline: "Whole Home Repiping Experts",
      keywords: [
        ...exact("whole house repipe"),
        ...phrase("repiping company", "repipe cost", "whole house repipe cost", "pex repipe", "repipe specialist", "replace old pipes house"),
      ],
    },
  ],
};

const cityKeyword = (text: string, path: string): KeywordSpec => ({
  text,
  matchType: "EXACT",
  finalUrl: `${SITE_ORIGIN}${path}`,
});

export const GENERAL_CITY: CampaignSpec = {
  key: "general-city",
  name: "General & City",
  budgetMicros: "15000000",
  cpcCapMicros: "15000000",
  launchEnabled: true,
  crossNegatives: ["emergency", "24 hour", "open now", "water heater", "tankless", "drain", "sewer", "leak detection", "slab leak", "repipe", "gas line", "toilet"],
  residentialFilter: true,
  pinnedHeadline2: STANDARD_PROMOTION_HEADLINE,
  headlines: STANDARD_HEADLINES,
  descriptions: standardDescriptions(
    "Austin plumbing experts who explain the issue and give you the best options for your home.",
  ),
  adGroups: [
    {
      name: "Plumber Near Me",
      finalUrl: `${SITE_ORIGIN}/plumbing`,
      pinnedHeadline: "Local Austin Plumbing Experts",
      keywords: [
        ...exact("plumber near me", "plumbers near me", "local plumber", "residential plumber"),
        ...phrase("plumbing company near me", "plumbing services near me", "best plumber near me", "licensed plumber near me"),
      ],
    },
    {
      name: "Plumbing Repairs",
      finalUrl: `${SITE_ORIGIN}/plumbing/repairs`,
      pinnedHeadline: "Austin Plumbing Repair Experts",
      keywords: [
        ...exact("plumbing repair near me", "low water pressure"),
        ...phrase("plumbing repair service", "no water pressure in house", "pressure reducing valve replacement", "water pressure regulator replacement", "plumbing repair cost"),
      ],
    },
    {
      name: "Austin Plumber",
      finalUrl: `${SITE_ORIGIN}/service-area/austin-tx`,
      pinnedHeadline: "Expert Plumbers in Austin",
      keywords: [
        ...exact("austin plumber", "plumber austin tx"),
        ...phrase("licensed plumber austin", "best plumber austin", "plumbing company austin", "plumber in austin texas"),
      ],
    },
    {
      name: "City Modifiers",
      finalUrl: `${SITE_ORIGIN}/service-area/austin-tx`,
      pinnedHeadline: "{LOCATION(City):Local Plumber}",
      keywords: [
        cityKeyword("round rock plumber", "/service-area/round-rock-tx"),
        cityKeyword("plumber round rock", "/service-area/round-rock-tx"),
        cityKeyword("pflugerville plumber", "/service-area/pflugerville-tx"),
        cityKeyword("cedar park plumber", "/service-area/cedar-park-tx"),
        cityKeyword("leander plumber", "/service-area/leander-tx"),
        cityKeyword("georgetown plumber", "/service-area/georgetown-tx"),
        cityKeyword("buda plumber", "/service-area/buda-tx"),
        cityKeyword("kyle plumber", "/service-area/kyle-tx"),
        cityKeyword("westlake plumber", "/service-area/west-lake-hills-tx"),
        cityKeyword("lakeway plumber", "/service-area/lakeway-tx"),
        cityKeyword("hutto plumber", "/service-area/hutto-tx"),
      ],
    },
  ],
};

export const FREEZE: CampaignSpec = {
  key: "freeze",
  name: "Freeze",
  budgetMicros: "75000000",
  cpcCapMicros: "35000000",
  launchEnabled: false,
  crossNegatives: [],
  residentialFilter: false,
  pinnedHeadline2: STANDARD_PROMOTION_HEADLINE,
  headlines: STANDARD_HEADLINES,
  descriptions: standardDescriptions(
    "Frozen pipe experts who act fast and give you the best options for your home.",
  ),
  adGroups: [
    {
      name: "Frozen Pipes",
      finalUrl: `${SITE_ORIGIN}/plumbing/burst-pipe-repair`,
      pinnedHeadline: "Frozen Pipe Repair Experts",
      keywords: [
        ...exact("frozen pipes", "frozen pipe repair"),
        ...phrase("burst pipe from freeze", "pipe froze and burst", "frozen pipe plumber", "emergency plumber freeze", "pipes frozen no water"),
      ],
    },
  ],
};

export const COMPETITOR: CampaignSpec = {
  key: "competitor",
  name: "Competitor",
  budgetMicros: "10000000",
  cpcCapMicros: "12000000",
  launchEnabled: false,
  crossNegatives: [],
  residentialFilter: false,
  pinnedHeadline2: STANDARD_PROMOTION_HEADLINE,
  headlines: STANDARD_HEADLINES,
  descriptions: standardDescriptions(
    "Austin plumbing experts who explain the issue and give you the best options for your home.",
  ),
  adGroups: [
    {
      name: "Competitor Names",
      finalUrl: `${SITE_ORIGIN}/service-area/austin-tx`,
      pinnedHeadline: "Local Austin Plumbing Experts",
      keywords: exact("radiant plumbing", "reliant plumbing", "daniels plumbing", "s and d plumbing", "abacus plumbing", "roto rooter", "mr rooter", "benjamin franklin plumbing", "thomas plumbing"),
    },
  ],
};
