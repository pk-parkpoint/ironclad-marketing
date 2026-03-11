export type GuideHubGroupId =
  | "pricing"
  | "before-hire"
  | "comparisons"
  | "reference"
  | "cost-guides"
  | "replacement-signs"
  | "tools";

export type GuideEntry = {
  slug: string;
  title: string;
  hubGroup: GuideHubGroupId;
  routeLabel: string;
};

export type GuideHubGroup = {
  id: GuideHubGroupId;
  anchorId: string;
  title: string;
  description: string;
};

export const GUIDE_HUB_GROUPS: GuideHubGroup[] = [
  {
    id: "pricing",
    anchorId: "pricing",
    title: "Know the Prices",
    description: "Price transparency pages covering what common plumbing work should cost in Austin.",
  },
  {
    id: "before-hire",
    anchorId: "before-you-hire",
    title: "Hire the Right Plumber",
    description: "Consumer guides for vetting plumbers, reviewing estimates, and avoiding pressure tactics.",
  },
  {
    id: "comparisons",
    anchorId: "comparisons",
    title: "Compare Your Options",
    description: "Side-by-side decision guides for repairs, replacements, and system choices.",
  },
  {
    id: "reference",
    anchorId: "austin-reference",
    title: "Austin Homeowner Reference",
    description: "Austin-specific homeowner education for codes, insurance, warranties, and utility context.",
  },
  {
    id: "cost-guides",
    anchorId: "cost-guides",
    title: "What It Costs",
    description: "Quick-read cost pages for the plumbing issues homeowners compare most often.",
  },
  {
    id: "replacement-signs",
    anchorId: "replacement-signs",
    title: "When to Replace",
    description: "Replacement-sign guides that help homeowners distinguish repairable issues from failing systems.",
  },
  {
    id: "tools",
    anchorId: "tools",
    title: "Tools & Downloads",
    description: "Decision aids, prep checklists, and homeowner tools published without forms or sign-up walls.",
  },
];

export const GUIDE_ENTRIES: GuideEntry[] = [
  {
    slug: "what-plumbing-costs-austin",
    title: "What Plumbing Should Cost in Austin",
    hubGroup: "pricing",
    routeLabel: "What Plumbing Should Cost",
  },
  {
    slug: "how-plumbing-pricing-works",
    title: "How Plumbing Pricing Actually Works",
    hubGroup: "pricing",
    routeLabel: "How Plumbing Pricing Works",
  },
  {
    slug: "plumbing-pricing-tricks",
    title: "Plumbing Pricing Tricks to Watch For",
    hubGroup: "pricing",
    routeLabel: "Red Flags to Watch For",
  },
  {
    slug: "questions-to-ask-your-plumber",
    title: "10 Questions to Ask Any Plumber",
    hubGroup: "before-hire",
    routeLabel: "Questions to Ask Any Plumber",
  },
  {
    slug: "plumber-red-flags",
    title: "12 Red Flags",
    hubGroup: "before-hire",
    routeLabel: "Red Flags to Watch For",
  },
  {
    slug: "how-to-research-a-plumber",
    title: "How to Research a Plumber in 10 Minutes",
    hubGroup: "before-hire",
    routeLabel: "How to Research a Plumber",
  },
  {
    slug: "big-vs-small-plumbing-companies",
    title: "Big vs Small Plumbing Companies",
    hubGroup: "before-hire",
    routeLabel: "Big vs Small Plumbing Companies",
  },
  {
    slug: "how-to-read-a-plumbing-estimate",
    title: "How to Read a Plumbing Estimate",
    hubGroup: "before-hire",
    routeLabel: "How to Read a Plumbing Estimate",
  },
  {
    slug: "how-to-negotiate-plumbing",
    title: "How to Negotiate Plumbing Prices",
    hubGroup: "before-hire",
    routeLabel: "How to Negotiate Plumbing",
  },
  {
    slug: "plumber-call-script",
    title: "Phone Call Script",
    hubGroup: "before-hire",
    routeLabel: "Phone Call Script",
  },
  {
    slug: "water-heater-repair-vs-replace",
    title: "Water Heater Repair vs Replacement",
    hubGroup: "comparisons",
    routeLabel: "Water Heater Repair vs Replacement",
  },
  {
    slug: "tank-vs-tankless",
    title: "Tank vs Tankless Water Heaters",
    hubGroup: "comparisons",
    routeLabel: "Tank vs Tankless",
  },
  {
    slug: "drain-cleaning-vs-hydro-jetting",
    title: "Drain Cleaning vs Hydro Jetting",
    hubGroup: "comparisons",
    routeLabel: "Drain Cleaning vs Hydro Jetting",
  },
  {
    slug: "sewer-repair-options-compared",
    title: "Sewer Repair Options Compared",
    hubGroup: "comparisons",
    routeLabel: "Sewer Repair Options Compared",
  },
  {
    slug: "softener-vs-filter-vs-combo",
    title: "Softener vs Filter vs Combo",
    hubGroup: "comparisons",
    routeLabel: "Softener vs Filter vs Combo",
  },
  {
    slug: "slab-leak-repair-options",
    title: "Slab Leak Repair Options",
    hubGroup: "comparisons",
    routeLabel: "Slab Leak Repair Options",
  },
  {
    slug: "austin-hard-water",
    title: "Austin Hard Water Guide",
    hubGroup: "reference",
    routeLabel: "Austin Hard Water",
  },
  {
    slug: "austin-plumbing-codes-homeowners",
    title: "Austin Plumbing Codes for Homeowners",
    hubGroup: "reference",
    routeLabel: "Austin Plumbing Codes",
  },
  {
    slug: "winter-plumbing-prep-austin",
    title: "Winter Plumbing Prep for Austin",
    hubGroup: "reference",
    routeLabel: "Winter Plumbing Prep for Austin",
  },
  {
    slug: "how-to-read-austin-water-bill",
    title: "How to Read Your Austin Water Bill",
    hubGroup: "reference",
    routeLabel: "How to Read Your Austin Water Bill",
  },
  {
    slug: "when-diy-vs-call-plumber",
    title: "When to DIY vs Call a Plumber",
    hubGroup: "reference",
    routeLabel: "When to DIY vs Call a Plumber",
  },
  {
    slug: "homeowners-insurance-plumbing",
    title: "Homeowner's Insurance and Plumbing",
    hubGroup: "reference",
    routeLabel: "Homeowner's Insurance and Plumbing",
  },
  {
    slug: "home-warranty-plumbing",
    title: "Home Warranty and Plumbing",
    hubGroup: "reference",
    routeLabel: "Home Warranty and Plumbing",
  },
  {
    slug: "plumbing-before-selling-home",
    title: "Plumbing Before Selling Your Home",
    hubGroup: "reference",
    routeLabel: "Plumbing Before Selling Your Home",
  },
  {
    slug: "new-construction-plumbing-warranty",
    title: "New Construction Warranty Checklist",
    hubGroup: "reference",
    routeLabel: "New Construction Warranty Checklist",
  },
  {
    slug: "drain-cleaning-cost-austin",
    title: "Drain Cleaning Cost in Austin",
    hubGroup: "cost-guides",
    routeLabel: "Drain Cleaning Cost in Austin",
  },
  {
    slug: "water-heater-replacement-cost-austin",
    title: "Water Heater Replacement Cost",
    hubGroup: "cost-guides",
    routeLabel: "Water Heater Replacement Cost",
  },
  {
    slug: "sewer-repair-cost-austin",
    title: "Sewer Repair Cost in Austin",
    hubGroup: "cost-guides",
    routeLabel: "Sewer Repair Cost in Austin",
  },
  {
    slug: "leak-detection-cost-austin",
    title: "Leak Detection Cost in Austin",
    hubGroup: "cost-guides",
    routeLabel: "Leak Detection Cost in Austin",
  },
  {
    slug: "repipe-cost-austin",
    title: "Repipe Cost in Austin",
    hubGroup: "cost-guides",
    routeLabel: "Repipe Cost in Austin",
  },
  {
    slug: "signs-water-heater-needs-replacing",
    title: "Signs Your Water Heater Needs Replacing",
    hubGroup: "replacement-signs",
    routeLabel: "Signs Your Water Heater Needs Replacing",
  },
  {
    slug: "signs-sewer-line-needs-replacing",
    title: "Signs Your Sewer Line Needs Replacing",
    hubGroup: "replacement-signs",
    routeLabel: "Signs Your Sewer Line Needs Replacing",
  },
  {
    slug: "signs-water-softener-needs-replacing",
    title: "Signs Your Water Softener Needs Replacing",
    hubGroup: "replacement-signs",
    routeLabel: "Signs Your Water Softener Needs Replacing",
  },
  {
    slug: "using-ai-for-plumbing-research",
    title: "Using AI for Plumbing Research",
    hubGroup: "tools",
    routeLabel: "Using AI for Plumbing Research",
  },
  {
    slug: "before-the-plumber-arrives",
    title: "Before the Plumber Arrives",
    hubGroup: "tools",
    routeLabel: "Before the Plumber Arrives",
  },
  {
    slug: "after-the-plumber-leaves",
    title: "After the Plumber Leaves",
    hubGroup: "tools",
    routeLabel: "After the Plumber Leaves",
  },
  {
    slug: "tools",
    title: "Free Plumbing Tools",
    hubGroup: "tools",
    routeLabel: "Free Plumbing Tools",
  },
];

export const GUIDE_ENTRY_BY_SLUG = new Map(
  GUIDE_ENTRIES.map((entry) => [entry.slug, entry]),
);

export const GUIDE_ROUTE_PATHS = GUIDE_ENTRIES.map((entry) => `/guides/${entry.slug}`);

export const GUIDES_DROPDOWN_LINKS = [
  { href: "/guides/what-plumbing-costs-austin", label: "What Plumbing Should Cost" },
  { href: "/guides/questions-to-ask-your-plumber", label: "Questions to Ask Any Plumber" },
  { href: "/guides/plumber-red-flags", label: "Red Flags to Watch For" },
  { href: "/guides/#comparisons", label: "Compare Your Options" },
  { href: "/guides", label: "All Guides" },
];
