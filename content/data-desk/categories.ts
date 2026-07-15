import type { DataDeskCategory } from "./types";

export const DATA_DESK_CATEGORIES: DataDeskCategory[] = [
  {
    id: "live-risk",
    label: "Live risk and conditions",
    description: "Event-driven dashboards that translate weather and water conditions into homeowner actions.",
    relatedGuideLinks: [
      { href: "/guides/plumbing-emergency-first-10-minutes", label: "Plumbing emergency: first 10 minutes" },
      { href: "/plumbing/emergency", label: "Emergency plumbing services" },
    ],
  },
  {
    id: "market-costs",
    label: "Costs, demand and permits",
    description: "Original Austin indicators for repair prices, service demand, remodeling and water waste.",
    relatedGuideLinks: [
      { href: "/guides/what-plumbing-costs-austin", label: "What plumbing costs in Austin" },
      { href: "/guides/water-heater-replacement-cost-austin", label: "Water heater replacement costs" },
    ],
  },
  {
    id: "property-research",
    label: "Property and project research",
    description: "Address, permit and planning tools for buyers, sellers and Austin property professionals.",
    relatedGuideLinks: [
      { href: "/guides/questions-to-ask-your-plumber", label: "Questions to ask a plumber" },
      { href: "/plumbing/plumbing-inspection", label: "Plumbing inspections" },
    ],
  },
  {
    id: "decision-tools",
    label: "Homeowner decision tools",
    description: "Guided tools for choosing the right response, professional or replacement path.",
    relatedGuideLinks: [
      { href: "/guides/when-diy-vs-call-plumber", label: "When to DIY or call a plumber" },
      { href: "/guides/water-heater-repair-vs-replace", label: "Repair or replace a water heater" },
    ],
  },
  {
    id: "partner-operations",
    label: "Partner and property operations",
    description: "Configurable tools for managers, HOAs, commercial operators and resident communications.",
    relatedGuideLinks: [
      { href: "/commercial-plumbing", label: "Commercial plumbing services" },
      { href: "/plumbing/backflow-prevention", label: "Backflow prevention and testing" },
    ],
  },
];
