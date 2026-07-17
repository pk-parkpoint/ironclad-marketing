import { choice } from "./experience-helpers";
import type { DataDeskExperience } from "./experience-types";

export const DATA_DESK_EXPERIENCES_16_20: DataDeskExperience[] = [
  {
    slug: "austin-leak-cost-calculator", accent: "#1FA0C4", accent2: "#54D6C8",
    headline: "Show exactly what a small leak costs", highlight: "small leak costs",
    signature: { value: "$14", unit: "/ month", label: "Example · one drip per second", stats: [{ value: "4", count: 4, label: "live outputs" }, { value: "Austin", label: "rate context" }, { value: "Instant", label: "recalculation" }] },
    rowLabels: ["Water lost / month", "Water lost / year", "Added cost / month", "Added cost / year"],
    control: { type: "leak-calculator", label: "Enter observed drips per minute", defaultValue: 120, presets: [{ label: "Slow", value: 30 }, { label: "Steady", value: 120 }, { label: "Fast", value: 300 }, { label: "Small stream", value: 900 }] },
  },
  {
    slug: "water-heater-decision-lab", accent: "#D9822B", accent2: "#F2B23C",
    headline: "Make the replacement decision before the tank does", highlight: "before the tank does",
    signature: { value: "11", unit: "years", label: "Example · past typical tank life", stats: [{ value: "3", count: 3, label: "system types" }, { value: "Life", label: "range compared" }, { value: "Local", label: "incentive context" }] },
    rowLabels: ["Estimated age", "System type", "Typical service life", "Recommendation"],
    control: { type: "heater-calculator", label: "Enter installation year and system type", defaultYear: 2015, systemTypes: ["Tank", "Tankless", "Heat pump"] },
  },
  {
    slug: "permit-rebate-incentive-navigator", accent: "#6A4FD0", accent2: "#9E7BEE",
    headline: "The paperwork, incentives, and official next steps", highlight: "official next steps",
    signature: { value: "2", label: "Likely permits · heater conversion", stats: [{ value: "6", count: 6, label: "project paths" }, { value: "3", count: 3, label: "authorities" }, { value: "Live", label: "official links" }] },
    rowLabels: ["Likely permits", "Where to apply", "Rebates", "Who to contact"],
    control: { type: "picker", label: "Choose a planned project", options: [
      choice("Water heater replacement", "Confirm", "info", ["Trade permit may apply", "Austin Build + Connect", "Check current Austin Energy offers", "Development Services and your utility"]),
      choice("Tankless conversion", "2 likely", "moderate", ["Plumbing plus gas / electrical trade permits", "Austin Build + Connect", "Efficiency incentives may apply", "Development Services, gas utility and installer"]),
      choice("Bathroom remodel", "Scope-based", "moderate", ["Plumbing permit; building permit if layout changes", "Austin Build + Connect", "WaterSense fixture offers may apply", "Development Services"]),
      choice("New irrigation", "Permit + rules", "moderate", ["Irrigation permit / licensed installer path", "Jurisdiction permit portal", "Controller and efficiency rebates may apply", "Austin Water conservation team"]),
      choice("Whole-home repipe", "Permit", "moderate", ["Plumbing trade permit", "Austin Build + Connect", "Limited direct rebate; check current programs", "Development Services and water utility"]),
      choice("Water softener", "Verify discharge", "info", ["Permit depends on connections and jurisdiction", "Confirm with local authority", "Check current efficiency programs", "Utility and Development Services"]),
    ] },
  },
  {
    slug: "freeze-shutoff-plan-builder", accent: "#2F7FD6", accent2: "#4FCBE0",
    headline: "Never search for the shutoff while water is entering", highlight: "the shutoff",
    signature: { value: "1-tap", label: "Private QR shutoff card", stats: [{ value: "5", count: 5, label: "property types" }, { value: "3", count: 3, label: "plan formats" }, { value: "Private", label: "by default" }] },
    rowLabels: ["Main shutoff usually", "Most vulnerable points", "Before a freeze", "Plan output"],
    control: { type: "picker", label: "Choose the property type", options: [
      choice("Slab foundation", "Build plan", "info", ["Meter box or exterior service entry", "Exterior bibbs, attic runs and garage lines", "Cover, insulate and label the meter tool", "Private mobile card + printable QR sheet"]),
      choice("Pier-and-beam", "Higher exposure", "high", ["Meter box or crawlspace service entry", "Crawlspace supply and uninsulated floor runs", "Insulate exposed piping and close vents safely", "Private page + crawlspace photo card + PDF"]),
      choice("Two-story", "Zone check", "moderate", ["Meter / service entry; interior manifold if present", "Upper exterior walls, attic and remote fixtures", "Map each isolation valve and protect attic lines", "Private mobile card + floor-by-floor checklist"]),
      choice("Condo / apartment", "Manager route", "info", ["Building or unit shutoff set by management", "Exterior wall fixtures and shared risers", "Save the emergency contact and unit valve photo", "Resident card + manager contact route"]),
      choice("New construction", "Document now", "low", ["Garage, utility room or exterior manifold", "Hose bibbs and any attic / exterior runs", "Photograph valves before finishes hide context", "Private page + labeled system map + QR"]),
    ] },
  },
  {
    slug: "pipe-material-pressure-flow-diagnostics", accent: "#3C82D6", accent2: "#5FBEEC",
    headline: "Describe what you have, not pretend a photo is an inspection", highlight: "Describe what you have",
    signature: { value: "62", unit: "psi", label: "Example · normal static pressure", stats: [{ value: "6", count: 6, label: "visible clues" }, { value: "0", count: 0, label: "hidden claims" }, { value: "Safe", label: "next steps" }] },
    rowLabels: ["Likely material", "Typical era", "Common concern", "Next step"],
    control: { type: "picker", label: "Choose the closest visible description", options: [
      choice("Dull gray → silver", "Galvanized?", "moderate", ["Galvanized steel is possible", "Common in early / mid-1900s homes", "Internal corrosion and reduced flow", "Confirm magnetism and have a plumber verify exposed material"]),
      choice("Reddish-brown", "Copper?", "info", ["Copper is likely", "Common across many postwar eras", "Joint leaks, pinholes or localized corrosion", "Document joints and pressure; inspect concerns in person"]),
      choice("White / cream flexible", "PEX?", "info", ["PEX is possible", "Common in newer work and repipes", "Fitting system, UV exposure and support", "Find printed markings and fitting type for verification"]),
      choice("Dull gray plastic", "PB warning", "high", ["Polybutylene is possible", "Common roughly late 1970s–mid 1990s", "Material and fitting failure history", "Do not diagnose from color alone; schedule material verification"]),
      choice("Black magnetic", "Steel / cast iron?", "moderate", ["Steel supply or cast-iron drain is possible", "Common in older systems", "Corrosion, scaling or drain deterioration", "Identify whether it is supply or drain and inspect its condition"]),
      choice("Not sure", "Unknown", "unknown", ["Unable to identify", "Unknown", "Color and photos are insufficient", "Use printed markings or request an in-person inspection"]),
    ] },
  },
];
