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

const SLAB_LEAK_REPAIR_DETAIL: ServiceDetail = {
  slug: "slab-leak-repair",
  heroDescription:
    "A slab leak is a water or drain line leak beneath your home's concrete foundation. In Austin, where expansive clay soil swells and shrinks with moisture, even a small slab leak can saturate the soil, shift your foundation, and cause cracks in walls and floors within weeks. Ironclad pinpoints slab leaks non-invasively and repairs them with the least disruption to your home.",
  symptomsHeading: "Signs of a Slab Leak",
  symptoms: [
    "Unexplained spike in your water bill",
    "Sound of running water when all fixtures are off",
    "Warm or damp spots on your floor",
    "Cracks in walls, baseboards, or tile",
    "Mildew or musty smell with no visible source",
    "Foundation shifting or doors that no longer close properly",
    "Water meter spinning with nothing running",
  ],
  solutionsHeading: "How We Repair Slab Leaks",
  solutions: [
    "Electronic and acoustic leak detection to pinpoint the exact location",
    "Spot repair through minimal slab access",
    "Pipe reroute above the slab to bypass the damaged section",
    "Epoxy pipe lining for multi-point deterioration",
    "Full repipe when the supply system has widespread failure",
    "Post-repair pressure testing and verification",
  ],
  austinNoteTitle: "Austin Note",
  austinNoteBody:
    "Austin's clay-heavy Blackland Prairie soil is one of the most expansive in the U.S. When a slab leak saturates the soil beneath your foundation, the clay swells unevenly. This differential movement cracks slabs, shifts door frames, and can cause structural damage that costs $10,000+ to remediate. Neighborhoods like Allandale, Crestview, Hyde Park, and Travis Heights — where homes from the 1950s–70s still have original copper supply lines — are the most common areas we service for slab leaks.",
  processHeading: "What to Expect",
  processSteps: [
    { number: "1", title: "Detect", description: "Electronic and thermal detection to pinpoint the leak without demolition." },
    { number: "2", title: "Options", description: "Written estimate with repair options: spot repair, reroute, or reline." },
    { number: "3", title: "Repair", description: "We complete the repair with minimal disruption to your flooring." },
    { number: "4", title: "Verify", description: "Pressure test to confirm the leak is resolved." },
  ],
  trustPoints: [
    { title: "Non-invasive detection", description: "We pinpoint the leak before cutting into anything." },
    { title: "Multiple repair options", description: "Spot repair, reroute, or reline — you choose." },
    { title: "Foundation awareness", description: "We understand Austin's soil and its impact on your home." },
  ],
  faqs: [
    {
      question: "How much does slab leak repair cost in Austin?",
      answer:
        "Spot repairs typically run $1,500–$3,500. Reroutes range from $2,500–$5,000. Full repipes cost more but solve systemic issues. We give you a specific written price after detection.",
    },
    {
      question: "How do you find a slab leak without tearing up my floor?",
      answer:
        "We use electronic acoustic sensors and thermal imaging to detect the leak through the slab. This pinpoints the location to within a few inches, so only a small access point is needed.",
    },
    {
      question: "Should I repair or reroute a slab leak?",
      answer:
        "If it's an isolated leak in an otherwise sound pipe, spot repair is cost-effective. If you've had multiple slab leaks or the pipe shows widespread corrosion, a reroute or repipe prevents future failures.",
    },
    {
      question: "Does homeowners insurance cover slab leak repair?",
      answer:
        "Most policies cover sudden pipe failures but not gradual corrosion. The resulting water damage (flooring, drywall) is more likely covered than the plumbing repair itself. We provide documentation for your claim.",
    },
  ],
  bookingCtaText: "Book Slab Leak Repair",
};

const WATER_HEATER_REPAIR_DETAIL: ServiceDetail = {
  slug: "water-heater-repair",
  heroDescription:
    "No hot water usually means a fixable problem — a failed thermostat, a burned-out heating element, a tripped reset button, or a faulty gas valve. Before you assume you need a full replacement, let us diagnose it. Many water heater issues are same-day repairs that cost a fraction of a new unit.",
  symptomsHeading: "Signs Your Water Heater Needs Repair",
  symptoms: [
    "No hot water at all",
    "Water is lukewarm but not hot",
    "Hot water runs out much faster than usual",
    "Pilot light keeps going out",
    "Popping or rumbling sounds from the tank",
    "Water pooling at the base of the unit",
    "Discolored or rusty hot water",
  ],
  solutionsHeading: "What We Repair",
  solutions: [
    "Thermostat diagnosis and replacement",
    "Heating element replacement (electric units)",
    "Gas valve and thermocouple repair",
    "Pilot light and ignitor repair",
    "Anode rod replacement to prevent tank corrosion",
    "T&P (temperature and pressure) relief valve replacement",
    "Dip tube replacement",
    "Sediment flush and maintenance",
  ],
  austinNoteTitle: "Austin Note",
  austinNoteBody:
    "Austin's 184 ppm hard water accelerates sediment buildup inside your tank. That sediment insulates the heating element from the water, forcing the unit to work harder and fail sooner. If your water heater is making popping or rumbling noises, sediment is the most likely cause — and a flush may restore normal operation.",
  processHeading: "What to Expect",
  processSteps: [
    { number: "1", title: "Diagnose", description: "We test thermostats, elements, gas valves, and connections." },
    { number: "2", title: "Recommend", description: "Repair vs. replace recommendation with honest reasoning." },
    { number: "3", title: "Repair", description: "Same-day repair with parts we carry on our trucks." },
    { number: "4", title: "Test", description: "We verify hot water output and check for leaks." },
  ],
  trustPoints: [
    { title: "Repair-first approach", description: "We fix what's fixable instead of pushing a replacement." },
    { title: "Same-day parts", description: "Common parts on every truck for same-day turnaround." },
    { title: "Honest replace guidance", description: "If replacement makes more sense, we'll tell you why." },
  ],
  faqs: [
    {
      question: "How much does water heater repair cost in Austin?",
      answer:
        "Most repairs run $150–$500 depending on the part and labor. Thermostat and element replacements are on the lower end; gas valve replacements are higher. You get a written price before we start.",
    },
    {
      question: "Should I repair or replace my water heater?",
      answer:
        "If your unit is under 8 years old and the repair is straightforward, repair usually makes sense. If it's over 10 years, leaking from the tank, or needs repeated repairs, replacement is more cost-effective long-term.",
    },
    {
      question: "Why is my water heater making noise?",
      answer:
        "Popping or rumbling usually means sediment buildup at the bottom of the tank. A flush often resolves it. If the noise persists, the tank may be deteriorating internally.",
    },
    {
      question: "Can you repair a tankless water heater?",
      answer:
        "Yes. We service both tank and tankless units. Tankless repairs commonly involve flow sensors, ignition components, and descaling.",
    },
  ],
  bookingCtaText: "Book Water Heater Repair",
};

const WATER_HEATER_INSTALLATION_DETAIL: ServiceDetail = {
  slug: "water-heater-installation",
  heroDescription:
    "Whether you're replacing a failing unit or upgrading to something more efficient, proper installation determines how well your water heater performs and how long it lasts. Ironclad handles the full job — removal, installation, code-compliant connections, expansion tank, and permits — so you get reliable hot water from day one.",
  symptomsHeading: "When to Consider a New Water Heater",
  symptoms: [
    "Your unit is 10+ years old and losing efficiency",
    "Tank is leaking from the bottom (not repairable)",
    "Repeated repairs are adding up in cost",
    "You're remodeling and need a different size or location",
    "You want to switch from tank to tankless (or vice versa)",
    "Your household hot water demand has increased",
  ],
  solutionsHeading: "What We Install",
  solutions: [
    "Standard tank water heaters (40–75 gallon, gas and electric)",
    "High-efficiency tank water heaters",
    "Tankless water heaters (indoor and outdoor models)",
    "Heat pump / hybrid water heaters",
    "Expansion tank installation (required by code in many jurisdictions)",
    "Recirculation pump systems for instant hot water",
    "Gas line and electrical upgrades as needed",
  ],
  austinNoteTitle: "Austin Note",
  austinNoteBody:
    "Austin's building code requires an expansion tank on new water heater installations connected to a closed plumbing system. We include this in every quote. If you're in an older home, we'll also check your gas line sizing, venting, and drain pan to make sure everything meets current code — not just the heater itself.",
  processHeading: "What to Expect",
  processSteps: [
    { number: "1", title: "Evaluate", description: "We assess your current setup, hot water demand, and fuel source." },
    { number: "2", title: "Quote", description: "Written estimate with 2–3 options at different price points." },
    { number: "3", title: "Remove", description: "We disconnect and remove the old unit." },
    { number: "4", title: "Install", description: "New unit installed with code-compliant connections, expansion tank, and drain pan." },
    { number: "5", title: "Verify", description: "Full system test plus warranty documentation for manufacturer and labor." },
  ],
  trustPoints: [
    { title: "Code-compliant every time", description: "Expansion tank, drain pan, proper venting — all included." },
    { title: "Same-day available", description: "Standard tank swaps often completed the same day." },
    { title: "Permits handled", description: "We pull permits when required and schedule inspections." },
  ],
  faqs: [
    {
      question: "How much does water heater installation cost in Austin?",
      answer:
        "Standard tank replacements typically run $1,800–$3,500 installed. Tankless installations range from $3,500–$6,500 depending on upgrades needed. We provide a specific written estimate.",
    },
    {
      question: "How long does installation take?",
      answer:
        "Standard tank swaps take 2–4 hours. Tankless installations or fuel-type changes may take a full day due to gas line or venting work.",
    },
    {
      question: "Should I get a tank or tankless water heater?",
      answer:
        "Tanks are less expensive upfront and simpler to install. Tankless lasts longer, uses less energy, and never runs out of hot water — but costs more initially and may need gas line or venting upgrades. We'll help you weigh the tradeoffs.",
    },
    {
      question: "Do you remove the old water heater?",
      answer:
        "Yes. Removal and disposal of your old unit is included in every installation quote.",
    },
  ],
  bookingCtaText: "Book Installation",
};

const SEWER_CAMERA_INSPECTION_DETAIL: ServiceDetail = {
  slug: "sewer-camera-inspection",
  heroDescription:
    "A sewer camera inspection is the fastest way to know exactly what's happening inside your sewer line. Instead of guessing or digging, we feed a high-definition camera through the line and record everything — root intrusion, pipe cracks, bellied sections, blockages, and connection failures. You see the footage. We explain what it means.",
  symptomsHeading: "When You Need a Sewer Camera Inspection",
  symptoms: [
    "Recurring sewer backups or slow drains",
    "Buying a home and want to check the sewer line",
    "Sewage odor in the yard or near cleanouts",
    "Roots visible near sewer line path",
    "Previous repair and you want to verify condition",
    "Insurance or warranty documentation needed",
  ],
  solutionsHeading: "What We Inspect For",
  solutions: [
    "Root intrusion and root damage",
    "Pipe cracks, breaks, and offsets",
    "Bellied or sagging pipe sections that trap waste",
    "Grease and mineral buildup",
    "Pipe material identification (clay, cast iron, PVC, orangeburg)",
    "Connection failures at joints",
    "Locating cleanouts and determining pipe routing",
  ],
  austinNoteTitle: "Austin Note",
  austinNoteBody:
    "We recommend sewer camera inspections for any Austin home purchase, especially in older neighborhoods. Homes built before 1980 often have clay tile or cast-iron sewer lines that may be near end-of-life. A $300 inspection before closing can save you from a $10,000+ surprise after move-in. We provide recorded footage you can share with your realtor or home inspector.",
  processHeading: "What to Expect",
  processSteps: [
    { number: "1", title: "Access", description: "We access the sewer line through an existing cleanout or toilet pull." },
    { number: "2", title: "Inspect", description: "HD camera travels the full length of the line, recording everything." },
    { number: "3", title: "Review", description: "We review the footage with you in real time and explain findings." },
    { number: "4", title: "Report", description: "You receive a written summary and recorded footage for your records." },
  ],
  trustPoints: [
    { title: "HD recorded footage", description: "You keep the footage — share it with realtors, insurers, or inspectors." },
    { title: "No upsell pressure", description: "We report what we find, not what generates the biggest repair ticket." },
    { title: "Pre-purchase specialist", description: "Protecting Austin home buyers from hidden sewer problems." },
  ],
  faqs: [
    {
      question: "How much does a sewer camera inspection cost in Austin?",
      answer:
        "A standard camera inspection runs $250–$450 depending on access and line length. It's one of the best investments you can make before buying a home or planning a sewer repair.",
    },
    {
      question: "Should I get a sewer inspection before buying a house?",
      answer:
        "Yes, especially in Austin. Sewer line replacement can cost $5,000–$15,000+. A camera inspection before closing gives you negotiating leverage or lets you budget for future work.",
    },
    {
      question: "How long does a sewer camera inspection take?",
      answer:
        "Typically 30–60 minutes for a standard residential line. You see the footage as we go.",
    },
    {
      question: "Can you locate where the sewer line runs in my yard?",
      answer:
        "Yes. The camera head has a locator signal that lets us mark the line path and depth from the surface. This is especially useful before landscaping or construction projects.",
    },
  ],
  bookingCtaText: "Book Camera Inspection",
};

const TRENCHLESS_SEWER_REPAIR_DETAIL: ServiceDetail = {
  slug: "trenchless-sewer-repair",
  heroDescription:
    "Traditional sewer repair means digging a trench across your yard, tearing up landscaping, driveways, and sometimes sidewalks. Trenchless repair achieves the same result — a fully restored sewer line — with minimal excavation. We use pipe lining (CIPP) and pipe bursting to repair or replace your sewer line while keeping your property intact.",
  symptomsHeading: "When Trenchless Repair Makes Sense",
  symptoms: [
    "Cracked or offset sewer pipe identified by camera inspection",
    "Root intrusion that keeps coming back after clearing",
    "Bellied pipe sections that trap waste and cause backups",
    "Aging clay or cast-iron pipe nearing end-of-life",
    "You want to avoid destroying your yard, driveway, or landscaping",
    "Insurance or warranty documentation shows pipe deterioration",
  ],
  solutionsHeading: "Trenchless Methods We Use",
  solutions: [
    "Cured-in-place pipe lining (CIPP) — a resin-coated liner is inserted and cured inside the existing pipe",
    "Pipe bursting — the old pipe is fractured outward while a new HDPE pipe is pulled through",
    "Spot lining for localized damage in otherwise sound pipes",
    "Camera inspection before and after to verify the repair",
    "Traditional excavation when trenchless isn't suitable (we'll explain why)",
  ],
  austinNoteTitle: "Austin Note",
  austinNoteBody:
    "Austin's mature tree canopy is beautiful but hard on sewer lines. Live oaks, pecans, and cedar elms send aggressive root systems toward moisture sources — including cracked sewer joints. Trenchless lining seals those cracks from the inside, cutting off root access without cutting down trees. It's the most common trenchless method we use in Central Austin neighborhoods.",
  processHeading: "What to Expect",
  processSteps: [
    { number: "1", title: "Camera", description: "Pre-repair camera inspection to assess pipe condition and determine method." },
    { number: "2", title: "Quote", description: "Written estimate comparing trenchless vs. traditional options." },
    { number: "3", title: "Prep", description: "Line is cleaned and any obstructions are cleared." },
    { number: "4", title: "Repair", description: "Liner is installed and cured, or old pipe is burst and replaced." },
    { number: "5", title: "Verify", description: "Post-repair camera confirms the new line is sound." },
  ],
  trustPoints: [
    { title: "Minimal yard damage", description: "Usually just 1–2 small access points instead of a full trench." },
    { title: "Camera-verified", description: "Before and after camera footage so you see the difference." },
    { title: "Honest method selection", description: "We use trenchless when it fits — not when it doesn't." },
  ],
  faqs: [
    {
      question: "How much does trenchless sewer repair cost in Austin?",
      answer:
        "Pipe lining typically runs $4,000–$8,000 for a standard residential line. Pipe bursting ranges from $6,000–$12,000. Exact pricing depends on line length, depth, and condition.",
    },
    {
      question: "Is trenchless as durable as traditional replacement?",
      answer:
        "Yes. CIPP liners and HDPE pipe used in bursting have a 50+ year expected lifespan. Many manufacturers warranty the liner for 50 years.",
    },
    {
      question: "Can trenchless fix a bellied pipe?",
      answer:
        "Lining alone cannot fix a bellied (sagging) pipe — the sag remains even with a new liner. Pipe bursting can in some cases, or a short excavation at the sag point combined with lining elsewhere is a common solution.",
    },
    {
      question: "How long does trenchless repair take?",
      answer:
        "Most residential trenchless repairs are completed in one day. The liner cures in 3–6 hours depending on diameter and length.",
    },
  ],
  bookingCtaText: "Book Trenchless Repair",
};

const TOILET_REPAIR_INSTALLATION_DETAIL: ServiceDetail = {
  slug: "toilet-repair-installation",
  heroDescription:
    "A running toilet wastes up to 200 gallons of water per day. A weak flush means something's wrong inside the tank or the drain path. Whether your toilet needs a flapper, a fill valve, a wax ring, or a full replacement, Ironclad handles it quickly with upfront pricing and tested results before we leave.",
  symptomsHeading: "Signs Your Toilet Needs Service",
  symptoms: [
    "Toilet runs continuously or cycles on and off",
    "Weak or incomplete flush",
    "Toilet rocks or wobbles on the floor",
    "Water pooling at the base",
    "Cracks in the bowl or tank",
    "Frequent clogs that a plunger can't clear",
    "Gurgling sounds when other fixtures drain",
  ],
  solutionsHeading: "What We Do",
  solutions: [
    "Flapper, fill valve, and flush valve repair or replacement",
    "Wax ring replacement to stop base leaks",
    "Toilet flange repair or replacement",
    "New toilet installation (standard, low-flow, comfort-height, elongated, ADA-compliant)",
    "Bidet seat and bidet attachment installation",
    "Toilet-to-floor bolt tightening and stabilization",
    "Supply line replacement",
  ],
  austinNoteTitle: "Austin Note",
  austinNoteBody:
    "Austin Water offers rebates for replacing old toilets with WaterSense-certified low-flow models. If you're replacing a toilet that uses 3.5+ gallons per flush with a 1.28 GPF model, check Austin Water's rebate program — it can offset part of the cost. We install WaterSense models and can help you choose one that flushes well despite using less water.",
  processHeading: "What to Expect",
  processSteps: [
    { number: "1", title: "Diagnose", description: "We identify the problem — tank internals, seal, flange, or drain." },
    { number: "2", title: "Quote", description: "Written estimate for repair or replacement with options." },
    { number: "3", title: "Fix", description: "Repair or install with proper sealing and connections." },
    { number: "4", title: "Test", description: "Multiple flush tests and leak check before we leave." },
  ],
  trustPoints: [
    { title: "Same-day repair", description: "Common toilet repairs completed in under an hour." },
    { title: "Water-saving options", description: "Low-flow models that actually flush well." },
    { title: "Clean installation", description: "Old wax, caulk, and bolts removed — not left behind." },
  ],
  faqs: [
    {
      question: "How much does toilet repair cost in Austin?",
      answer:
        "Internal repairs (flapper, fill valve) typically run $125–$250. Wax ring and flange repairs run $200–$400. Full toilet replacement installed runs $350–$800+ depending on the model.",
    },
    {
      question: "Should I repair or replace my toilet?",
      answer:
        "If the bowl or tank is cracked, replace it. If it's an older model using 3.5+ GPF, replacing saves water and money long-term. For simple internal issues on a modern toilet, repair is usually the better call.",
    },
    {
      question: "Can I buy my own toilet and have you install it?",
      answer:
        "Yes. We install customer-supplied toilets regularly. We warranty our labor but not the fixture itself.",
    },
    {
      question: "Why does my toilet keep running?",
      answer:
        "Usually a worn flapper, a faulty fill valve, or an incorrect water level. These are inexpensive, same-day repairs.",
    },
  ],
  bookingCtaText: "Book Toilet Service",
};

const FAUCET_SINK_REPAIR_INSTALLATION_DETAIL: ServiceDetail = {
  slug: "faucet-sink-repair-installation",
  heroDescription:
    "A dripping faucet wastes up to 3,000 gallons per year. A leaking sink connection damages the cabinet below. These aren't cosmetic problems — they're plumbing problems with real cost. Ironclad repairs and installs kitchen faucets, bathroom faucets, and all sink types with proper sealing and tested connections.",
  symptomsHeading: "Signs You Need Faucet or Sink Service",
  symptoms: [
    "Faucet drips after you turn it off",
    "Handles are stiff, loose, or hard to turn",
    "Low water pressure from a single faucet",
    "Water leaking under the sink",
    "Rust, corrosion, or mineral buildup on the fixture",
    "You're upgrading as part of a kitchen or bath remodel",
  ],
  solutionsHeading: "What We Do",
  solutions: [
    "Faucet repair (cartridge, ceramic disc, ball-type, and compression)",
    "Faucet replacement and new installation",
    "Undermount, drop-in, farmhouse, and vessel sink installation",
    "Supply line replacement",
    "Shut-off valve repair and replacement under sinks",
    "P-trap and drain connection repair",
    "Garbage disposal connection with new sink installs",
  ],
  austinNoteTitle: "Austin Note",
  austinNoteBody:
    "Austin's hard water deposits calcium and mineral buildup inside faucet cartridges and aerators. If your faucet handle has gotten stiff or your flow has decreased, a cartridge replacement and aerator cleaning often restores full function. For fixtures older than 10 years, the buildup may be severe enough that replacement is the cleaner option.",
  processHeading: "What to Expect",
  processSteps: [
    { number: "1", title: "Assess", description: "We inspect the fixture and supply connections." },
    { number: "2", title: "Quote", description: "Written estimate for repair or replacement." },
    { number: "3", title: "Install", description: "Professional installation with proper sealing and torque." },
    { number: "4", title: "Test", description: "Leak check, flow test, and drain verification." },
  ],
  trustPoints: [
    { title: "Precision installation", description: "Correct sealing prevents leaks behind walls and under cabinets." },
    { title: "Customer fixtures welcome", description: "Buy your own — we install it right." },
    { title: "Hard-water expertise", description: "We know which fixtures hold up in Austin's water." },
  ],
  faqs: [
    {
      question: "How much does faucet replacement cost?",
      answer:
        "Labor for faucet installation typically runs $150–$300 depending on complexity and access. The fixture cost is separate. We can supply one or install yours.",
    },
    {
      question: "Can you install a farmhouse sink?",
      answer:
        "Yes. Farmhouse sinks often require cabinet modification and different drain configurations. We handle the plumbing side and can coordinate with your contractor on the cabinet work.",
    },
    {
      question: "Why is my faucet handle hard to turn?",
      answer:
        "Usually mineral buildup inside the cartridge. A cartridge replacement typically restores smooth operation. In Austin's hard water, this is very common on fixtures older than 5 years.",
    },
    {
      question: "My sink drains slowly — is that a faucet problem?",
      answer:
        "No, that's a drain issue. The P-trap or drain line may have buildup. We can clear it during the same visit if needed.",
    },
  ],
  bookingCtaText: "Book Faucet & Sink Service",
};

const GARBAGE_DISPOSAL_REPAIR_INSTALLATION_DETAIL: ServiceDetail = {
  slug: "garbage-disposal-repair-installation",
  heroDescription:
    "A jammed, humming, or leaking garbage disposal doesn't always need replacing. In many cases, a reset, a cleared jam, or a seal replacement gets it working again. When replacement is the better option, we install the new unit and handle the electrical and plumbing connections so it works properly from the start.",
  symptomsHeading: "Signs Your Disposal Needs Service",
  symptoms: [
    "Disposal hums but doesn't spin",
    "Disposal doesn't turn on at all",
    "Leaking from the bottom or side",
    "Persistent bad odor even after cleaning",
    "Frequent jamming that requires manual resets",
    "Grinding noise has changed or gotten louder",
  ],
  solutionsHeading: "What We Do",
  solutions: [
    "Jam clearing and manual reset",
    "Disposal repair (bearings, seals, splash guard)",
    "New disposal installation (1/3 HP to 1 HP models)",
    "Disposal replacement with upgraded unit",
    "Electrical connection and switch wiring",
    "Dishwasher drain connection to disposal",
    "Drain line connection and leak testing",
  ],
  austinNoteTitle: "Austin Note",
  austinNoteBody:
    "Most Austin homes have disposals connected to the kitchen drain and often to the dishwasher drain as well. When we install or replace a disposal, we verify both connections and test the dishwasher drain path too. A common issue we see is a clogged disposal causing dishwasher backup — a single visit fixes both.",
  processHeading: "What to Expect",
  processSteps: [
    { number: "1", title: "Diagnose", description: "We determine if the issue is a jam, electrical, or mechanical failure." },
    { number: "2", title: "Quote", description: "Repair vs. replacement quote with model options." },
    { number: "3", title: "Install", description: "New unit mounted, wired, and plumbed." },
    { number: "4", title: "Test", description: "Tested with water running — no leaks, no vibration, proper drainage." },
  ],
  trustPoints: [
    { title: "Repair-first approach", description: "If a jam clear or reset fixes it, we won't push a replacement." },
    { title: "Proper electrical", description: "Wired and connected to code — not jury-rigged." },
    { title: "Complete connection", description: "Drain and dishwasher connections included and tested." },
  ],
  faqs: [
    {
      question: "How much does garbage disposal installation cost?",
      answer:
        "A standard disposal replacement including the unit runs $250–$550 installed. Premium models with longer warranties and more power cost more. We provide a specific written estimate.",
    },
    {
      question: "My disposal hums but won't spin — is it broken?",
      answer:
        "Probably not. A humming disposal usually has a jam. We use an Allen wrench to free the impellers and clear the blockage. If the motor is burned out, we'll recommend replacement.",
    },
    {
      question: "What size disposal do I need?",
      answer:
        "For most Austin households, a 1/2 HP model handles daily use well. Families that cook frequently or have large households may benefit from a 3/4 or 1 HP unit. We recommend based on your usage.",
    },
    {
      question: "Can you add a disposal to a sink that doesn't have one?",
      answer:
        "Yes. We handle the plumbing modifications, electrical connection, and switch installation. The sink needs a standard drain opening (3.5 inches).",
    },
  ],
  bookingCtaText: "Book Disposal Service",
};

const HYDRO_JETTING_DETAIL: ServiceDetail = {
  slug: "hydro-jetting",
  heroDescription:
    "Hydro jetting uses high-pressure water — up to 4,000 PSI — to scour the inside of your sewer and drain lines. It removes grease, mineral scale, tree roots, and years of buildup that a cable snake can't touch. It's the difference between poking a hole through a clog and restoring the full diameter of the pipe.",
  symptomsHeading: "When You Need Hydro Jetting",
  symptoms: [
    "Recurring drain clogs that come back after snaking",
    "Grease buildup in commercial or heavy-use kitchen lines",
    "Slow drainage throughout multiple fixtures",
    "Camera inspection shows heavy scale or root intrusion",
    "Preparing a line for pipe lining (CIPP) — jetting is required first",
    "Sewage odor even after drain cleaning",
  ],
  solutionsHeading: "What We Do",
  solutions: [
    "High-pressure hydro jetting (up to 4,000 PSI) for sewer main lines",
    "Kitchen drain jetting for grease and food buildup",
    "Root cutting and flushing via hydro jet nozzle",
    "Pre-lining pipe preparation (required before CIPP installation)",
    "Camera inspection before and after to verify results",
    "Descaling of mineral-encrusted lines",
  ],
  austinNoteTitle: "Austin Note",
  austinNoteBody:
    "Austin's combination of hard water, mature trees, and aging infrastructure makes hydro jetting one of the most effective maintenance tools available. For restaurants and commercial kitchens in Central Austin, annual jetting of grease lines prevents the costly backups that violate city code and shut down kitchens. For residential lines with recurring root problems, jetting plus root treatment can extend the life of an aging sewer line by years.",
  processHeading: "What to Expect",
  processSteps: [
    { number: "1", title: "Camera", description: "Pre-jet camera inspection to assess pipe condition and identify concerns." },
    { number: "2", title: "Quote", description: "Written estimate based on line length, diameter, and severity." },
    { number: "3", title: "Jet", description: "High-pressure water scours the pipe walls clean." },
    { number: "4", title: "Verify", description: "Post-jet camera confirms full pipe diameter is restored." },
  ],
  trustPoints: [
    { title: "Camera-guided", description: "We inspect before jetting to avoid damaging compromised pipes." },
    { title: "Full-diameter restoration", description: "Not a hole through the clog — the entire pipe is cleaned." },
    { title: "Safe pipe assessment", description: "We won't jet a pipe that can't handle the pressure." },
  ],
  faqs: [
    {
      question: "How much does hydro jetting cost in Austin?",
      answer:
        "Residential hydro jetting typically runs $350–$800 depending on line length and access. Commercial or severely clogged lines may cost more. Camera inspection is usually included.",
    },
    {
      question: "Is hydro jetting safe for old pipes?",
      answer:
        "It depends on the pipe condition. We always run a camera first. If the pipe is fragile, cracked, or deteriorating, we'll recommend an alternative. Jetting is safe for sound PVC, cast iron, and clay pipes.",
    },
    {
      question: "How often should sewer lines be jetted?",
      answer:
        "Most residential lines don't need routine jetting. If you have recurring root intrusion or heavy grease buildup, annual or biannual jetting can prevent emergencies. Commercial kitchen lines often need quarterly service.",
    },
    {
      question: "What's the difference between snaking and hydro jetting?",
      answer:
        "Snaking pokes through a blockage. Jetting removes the blockage and cleans the pipe walls. Snaking is cheaper for simple clogs; jetting is better for buildup, grease, roots, and recurring problems.",
    },
  ],
  bookingCtaText: "Book Hydro Jetting",
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
  "slab-leak-repair": SLAB_LEAK_REPAIR_DETAIL,
  "water-heater-repair": WATER_HEATER_REPAIR_DETAIL,
  "water-heater-installation": WATER_HEATER_INSTALLATION_DETAIL,
  "sewer-camera-inspection": SEWER_CAMERA_INSPECTION_DETAIL,
  "trenchless-sewer-repair": TRENCHLESS_SEWER_REPAIR_DETAIL,
  "toilet-repair-installation": TOILET_REPAIR_INSTALLATION_DETAIL,
  "faucet-sink-repair-installation": FAUCET_SINK_REPAIR_INSTALLATION_DETAIL,
  "garbage-disposal-repair-installation": GARBAGE_DISPOSAL_REPAIR_INSTALLATION_DETAIL,
  "hydro-jetting": HYDRO_JETTING_DETAIL,
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
