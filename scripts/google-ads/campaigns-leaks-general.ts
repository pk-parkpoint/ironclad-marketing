import {
  SITE_ORIGIN,
  STANDARD_HEADLINES,
  STANDARD_PROMOTION_HEADLINE,
  standardDescriptions,
} from "./manifest-shared";
import {
  GENERAL_SERVICE_GAP_GROUPS,
  GENERAL_SERVICE_ROUTING_NEGATIVES,
} from "./campaigns-service-gaps";
import { exact, phrase, type CampaignSpec, type KeywordSpec } from "./types";
import { TARGET_CPA_MICROS } from "./launch-config";

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
  targetCpaMicros: TARGET_CPA_MICROS,
  launchEnabled: true,
  crossNegatives: ["emergency", "24 hour", "open now", "water heater", "tankless", "drain", "sewer", "leak detection", "slab leak", "repipe", "gas line", "toilet"],
  residentialFilter: true,
  pinnedHeadline2: STANDARD_PROMOTION_HEADLINE,
  headlines: STANDARD_HEADLINES,
  descriptions: standardDescriptions(),
  adGroups: [
    {
      name: "Plumber Near Me",
      finalUrl: `${SITE_ORIGIN}/plumbing`,
      pinnedHeadline: "Plumber Near Me",
      outcomeDescription: "Know what needs fixing—and what can wait—before you decide.",
      negativeKeywords: GENERAL_SERVICE_ROUTING_NEGATIVES,
      keywords: [
        ...exact("plumber near me", "plumbers near me", "local plumber", "residential plumber"),
        ...phrase("plumbing company near me", "plumbing services near me", "best plumber near me", "licensed plumber near me"),
      ],
    },
    {
      name: "Plumbing Repairs",
      finalUrl: `${SITE_ORIGIN}/plumbing/repairs`,
      pinnedHeadline: "Plumbing Repair Experts",
      outcomeDescription: "Find the cause and get the right plumbing repair for your home.",
      negativeKeywords: GENERAL_SERVICE_ROUTING_NEGATIVES,
      keywords: [
        ...exact("plumbing repair near me", "low water pressure"),
        ...phrase("plumbing repair service", "no water pressure in house", "pressure reducing valve replacement", "water pressure regulator replacement", "plumbing repair cost"),
      ],
    },
    {
      name: "Austin Plumber",
      finalUrl: `${SITE_ORIGIN}/service-area/austin-tx`,
      pinnedHeadline: "Austin Plumber",
      outcomeDescription: "Know what needs fixing—and what can wait—before you decide.",
      negativeKeywords: GENERAL_SERVICE_ROUTING_NEGATIVES,
      keywords: [
        ...exact("austin plumber", "plumber austin tx"),
        ...phrase("licensed plumber austin", "best plumber austin", "plumbing company austin", "plumber in austin texas"),
      ],
    },
    {
      name: "City Modifiers",
      finalUrl: `${SITE_ORIGIN}/service-area/austin-tx`,
      pinnedHeadline: "{LOCATION(City):Local Plumber}",
      outcomeDescription: "Get a straight answer and the right plumbing repair for your home.",
      negativeKeywords: GENERAL_SERVICE_ROUTING_NEGATIVES,
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
    ...GENERAL_SERVICE_GAP_GROUPS,
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
  descriptions: standardDescriptions(),
  adGroups: [
    {
      name: "Frozen Pipes",
      finalUrl: `${SITE_ORIGIN}/plumbing/burst-pipe-repair`,
      pinnedHeadline: "Frozen Pipe Repair Experts",
      outcomeDescription: "Thaw or repair frozen pipes before they cause more damage.",
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
  descriptions: standardDescriptions(),
  adGroups: [
    {
      name: "Competitor Names",
      finalUrl: `${SITE_ORIGIN}/service-area/austin-tx`,
      pinnedHeadline: "Austin Plumbing Company",
      outcomeDescription: "Know what needs fixing—and what can wait—before you decide.",
      keywords: exact("radiant plumbing", "reliant plumbing", "daniels plumbing", "s and d plumbing", "abacus plumbing", "roto rooter", "mr rooter", "benjamin franklin plumbing", "thomas plumbing"),
    },
  ],
};
