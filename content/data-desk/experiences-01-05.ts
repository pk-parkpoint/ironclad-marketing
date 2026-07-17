import { choice, result } from "./experience-helpers";
import type { DataDeskExperience } from "./experience-types";

const freezeScenarios = [
  choice("Severe", "Act now", "severe", ["83 / Severe", "18°F · 14 hr below 32°F · 6 hr below 28°F · 17 mph wind", "12–24 hours · peak risk overnight", "78724 · 78744 · 78753", "Insulate exposed lines · drip vulnerable fixtures · locate the shutoff"]),
  choice("High", "Prepare today", "high", ["64 / High", "24°F · 9 hr below 32°F · 2 hr below 28°F · 12 mph wind", "18–30 hours · early morning peak", "78745 · 78748 · 78653", "Disconnect hoses · cover bibbs · protect exterior runs"]),
  choice("Moderate", "Watch", "moderate", ["46 / Moderate", "29°F · 4 hr below 32°F · 0 hr below 28°F · 8 mph wind", "24–36 hours · short dawn window", "78704 · 78749 · 78757", "Review the shutoff plan · cover exposed fixtures · monitor updates"]),
  choice("Low", "Routine prep", "low", ["22 / Low", "33°F · 0 hr below 32°F · 0 hr below 28°F · 6 mph wind", "No dangerous window forecast", "No elevated ZIP band", "Keep supplies ready · confirm contacts · check the next forecast"]),
];

const costJobs = [
  choice("40-gal water heater", "$$$", "high", ["$2,150", "$1,750–$2,850", "Venting, access and code upgrades"]),
  choice("Tankless water heater", "$$$", "high", ["$4,850", "$3,900–$6,400", "Gas capacity and vent routing"]),
  choice("Sewer repair", "$$$", "high", ["$3,400", "$2,200–$5,800", "Depth, access and repair length"]),
  choice("Slab leak repair", "$$$$", "severe", ["$6,900", "$4,200–$11,500", "Location and reroute complexity"]),
  choice("Whole-home repipe", "$$$$", "severe", ["$9,800", "$7,200–$15,600", "Home size, stories and wall access"]),
  choice("Drain clearing", "$", "low", ["$285", "$195–$425", "Access and obstruction severity"]),
  choice("Toilet repair", "$", "low", ["$465", "$275–$725", "Repair versus fixture replacement"]),
  choice("Faucet repair", "$", "low", ["$390", "$225–$650", "Fixture type and cartridge availability"]),
  choice("Disposal replacement", "$", "low", ["$425", "$325–$625", "Horsepower and electrical access"]),
  choice("Pressure-reducing valve", "$$", "moderate", ["$775", "$575–$1,150", "Valve location and shutoff condition"]),
  choice("Hose bibb repair", "$", "low", ["$325", "$215–$525", "Wall access and freeze damage"]),
  choice("Shower valve repair", "$$", "moderate", ["$680", "$450–$1,050", "Trim compatibility and wall access"]),
  choice("Leak location", "$", "low", ["$445", "$325–$675", "Test scope and concealed access"]),
  choice("Hydro-jetting", "$$", "moderate", ["$725", "$525–$1,200", "Line length and cleanout access"]),
  choice("Sewer replacement", "$$$$", "severe", ["$8,500", "$5,900–$14,800", "Length, depth and restoration"]),
  choice("Sump pump", "$$", "moderate", ["$1,850", "$1,250–$3,200", "Pit, power and discharge route"]),
  choice("Water softener", "$$$", "high", ["$2,350", "$1,650–$3,900", "Capacity, drain and loop availability"]),
  choice("Gas line", "$$", "moderate", ["$1,650", "$900–$3,400", "Run length, sizing and permit needs"]),
];

export const DATA_DESK_EXPERIENCES_01_05: DataDeskExperience[] = [
  {
    slug: "austin-freeze-pipe-risk", accent: "#1E5FD6", accent2: "#3DD6E6",
    headline: "What the forecast means for Austin plumbing", highlight: "forecast",
    signature: { value: "83", unit: "/ 100", label: "Severe · danger window in 12–24 hours", stats: [{ value: "18°", label: "lowest forecast" }, { value: "14", count: 14, label: "hours below 32°" }, { value: "9", count: 9, label: "ZIPs elevated" }] },
    rowLabels: ["Gauge score / band", "Live conditions", "Freeze window", "Neighborhood ZIP bands", "Immediate actions"],
    control: { type: "gauge", label: "Forecast scenario", options: freezeScenarios },
  },
  {
    slug: "austin-plumbing-cost-index", accent: "#1E7ACB", accent2: "#39C6D9",
    headline: "What Austin plumbing work actually costs", highlight: "actually costs",
    signature: { value: "$2,150", label: "Median · 40-gallon water heater", stats: [{ value: "18", count: 18, label: "job types" }, { value: "25–75", label: "percentile range" }, { value: "Q2", label: "current release" }] },
    rowLabels: ["Median price", "Typical range (25th–75th)", "Main cost driver"],
    control: { type: "select", label: "Choose a completed job type", options: costJobs },
  },
  {
    slug: "austin-plumbing-emergency-pulse", accent: "#E0742A", accent2: "#F6B23C",
    headline: "A weekly weather report for plumbing systems", highlight: "weather report",
    signature: { value: "+38%", label: "Sewer backups versus seasonal normal", stats: [{ value: "6", count: 6, label: "issues tracked" }, { value: "14", count: 14, label: "day trend" }, { value: "3", count: 3, label: "source feeds" }] },
    rowLabels: ["This week vs. normal", "14-day trend", "Likely driver", "Typical resolution"],
    control: { type: "picker", label: "Choose an emergency type", options: [
      choice("Sewer backups", "+38%", "high", ["38% above normal", "Rising for 5 days", "Heavy rainfall after dry soil", "Camera inspection, clearing or line repair"]),
      choice("Burst / frozen pipes", "+21%", "high", ["21% above normal", "Rising with overnight lows", "Two nights below freezing", "Isolate water and repair the failed section"]),
      choice("Water-heater failures", "+12%", "moderate", ["12% above normal", "Stable after a short rise", "High winter recovery demand", "Diagnose controls, tank or supply"]),
      choice("Slab / hidden leaks", "+7%", "moderate", ["7% above normal", "Near seasonal range", "Soil movement and aging supply", "Locate, isolate and compare repair paths"]),
      choice("Clogged drains", "Normal", "low", ["2% below normal", "Flat across 14 days", "Normal household use", "Clear the branch or main obstruction"]),
      choice("Low pressure", "Normal", "low", ["Within normal range", "Falling slightly", "Utility work and local fixture issues", "Check scope, regulator and supply"]),
    ] },
  },
  {
    slug: "austin-plumbing-permit-tracker", accent: "#6A4FD0", accent2: "#9E7BEE",
    headline: "Where Austin is investing in plumbing", highlight: "investing",
    signature: { value: "1,284", label: "Issued permits · trailing 30 days", stats: [{ value: "6", count: 6, label: "ZIPs compared" }, { value: "+9%", label: "year over year" }, { value: "Nightly", label: "source refresh" }] },
    rowLabels: ["Permits (30 days)", "Top project type", "Median declared value", "Year over year"],
    control: { type: "picker", label: "Choose a ZIP code", options: [
      choice("78704", "+14%", "info", ["168", "Kitchen and bath remodel", "$24,500", "+14%"]),
      choice("78745", "+11%", "info", ["143", "Water-heater replacement", "$12,800", "+11%"]),
      choice("78702", "+18%", "high", ["126", "Addition / ADU plumbing", "$38,000", "+18%"]),
      choice("78660", "+7%", "info", ["204", "New residential plumbing", "$31,600", "+7%"]),
      choice("78723", "+9%", "info", ["119", "Bathroom remodel", "$19,750", "+9%"]),
      choice("78749", "−3%", "low", ["98", "Water-heater replacement", "$10,900", "−3%"]),
    ] },
  },
  {
    slug: "austin-home-plumbing-risk-report", accent: "#2F8FE0", accent2: "#5AC8EC",
    headline: "A pre-inspection briefing for any Austin address", highlight: "any Austin address",
    signature: { value: "~1948", label: "Construction era · elevated context", stats: [{ value: "72", count: 72, label: "context score" }, { value: "4", count: 4, label: "public sources" }, { value: "6", count: 6, label: "report fields" }] },
    rowLabels: ["Construction era", "Area housing age", "Permits on record", "Flood zone", "Freeze exposure", "Era-typical concern"],
    control: { type: "search", label: "Search an Austin address", placeholder: "Enter an address or ZIP code", samples: [
      choice("4302 Avenue G", "Elevated", "high", ["Built around 1948", "Most nearby homes: 1939–1959", "3 plumbing-related records", "Zone X · lower mapped risk", "Elevated · older exposed runs", "Galvanized supply and aging cast iron may warrant inspection"], "Property context only; materials are possibilities until inspected."),
      choice("1108 Cedar Ave", "Moderate", "moderate", ["Built around 1962", "Most nearby homes: 1950–1979", "2 plumbing-related records", "Zone X", "Moderate", "Original drain materials and pressure regulation are common questions"], "Verify the parcel and permit record before relying on this briefing."),
      choice("11701 Catalina Dr", "Lower", "low", ["Built around 1998", "Most nearby homes: 1990–2009", "1 plumbing-related record", "Zone X", "Lower", "Fixture supply connectors and water-heater age deserve routine review"]),
      choice("1600 Tinnin Ford Rd", "Watch flood", "high", ["Built around 1984", "Mixed 1970–1999 area", "4 plumbing-related records", "Mapped flood-hazard context nearby", "Moderate", "Backflow protection and post-flood drain checks are priority questions"]),
    ], fallback: result("Estimated area briefing", "Verify", "unknown", ["Estimated from entered area", "ZIP-level Census range", "Open the official permit search", "Confirm with FEMA source", "Weather-based estimate", "Schedule an inspection for property-specific findings"], "No exact demo record matched. These are area estimates and official verification links.") },
  },
];
