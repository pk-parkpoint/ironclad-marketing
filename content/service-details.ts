import type { ServiceEntry } from "./services";

export type ServiceProcessStep = {
  number: string;
  title: string;
  description: string;
};

export type ServiceFaq = {
  question: string;
  answer: string;
};

export type ServiceDetail = {
  slug: string;
  heroDescription: string;
  symptomsHeading: string;
  symptoms: string[];
  solutionsHeading: string;
  solutions: string[];
  austinNoteTitle: string;
  austinNoteBody: string;
  processHeading: string;
  processSteps: ServiceProcessStep[];
  trustPoints: Array<{ title: string; description: string }>;
  faqs: ServiceFaq[];
  bookingCtaText: string;
};

const REPAIRS_DETAIL: ServiceDetail = {
  slug: "repairs",
  heroDescription:
    "Most plumbing problems start small — a dripping faucet, a toilet that won't stop running, a slow leak under the kitchen sink. Left alone, they get expensive. Ironclad repairs are done right the first time so you don't pay twice.",
  symptomsHeading: "Signs You Need a Repair",
  symptoms: [
    "Faucet drips after you turn it off",
    "Toilet runs constantly or flushes weakly",
    "Water pressure has dropped noticeably",
    "Visible corrosion on pipes or fittings",
    "Water stains on walls, ceilings, or under cabinets",
    "Higher-than-normal water bill with no change in usage",
  ],
  solutionsHeading: "What We Repair",
  solutions: [
    "Leaking and dripping faucets",
    "Running and clogged toilets",
    "Pipe leaks (exposed and concealed)",
    "Garbage disposal issues",
    "Shut-off valve replacement",
    "Hose bib and outdoor spigot repair",
    "Supply line replacement",
    "General pipe and fitting repair",
  ],
  austinNoteTitle: "Austin Note",
  austinNoteBody:
    "Many Austin homes built in the 1970s–90s still have original supply lines and shut-off valves that are corroded or seized. If your shut-off valves don't fully close, that's a repair worth doing before the next emergency.",
  processHeading: "What to Expect",
  processSteps: [
    { number: "1", title: "Assess", description: "We arrive in your window and assess the issue." },
    {
      number: "2",
      title: "Estimate",
      description: "You get a written estimate with options (repair vs. replace if applicable).",
    },
    { number: "3", title: "Repair", description: "We complete the repair, test everything, and clean up." },
    { number: "4", title: "Warranty", description: "You receive warranty documentation." },
  ],
  trustPoints: [
    { title: "Diagnose before we quote", description: "No guessing, no inflating." },
    { title: "Written repair warranty", description: "Repairs are warrantied in writing." },
    { title: "Same-day parts on trucks", description: "We stock common parts for same-day fixes." },
  ],
  faqs: [
    {
      question: "How much does a plumbing repair cost in Austin?",
      answer:
        "It depends on the issue. Simple faucet repairs start around $150–$250. We always give you a written price before starting.",
    },
    {
      question: "Do you charge a trip fee?",
      answer:
        "We charge a diagnostic fee that covers the visit, evaluation, and written estimate. If you approve the work, the fee is typically applied toward the repair cost.",
    },
    {
      question: "Can you fix my plumbing today?",
      answer:
        "In most cases, yes. We carry common parts and can complete straightforward repairs same-day. If parts need to be ordered, we'll let you know the timeline upfront.",
    },
    {
      question: "Should I repair or replace my fixture?",
      answer:
        "We'll give you both options with pricing so you can decide. If a repair will hold for years, we'll tell you. If it's a temporary fix on a failing fixture, we'll be honest about that too.",
    },
  ],
  bookingCtaText: "Book a Repair",
};

const DRAIN_CLEANING_DETAIL: ServiceDetail = {
  slug: "drain-cleaning",
  heroDescription:
    "A plunger might clear the symptom. We find the cause. Ironclad drain cleaning includes camera inspection when warranted, so you know exactly what's happening inside your pipes — not just that something was blocking them.",
  symptomsHeading: "Signs You Need Drain Cleaning",
  symptoms: [
    "Water drains slowly in sinks, tubs, or showers",
    "Gurgling sounds from drains",
    "Recurring clogs in the same drain",
    "Multiple fixtures draining slowly at once",
    "Sewage or rotten-egg odor near drains",
    "Water backing up into other fixtures",
  ],
  solutionsHeading: "What We Do",
  solutions: [
    "Cable (snake) drain cleaning for routine blockages",
    "Hydro jetting for heavy buildup and grease lines",
    "Camera inspection to identify root intrusion, pipe damage, or buildup patterns",
    "Kitchen drain and grease line clearing",
    "Shower and tub drain clearing",
    "Floor drain and utility drain service",
    "Main sewer line clearing",
  ],
  austinNoteTitle: "Austin Note",
  austinNoteBody:
    "Older Austin neighborhoods — particularly those in Central Austin, Travis Heights, and Hyde Park — often have aging cast-iron drain lines that are prone to root intrusion and interior corrosion. If you're clearing the same drain every few months, the pipe itself may need attention, not just the clog.",
  processHeading: "What to Expect",
  processSteps: [
    {
      number: "1",
      title: "Assess",
      description: "We assess which drains are affected and how.",
    },
    {
      number: "2",
      title: "Clear",
      description: "We clear the blockage using the appropriate method.",
    },
    {
      number: "3",
      title: "Inspect",
      description: "If the problem recurs or indicates a deeper issue, we run a camera inspection.",
    },
    {
      number: "4",
      title: "Review",
      description: "You see the camera footage and we explain what's going on.",
    },
    {
      number: "5",
      title: "Quote",
      description: "Written estimate for any recommended follow-up work.",
    },
  ],
  trustPoints: [
    { title: "Root-cause focus", description: "We don't just snake and leave." },
    { title: "Camera inspection available", description: "Ideal for recurring issues and deeper diagnosis." },
    { title: "Upfront pricing", description: "You see a price before we start any work." },
  ],
  faqs: [
    {
      question: "How much does drain cleaning cost in Austin?",
      answer:
        "Straightforward cable clearing typically runs $175–$350 depending on access and severity. Hydro jetting and camera inspection are additional. You'll see a price before we start.",
    },
    {
      question: "How often should I have my drains cleaned?",
      answer:
        "Most homes don't need routine cleaning. If you're experiencing recurring clogs (every few months), that's a sign of an underlying issue worth investigating.",
    },
    {
      question: "Is hydro jetting safe for older pipes?",
      answer:
        "It depends on the pipe material and condition. We inspect before jetting and will recommend an alternative if your pipes can't handle the pressure.",
    },
    {
      question: "Do you clean main sewer lines?",
      answer:
        "Yes. We clear main lines and can run a camera to check for root intrusion, bellied pipe, or damage.",
    },
  ],
  bookingCtaText: "Book Drain Service",
};

const SEWER_SERVICES_DETAIL: ServiceDetail = {
  slug: "sewer-services",
  heroDescription:
    "Sewer problems are stressful. The smell, the mess, the uncertainty about what's actually wrong — we get it. Ironclad starts every sewer job with a camera inspection so we can show you exactly what's happening before recommending a course of action.",
  symptomsHeading: "Signs of a Sewer Line Problem",
  symptoms: [
    "Multiple drains backing up simultaneously",
    "Sewage odor in the yard or inside the home",
    "Unexplained wet or soggy patches in the yard",
    "Gurgling toilets when other fixtures are used",
    "Slow drains throughout the house (not just one fixture)",
    "Indentations or sinkholes in the yard near the sewer line",
  ],
  solutionsHeading: "What We Do",
  solutions: [
    "Sewer camera inspection with recorded footage",
    "Sewer line spot repair",
    "Trenchless sewer line repair (pipe lining / pipe bursting)",
    "Traditional sewer line replacement",
    "Root removal and prevention",
    "Sewer cleanout installation",
    "Backflow prevention",
  ],
  austinNoteTitle: "Austin Note",
  austinNoteBody:
    "Austin's expansive clay soil puts constant stress on underground sewer lines. The soil swells during rainy periods and shrinks during Texas summers, shifting pipes and creating cracks over time. Homes built before the 1990s may still have original clay tile or cast-iron sewer lines that are nearing — or past — their useful life.",
  processHeading: "What to Expect",
  processSteps: [
    { number: "1", title: "Camera", description: "We run a sewer camera and record the footage." },
    { number: "2", title: "Review", description: "We review the footage with you and explain what we see." },
    {
      number: "3",
      title: "Options",
      description: "You receive a written estimate with repair options (spot repair, lining, or replacement).",
    },
    { number: "4", title: "Repair", description: "We complete the work with minimal disruption to your property." },
    { number: "5", title: "Verify", description: "Final camera verification to confirm the repair." },
  ],
  trustPoints: [
    { title: "Camera-first approach", description: "We show you the problem before recommending a fix." },
    {
      title: "Trenchless options available",
      description: "Minimize yard and landscape damage when possible.",
    },
    { title: "Written warranty", description: "Every sewer line job includes a written warranty." },
  ],
  faqs: [
    {
      question: "How much does sewer line repair cost in Austin?",
      answer:
        "Spot repairs typically range from $1,500–$4,000. Full replacements can run $5,000–$15,000+ depending on length, depth, and method. We give you a specific written price after camera inspection.",
    },
    {
      question: "What is trenchless sewer repair?",
      answer:
        "It's a method that repairs or replaces your sewer line without digging a trench across your yard. We insert a new liner or burst the old pipe and pull a new one through. Less disruption, faster timeline.",
    },
    {
      question: "How do I know if my sewer line needs replacing?",
      answer:
        "Recurring backups, root intrusion that keeps coming back, and visible damage on camera footage are all signs. We'll be straightforward about whether a repair will hold or if replacement makes more sense long-term.",
    },
    {
      question: "Does homeowners insurance cover sewer line replacement?",
      answer:
        "Policies vary. Most standard policies don't cover gradual wear, but some cover sudden failures. We provide documentation to support your claim if applicable.",
    },
  ],
  bookingCtaText: "Book Sewer Service",
};

const WATER_HEATERS_DETAIL: ServiceDetail = {
  slug: "water-heaters",
  heroDescription:
    "No hot water is more than an inconvenience — it's a disruption to your entire household. Whether your tank water heater needs a repair, a replacement, or you're ready to upgrade, we'll walk you through your options clearly and get hot water back fast.",
  symptomsHeading: "Signs Your Water Heater Needs Attention",
  symptoms: [
    "No hot water or inconsistent temperature",
    "Rusty or discolored hot water",
    "Popping, rumbling, or banging sounds from the tank",
    "Water pooling around the base of the heater",
    "Hot water runs out faster than it used to",
    "Unit is over 10 years old",
  ],
  solutionsHeading: "What We Do",
  solutions: [
    "Tank water heater repair (thermostats, heating elements, anodes, valves)",
    "Tank water heater replacement (40–75 gal, gas and electric)",
    "Water heater installation for new construction or remodels",
    "Expansion tank installation",
    "Recirculation pump installation",
    "Water heater flushing and maintenance",
    "Gas and electric hookups",
  ],
  austinNoteTitle: "Austin Note",
  austinNoteBody:
    "Austin's hard water (184 ppm) accelerates sediment buildup inside water heater tanks. If you haven't flushed your tank in the last year, sediment is likely reducing your heater's efficiency and shortening its lifespan. Annual flushing is one of the simplest things you can do to extend the life of your water heater in Central Texas.",
  processHeading: "What to Expect",
  processSteps: [
    { number: "1", title: "Evaluate", description: "We evaluate your current unit and water usage." },
    {
      number: "2",
      title: "Quote",
      description:
        "If repair is viable, we quote the repair. If replacement makes more sense, we present 2–3 options with pricing.",
    },
    {
      number: "3",
      title: "Install",
      description:
        "For replacements, we handle removal of the old unit, installation, code-compliant connections, and testing.",
    },
    {
      number: "4",
      title: "Warranty",
      description: "You receive manufacturer warranty info plus Ironclad workmanship warranty.",
    },
  ],
  trustPoints: [
    { title: "Right-fit guidance", description: "We help you choose the right size and type." },
    { title: "Same-day replacement", description: "Available for standard tank units." },
    { title: "Permits handled", description: "We handle permits when required." },
  ],
  faqs: [
    {
      question: "How long does a water heater last in Austin?",
      answer:
        "Tank heaters typically last 8–12 years. With Austin's hard water, units on the shorter end are common if they haven't been flushed regularly.",
    },
    {
      question: "Should I switch to tankless?",
      answer:
        "Tankless has benefits (endless hot water, longer lifespan, energy savings) but requires different infrastructure. We'll assess your home and give you an honest comparison.",
    },
    {
      question: "How long does water heater replacement take?",
      answer:
        "Standard tank swaps take 2–4 hours. Same-day service is available for most installations.",
    },
    {
      question: "Do you offer financing for water heater replacement?",
      answer: "Yes. We offer financing options for qualified customers.",
    },
  ],
  bookingCtaText: "Book Water Heater Service",
};

const TANKLESS_WATER_HEATERS_DETAIL: ServiceDetail = {
  slug: "tankless-water-heaters",
  heroDescription:
    "Tankless units heat water on demand, so you never run out mid-shower. They last longer than tanks, use less energy, and take up a fraction of the space. But they're not right for every home. We'll give you an honest assessment.",
  symptomsHeading: "Benefits of Going Tankless",
  symptoms: [
    "Hot water that never runs out",
    "20+ year lifespan (vs. 8–12 for tanks)",
    "20–30% energy savings on water heating",
    "Wall-mounted, compact design frees up floor space",
    "No risk of tank rupture or flooding",
  ],
  solutionsHeading: "What We Do",
  solutions: [
    "Tankless water heater installation (indoor and outdoor units)",
    "Tank-to-tankless conversion (including gas line and venting upgrades)",
    "Tankless water heater repair and maintenance",
    "Annual descaling and flushing (critical in Austin's hard water)",
    "Multi-unit installations for larger homes",
  ],
  austinNoteTitle: "Austin Note",
  austinNoteBody:
    "Hard water is the number-one enemy of tankless water heaters. Without annual descaling, mineral deposits can reduce efficiency and void your manufacturer warranty. We recommend pairing a tankless unit with a water softener for maximum longevity in the Austin area.",
  processHeading: "What to Expect",
  processSteps: [
    {
      number: "1",
      title: "Assess",
      description: "We assess your home's hot water demand, gas supply, and venting.",
    },
    { number: "2", title: "Recommend", description: "We recommend the right unit size and brand." },
    {
      number: "3",
      title: "Install",
      description:
        "Installation includes all necessary upgrades (gas line sizing, venting, electrical).",
    },
    {
      number: "4",
      title: "Walkthrough",
      description: "We test the system, walk you through operation, and set up a maintenance schedule.",
    },
    {
      number: "5",
      title: "Warranty",
      description: "Full manufacturer warranty plus Ironclad workmanship warranty.",
    },
  ],
  trustPoints: [
    { title: "Honest fit assessment", description: "We'll tell you if tankless makes sense for your home." },
    { title: "Code-compliant upgrades", description: "Gas, venting, electrical done the right way." },
    { title: "Hard-water maintenance plan", description: "Annual descaling guidance for Austin conditions." },
  ],
  faqs: [
    {
      question: "How much does tankless water heater installation cost?",
      answer:
        "Typically $3,500–$6,500 installed, depending on the unit and whether gas line or venting upgrades are needed. We provide a specific written estimate after evaluating your home.",
    },
    {
      question: "Is my home a good candidate for tankless?",
      answer:
        "Most homes are, but it depends on your gas supply, electrical capacity, and hot water demand. Homes with very high simultaneous demand (e.g., 4+ bathrooms in use at once) may need multiple units.",
    },
    {
      question: "How often does a tankless need maintenance?",
      answer: "Annually, especially in Austin. Descaling removes mineral buildup and keeps the unit running efficiently.",
    },
    {
      question: "Which brands do you install?",
      answer:
        "We install leading tankless brands selected for reliability and parts availability. We recommend based on your specific needs, not on which brand pays the highest margin.",
    },
  ],
  bookingCtaText: "Book Tankless Consultation",
};

const LEAK_DETECTION_DETAIL: ServiceDetail = {
  slug: "leak-detection",
  heroDescription:
    "Hidden leaks are expensive in Austin — not just because of wasted water, but because of what they do to your foundation. Our expansive clay soil amplifies the damage: a small leak under your slab saturates the soil, the soil swells, and your foundation shifts. We use non-invasive detection technology to find leaks fast and accurately.",
  symptomsHeading: "Signs of a Hidden Leak",
  symptoms: [
    "Water bill spikes with no change in usage",
    "Sound of running water when everything is off",
    "Warm or damp spots on floors",
    "Cracks appearing in walls or foundation",
    "Musty or mildew smell without a visible source",
    "Low water pressure throughout the house",
    "Water meter spinning when no fixtures are in use",
  ],
  solutionsHeading: "What We Do",
  solutions: [
    "Electronic acoustic leak detection",
    "Thermal imaging for behind-wall and under-slab leaks",
    "Pressure testing to isolate supply lines",
    "Slab leak pinpointing",
    "Behind-wall and ceiling leak investigation",
    "Post-repair verification testing",
  ],
  austinNoteTitle: "Austin Note",
  austinNoteBody:
    "Austin sits on clay-heavy soil that expands and contracts with moisture. A slab leak can erode the supporting soil under your foundation in weeks, leading to cracking, settling, and structural damage that costs thousands to repair. Older neighborhoods like Hyde Park, Travis Heights, Allandale, and Crestview are especially susceptible due to aging copper supply lines and cast-iron drains.",
  processHeading: "What to Expect",
  processSteps: [
    { number: "1", title: "Evaluate", description: "We evaluate symptoms and run pressure tests." },
    { number: "2", title: "Detect", description: "Electronic and thermal detection to pinpoint the leak location." },
    { number: "3", title: "Mark", description: "We mark the exact spot — no unnecessary demolition." },
    { number: "4", title: "Estimate", description: "Written estimate for the repair." },
    { number: "5", title: "Verify", description: "Post-repair testing to confirm the fix." },
  ],
  trustPoints: [
    { title: "Non-invasive technology", description: "We find leaks without tearing up your floors." },
    { title: "Pinpoint, not guess", description: "You don't pay for exploratory work." },
    {
      title: "Austin slab-leak expertise",
      description: "Local experience with foundation-related plumbing issues.",
    },
  ],
  faqs: [
    {
      question: "How much does leak detection cost in Austin?",
      answer:
        "Detection typically runs $250–$500 depending on complexity. This is separate from the repair itself, which we quote after locating the leak.",
    },
    {
      question: "Does insurance cover slab leak repair?",
      answer:
        "Most policies cover sudden pipe breaks but not gradual corrosion. The resulting water damage is more likely to be covered than the plumbing repair itself. We provide documentation for your insurer.",
    },
    {
      question: "How long does leak detection take?",
      answer:
        "Most detections take 1–3 hours. Complex situations (multiple leaks, large homes) may take longer.",
    },
    {
      question: "Can you detect leaks under tile or hardwood?",
      answer:
        "Yes. Our equipment works through any flooring material without damaging it.",
    },
  ],
  bookingCtaText: "Book Leak Detection",
};

const GAS_LINE_SERVICES_DETAIL: ServiceDetail = {
  slug: "gas-line-services",
  heroDescription:
    "Gas work is not DIY territory. Whether you're adding a gas line for a new range, running a line to your outdoor kitchen, or suspect a gas leak, Ironclad handles it with the licensing, equipment, and testing protocols the job requires.",
  symptomsHeading: "Signs of a Gas Line Issue",
  symptoms: [
    "Rotten egg or sulfur smell near gas appliances or in your yard",
    "Hissing or whistling near a gas line or appliance",
    "Dead vegetation in a line above a buried gas pipe",
    "Higher-than-expected gas bills",
    "Pilot lights that won't stay lit",
    "Physical symptoms (headaches, dizziness, nausea) near gas appliances",
  ],
  solutionsHeading: "What We Do",
  solutions: [
    "Gas leak detection and repair",
    "New gas line installation (indoor and outdoor)",
    "Gas line extensions for new appliances (ranges, dryers, fireplaces, water heaters)",
    "Outdoor gas line installation (grills, fire pits, outdoor kitchens, pool heaters)",
    "Gas pressure testing",
    "Gas line relocation during remodels",
    "Appliance hookup and connection",
  ],
  austinNoteTitle: "Austin Note",
  austinNoteBody:
    "Outdoor living is a major part of Austin life. Gas lines for outdoor kitchens, fire pits, and pool heaters are some of our most requested installations. We handle permits and inspections where required, and every installation is pressure-tested before we leave.",
  processHeading: "What to Expect",
  processSteps: [
    { number: "1", title: "Plan", description: "We evaluate your needs and plan the route for new lines." },
    {
      number: "2",
      title: "Estimate",
      description: "Written estimate covering materials, labor, and any permit costs.",
    },
    {
      number: "3",
      title: "Install",
      description: "Installation with code-compliant materials and connections.",
    },
    { number: "4", title: "Test", description: "Pressure test to verify integrity." },
    { number: "5", title: "Hookup", description: "Appliance hookup and functional test." },
  ],
  trustPoints: [
    { title: "Licensed, code-compliant", description: "Gas work handled by licensed plumbers." },
    { title: "Pressure-tested", description: "Every installation is tested before we leave." },
    { title: "Permits handled", description: "We handle permitting and inspections when required." },
  ],
  faqs: [
    {
      question: "Do I need a permit for gas line work in Austin?",
      answer:
        "It depends on the scope. New installations and major modifications typically require a permit. We handle the permitting process.",
    },
    {
      question: "Can you run a gas line to my outdoor kitchen?",
      answer:
        "Yes. This is one of our most common gas line installations. We run the line, install shut-offs, connect appliances, and pressure test the system.",
    },
    {
      question: "How do you test for gas leaks?",
      answer:
        "We use electronic gas detectors and pressure testing to identify leaks. Every new installation is tested before we leave.",
    },
    {
      question: "Is it safe to run a gas line myself?",
      answer:
        "No. Gas line work requires a licensed plumber, code-compliant materials, pressure testing, and in most cases a permit and inspection.",
    },
  ],
  bookingCtaText: "Book Gas Line Service",
};

const FIXTURES_DETAIL: ServiceDetail = {
  slug: "fixtures",
  heroDescription:
    "A fixture might seem simple, but a bad installation leads to leaks, wobbling, poor water flow, and callbacks. Ironclad installs and repairs fixtures with precision — proper sealing, correct torque, verified connections, and a clean finish.",
  symptomsHeading: "When to Call Us",
  symptoms: [
    "Installing new faucets, sinks, or toilets",
    "Upgrading bathroom or kitchen fixtures during a remodel",
    "Replacing a leaking or outdated fixture",
    "Fixing a faucet that drips, a toilet that runs, or a showerhead with low pressure",
    "Adding a utility sink, wet bar, or laundry hookup",
  ],
  solutionsHeading: "What We Do",
  solutions: [
    "Kitchen and bathroom faucet installation and repair",
    "Toilet installation and repair (standard, low-flow, comfort-height, bidet seats)",
    "Sink installation (undermount, drop-in, vessel, utility)",
    "Shower and tub fixture installation (trim kits, valves, diverters, showerheads)",
    "Bathtub installation and replacement",
    "Garbage disposal installation and replacement",
    "Outdoor hose bib installation and repair",
  ],
  austinNoteTitle: "Austin Note",
  austinNoteBody:
    "If you're remodeling and sourcing your own fixtures, make sure they're compatible with your existing plumbing. We're happy to review your selections before you buy — it can save a return trip and a restocking fee.",
  processHeading: "What to Expect",
  processSteps: [
    { number: "1", title: "Assess", description: "We assess the existing plumbing and your new fixture." },
    { number: "2", title: "Estimate", description: "Written estimate for installation or repair." },
    {
      number: "3",
      title: "Install",
      description: "Professional installation with proper sealing and connections.",
    },
    { number: "4", title: "Test", description: "We test for leaks and proper operation before leaving." },
    { number: "5", title: "Warranty", description: "Cleanup and warranty documentation." },
  ],
  trustPoints: [
    { title: "Precision workmanship", description: "Proper sealing, correct torque, verified connections." },
    { title: "Leak-tested before we leave", description: "We verify operation and check for leaks." },
    { title: "Labor warranty", description: "Our workmanship is backed by a written warranty." },
  ],
  faqs: [
    {
      question: "Can I buy my own fixtures and have you install them?",
      answer:
        "Absolutely. We install customer-supplied fixtures regularly. We just can't warranty the fixture itself — only our labor.",
    },
    {
      question: "How long does fixture installation take?",
      answer:
        "A single fixture (faucet, toilet) typically takes 1–2 hours. Multiple fixtures in a remodel may take a half or full day.",
    },
    {
      question: "Do you do full bathroom remodels?",
      answer:
        "We handle the plumbing side of remodels: moving or adding supply and drain lines, installing fixtures, and connecting appliances. For tile, drywall, and finishes, you'll want a general contractor.",
    },
    {
      question: "My faucet drips — repair or replace?",
      answer:
        "Depends on the fixture. A quality faucet with a bad cartridge is worth repairing. A builder-grade faucet that's corroded may be better replaced. We'll give you both options.",
    },
  ],
  bookingCtaText: "Book Fixture Service",
};

const WATER_TREATMENT_DETAIL: ServiceDetail = {
  slug: "water-treatment",
  heroDescription:
    "Austin's municipal water supply measures around 184 parts per million in hardness — well above the \"hard\" threshold. That mineral content coats the inside of your pipes, shortens the life of your water heater, leaves residue on fixtures, and makes soap work harder. A properly sized water treatment system protects your entire plumbing system and the appliances connected to it.",
  symptomsHeading: "Signs You Need Water Treatment",
  symptoms: [
    "White, chalky buildup on faucets and showerheads",
    "Spots on dishes and glassware after washing",
    "Dry, itchy skin or flat hair after showering",
    "Soap and shampoo that don't lather well",
    "Scale buildup in your water heater or coffee maker",
    "Declining water pressure over time",
  ],
  solutionsHeading: "What We Do",
  solutions: [
    "Whole-home water softener installation",
    "Whole-home water filtration systems",
    "Reverse osmosis (RO) drinking water systems",
    "Water quality testing",
    "Water treatment system maintenance and salt delivery coordination",
    "Existing system repair and replacement",
  ],
  austinNoteTitle: "Austin Note",
  austinNoteBody:
    "The Edwards Aquifer supplies much of Austin's water, and the limestone formations it passes through are what make our water so hard. A whole-home softener is the single most effective thing you can do to extend the life of your pipes, water heater, and appliances. If you have a tankless water heater, a softener isn't optional — it's essential to protect your investment and maintain your warranty.",
  processHeading: "What to Expect",
  processSteps: [
    { number: "1", title: "Test", description: "We test your water and assess your household's usage." },
    {
      number: "2",
      title: "Recommend",
      description: "We recommend a system sized for your home — not oversized, not undersized.",
    },
    { number: "3", title: "Install", description: "Professional installation with bypass valve for maintenance." },
    { number: "4", title: "Walkthrough", description: "We walk you through operation and maintenance." },
    { number: "5", title: "Warranty", description: "Warranty documentation for both equipment and labor." },
  ],
  trustPoints: [
    {
      title: "Right-size systems",
      description: "Sized to your water chemistry and usage — not square footage.",
    },
    { title: "No upsells", description: "We install what you need, not the most expensive option." },
    { title: "Austin hard-water expertise", description: "Scale prevention and tankless compatibility." },
  ],
  faqs: [
    {
      question: "How much does a water softener cost in Austin?",
      answer:
        "Installed systems typically range from $2,000–$5,000 depending on capacity and features. We provide a specific written estimate after testing your water.",
    },
    {
      question: "Do I need a water softener and a filter?",
      answer:
        "They solve different problems. A softener removes hardness minerals (calcium, magnesium). A filter removes sediment, chlorine, and other contaminants. Many homeowners benefit from both.",
    },
    {
      question: "Will a softener make my water taste salty?",
      answer:
        "No. Modern softeners use a minimal amount of salt in the regeneration process, and the result is soft water — not salty water. If you prefer filtered drinking water, we can add an RO system at your kitchen sink.",
    },
    {
      question: "How often does a softener need maintenance?",
      answer:
        "Mainly salt refills (every 4–8 weeks depending on usage) and an annual checkup. We can coordinate salt delivery service if you prefer.",
    },
  ],
  bookingCtaText: "Book Water Treatment Service",
};

const EMERGENCY_DETAIL: ServiceDetail = {
  slug: "emergency",
  heroDescription:
    "Burst pipe flooding your kitchen. Sewer backing up into your bathroom. Gas smell you can't explain. These situations don't wait for business hours, and neither do we. Call or text Ironclad for emergency plumbing response in Greater Austin.",
  symptomsHeading: "What Counts as a Plumbing Emergency",
  symptoms: [
    "Burst or ruptured pipe",
    "Sewer backup into the home",
    "Gas leak or gas smell",
    "No water to the house",
    "Uncontrollable water leak (can't find or turn the shut-off)",
    "Water heater failure with flooding",
    "Frozen or burst pipes (during rare Austin cold snaps)",
  ],
  solutionsHeading: "What We Do",
  solutions: [
    "24/7 emergency response across Greater Austin",
    "Burst pipe repair and temporary mitigation",
    "Emergency sewer line clearing",
    "Gas leak detection and repair",
    "Emergency water heater replacement",
    "Shut-off valve repair or replacement",
    "Emergency leak detection and repair",
  ],
  austinNoteTitle: "Austin Note",
  austinNoteBody:
    "Austin's rare but severe cold snaps — like the ones in 2021 and 2023 — expose homes that aren't winterized. If you have exposed pipes in your attic, garage, or exterior walls, consider pipe insulation before the next freeze. We can help.",
  processHeading: "What to Expect",
  processSteps: [
    { number: "1", title: "Contact", description: "Call or text us — we answer 24/7." },
    { number: "2", title: "Dispatch", description: "We dispatch a technician as fast as possible." },
    {
      number: "3",
      title: "Contain",
      description: "On arrival, we contain the situation first (stop the water, secure the gas).",
    },
    {
      number: "4",
      title: "Estimate",
      description: "Once contained, we evaluate and provide a written estimate for the full repair.",
    },
    {
      number: "5",
      title: "Repair",
      description: "We complete the repair or schedule follow-up work as needed.",
    },
  ],
  trustPoints: [
    { title: "24/7 response", description: "Emergencies don't wait for business hours." },
    { title: "Contain first", description: "We stop the damage before moving to full repair." },
    { title: "Transparent emergency rates", description: "You'll know the cost before we start." },
  ],
  faqs: [
    {
      question: "How fast can you get here?",
      answer:
        "Response times vary by time of day and demand, but we prioritize emergencies and dispatch as quickly as possible. We'll give you an honest ETA when you call.",
    },
    {
      question: "Do you charge extra for emergency service?",
      answer:
        "Our emergency rates are higher than standard rates, and we're transparent about that upfront. You'll know the cost before we start any work.",
    },
    {
      question: "Where is my main water shut-off?",
      answer:
        "Most Austin homes have a shut-off valve at the meter box near the street (you may need a meter key) and one where the main line enters the house. If you're not sure, we can show you during any service visit.",
    },
    {
      question: "Should I call my insurance company?",
      answer:
        "For significant water damage, yes. Document the damage with photos before cleanup. We can provide documentation of the plumbing issue to support your claim.",
    },
  ],
  bookingCtaText: "Get Emergency Help",
};

const SERVICE_DETAILS_BY_SLUG: Partial<Record<string, ServiceDetail>> = {
  repairs: REPAIRS_DETAIL,
  "drain-cleaning": DRAIN_CLEANING_DETAIL,
  "sewer-services": SEWER_SERVICES_DETAIL,
  "water-heaters": WATER_HEATERS_DETAIL,
  "tankless-water-heaters": TANKLESS_WATER_HEATERS_DETAIL,
  "leak-detection": LEAK_DETECTION_DETAIL,
  "gas-line-services": GAS_LINE_SERVICES_DETAIL,
  fixtures: FIXTURES_DETAIL,
  "water-treatment": WATER_TREATMENT_DETAIL,
  emergency: EMERGENCY_DETAIL,
};

function buildGenericServiceDetail(entry: ServiceEntry): ServiceDetail {
  return {
    slug: entry.slug,
    heroDescription: entry.metaDescription,
    symptomsHeading: "Common Signs",
    symptoms: [
      "Recurring issues that come back after quick fixes",
      "Visible leaks, odors, or unusual noises",
      "Sudden loss of function or poor performance",
      "Water damage risk if left unresolved",
    ],
    solutionsHeading: "How We Help",
    solutions: [
      "Inspect and diagnose the root cause",
      "Recommend the right repair, not the biggest repair",
      "Provide upfront pricing before work begins",
      "Test and verify before we leave",
    ],
    austinNoteTitle: "Austin-Specific",
    austinNoteBody:
      "Austin homes face hard water, expansive clay soil, and temperature swings. We tailor recommendations based on your neighborhood, home age, and the condition of your system.",
    processHeading: "What to Expect",
    processSteps: [
      { number: "1", title: "Assess", description: "We inspect and confirm what’s happening." },
      { number: "2", title: "Explain", description: "You get options and upfront pricing." },
      { number: "3", title: "Repair", description: "We fix it cleanly and test before we leave." },
    ],
    trustPoints: [
      { title: "Upfront pricing", description: "Know the cost before we start." },
      { title: "On-time windows", description: "We respect your schedule and communicate clearly." },
      { title: "Written warranty", description: "We stand behind our work." },
    ],
    faqs: [
      {
        question: "Do you offer upfront pricing?",
        answer: "Yes. We provide clear pricing before work begins so you can approve confidently.",
      },
      {
        question: "Do you service my area?",
        answer: "We serve Austin and surrounding cities. See the Service Area pages for details.",
      },
    ],
    bookingCtaText: "Book Service",
  };
}

export function getServiceDetail(entry: ServiceEntry): ServiceDetail {
  return SERVICE_DETAILS_BY_SLUG[entry.slug] ?? buildGenericServiceDetail(entry);
}
