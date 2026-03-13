import { PRICING_SERVICE_GUIDE_SPECS } from "@/content/pricing-service-guides";

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
    title: "Make the Right Decision",
    description: "Side-by-side decision guides for repairs, replacements, and system choices.",
  },
  {
    id: "reference",
    anchorId: "austin-reference",
    title: "Austin Homeowner Reference",
    description: "Austin-specific homeowner education for codes, insurance, warranties, water bills, and hard water.",
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
    description: "Decision aids, prep checklists, AI prompts, and homeowner tools published without sign-up walls.",
  },
];

const BASE_GUIDE_ENTRIES: GuideEntry[] = [
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
    title: "10 Questions to Ask Before You Hire a Plumber",
    hubGroup: "before-hire",
    routeLabel: "Questions to Ask Before You Hire a Plumber",
  },
  {
    slug: "plumber-red-flags",
    title: "12 Red Flags That Mean You Should Hire a Different Plumber",
    hubGroup: "before-hire",
    routeLabel: "12 Red Flags",
  },
  {
    slug: "how-to-research-a-plumber",
    title: "How to Research a Plumber in 10 Minutes",
    hubGroup: "before-hire",
    routeLabel: "How to Research a Plumber",
  },
  {
    slug: "big-vs-small-plumbing-companies",
    title: "Big Plumbing Companies vs Small Ones in Austin",
    hubGroup: "before-hire",
    routeLabel: "Big vs Small Plumbing Companies",
  },
  {
    slug: "how-to-read-a-plumbing-estimate",
    title: "How to Read a Plumbing Estimate Without Getting Played",
    hubGroup: "before-hire",
    routeLabel: "How to Read a Plumbing Estimate",
  },
  {
    slug: "how-to-negotiate-plumbing",
    title: "How to Get the Best Price on Plumbing Work in Austin",
    hubGroup: "before-hire",
    routeLabel: "How to Negotiate Plumbing Prices",
  },
  {
    slug: "plumber-call-script",
    title: "The Exact Script for Calling a Plumber",
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
    routeLabel: "Austin Hard Water Guide",
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
    routeLabel: "Winter Plumbing Prep",
  },
  {
    slug: "how-to-read-austin-water-bill",
    title: "How to Read Your Austin Water Bill",
    hubGroup: "reference",
    routeLabel: "How to Read Your Austin Water Bill",
  },
  {
    slug: "when-diy-vs-call-plumber",
    title: "When to Fix It Yourself and When to Call a Plumber",
    hubGroup: "reference",
    routeLabel: "When to DIY vs Call a Plumber",
  },
  {
    slug: "homeowners-insurance-plumbing",
    title: "What Your Homeowner's Insurance Covers for Plumbing Damage",
    hubGroup: "reference",
    routeLabel: "Homeowner's Insurance and Plumbing",
  },
  {
    slug: "home-warranty-plumbing",
    title: "What Your Home Warranty Actually Covers for Plumbing",
    hubGroup: "reference",
    routeLabel: "Home Warranty and Plumbing",
  },
  {
    slug: "plumbing-before-selling-home",
    title: "Preparing Your Home's Plumbing Before You Sell",
    hubGroup: "reference",
    routeLabel: "Plumbing Before Selling Your Home",
  },
  {
    slug: "new-construction-plumbing-warranty",
    title: "New Home Plumbing Checklist Before Your Builder Warranty Expires",
    hubGroup: "reference",
    routeLabel: "New Construction Warranty Checklist",
  },
  {
    slug: "plumbing-emergency-first-10-minutes",
    title: "Plumbing Emergency: The First 10 Minutes",
    hubGroup: "tools",
    routeLabel: "Plumbing Emergency: First 10 Minutes",
  },
  {
    slug: "slab-leak-signs-austin",
    title: "Slab Leak Signs Austin Homeowners Should Not Ignore",
    hubGroup: "reference",
    routeLabel: "Slab Leak Signs",
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
    title: "How to Use ChatGPT or Claude to Not Get Ripped Off by a Plumber",
    hubGroup: "tools",
    routeLabel: "Using AI for Plumbing Research",
  },
  {
    slug: "before-the-plumber-arrives",
    title: "Before the Plumber Arrives: 5-Minute Prep",
    hubGroup: "tools",
    routeLabel: "Before the Plumber Arrives",
  },
  {
    slug: "after-the-plumber-leaves",
    title: "After the Plumber Leaves: 5-Minute Check",
    hubGroup: "tools",
    routeLabel: "After the Plumber Leaves",
  },
  {
    slug: "tools",
    title: "Free Plumbing Tools: No Email, No Sign-Up, Just Download",
    hubGroup: "tools",
    routeLabel: "Free Plumbing Tools",
  },
];

export const GUIDE_ENTRIES: GuideEntry[] = [
  ...BASE_GUIDE_ENTRIES,
  ...PRICING_SERVICE_GUIDE_SPECS.map((spec) => ({
    slug: spec.slug,
    title: spec.title,
    hubGroup: "cost-guides" as const,
    routeLabel: spec.routeLabel,
  })),
];

export const GUIDE_ENTRY_BY_SLUG = new Map(GUIDE_ENTRIES.map((entry) => [entry.slug, entry]));

export const GUIDE_ROUTE_PATHS = GUIDE_ENTRIES.map((entry) => `/guides/${entry.slug}`);

export const GUIDES_DROPDOWN_LINKS = [
  { href: "/guides/what-plumbing-costs-austin", label: "What Plumbing Should Cost" },
  { href: "/guides/questions-to-ask-your-plumber", label: "Questions to Ask Before You Hire" },
  { href: "/guides/plumber-red-flags", label: "Red Flags to Watch For" },
  { href: "/guides/tank-vs-tankless", label: "Compare Your Options" },
  { href: "/guides", label: "All Guides" },
];
