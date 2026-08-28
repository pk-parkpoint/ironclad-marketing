import { SITE_ORIGIN } from "./manifest-shared";
import type { SitelinkSpec } from "./types";

export const CAMPAIGN_SITELINK_ASSET_PREFIX = "IRONCLAD | Campaign Sitelink | ";

export const CAMPAIGN_SITELINKS: Record<string, SitelinkSpec[]> = {
  emergency: [
    {
      text: "Burst Pipe Repair",
      description1: "Help for burst and leaking pipes.",
      description2: "Call for emergency availability.",
      finalUrl: `${SITE_ORIGIN}/plumbing/burst-pipe-repair`,
    },
    {
      text: "Sewer Backup Help",
      description1: "Backups, main lines, and overflows.",
      description2: "Get the soonest available window.",
      finalUrl: `${SITE_ORIGIN}/plumbing/sewer-services`,
    },
    {
      text: "Overflowing Toilet",
      description1: "Urgent toilet overflow assistance.",
      description2: "Call Ironclad for local service.",
      finalUrl: `${SITE_ORIGIN}/plumbing/toilet-repair-installation`,
    },
    {
      text: "After-Hours Plumbing",
      description1: "Nights and weekends available.",
      description2: "Speak with our local plumbing team.",
      finalUrl: `${SITE_ORIGIN}/plumbing/emergency`,
    },
  ],
  "general-city": [
    {
      text: "Plumbing Repairs",
      description1: "Leaks, pipes, valves, and fixtures.",
      description2: "Find the right home repair.",
      finalUrl: `${SITE_ORIGIN}/plumbing/repairs`,
    },
    {
      text: "Water Pressure Help",
      description1: "Diagnose low or unstable pressure.",
      description2: "Regulators, valves, supply lines.",
      finalUrl: `${SITE_ORIGIN}/plumbing/water-pressure`,
    },
    {
      text: "Austin Plumber",
      description1: "Licensed residential plumbing help.",
      description2: "Serving Austin and nearby cities.",
      finalUrl: `${SITE_ORIGIN}/service-area/austin-tx`,
    },
    {
      text: "Greater Austin Areas",
      description1: "See cities and neighborhoods.",
      description2: "Find your local service-area page.",
      finalUrl: `${SITE_ORIGIN}/service-area`,
    },
  ],
  "drain-sewer": [
    {
      text: "Drain Clearing",
      description1: "Clear slow and clogged drains.",
      description2: "Drain snaking service available.",
      finalUrl: `${SITE_ORIGIN}/plumbing/drain-clearing`,
    },
    {
      text: "Clogged Drain Help",
      description1: "Kitchen, shower, and sink clogs.",
      description2: "Get drains flowing again.",
      finalUrl: `${SITE_ORIGIN}/plumbing/clogged-drain`,
    },
    {
      text: "Sewer Camera Inspection",
      description1: "See blockages and pipe damage.",
      description2: "Camera-first sewer diagnosis.",
      finalUrl: `${SITE_ORIGIN}/plumbing/sewer-camera-inspection`,
    },
    {
      text: "Hydro Jetting",
      description1: "Clear grease, roots, and buildup.",
      description2: "High-pressure line cleaning.",
      finalUrl: `${SITE_ORIGIN}/plumbing/hydro-jetting`,
    },
  ],
  "water-heater": [
    {
      text: "Water Heater Repair",
      description1: "No hot water or inconsistent heat.",
      description2: "Tank and tankless repair options.",
      finalUrl: `${SITE_ORIGIN}/plumbing/water-heater-repair`,
    },
    {
      text: "Heater Replacement",
      description1: "Replace an aging water heater.",
      description2: "Gas and electric options.",
      finalUrl: `${SITE_ORIGIN}/plumbing/water-heaters`,
    },
    {
      text: "Heater Installation",
      description1: "Professional water heater setup.",
      description2: "Correct sizing for your home.",
      finalUrl: `${SITE_ORIGIN}/plumbing/water-heater-installation`,
    },
    {
      text: "Tankless Water Heaters",
      description1: "Tankless repair and installation.",
      description2: "Efficient hot-water options.",
      finalUrl: `${SITE_ORIGIN}/plumbing/tankless-water-heaters`,
    },
  ],
  "leaks-lines": [
    {
      text: "Slab Leak Repair",
      description1: "Find and repair hidden slab leaks.",
      description2: "Targeted options with less cutting.",
      finalUrl: `${SITE_ORIGIN}/plumbing/slab-leak-repair`,
    },
    {
      text: "Water Line Repair",
      description1: "Main line leaks and broken pipes.",
      description2: "Restore reliable water service.",
      finalUrl: `${SITE_ORIGIN}/plumbing/water-line-repair`,
    },
    {
      text: "Gas Line Services",
      description1: "Gas line repair and installation.",
      description2: "Licensed residential gas work.",
      finalUrl: `${SITE_ORIGIN}/plumbing/gas-line-services`,
    },
    {
      text: "Whole-Home Repiping",
      description1: "Replace aging or corroded pipes.",
      description2: "PEX repiping options for your home.",
      finalUrl: `${SITE_ORIGIN}/plumbing/repiping`,
    },
  ],
};

export function campaignSitelinkAssetName(campaignKey: string, text: string): string {
  return `${CAMPAIGN_SITELINK_ASSET_PREFIX}${campaignKey} | ${text}`;
}
