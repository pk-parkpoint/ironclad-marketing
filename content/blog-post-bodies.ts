export type BlogPostSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type BlogPostBody = {
  slug: string;
  dek: string;
  sections: BlogPostSection[];
  checklistHeading?: string;
  checklistItems?: string[];
  disclaimer?: string;
};

const HOW_TO_CHOOSE_WATER_HEATER: BlogPostBody = {
  slug: "how-to-choose-water-heater-austin",
  dek: "A practical, Austin-focused checklist for picking the right system without overpaying or undersizing.",
  sections: [
    {
      heading: "Start With Demand, Not Marketing",
      paragraphs: [
        "The right water heater starts with your household demand: bathrooms, occupancy, and how many hot-water events happen at the same time.",
        "A tank that's too small gives you cold showers. A system that's oversized costs more upfront and can be less efficient to operate.",
      ],
      bullets: [
        "Count bathrooms and typical simultaneous showers",
        "Note if you run laundry and dishwashers during peak use",
        "Consider future changes (kids, guests, remodels)",
      ],
    },
    {
      heading: "Tank vs. Tankless: The Real Tradeoffs",
      paragraphs: [
        "Tank heaters are straightforward, generally lower cost, and fast to replace. Tankless offers longer life and on-demand hot water, but it's not a free upgrade.",
        "Tankless often requires gas line sizing, venting changes, and annual maintenance. If those constraints aren't a fit, a quality tank replacement is frequently the smarter move.",
      ],
      bullets: [
        "Choose tank when you want lowest upfront cost and simple swaps",
        "Choose tankless when you want endless hot water and are ready for maintenance",
        "If you go tankless in Austin, plan for annual descaling",
      ],
    },
    {
      heading: "Austin Factor: Hard Water Changes the Math",
      paragraphs: [
        "Austin's hard water accelerates scale and sediment buildup. That can shorten tank life and reduce efficiency if the heater isn't maintained.",
        "If you have persistent scale on fixtures or you rarely flush your tank, build maintenance into your decision, not as an afterthought.",
      ],
      bullets: [
        "Flush tank heaters annually when possible",
        "Descale tankless units annually (more often in heavy hard-water exposure)",
        "Consider water treatment if scale buildup is a recurring theme",
      ],
    },
    {
      heading: "Don’t Skip Code and Venting Details",
      paragraphs: [
        "The right heater is also a code-compliant install: expansion tanks where required, correct venting, and safe gas or electrical connections.",
        "If you are changing fuel type, moving locations, or converting to tankless, plan for more than a same-day swap.",
      ],
    },
  ],
  checklistHeading: "Quick Checklist Before You Buy",
  checklistItems: [
    "Current heater age and symptoms (noise, rust-colored water, leaks)",
    "Fuel type (gas/electric) and constraints in the install location",
    "Hot-water demand and peak simultaneous use",
    "Maintenance tolerance (flush/descale) and plan",
    "Budget for code items (valves, expansion tank, venting) if needed",
  ],
  disclaimer:
    "This guide is general information. A licensed plumber should confirm sizing, venting, and code requirements for your specific home.",
};

const SLAB_LEAK_WARNING_SIGNS: BlogPostBody = {
  slug: "slab-leak-warning-signs",
  dek: "Early detection matters in Austin: expansive clay soil can amplify damage fast.",
  sections: [
    {
      heading: "Why Slab Leaks Are a Bigger Deal in Austin",
      paragraphs: [
        "Austin sits on expansive clay soil that swells with moisture and shrinks in heat. A small leak under the slab can change soil support and contribute to cracking or settling.",
        "The goal is to catch the issue early, before water damage and foundation impact compound costs.",
      ],
    },
    {
      heading: "7 Warning Signs You Shouldn’t Ignore",
      paragraphs: ["If you notice one or more of these, it’s worth investigating quickly:"],
      bullets: [
        "Water bill spikes with no change in usage",
        "Sound of running water when everything is off",
        "Warm or damp spots on flooring",
        "Musty odor with no visible source",
        "Sudden drop in water pressure",
        "Cracks appearing in walls or flooring",
        "A water meter that moves when all fixtures are off",
      ],
    },
    {
      heading: "What to Do Next (Without Guessing)",
      paragraphs: [
        "Avoid exploratory demolition. Professional leak detection uses pressure testing, acoustic tools, and thermal imaging to narrow the leak location before opening anything up.",
        "Once located, you can make a decision with real information: targeted repair vs. reroute, timeline, and cost.",
      ],
      bullets: [
        "Shut off all fixtures and check whether the meter still moves",
        "Document any visible damage (photos help for insurance conversations)",
        "Schedule leak detection to pinpoint location before repair work",
      ],
    },
    {
      heading: "Insurance Note",
      paragraphs: [
        "Policies vary. Many cover sudden breaks and resulting water damage more readily than gradual corrosion or the plumbing repair itself.",
        "Good documentation from a licensed plumber helps you have a clear conversation with your insurer.",
      ],
    },
  ],
  disclaimer:
    "If you suspect a major leak or active flooding, shut off the main water supply and contact a licensed plumber immediately.",
};

const HARD_WATER_MAINTENANCE_CHECKLIST: BlogPostBody = {
  slug: "hard-water-maintenance-checklist",
  dek: "A homeowner checklist to reduce scale, protect appliances, and keep fixtures looking clean in Austin.",
  sections: [
    {
      heading: "What Hard Water Does to Your Home",
      paragraphs: [
        "Hard water leaves scale on fixtures, reduces water heater efficiency, and can shorten the life of plumbing components over time.",
        "In Austin, staying ahead of scale is usually cheaper than replacing parts after they fail.",
      ],
    },
    {
      heading: "Maintenance That Pays Off",
      paragraphs: ["These are practical steps that reduce scale-related failures and extend equipment life:"],
      bullets: [
        "Flush tank water heaters annually to reduce sediment buildup",
        "Descale tankless water heaters annually (more often in heavy use)",
        "Clean faucet aerators and showerheads when flow drops",
        "Use a scale-safe cleaner on fixtures instead of abrasive scraping",
        "Inspect shut-off valves periodically so they work during an emergency",
      ],
    },
    {
      heading: "When to Consider Water Treatment",
      paragraphs: [
        "If you constantly battle scale, a whole-home softener is often the most effective system-wide solution.",
        "Pairing tankless heaters with water treatment can reduce maintenance burden and protect your investment.",
      ],
    },
  ],
  checklistHeading: "Austin Hard Water Checklist",
  checklistItems: [
    "Clean showerheads/aerators when flow drops",
    "Flush tank heater annually (if safe and accessible)",
    "Descale tankless annually",
    "Watch for scale buildup as an early warning sign",
    "Consider whole-home softening if scale is constant",
  ],
  disclaimer:
    "If you’re not comfortable performing maintenance or if shut-offs don’t fully close, have a licensed plumber handle service safely.",
};

const BLOG_BODIES_BY_SLUG: Record<string, BlogPostBody> = {
  "how-to-choose-water-heater-austin": HOW_TO_CHOOSE_WATER_HEATER,
  "slab-leak-warning-signs": SLAB_LEAK_WARNING_SIGNS,
  "hard-water-maintenance-checklist": HARD_WATER_MAINTENANCE_CHECKLIST,
};

export function getBlogPostBody(slug: string): BlogPostBody | null {
  return BLOG_BODIES_BY_SLUG[slug] ?? null;
}

