import { choice, result } from "./experience-helpers";
import type { DataDeskExperience } from "./experience-types";

export const DATA_DESK_EXPERIENCES_11_15: DataDeskExperience[] = [
  {
    slug: "austin-contractor-license-permit-search", accent: "#3D7BD0", accent2: "#5FBCE8",
    headline: "Verify the contractor using official records", highlight: "official records",
    signature: { value: "Official", label: "Direct verification paths", stats: [{ value: "2", count: 2, label: "agency systems" }, { value: "4", count: 4, label: "record fields" }, { value: "Live", label: "source links" }] },
    rowLabels: ["License status", "License number", "Trade", "Permits / verification"],
    control: { type: "search", label: "Search a contractor or license", placeholder: "Company name or license number", samples: [
      choice("Ironclad Plumbing", "Verify official", "info", ["Use TSBPE current-status record", "M-45179", "Responsible master plumber", "Open Austin AB+C permit search"], "Always confirm the current agency record before signing."),
      choice("Reliant Plumbing", "Verify official", "info", ["Use TSBPE current-status record", "Search by company / responsible master", "Plumbing", "Open official license and Austin permit results"]),
      choice("QuickFix Handyman", "Trade check", "moderate", ["No demo plumbing-license match", "Not provided", "Handyman listing · plumbing scope must be verified", "Check the individual license holder and project permit"]),
      choice("License # M-38", "Partial match", "unknown", ["Open official result to confirm", "M-38…", "Master plumber record search", "Review current status and responsible company"]),
    ], fallback: result("Official verification links", "Verify", "unknown", ["Search the current TSBPE record", "Enter the complete license number", "Confirm the licensed trade", "Search Austin AB+C by address or contractor"], "No local demo record matched; use the official agency links shown here.") },
  },
  {
    slug: "austin-leak-water-waste-economics", accent: "#1CA3C9", accent2: "#5FE0D0",
    headline: "Turn an invisible leak into gallons and dollars", highlight: "gallons and dollars",
    signature: { value: "6,570", unit: "gal/yr", label: "Example running toilet", stats: [{ value: "$83", label: "annual impact" }, { value: "5", count: 5, label: "leak types" }, { value: "Rate", label: "versioned" }] },
    rowLabels: ["Water lost / year", "Water lost / month", "Added cost / month", "Added cost / year", "Everyday equivalent"],
    control: { type: "picker", label: "Choose a leak example", options: [
      choice("Running toilet", "$83 / yr", "high", ["6,570 gallons", "548 gallons", "$6.90", "$82.78", "About 110 bathtub fills"]),
      choice("Faucet drip", "$14 / yr", "moderate", ["1,095 gallons", "91 gallons", "$1.15", "$13.80", "About 73 dishwasher cycles"]),
      choice("Showerhead leak", "$28 / yr", "moderate", ["2,190 gallons", "183 gallons", "$2.30", "$27.59", "About 44 ten-minute showers"]),
      choice("Irrigation valve", "$276 / yr", "severe", ["21,900 gallons", "1,825 gallons", "$23.00", "$275.94", "More than a small pool"]),
      choice("Water-heater T&P valve", "$110 / yr", "high", ["8,760 gallons", "730 gallons", "$9.20", "$110.38", "About 146 bathtub fills"]),
    ] },
  },
  {
    slug: "austin-home-systems-triage", accent: "#4A78D6", accent2: "#6FB0EE",
    headline: "Call the right professional first", highlight: "right professional",
    signature: { value: "12", label: "Safety-reviewed service routes", stats: [{ value: "5", count: 5, label: "starting symptoms" }, { value: "1st", label: "safe action" }, { value: "24/7", label: "emergency route" }] },
    rowLabels: ["Do first", "Then call", "Contingency"],
    control: { type: "picker", label: "What is happening?", options: [
      choice("Water spreading fast", "Act now", "severe", ["Shut off water if you can do so safely", "Emergency plumber · then restoration if needed", "If near electricity, keep clear and call emergency services"]),
      choice("Gas / rotten-egg smell", "Leave now", "severe", ["Leave without operating switches or flames", "911 and the gas utility from outside", "Do not re-enter until the authority clears it"]),
      choice("No hot water", "Same-day", "moderate", ["Check for visible leaking; do not open gas/electric panels", "Licensed plumber", "If there is gas odor or active leaking, use the emergency route"]),
      choice("Slow / backing-up drain", "Plumber", "moderate", ["Stop using affected fixtures", "Drain or sewer plumber", "If sewage is spreading, isolate the area and escalate"]),
      choice("No water at all", "Verify utility", "info", ["Check whether neighbors or Austin Water report an outage", "Utility first, then plumber if property-specific", "If a private line is leaking, shut off and call a plumber"]),
    ] },
  },
  {
    slug: "tenant-plumbing-maintenance-triage", accent: "#3F8AD8", accent2: "#63C4EC",
    headline: "A maintenance coordinator for every tenant, 24/7", highlight: "every tenant",
    signature: { value: "24/7", label: "Partner-branded resident coverage", stats: [{ value: "5", count: 5, label: "urgent flows" }, { value: "1", count: 1, label: "safety engine" }, { value: "Fast", label: "complete tickets" }] },
    rowLabels: ["Do first", "Then", "Meanwhile"],
    control: { type: "picker", label: "Choose the maintenance issue", options: [
      choice("Overflowing toilet", "Emergency", "severe", ["Stop the fixture valve and do not flush again", "Call the property emergency line", "Move belongings and document safe visible damage"]),
      choice("Active leak under sink", "Urgent", "high", ["Close the local valves if reachable and safe", "Submit an urgent ticket with a photo", "Use a container; avoid electrical items and cabinets"]),
      choice("No hot water", "Priority", "moderate", ["Check only the visible leak status", "Submit the property’s priority maintenance ticket", "Do not open heater panels or relight equipment"]),
      choice("No water at all", "Verify", "info", ["Check property notices and neighboring fixtures", "Contact the manager / utility route shown", "Keep all taps closed until service returns"]),
      choice("Sewage backup", "Emergency", "severe", ["Stop water use and keep people away", "Call the property emergency line immediately", "Do not use chemicals or clean contaminated water unprotected"]),
    ] },
  },
  {
    slug: "homebuyer-inspection-action-planner", accent: "#5566D0", accent2: "#7FA2EE",
    headline: "Turn inspection findings into a prioritized action list", highlight: "prioritized action list",
    signature: { value: "High", label: "Example urgency · galvanized supply", stats: [{ value: "6", count: 6, label: "common findings" }, { value: "3", count: 3, label: "next steps" }, { value: "Calm", label: "decision support" }] },
    rowLabels: ["Why it matters", "Ask", "Next professional"],
    control: { type: "picker", label: "Choose an inspection finding", options: [
      choice("Older water heater", "Plan", "moderate", ["Failure risk rises beyond typical service life", "Age, maintenance history, leaks and venting", "Licensed plumber for condition and replacement paths"]),
      choice("Low pressure", "Investigate", "moderate", ["May be fixture-specific, regulator-related or supply-wide", "Which fixtures, when it started and static pressure", "Plumber after utility / area scope is checked"]),
      choice("Cast-iron drains", "Inspect", "high", ["Age, corrosion and root entry can affect remaining service", "Camera findings, repairs and recurring backup history", "Drain / sewer specialist"]),
      choice("Galvanized supply", "High", "high", ["Internal corrosion can reduce flow and reliability", "Visible material, pressure and any partial replacement", "Licensed plumber for material verification and scope"]),
      choice("Signs of past leak", "Verify dry", "moderate", ["A stain cannot show whether a leak is active", "Moisture reading, repair record and affected materials", "Inspector / restoration professional, then plumber if active"]),
      choice("Polybutylene pipe", "High", "high", ["Material history and fittings warrant careful verification", "Extent, fittings, prior failures and insurability", "Licensed plumber and insurance professional"]),
    ] },
  },
];
