import { choice } from "./experience-helpers";
import type { DataDeskExperience } from "./experience-types";

export const DATA_DESK_EXPERIENCES_06_10: DataDeskExperience[] = [
  {
    slug: "austin-water-conditions", accent: "#1CA3C9", accent2: "#43D6E0",
    headline: "Austin’s water situation in one card", highlight: "water situation",
    signature: { value: "Stage 2", label: "Current watering restrictions", stats: [{ value: "15", count: 15, label: "minute source cycle" }, { value: "5", count: 5, label: "signals combined" }, { value: "Live", label: "alert monitoring" }] },
    rowLabels: ["Current value", "What it means", "Source", "Updated"],
    control: { type: "picker", label: "Choose a water signal", options: [
      choice("Watering restrictions", "Stage 2", "moderate", ["Stage 2", "Assigned-day outdoor watering; check address schedule", "Austin Water", "Today · 7:45 AM"]),
      choice("Highland Lakes storage", "Watch", "moderate", ["52% combined storage", "Supply remains below the long-term target", "LCRA Hydromet", "15 minutes ago"]),
      choice("Drought stage", "Severe", "high", ["D2 · Severe drought", "Conserve and expect restrictions to remain active", "U.S. Drought Monitor", "Thursday release"]),
      choice("Recent rainfall", "Low", "info", ["0.42 in · past 7 days", "Not enough rain to suspend all irrigation", "NWS Camp Mabry", "1 hour ago"]),
      choice("Boil-water status", "Clear", "low", ["No active citywide notice", "Normal official guidance is in effect", "Austin Water alerts", "Checked 5 minutes ago"]),
    ] },
  },
  {
    slug: "austin-water-quality-hardness", accent: "#2AAE9E", accent2: "#57D9C4",
    headline: "What water measurements mean for the systems in a home", highlight: "measurements",
    signature: { value: "168", unit: "ppm", label: "Total hardness · classified hard", stats: [{ value: "12", count: 12, label: "month trend" }, { value: "4", count: 4, label: "measures tracked" }, { value: "PDF", label: "human verified" }] },
    rowLabels: ["Latest reading", "Classification", "12-month trend", "What it affects"],
    control: { type: "picker", label: "Choose a published measurement", options: [
      choice("Total hardness", "Hard", "moderate", ["168 ppm · 9.8 gpg", "Hard", "+6 ppm across 12 months", "Scale on fixtures, heaters and appliances"]),
      choice("pH", "Normal", "low", ["7.7", "Within the reported operating range", "Stable · ±0.2", "Corrosion and treatment context, not a home diagnosis"]),
      choice("Total dissolved solids", "Watch", "info", ["286 ppm", "Typical published local range", "+18 ppm across 12 months", "Taste, spotting and equipment maintenance context"]),
      choice("Chloramine", "Reported", "info", ["2.4 mg/L", "Within Austin Water’s published range", "Stable", "Filter compatibility and aquarium handling guidance"]),
    ] },
  },
  {
    slug: "austin-flood-sewer-backflow-risk", accent: "#3757C9", accent2: "#4FA0E8",
    headline: "Where flood conditions meet home plumbing", highlight: "flood conditions",
    signature: { value: "3", label: "Active flood alerts · Travis County", stats: [{ value: "5", count: 5, label: "watersheds" }, { value: "4", count: 4, label: "source layers" }, { value: "Event", label: "update mode" }] },
    rowLabels: ["Gauge status", "Active alert", "Backflow risk", "Post-flood action"],
    control: { type: "picker", label: "Choose a watershed", options: [
      choice("Onion Creek", "High", "high", ["Stream rising rapidly", "Flood warning active", "Elevated where drains or cleanouts are submerged", "Avoid contact; inspect backflow and drain systems after water recedes"]),
      choice("Shoal Creek", "Moderate", "moderate", ["Above normal", "Flood advisory", "Watch low fixtures and below-grade drains", "Document water entry and keep fixtures out of service if contaminated"]),
      choice("Waller Creek", "Watch", "moderate", ["Rising", "No warning · advisory nearby", "Localized risk near low connections", "Check cleanouts and floor drains after the event"]),
      choice("Williamson Creek", "High", "high", ["Near action stage", "Flood warning active", "Elevated for low-lying properties", "Do not clear contaminated backups without protective help"]),
      choice("Lady Bird Lake corridor", "Normal", "low", ["Within observed range", "No active alert", "No broad elevation indicated", "Continue normal maintenance and monitor official alerts"]),
    ] },
  },
  {
    slug: "austin-home-services-cost-index", accent: "#4A6BD6", accent2: "#6FA8EE",
    headline: "The cost of maintaining an Austin home", highlight: "maintaining",
    signature: { value: "7", label: "Home-service trades tracked", stats: [{ value: "Quarterly", label: "release" }, { value: "25–75", label: "percentile band" }, { value: "Local", label: "completed work" }] },
    rowLabels: ["Median service call", "Typical project range", "Quarter over quarter", "Contributing firms"],
    control: { type: "picker", label: "Choose a home-service trade", options: [
      choice("Plumbing", "+4.2%", "info", ["$325", "$285–$2,450", "+4.2%", "6 qualified contributors"]),
      choice("HVAC", "+5.1%", "moderate", ["$289", "$240–$7,800", "+5.1%", "5 qualified contributors"]),
      choice("Electrical", "+2.4%", "info", ["$275", "$225–$3,900", "+2.4%", "4 qualified contributors"]),
      choice("Roofing", "+1.8%", "info", ["$475", "$390–$14,500", "+1.8%", "4 qualified contributors"]),
      choice("Appliance repair", "−0.7%", "low", ["$245", "$190–$625", "−0.7%", "3 qualified contributors"]),
      choice("Restoration", "+8.6%", "high", ["$1,250", "$650–$9,800", "+8.6%", "3 qualified contributors"]),
    ] },
  },
  {
    slug: "austin-storm-damage-survey", accent: "#2F6FD0", accent2: "#57B7E8",
    headline: "How an event hits real homes, live", highlight: "real homes",
    signature: { value: "642", label: "Voluntary responses so far", stats: [{ value: "5", count: 5, label: "impact types" }, { value: "24/7", label: "moderation" }, { value: "Opt-in", label: "survey" }] },
    rowLabels: ["Share reporting this", "Median repair cost", "Time without service", "When it appeared"],
    control: { type: "picker", label: "Choose a reported outcome", options: [
      choice("No damage", "54%", "low", ["54% of responses", "$0", "No interruption", "After both freeze nights"]),
      choice("Minor leak", "18%", "moderate", ["18% of responses", "$425", "Under 4 hours", "Mostly during the thaw"]),
      choice("Burst pipe", "11%", "severe", ["11% of responses", "$2,850", "14 hours", "Peak reports during thaw"]),
      choice("No water", "10%", "high", ["10% of responses", "$180", "9 hours", "First overnight freeze"]),
      choice("Water-heater failure", "7%", "high", ["7% of responses", "$2,200", "22 hours", "Second morning"]),
    ] },
  },
];
