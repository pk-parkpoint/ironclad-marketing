import { LICENSE_DESCRIPTION, SITE_ORIGIN } from "./manifest-shared";
import { exact, phrase, type CampaignSpec } from "./types";

export const DRAIN_SEWER: CampaignSpec = {
  key: "drain-sewer",
  name: "Drain & Sewer",
  budgetMicros: "15000000",
  cpcCapMicros: "18000000",
  launchEnabled: true,
  crossNegatives: ["emergency", "24 hour", "open now", "water heater", "tankless", "slab leak", "repipe"],
  residentialFilter: true,
  headlines: [
    "Clogged Drain? Call Us Today",
    "Same-Day Drain Clearing",
    "We Clear Clogs Fast",
    "Camera Inspection Available",
    "Kitchen, Bath & Main Lines",
    "Licensed & Insured Plumbers",
    "5-Star Rated Austin Plumbers",
    "Locally Owned & Operated",
    "Price Approved Before Work",
    "We Find It and Fix It",
    "Serving All of Greater Austin",
    "Book Online in 60 Seconds",
    "Call Now for Fast Service",
    "Repairs Done Right",
  ],
  descriptions: [
    LICENSE_DESCRIPTION,
    "Clogged drain, slow drain, or sewer backup? Same-day drain clearing across Austin.",
    "Camera inspection available. We find the problem, show you the price, then fix it.",
    "5-star rated and locally owned. Call now or book your appointment online in 60 seconds.",
  ],
  adGroups: [
    {
      name: "Drain Cleaning & Drain Clearing",
      finalUrl: `${SITE_ORIGIN}/drain-cleaning`,
      pinnedHeadline: "Drain Cleaning in Austin",
      keywords: [
        ...exact("drain cleaning", "drain cleaning near me", "drain cleaning austin", "drain clearing", "drain clearing service"),
        ...phrase("drain clearing near me", "drain cleaning service", "drain cleaning cost", "drain snaking", "snake a drain", "drain snake service", "rooter service", "drain rooter", "sewer rooter", "drain cleaning company"),
      ],
    },
    {
      name: "Clogged Drain",
      finalUrl: `${SITE_ORIGIN}/plumbing/clogged-drain`,
      pinnedHeadline: "Clogged Drain Plumber",
      keywords: [
        ...exact("clogged drain plumber"),
        ...phrase("clogged kitchen sink plumber", "unclog drain plumber", "drain unclogging service", "clear clogged drain", "slow drain plumber", "clogged shower drain plumber", "clogged bathtub drain plumber", "sink wont drain"),
      ],
    },
    {
      name: "Sewer Line",
      finalUrl: `${SITE_ORIGIN}/plumbing/sewer-services`,
      pinnedHeadline: "Sewer Line Repair Austin",
      keywords: [
        ...exact("sewer line repair", "sewer line replacement"),
        ...phrase("main line clog", "clogged main line", "main drain clog", "sewer line repair cost", "sewer line replacement cost", "sewer smell in house", "sewer line cleaning"),
      ],
    },
    {
      name: "Sewer Camera & Scope",
      finalUrl: `${SITE_ORIGIN}/plumbing/sewer-camera-inspection`,
      pinnedHeadline: "Sewer Camera Inspection",
      keywords: [
        ...exact("sewer camera inspection", "sewer scope inspection"),
        ...phrase("sewer camera inspection cost", "sewer inspection before buying house", "plumbing inspection home purchase", "sewer line camera", "sewer scope near me"),
      ],
    },
    {
      name: "Hydro Jetting",
      finalUrl: `${SITE_ORIGIN}/plumbing/hydro-jetting`,
      pinnedHeadline: "Hydro Jetting in Austin",
      keywords: [
        ...exact("hydro jetting"),
        ...phrase("hydro jetting near me", "hydro jetting cost", "hydro jet drain cleaning", "sewer jetting service"),
      ],
    },
    {
      name: "Trenchless",
      finalUrl: `${SITE_ORIGIN}/plumbing/trenchless-sewer-repair`,
      pinnedHeadline: "Trenchless Sewer Repair",
      keywords: [
        ...exact("trenchless sewer repair"),
        ...phrase("trenchless sewer replacement", "trenchless pipe lining", "pipe bursting sewer", "trenchless sewer repair cost"),
      ],
    },
    {
      name: "Toilet Repair & Install",
      finalUrl: `${SITE_ORIGIN}/plumbing/toilet-repair-installation`,
      pinnedHeadline: "Toilet Repair & Install",
      keywords: [
        ...exact("toilet repair", "toilet installation", "toilet replacement"),
        ...phrase("clogged toilet plumber", "toilet leaking at base", "toilet repair near me", "toilet installation cost", "install new toilet", "toilet wont flush plumber"),
      ],
    },
  ],
};
