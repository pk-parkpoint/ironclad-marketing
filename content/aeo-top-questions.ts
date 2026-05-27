export type SourceReference = {
  label: string;
  url: string;
};

export type TopPlumbingQuestion = {
  question: string;
  variants: string[];
  answer: string;
  urgentNote: string;
  service: { label: string; path: string };
  guide: { label: string; path: string };
  sources: SourceReference[];
};

export const TOP_QUESTIONS_GUIDE_PATH = "/guides/top-plumbing-questions-austin-texas";
export const TOP_QUESTIONS_GUIDE_TITLE = "Top Plumbing Questions Austin and Texas Homeowners Ask";
export const TOP_QUESTIONS_GUIDE_DESCRIPTION =
  "Direct answers to the plumbing questions Austin homeowners ask before hiring a plumber, including emergencies, permits, pricing, licensing, slab leaks, water heaters, drains, insurance, and hard water.";
export const TOP_QUESTIONS_GUIDE_LAST_UPDATED = "2026-05-26";

export const OFFICIAL_SOURCE_REFERENCES: SourceReference[] = [
  { label: "Texas State Board of Plumbing Examiners", url: "https://tsbpe.texas.gov/" },
  {
    label: "Austin Development Services permit guide",
    url: "https://www.austintexas.gov/development-services/do-i-need-permit",
  },
  {
    label: "Austin Development Services emergency permits",
    url: "https://www.austintexas.gov/development-services/emergency-permits",
  },
  { label: "Austin Water quality reports", url: "https://www.austintexas.gov/water/water-quality-reports" },
  { label: "EPA WaterSense leak guidance", url: "https://www.epa.gov/watersense/our_water/fix_a_leak.html" },
  { label: "ENERGY STAR water heater guidance", url: "https://www.energystar.gov/products/heat_pump_water_heaters" },
  { label: "Texas Gas Service emergency guidance", url: "https://www.texasgasservice.com/es-us/report-emergency" },
];

const source = (label: string) => {
  const match = OFFICIAL_SOURCE_REFERENCES.find((entry) => entry.label === label);
  if (!match) {
    throw new Error(`Missing source reference: ${label}`);
  }
  return match;
};

export const TOP_PLUMBING_QUESTIONS: TopPlumbingQuestion[] = [
  {
    question: "What should I do first in a plumbing emergency?",
    variants: ["burst pipe first step", "sewer backup first step", "water heater leaking", "gas smell"],
    answer:
      "Stop the damage before shopping for a quote. Shut off the fixture valve or main water valve, avoid electrical areas with standing water, leave the house if you smell gas, and document visible damage with photos. After the immediate safety step, call a plumber for the repair path and call mitigation if water reached floors, walls, or cabinets.",
    urgentNote: "If you smell gas, leave the area first and contact the gas utility or 911 before scheduling plumbing work.",
    service: { label: "Emergency plumbing", path: "/plumbing/emergency" },
    guide: { label: "Plumbing emergency: first 10 minutes", path: "/guides/plumbing-emergency-first-10-minutes" },
    sources: [
      source("Texas Gas Service emergency guidance"),
      source("Austin Development Services emergency permits"),
      source("EPA WaterSense leak guidance"),
    ],
  },
  {
    question: "How much should a plumber cost in Austin?",
    variants: ["plumber cost Texas", "drain cleaning cost", "emergency plumber cost", "water heater cost"],
    answer:
      "Austin plumbing cost depends on access, urgency, materials, code requirements, and whether the quote includes diagnosis, repair, disposal, permits, and warranty. A useful estimate should name the actual scope, not just a bundled total. Compare the number against a published range, then ask why the quote is above that range before approving work.",
    urgentNote: "Do not delay a flooding, sewer, or gas-safety issue just to compare prices.",
    service: { label: "Plumbing repairs", path: "/plumbing/repairs" },
    guide: { label: "What plumbing should cost in Austin", path: "/guides/what-plumbing-costs-austin" },
    sources: [source("Texas State Board of Plumbing Examiners")],
  },
  {
    question: "How do I verify a plumber's license in Texas?",
    variants: ["TSBPE license lookup", "responsible master plumber", "unlicensed plumber risk"],
    answer:
      "Use the Texas State Board of Plumbing Examiners lookup before authorizing plumbing work. Ask the company for the Responsible Master Plumber name and license number, confirm the license is active, and make sure the company name and person responsible for the work match what you were told. Vague answers are a reason to pause.",
    urgentNote: "For gas, water-heater, sewer, and permit work, do not treat license verification as optional.",
    service: { label: "Licenses and insurance", path: "/licenses" },
    guide: { label: "Questions to ask your plumber", path: "/guides/questions-to-ask-your-plumber" },
    sources: [source("Texas State Board of Plumbing Examiners")],
  },
  {
    question: "Do I need a permit for plumbing work in Austin or Texas?",
    variants: ["water heater permit", "gas line permit", "sewer permit", "who pulls permit"],
    answer:
      "Licensing is Texas-wide, but permit rules are local. In Austin, many water-heater, gas-line, sewer, and larger repair scopes can require permit review or inspection. A licensed plumbing company should tell you whether a permit applies, who pulls it, what inspection is expected, and whether emergency work changes the timing.",
    urgentNote: "Emergency stabilization can come first, but permit and inspection requirements still need to be resolved.",
    service: { label: "Gas line services", path: "/plumbing/gas-line-services" },
    guide: { label: "Austin plumbing codes for homeowners", path: "/guides/austin-plumbing-codes-homeowners" },
    sources: [source("Austin Development Services permit guide"), source("Austin Development Services emergency permits")],
  },
  {
    question: "How do I know if I have a slab leak?",
    variants: ["warm floor", "high water bill", "foundation cracks", "leak under slab"],
    answer:
      "A slab leak is possible when you see an unexplained water-bill spike, hear water when fixtures are off, notice warm flooring, smell musty areas, see damp baseboards, or find new foundation movement. Those signs are not proof by themselves. The next step is controlled testing and leak detection before anyone recommends demolition or rerouting.",
    urgentNote: "Shut off water if active leaking is damaging floors, walls, or cabinets.",
    service: { label: "Slab leak repair", path: "/plumbing/slab-leak-repair" },
    guide: { label: "Slab leak signs in Austin", path: "/guides/slab-leak-signs-austin" },
    sources: [source("EPA WaterSense leak guidance")],
  },
  {
    question: "Should I repair or replace my water heater?",
    variants: ["no hot water", "leaking water heater", "10-year-old heater", "tank vs tankless"],
    answer:
      "Repair usually makes sense for a newer tank with a clear component failure, such as an element, thermostat, valve, or pilot issue. Replacement becomes more likely when the tank is leaking, corrosion is visible, capacity is wrong, repairs are recurring, or the unit is near the end of its expected life. Compare repair cost against remaining life.",
    urgentNote: "If the tank is actively leaking, shut off the water supply to the heater and protect nearby electrical areas.",
    service: { label: "Water heater service", path: "/plumbing/water-heaters" },
    guide: { label: "Water heater repair vs replacement", path: "/guides/water-heater-repair-vs-replace" },
    sources: [source("ENERGY STAR water heater guidance"), source("Austin Development Services permit guide")],
  },
  {
    question: "Why does my drain keep clogging?",
    variants: ["recurring clog", "roots", "grease", "old pipe", "snake did not work"],
    answer:
      "A recurring clog usually means the first cleaning cleared the symptom but not the cause. Common causes include grease buildup, scale, root intrusion, pipe bellies, broken pipe sections, poor slope, or items lodged deeper in the line. If the same drain keeps backing up, ask for camera evidence or a clearer diagnosis before approving repeated snaking.",
    urgentNote: "Multiple fixtures backing up at once can indicate a mainline or sewer issue and should be treated as urgent.",
    service: { label: "Drain cleaning", path: "/plumbing/drain-cleaning" },
    guide: { label: "Drain cleaning vs hydro jetting", path: "/guides/drain-cleaning-vs-hydro-jetting" },
    sources: [source("EPA WaterSense leak guidance")],
  },
  {
    question: "Is hydro jetting worth it or safe?",
    variants: ["hydro jetting vs snake", "old pipe risk", "roots", "grease"],
    answer:
      "Hydro jetting can be worth it when the pipe can handle pressure and the blockage is grease, scale, sludge, or recurring buildup. It is not automatically right for damaged, collapsed, fragile, or poorly diagnosed lines. A camera inspection before or after jetting helps confirm whether jetting solved the cause or revealed a repair need.",
    urgentNote: "Do not approve jetting on an unknown old sewer line without asking how pipe condition was checked.",
    service: { label: "Hydro jetting", path: "/plumbing/hydro-jetting" },
    guide: { label: "Drain cleaning vs hydro jetting", path: "/guides/drain-cleaning-vs-hydro-jetting" },
    sources: [source("Texas State Board of Plumbing Examiners")],
  },
  {
    question: "Does homeowners insurance cover plumbing leaks?",
    variants: ["slab leak insurance", "water damage", "pipe repair", "sudden vs gradual"],
    answer:
      "Insurance coverage depends on the policy and the cause. Sudden water damage is often treated differently from slow leaks, maintenance issues, pipe replacement, and access or restoration costs. Before making assumptions, document the leak, take photos, save plumber findings, keep mitigation records, and ask your insurer what evidence they need.",
    urgentNote: "Dry wet materials quickly; mold and secondary damage can become a separate problem.",
    service: { label: "Leak detection", path: "/plumbing/leak-detection" },
    guide: { label: "Homeowners insurance and plumbing", path: "/guides/homeowners-insurance-plumbing" },
    sources: [source("EPA WaterSense leak guidance")],
  },
  {
    question: "How hard is Austin water and do I need a softener?",
    variants: ["Austin water hardness", "water spots", "water heater sediment", "filter vs softener"],
    answer:
      "Austin Water's published reports show municipal hardness that should be read from the current official report, then compared with your home conditions. Fixture scale, heater sediment, private wells, neighboring utilities, and house plumbing can change what you experience. Test before buying equipment, then compare softener, carbon filter, reverse osmosis, or combination systems.",
    urgentNote: "Do not buy a treatment system based only on a door-to-door test or generic city claim.",
    service: { label: "Water treatment", path: "/plumbing/water-treatment" },
    guide: { label: "Austin hard water guide", path: "/guides/austin-hard-water" },
    sources: [source("Austin Water quality reports"), source("EPA WaterSense leak guidance")],
  },
];
