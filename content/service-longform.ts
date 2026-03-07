import type { ServiceEntry } from "./services";

export type ServiceLongform = {
  overviewHeading: string;
  overviewParagraphs: string[];
  checklistHeading: string;
  checklistItems: string[];
  preventionHeading: string;
  preventionTips: string[];
};

const SERVICE_LONGFORM_BY_SLUG: Partial<Record<string, ServiceLongform>> = {
  repairs: {
    overviewHeading: "Repair Work That Solves the Root Issue",
    overviewParagraphs: [
      "A repair should do more than stop today's leak. Our technicians verify why the failure happened, check nearby fittings, and confirm pressure and flow so you are not scheduling the same fix again next month.",
      "When repair and replacement are both on the table, we price both options in writing and explain the expected service life of each path. That lets you choose based on long-term value, not guesswork.",
    ],
    checklistHeading: "During Most Repair Visits We",
    checklistItems: [
      "Isolate and test the affected fixture or line before disassembly",
      "Inspect shut-off valves and adjacent supply points for hidden wear",
      "Use manufacturer-grade parts whenever available for better fit and lifespan",
      "Pressure test and function test after reassembly",
      "Document what was repaired and what to watch over the next 12 months",
    ],
    preventionHeading: "Repair Prevention Tips for Austin Homes",
    preventionTips: [
      "Exercise fixture shut-off valves twice a year so they do not seize.",
      "Watch for slow drips under vanities and behind toilets after freeze swings.",
      "Replace braided supply lines every 5-7 years before they rupture.",
      "Set leak alerts on your water meter app if your utility supports it.",
    ],
  },
  "drain-cleaning": {
    overviewHeading: "Drain Cleaning Built Around Long-Term Flow",
    overviewParagraphs: [
      "Quick snaking can restore flow for a day and hide larger problems. We choose the clearing method based on blockage type, line material, and line condition so the fix lasts longer and causes less pipe wear.",
      "For repeat clogs, we pair cleaning with inspection so you can see whether grease, roots, scale, or pipe damage is driving the issue. That evidence keeps next-step recommendations practical and cost-effective.",
    ],
    checklistHeading: "Our Drain Service Scope Usually Includes",
    checklistItems: [
      "Access-point evaluation to reach the blockage safely",
      "Mechanical or hydro cleaning matched to the line condition",
      "Flow test across impacted fixtures before and after clearing",
      "Optional camera confirmation when recurrence risk is high",
      "Clear follow-up plan if structural sewer work is recommended",
    ],
    preventionHeading: "How to Reduce Repeat Clogs",
    preventionTips: [
      "Install strainers in shower and tub drains to catch hair buildup.",
      "Avoid putting grease, oils, or coffee grounds down kitchen lines.",
      "Schedule camera inspection if clogs return in under six months.",
      "Use annual maintenance cleaning for high-use kitchens and older homes.",
    ],
  },
  "sewer-services": {
    overviewHeading: "Sewer Solutions With Full Line Visibility",
    overviewParagraphs: [
      "Sewer decisions are high-stakes because excavation and restoration can be costly. We use camera footage to show exact pipe condition, depth, and failure points before recommending a repair strategy.",
      "When possible, we present both trenchless and traditional options with clear tradeoffs for timeline, disruption, and warranty. You get a plan that fits your property, budget, and long-term ownership goals.",
    ],
    checklistHeading: "Sewer Project Planning Includes",
    checklistItems: [
      "Recorded camera footage and defect mapping",
      "Repair-path comparison with budget and durability notes",
      "Permit and code requirements review for your municipality",
      "Protection steps for driveways, landscaping, and hardscape",
      "Post-repair camera verification and documentation",
    ],
    preventionHeading: "Sewer Risk Reduction",
    preventionTips: [
      "Address recurring backups immediately instead of waiting for total blockage.",
      "Consider root-barrier treatment in mature-tree neighborhoods.",
      "Request inspection before major remodels that add water load.",
      "Know your cleanout location so emergencies can be mitigated quickly.",
    ],
  },
  "water-heaters": {
    overviewHeading: "Hot Water Planning Beyond a Simple Swap",
    overviewParagraphs: [
      "Water heater service is not only about replacing a failed tank. We evaluate household demand, recovery needs, fuel type, and installation constraints to make sure your next system performs correctly day one.",
      "For older units, we balance repair cost against remaining lifespan and efficiency. You get a straight recommendation on whether repair is worth it or if replacement avoids repeat service calls.",
    ],
    checklistHeading: "What We Validate on Water Heater Jobs",
    checklistItems: [
      "Capacity and recovery rate for your household size",
      "Code-compliant venting, pan, pressure relief, and expansion tank setup",
      "Gas/electrical supply and shutoff accessibility checks",
      "Initial startup, temperature calibration, and leak inspection",
      "Warranty registration and maintenance guidance before we leave",
    ],
    preventionHeading: "Water Heater Longevity Tips",
    preventionTips: [
      "Flush tank units annually to remove sediment from hard water.",
      "Replace worn anode rods before interior tank corrosion accelerates.",
      "Keep temperature around 120F unless special use requires higher.",
      "Install leak sensors in utility closets and garage heater locations.",
    ],
  },
  "tankless-water-heaters": {
    overviewHeading: "Tankless Performance Depends on Correct Setup",
    overviewParagraphs: [
      "Tankless systems deliver strong efficiency and endless hot water, but only when sizing, gas supply, venting, and water quality are handled correctly. We engineer each installation around real usage, not marketing claims.",
      "If your home's infrastructure is not tankless-ready, we outline required upgrades in advance so there are no mid-install surprises. Every recommendation is tied to reliability, safety, and manufacturer warranty compliance.",
    ],
    checklistHeading: "Tankless Install Scope",
    checklistItems: [
      "Demand calculation based on simultaneous fixture use",
      "Gas line and venting verification for target unit output",
      "Water quality and scale risk assessment",
      "Startup tuning, recirculation setup where applicable, and test runs",
      "Annual maintenance plan for descaling and filter checks",
    ],
    preventionHeading: "Keep Tankless Systems Healthy",
    preventionTips: [
      "Descale yearly in Austin to prevent mineral lockup.",
      "Pair with a softener in very hard-water zones for better exchanger life.",
      "Do not ignore minor error codes; early service prevents shutdowns.",
      "Schedule filter cleaning and burner checks before winter demand peaks.",
    ],
  },
  "leak-detection": {
    overviewHeading: "Leak Detection Focused on Precision and Speed",
    overviewParagraphs: [
      "Unnecessary demolition is one of the biggest costs in leak response. Our process combines pressure testing, acoustic tools, and thermal imaging to isolate leak location before repair begins.",
      "For slab and concealed leaks, we provide a documented finding so you can coordinate repairs, restoration, and insurance communication with fewer delays and fewer unknowns.",
    ],
    checklistHeading: "Detection Appointments Commonly Include",
    checklistItems: [
      "Usage pattern review and meter behavior verification",
      "Zone-by-zone pressure isolation to narrow probable source lines",
      "Acoustic and thermal confirmation to improve pinpoint accuracy",
      "Marked location guidance for targeted repair access",
      "Repair handoff notes and post-repair verification plan",
    ],
    preventionHeading: "Leak Risk Management",
    preventionTips: [
      "Track monthly water usage and investigate unexplained increases quickly.",
      "Install smart shutoff valves in homes with prior leak history.",
      "Respond to warm floor spots and foundation cracks immediately.",
      "Inspect exposed copper and braided connectors every season.",
    ],
  },
  "gas-line-services": {
    overviewHeading: "Gas Line Work Executed for Safety and Code",
    overviewParagraphs: [
      "Gas service demands strict testing and code compliance at every step. We map the route, size piping for load, and pressure test before appliance startup so your system is safe and reliable.",
      "Whether you are adding a single appliance or extending outdoor lines, we align the project with inspection requirements and clear documentation to protect your household and investment.",
    ],
    checklistHeading: "Gas Line Project Controls",
    checklistItems: [
      "Load calculations for current and future gas appliances",
      "Routing plan that prioritizes serviceability and protection",
      "Code-grade materials, shutoffs, and sediment traps where required",
      "Pressure and leak tests before and after final connections",
      "Permit and inspection coordination for qualifying jobs",
    ],
    preventionHeading: "Gas System Best Practices",
    preventionTips: [
      "Treat gas odors as urgent and leave the property before calling.",
      "Do not enclose gas valves behind permanent finish work.",
      "Test older appliance connectors during remodels or appliance swaps.",
      "Schedule inspections when adding high-BTU outdoor equipment.",
    ],
  },
  fixtures: {
    overviewHeading: "Fixture Installs That Stay Tight and Level",
    overviewParagraphs: [
      "Fixture quality is only half of the result. Durable performance comes from correct alignment, sealing, anchoring, and pressure control at install time. We treat every fixture project like a finish-detail job, not a quick swap.",
      "If your remodel involves mixed brands and rough-in constraints, we verify compatibility before installation so trim, valves, and supply points all work together cleanly.",
    ],
    checklistHeading: "Our Fixture Install Standards",
    checklistItems: [
      "Compatibility check between fixture, valve body, and rough-in dimensions",
      "Proper anchoring and leveling to prevent movement and seal failure",
      "Connection torque and seal methods matched to manufacturer specs",
      "Operational testing for flow, temperature balance, and drainage",
      "Final finish protection and workspace cleanup",
    ],
    preventionHeading: "Extend Fixture Lifespan",
    preventionTips: [
      "Use water-softening solutions to reduce scale on cartridges and aerators.",
      "Replace worn toilet flappers and fill valves before overflows happen.",
      "Clean aerators and showerheads quarterly in hard-water homes.",
      "Address loose mounts early to avoid countertop or tile damage.",
    ],
  },
  "water-treatment": {
    overviewHeading: "Treatment Systems Matched to Austin Water Conditions",
    overviewParagraphs: [
      "Water treatment works best when equipment matches your chemistry and demand profile. We test source water, identify hardness and contaminant priorities, and size systems for steady performance without overbuilding.",
      "Proper treatment protects plumbing assets beyond taste and feel. Softening and filtration reduce scale accumulation, preserve water heater efficiency, and lower maintenance frequency across fixtures and appliances.",
    ],
    checklistHeading: "Water Treatment Implementation",
    checklistItems: [
      "On-site water quality testing and usage profile review",
      "System sizing for regeneration capacity and pressure stability",
      "Bypass configuration for safe maintenance and service",
      "Commissioning checks for blend settings and flow performance",
      "Ongoing care plan for salt, filters, and annual inspections",
    ],
    preventionHeading: "Get Better Results From Your System",
    preventionTips: [
      "Use high-purity salt and monitor brine tank levels consistently.",
      "Replace pre-filters on schedule to protect downstream equipment.",
      "Test untreated outside lines separately from treated indoor supply.",
      "Recalibrate settings after major household occupancy changes.",
    ],
  },
  emergency: {
    overviewHeading: "Emergency Response That Prioritizes Damage Control",
    overviewParagraphs: [
      "In emergency plumbing, the first goal is always stabilization. We secure water or gas, reduce active damage, and then move into diagnosis and repair planning with clear communication at each step.",
      "After immediate mitigation, we provide a documented repair scope so you can coordinate restoration work, insurance reporting, and permanent plumbing correction without losing momentum.",
    ],
    checklistHeading: "Emergency Workflow",
    checklistItems: [
      "Immediate safety and shutoff guidance during dispatch",
      "On-site containment actions to stop ongoing damage",
      "Rapid diagnosis to identify source and downstream risks",
      "Transparent emergency pricing before full repair work starts",
      "Next-day follow-up plan if restoration trade coordination is needed",
    ],
    preventionHeading: "Emergency Preparedness Checklist",
    preventionTips: [
      "Label all household shutoff points and keep access clear.",
      "Insulate vulnerable lines before winter events.",
      "Keep appliance pans and leak alarms in high-risk utility areas.",
      "Store insurer contact details and photo documentation workflow in advance.",
    ],
  },
};

function buildGenericLongform(entry: ServiceEntry): ServiceLongform {
  return {
    overviewHeading: `${entry.title} With Clear Scope and Results`,
    overviewParagraphs: [
      "Our approach starts with diagnosis and an options-based plan so you can choose the repair path that fits your timeline and budget.",
      "Every service is documented, tested, and reviewed before we close out the visit.",
    ],
    checklistHeading: "What You Can Expect",
    checklistItems: [
      "Arrival in your scheduled window",
      "Root-cause diagnosis and written estimate",
      "Code-aligned workmanship with jobsite protection",
      "System testing and cleanup before departure",
    ],
    preventionHeading: "After-Service Guidance",
    preventionTips: [
      "Monitor performance for the first week after service.",
      "Address small symptoms quickly before they become urgent.",
      "Follow recommended maintenance intervals to reduce lifecycle cost.",
    ],
  };
}

export function getServiceLongform(entry: ServiceEntry): ServiceLongform {
  return SERVICE_LONGFORM_BY_SLUG[entry.slug] ?? buildGenericLongform(entry);
}
