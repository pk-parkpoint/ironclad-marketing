import { choice, result } from "./experience-helpers";
import type { DataDeskExperience } from "./experience-types";

export const DATA_DESK_EXPERIENCES_21_25: DataDeskExperience[] = [
  {
    slug: "seller-remodel-plumbing-planner", accent: "#5A5FD0", accent2: "#8A86EE",
    headline: "Build a realistic scope before requesting bids", highlight: "realistic scope",
    signature: { value: "$–$$", label: "Example planning budget band", stats: [{ value: "5", count: 5, label: "project scopes" }, { value: "4", count: 4, label: "planning outputs" }, { value: "Index", label: "cost-linked" }] },
    rowLabels: ["Likely scope", "Budget band", "Permits", "Sequencing"],
    control: { type: "picker", label: "Choose a project", options: [
      choice("Kitchen remodel", "$$$", "high", ["Sink, disposal, dishwasher and possible line relocation", "$$$ · layout-dependent", "Trade permit likely if piping changes", "Finalize cabinets / appliances before rough plumbing"]),
      choice("Bathroom remodel", "$$–$$$", "high", ["Fixture replacement; possible drain, vent and supply relocation", "$$–$$$", "Trade permit likely for layout changes", "Demolition → rough plumbing → waterproofing → trim"]),
      choice("Water heater swap", "$–$$", "moderate", ["Like-for-like heater, connections, drain pan and code items", "$–$$", "Confirm local trade-permit path", "Select equipment before disconnecting the old unit"]),
      choice("Whole-home repipe", "$$$$", "severe", ["Supply distribution, access, patching and fixture reconnection", "$$$$", "Plumbing permit and inspection expected", "Map access and occupied-room phases before work"]),
      choice("Add a bathroom", "$$$$", "severe", ["New drain, vent, water, fixtures and tie-ins", "$$$$ · location-sensitive", "Building and plumbing permits likely", "Confirm feasibility before architectural finish decisions"]),
    ] },
  },
  {
    slug: "hoa-multifamily-water-risk", accent: "#3766C9", accent2: "#5AA6E8",
    headline: "One water-risk operating system for the portfolio", highlight: "water-risk operating system",
    signature: { value: "42", label: "Buildings tracked", stats: [{ value: "4", count: 4, label: "demo buildings" }, { value: "3", count: 3, label: "live feeds" }, { value: "Private", label: "operations" }] },
    rowLabels: ["Freeze readiness", "Open incidents", "Last inspection", "Shutoff plan"],
    control: { type: "picker", label: "Choose a building", options: [
      choice("Oakline (1985)", "Action needed", "high", ["72% · 3 exterior runs unverified", "2 · one active leak", "Nov 14, 2025", "Mapped · two valve photos need refresh"]),
      choice("Rivercrest (2002)", "Watch", "moderate", ["88% · resident notice pending", "0", "Jan 9, 2026", "Complete · annual drill due"]),
      choice("The Mueller (2015)", "Ready", "low", ["97% · all critical points confirmed", "0", "Mar 18, 2026", "Complete · QR cards distributed"]),
      choice("Clubhouse & amenities", "Review", "moderate", ["81% · irrigation backflow check due", "1 · slow floor drain", "Oct 22, 2025", "Main valve mapped · pool branch pending"]),
    ] },
  },
  {
    slug: "austin-irrigation-water-budget", accent: "#2AA36A", accent2: "#5FD98F",
    headline: "Watering rules, weather, usage, and cost in one tool", highlight: "one tool",
    signature: { value: "Tue / Sat", label: "Example assigned watering days", stats: [{ value: "3", count: 3, label: "demo ZIPs" }, { value: "7", count: 7, label: "day rainfall" }, { value: "Live", label: "rule checks" }] },
    rowLabels: ["Watering days", "Allowed hours", "Restriction stage", "Rain last 7 days", "Rebates available"],
    control: { type: "search", label: "Search by ZIP code", placeholder: "Enter a ZIP code", samples: [
      choice("78704", "Austin Water", "info", ["Tuesday / Saturday", "Before 10 AM or after 7 PM", "Stage 2", "0.42 in", "Smart controller and efficiency offers · verify eligibility"]),
      choice("78745", "Austin Water", "info", ["Wednesday / Sunday", "Before 10 AM or after 7 PM", "Stage 2", "0.36 in", "Irrigation upgrade offers · verify eligibility"]),
      choice("78660", "Verify utility", "moderate", ["Address-dependent", "Confirm with serving utility", "Provider-specific", "0.28 in", "Provider programs vary"]),
    ], fallback: result("Utility check needed", "Verify", "unknown", ["Address-dependent", "Confirm with the serving utility", "Provider-specific", "Local station estimate unavailable", "Check official utility programs"], "ZIP boundaries do not always match water providers. Confirm the serving utility.") },
  },
  {
    slug: "restaurant-commercial-water-drain-planner", accent: "#3F86D8", accent2: "#63C0EC",
    headline: "Document the water and drain systems a business depends on", highlight: "systems a business depends on",
    signature: { value: "12", label: "Fixtures · mid-size kitchen example", stats: [{ value: "5", count: 5, label: "business types" }, { value: "4", count: 4, label: "risk outputs" }, { value: "Ops", label: "continuity plan" }] },
    rowLabels: ["Fixture inventory", "Grease risk", "Maintenance interval", "Priority upgrade"],
    control: { type: "picker", label: "Choose a business profile", options: [
      choice("Full-service restaurant", "High grease", "high", ["12 fixtures · 3 hot-water appliances", "High · interceptor and kitchen branches", "Monthly line review · interceptor per permit / load", "Map shutoffs and verify hot-water recovery"]),
      choice("Coffee shop", "Moderate", "moderate", ["8 fixtures · espresso and warewashing", "Moderate · milk solids and grounds", "Quarterly drain review", "Dedicated filtration and accessible equipment shutoffs"]),
      choice("Bar", "Moderate", "moderate", ["10 fixtures · glass washers and floor drains", "Moderate · citrus, syrup and floor debris", "Quarterly branch / floor-drain review", "Floor-drain maintenance and labeled shutoffs"]),
      choice("Bakery", "High solids", "high", ["11 fixtures · mixers and warewashing", "High · dough, fats and solids", "Monthly high-use branch review", "Solids handling and drain-screen program"]),
      choice("Food-truck commissary", "Variable", "moderate", ["9 shared fixtures · fill and waste points", "Variable by tenant and waste practice", "Monthly shared-system review", "Tenant rules, backflow checks and emergency contacts"]),
    ] },
  },
  {
    slug: "plumbing-troubleshooting-tools", accent: "#4A78D6", accent2: "#6FB0EE",
    headline: "The first five questions staff asks every caller", highlight: "first five questions",
    signature: { value: "8", label: "Embeddable troubleshooting modules", stats: [{ value: "6", count: 6, label: "demo modules" }, { value: "4", count: 4, label: "answer fields" }, { value: "Safe", label: "triage ceiling" }] },
    rowLabels: ["First check", "Likely cause", "Can it wait?", "When to call"],
    control: { type: "picker", label: "Choose a symptom", options: [
      choice("Running toilet", "Can wait briefly", "low", ["Lift the tank lid only if stable; see whether the flapper seals", "Flapper, fill valve or chain", "Usually, if water is contained", "When it will not stop, leaks outside the tank or raises the bill"]),
      choice("Slow drain", "Schedule", "moderate", ["Check whether one fixture or several are affected", "Local trap / branch clog or main-line issue", "One slow fixture can often wait briefly", "Multiple backups, sewage or recurring symptoms need prompt help"]),
      choice("No hot water", "Same-day", "moderate", ["Look only for visible leaking and note system type", "Controls, power / gas supply or heater failure", "Briefly if there is no leak or gas odor", "Same day; immediately for leaking or gas odor"]),
      choice("Garbage disposal jammed", "Safe check", "moderate", ["Turn it off at the switch and breaker before any external reset", "Jam, overload or failed motor", "Yes, if isolated and not leaking", "If it hums repeatedly, leaks or the circuit will not reset"]),
      choice("Low pressure", "Investigate", "info", ["Compare hot / cold and one fixture / whole home", "Aerator, valve, regulator or utility supply", "Usually, unless pressure suddenly collapsed with leaking", "For whole-home, sudden or recurring pressure loss"]),
      choice("Sewer odor", "Prompt", "high", ["Identify the room and whether a drain is dry or backing up", "Dry trap, vent issue or drain / sewer defect", "Only a brief dry-trap odor without backup", "Promptly for persistent odor, sewage, illness or multiple drains"]),
    ] },
  },
];
