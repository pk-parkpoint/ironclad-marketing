import type { LocationEntry } from "./locations";

export type LocationDetailProcessStep = {
  number: string;
  title: string;
  description: string;
};

export type LocationDetail = {
  slug: string;
  heroDescription: string;
  overviewHeading: string;
  overviewParagraphs: string[];
  commonIssuesHeading: string;
  commonIssues: string[];
  neighborhoodHeading: string;
  neighborhoodBody: string;
  neighborhoods: string[];
  featuredServicesHeading: string;
  featuredServiceSlugs: string[];
  homeownerTipsHeading: string;
  homeownerTips: string[];
  processHeading: string;
  processSteps: LocationDetailProcessStep[];
  trustPoints: Array<{ title: string; description: string }>;
  faqs: Array<{ question: string; answer: string }>;
};

type LocationProfile = {
  localOverview: string;
  infrastructureContext: string;
  neighborhoods: string[];
  commonIssues: string[];
  featuredServiceSlugs: string[];
  homeownerTips: string[];
  dispatchNote: string;
};

const LOCATION_PROFILE_BY_SLUG: Partial<Record<string, LocationProfile>> = {
  "austin-tx": {
    localOverview:
      "Austin homes range from historic central neighborhoods to newer suburban builds, and plumbing needs vary widely across that footprint. We support both aging infrastructure and modern high-demand systems throughout the city.",
    infrastructureContext:
      "Older properties often need leak detection, sewer diagnostics, and fixture modernization, while newer construction frequently calls for warranty-phase adjustments, pressure balancing, and water quality upgrades.",
    neighborhoods: ["Downtown", "South Austin", "Hyde Park", "Mueller", "Circle C"],
    commonIssues: [
      "Slab leak risk in older copper supply systems",
      "Hard-water scale reducing fixture and heater performance",
      "Recurring sewer backups in mature-tree neighborhoods",
      "Pressure and balancing issues in multi-story remodels",
    ],
    featuredServiceSlugs: ["leak-detection", "water-treatment", "drain-cleaning"],
    homeownerTips: [
      "Schedule annual water heater maintenance to offset hard-water sediment.",
      "Track water use monthly and investigate unexplained spikes fast.",
      "Address slow drains early in neighborhoods with mature root systems.",
    ],
    dispatchNote: "We keep dispatch coverage across North, Central, and South Austin daily.",
  },
  "round-rock-tx": {
    localOverview:
      "Round Rock homeowners often balance fast-paced schedules with family-heavy water usage. We focus on reliable scheduling and durable repairs that hold up under daily demand.",
    infrastructureContext:
      "A mix of established subdivisions and newer developments means we regularly handle both fixture upgrades and core plumbing corrections in the same neighborhood.",
    neighborhoods: ["Brushy Creek", "Teravista", "Forest Creek", "Paloma Lake", "Cat Hollow"],
    commonIssues: [
      "Water heater strain from high household demand",
      "Kitchen drain buildup in high-use family homes",
      "Toilet and fixture wear in older subdivisions",
      "Water pressure inconsistencies across larger floor plans",
    ],
    featuredServiceSlugs: ["water-heaters", "drain-cleaning", "fixtures"],
    homeownerTips: [
      "Flush tank heaters every year to maintain recovery and efficiency.",
      "Use drain strainers in bathrooms with heavy daily use.",
      "Replace old shut-off valves before emergency failures occur.",
    ],
    dispatchNote: "Round Rock is in our regular same-day service corridor.",
  },
  "georgetown-tx": {
    localOverview:
      "Georgetown's rapid growth has produced a wide mix of new construction and established homes. Our team supports both planned upgrades and urgent plumbing repairs across the city.",
    infrastructureContext:
      "As development expands, we commonly address water heater sizing, treatment planning, and sewer diagnostics tied to changing occupancy and system load.",
    neighborhoods: ["Sun City", "Wolf Ranch", "Berry Creek", "Georgetown Village", "Rancho Sienna"],
    commonIssues: [
      "Hot-water shortfall in homes with growing occupancy",
      "Scale buildup from hard municipal water",
      "Drain blockages from kitchen and laundry load increases",
      "Early fixture wear in builder-grade installations",
    ],
    featuredServiceSlugs: ["water-heaters", "water-treatment", "repairs"],
    homeownerTips: [
      "Right-size replacement heaters for current, not original, household demand.",
      "Add whole-home treatment to protect heaters and fixtures.",
      "Schedule proactive inspections before warranty periods end.",
    ],
    dispatchNote: "We dispatch to Georgetown throughout the week with priority windows available.",
  },
  "pflugerville-tx": {
    localOverview:
      "Pflugerville homeowners need practical service that keeps up with growth and busy schedules. We provide clear options and complete repairs in one visit whenever possible.",
    infrastructureContext:
      "The area's broad housing mix creates recurring needs around fixture reliability, drain maintenance, and water quality protection.",
    neighborhoods: ["Falcon Pointe", "Highland Park", "Blackhawk", "Villages of Hidden Lake", "Avalon"],
    commonIssues: [
      "Recurring sink and shower drain clogs",
      "Water softening needs tied to hard-water exposure",
      "Faucet and toilet component failures",
      "Occasional slab leak symptoms in older sections",
    ],
    featuredServiceSlugs: ["drain-cleaning", "water-treatment", "leak-detection"],
    homeownerTips: [
      "Avoid grease disposal down drains to reduce repeat kitchen clogs.",
      "Inspect toilet fill valves yearly in high-use bathrooms.",
      "Act quickly on warm floor spots or unexplained moisture.",
    ],
    dispatchNote: "Pflugerville remains one of our fastest-response service zones.",
  },
  "cedar-park-tx": {
    localOverview:
      "Cedar Park properties range from long-established neighborhoods to newer communities with expanding infrastructure demand. We tailor work scopes to the age and layout of each home.",
    infrastructureContext:
      "Common service calls include drain and sewer diagnostics, fixture replacement, and water treatment system installs for scale control.",
    neighborhoods: ["Buttercup Creek", "Ranch at Brushy Creek", "Twin Creeks", "Red Oaks", "Anderson Mill West"],
    commonIssues: [
      "Mainline drain concerns in mature subdivisions",
      "Water-heater efficiency loss from sediment accumulation",
      "Fixture and valve wear in high-traffic households",
      "Scale buildup affecting shower and kitchen performance",
    ],
    featuredServiceSlugs: ["drain-cleaning", "water-heaters", "water-treatment"],
    homeownerTips: [
      "Book camera inspections when drain problems recur more than twice a year.",
      "Maintain water heaters annually to reduce sediment-related failures.",
      "Clean aerators and showerheads quarterly in hard-water homes.",
    ],
    dispatchNote: "Cedar Park service routes run daily, including peak evening windows.",
  },
  "leander-tx": {
    localOverview:
      "Leander's growth has produced high service demand across both new and established homes. We focus on dependable timelines and workmanship that scales with household growth.",
    infrastructureContext:
      "Typical projects include water heater upgrades, fixture expansion during remodels, and drain service for larger family occupancy.",
    neighborhoods: ["Crystal Falls", "Larkspur", "Travisso", "Bryson", "Mason Hills"],
    commonIssues: [
      "Undersized hot-water systems for expanding households",
      "Fixture reliability issues in fast-turn construction cycles",
      "Drain flow problems in high-use kitchens",
      "Hard-water scale affecting appliance efficiency",
    ],
    featuredServiceSlugs: ["water-heaters", "fixtures", "water-treatment"],
    homeownerTips: [
      "Reassess water heater capacity after major household changes.",
      "Install quality shutoff hardware during fixture upgrades.",
      "Use treatment systems to protect tankless and tank heaters alike.",
    ],
    dispatchNote: "Leander dispatch times are typically same-day for core service calls.",
  },
  "lakeway-tx": {
    localOverview:
      "Lakeway homes often include complex layouts, multiple baths, and high-end fixtures that require precision installation and maintenance. We prioritize clean workmanship and careful diagnostics.",
    infrastructureContext:
      "In this market we frequently handle leak location, fixture upgrades, and water quality systems that protect long-term plumbing performance.",
    neighborhoods: ["Rough Hollow", "Serene Hills", "Flintrock Falls", "Old Lakeway", "The Hills"],
    commonIssues: [
      "Pressure balancing concerns in multi-level homes",
      "Hidden leak symptoms around slab and wall runs",
      "Scale-related wear on premium fixtures",
      "Water heater performance decline in larger homes",
    ],
    featuredServiceSlugs: ["leak-detection", "fixtures", "water-treatment"],
    homeownerTips: [
      "Use pressure regulation to protect premium fixture cartridges.",
      "Schedule annual leak checks in larger homes with long line runs.",
      "Maintain treatment systems to preserve fixture finish quality.",
    ],
    dispatchNote: "Lakeway appointments are scheduled with route-specific arrival windows.",
  },
  "bee-cave-tx": {
    localOverview:
      "Bee Cave homeowners rely on proactive plumbing service to support custom homes and frequent outdoor living upgrades. We handle both preventive and project-based plumbing with full documentation.",
    infrastructureContext:
      "Common work includes gas lines for outdoor amenities, fixture updates, and water treatment tied to hard-water conditions.",
    neighborhoods: ["Falconhead", "Spanish Oaks", "Homestead", "Bella Colinas", "The Uplands"],
    commonIssues: [
      "Outdoor gas line expansion for kitchens and fire features",
      "Scale buildup in showers and designer fixtures",
      "Water heater stress in large, high-demand homes",
      "Leak concerns on longer plumbing runs",
    ],
    featuredServiceSlugs: ["gas-line-services", "water-treatment", "water-heaters"],
    homeownerTips: [
      "Pressure test gas systems after adding new outdoor appliances.",
      "Use softening to reduce scale on decorative finishes.",
      "Service water heaters before seasonal high-demand periods.",
    ],
    dispatchNote: "Bee Cave is served by dedicated western route coverage.",
  },
  "west-lake-hills-tx": {
    localOverview:
      "West Lake Hills homes often combine mature infrastructure with high-spec remodels. We provide detail-oriented plumbing service that protects both property value and system reliability.",
    infrastructureContext:
      "Frequent projects include leak diagnostics, fixture modernization, and treatment upgrades to reduce hard-water impact.",
    neighborhoods: ["Westwood", "Treemont", "Mesa Oaks", "Wildcat Club", "Las Lomas"],
    commonIssues: [
      "Leak detection needs in concealed and difficult access areas",
      "Aging shutoff and supply components in established homes",
      "Hard-water scaling in premium kitchens and baths",
      "Drain performance issues tied to older branch lines",
    ],
    featuredServiceSlugs: ["leak-detection", "repairs", "water-treatment"],
    homeownerTips: [
      "Replace original supply valves proactively during remodel phases.",
      "Treat water hardness before installing premium fixture packages.",
      "Inspect drain lines before major kitchen or bath renovations.",
    ],
    dispatchNote: "West Lake Hills appointments receive high-priority dispatch planning.",
  },
  "rollingwood-tx": {
    localOverview:
      "Rollingwood homeowners expect clean execution, strong communication, and minimal disruption. Our team is structured for exactly that standard.",
    infrastructureContext:
      "Most requests involve leak management, fixture replacements, and preventive upgrades designed to keep older systems operating reliably.",
    neighborhoods: ["Hatley Drive area", "Nixon Drive area", "Rollingwood Drive corridor", "Riley Road area", "Edgegrove"],
    commonIssues: [
      "Concealed leak concerns in older plumbing layouts",
      "Toilet and faucet wear from years of daily use",
      "Water heater service planning for aging systems",
      "Scale accumulation affecting fixture performance",
    ],
    featuredServiceSlugs: ["leak-detection", "fixtures", "water-heaters"],
    homeownerTips: [
      "Add leak alerts in homes with older copper supply systems.",
      "Refresh fixtures and shutoffs together during replacement projects.",
      "Document serial and install dates for all water heaters and treatment units.",
    ],
    dispatchNote: "Rollingwood is covered by central dispatch teams with short travel times.",
  },
  "dripping-springs-tx": {
    localOverview:
      "Dripping Springs properties often involve rural layouts, larger lots, and water quality variation. We build plumbing plans that account for distance, pressure, and treatment requirements.",
    infrastructureContext:
      "Service calls commonly include treatment upgrades, leak response, and system tuning for homes with unique infrastructure conditions.",
    neighborhoods: ["Belterra", "Headwaters", "Caliterra", "Driftwood-adjacent communities", "Founders Ridge"],
    commonIssues: [
      "Water quality and hardness concerns across supply types",
      "Pressure management in homes with longer plumbing runs",
      "Water heater efficiency decline from mineral load",
      "Leak risks in high-variation temperature cycles",
    ],
    featuredServiceSlugs: ["water-treatment", "leak-detection", "water-heaters"],
    homeownerTips: [
      "Test water quality before selecting treatment equipment.",
      "Use annual inspections for homes with long service lines.",
      "Plan preventive leak checks before seasonal temperature swings.",
    ],
    dispatchNote: "Dripping Springs service is scheduled with route windows tailored to travel distance.",
  },
  "buda-tx": {
    localOverview:
      "Buda households need quick, dependable plumbing support as neighborhoods continue to expand. We focus on same-day-capable repairs and practical upgrade planning.",
    infrastructureContext:
      "Common calls include drain clearing, heater replacement, and fixture work driven by daily family usage.",
    neighborhoods: ["Sunfield", "Whispering Hollow", "Garlic Creek", "Cullen Country", "Elm Grove"],
    commonIssues: [
      "Recurring kitchen and bath drain blockages",
      "Water heater wear in high-usage family homes",
      "Fixture and valve failures in builder-grade installs",
      "Hard-water scaling on appliances and shower components",
    ],
    featuredServiceSlugs: ["drain-cleaning", "water-heaters", "fixtures"],
    homeownerTips: [
      "Treat slow drains early before full backups occur.",
      "Flush water heaters yearly to improve lifespan.",
      "Replace aging fixture supply lines before leaks emerge.",
    ],
    dispatchNote: "Buda remains on a daily dispatch route with strong same-day coverage.",
  },
  "kyle-tx": {
    localOverview:
      "Kyle's fast growth means plumbing systems are under constant change from remodels, additions, and increased occupancy. We help homeowners stay ahead of wear and performance issues.",
    infrastructureContext:
      "Our work frequently includes drain and sewer diagnostics, water heater adjustments, and fixture upgrades for changing household demand.",
    neighborhoods: ["Plum Creek", "Hometown Kyle", "Creekside Village", "Paramount", "Waterleaf"],
    commonIssues: [
      "Drain line stress from expanding occupancy",
      "Hot-water recovery limitations in larger families",
      "Fixture fatigue in heavily used bathrooms",
      "Scale accumulation affecting flow and appliance reliability",
    ],
    featuredServiceSlugs: ["drain-cleaning", "water-heaters", "repairs"],
    homeownerTips: [
      "Review plumbing capacity before major home additions.",
      "Use preventive drain maintenance for high-demand kitchens.",
      "Upgrade shutoff and control valves during fixture replacements.",
    ],
    dispatchNote: "Kyle service windows are available most days with expedited emergency dispatch.",
  },
  "manor-tx": {
    localOverview:
      "Manor homeowners need straightforward plumbing service that keeps pace with community growth and day-to-day reliability needs. We prioritize clear estimates and durable outcomes.",
    infrastructureContext:
      "Typical projects include water treatment, fixture reliability corrections, and leak diagnostics as systems mature.",
    neighborhoods: ["ShadowGlen", "Presidential Meadows", "Bell Farms", "Carillon", "Lagos"],
    commonIssues: [
      "Hard-water scale impact on plumbing fixtures",
      "Minor leak patterns around supply fittings",
      "Drain slowdown in high-use kitchens and baths",
      "Water heater maintenance gaps in newer homes",
    ],
    featuredServiceSlugs: ["water-treatment", "repairs", "drain-cleaning"],
    homeownerTips: [
      "Adopt annual maintenance even on newer plumbing systems.",
      "Install treatment early to reduce long-term fixture wear.",
      "Track drainage performance and address recurring slow flow promptly.",
    ],
    dispatchNote: "Manor is on our East-side dispatch schedule with routine same-day availability.",
  },
  "hutto-tx": {
    localOverview:
      "Hutto's expanding neighborhoods create strong demand for both reactive repairs and preventive planning. We handle everyday service calls and long-term plumbing upgrades.",
    infrastructureContext:
      "Most projects involve water heater optimization, fixture and valve durability, and hard-water mitigation for system protection.",
    neighborhoods: ["Star Ranch", "Riverwalk", "Carmel Creek", "Hutto Highlands", "Emory Crossing"],
    commonIssues: [
      "Water heater strain as households grow",
      "Fixture wear from hard-water scaling",
      "Drain maintenance needs in active family homes",
      "Leak concerns around aging supply connectors",
    ],
    featuredServiceSlugs: ["water-heaters", "water-treatment", "fixtures"],
    homeownerTips: [
      "Inspect heater performance before noticeable hot-water loss appears.",
      "Use water treatment to reduce cartridge and valve replacement cycles.",
      "Replace older braided lines proactively during fixture service.",
    ],
    dispatchNote: "Hutto service is included in our daily Williamson County routes.",
  },
  "taylor-tx": {
    localOverview:
      "Taylor homeowners rely on dependable plumbing support for both established homes and newly developing areas. We provide transparent planning and practical repair options.",
    infrastructureContext:
      "Frequent service types include drain diagnostics, sewer evaluation, and water heater replacement tailored to household demand.",
    neighborhoods: ["Northpark", "Mallard Park area", "Meadow Creek", "Sarah's Creek", "Mustang Creek"],
    commonIssues: [
      "Drain and sewer concerns in older line networks",
      "Heater efficiency decline from sediment accumulation",
      "Fixture and shutoff valve aging",
      "Water quality concerns tied to mineral content",
    ],
    featuredServiceSlugs: ["sewer-services", "water-heaters", "drain-cleaning"],
    homeownerTips: [
      "Use camera diagnostics when drain issues return repeatedly.",
      "Plan heater replacement before end-of-life failure periods.",
      "Install treatment to reduce scale load on older plumbing.",
    ],
    dispatchNote: "Taylor jobs are planned with dedicated route blocks for reliable arrival windows.",
  },
  "liberty-hill-tx": {
    localOverview:
      "Liberty Hill homes range from newer communities to larger-lot properties with unique water and pressure requirements. Our service plans account for those differences.",
    infrastructureContext:
      "Common requests include water quality treatment, leak diagnostics, and fixture and heater support for expanding households.",
    neighborhoods: ["Santa Rita Ranch", "Northgate Ranch", "Rancho Santa Fe", "Lariat", "Stonewall Ranch"],
    commonIssues: [
      "Water quality and hardness management across varied supply profiles",
      "Pressure balancing in larger homes and longer pipe runs",
      "Water heater sizing and recovery mismatches",
      "Leak concerns in high-expansion soil conditions",
    ],
    featuredServiceSlugs: ["water-treatment", "leak-detection", "water-heaters"],
    homeownerTips: [
      "Match treatment system size to actual occupancy and usage.",
      "Check pressure regulation annually on larger properties.",
      "Investigate unexplained wet spots quickly to avoid slab impact.",
    ],
    dispatchNote: "Liberty Hill is covered through our northern dispatch lanes each service day.",
  },
  "lago-vista-tx": {
    localOverview:
      "Lago Vista properties often involve lake-area conditions, elevation changes, and varied home layouts. We focus on plumbing reliability with careful diagnostics and preventive planning.",
    infrastructureContext:
      "Our work here regularly includes leak response, fixture upgrades, and water treatment support for long-term system protection.",
    neighborhoods: ["Highland Lake Estates", "Bar-K Ranch", "Point Venture-adjacent areas", "Country Club Estates", "Lakeside communities"],
    commonIssues: [
      "Pressure and flow consistency in elevation-shifted layouts",
      "Hard-water scale reducing fixture and heater performance",
      "Leak diagnosis needs in concealed and extended line runs",
      "Drain flow challenges in older sections",
    ],
    featuredServiceSlugs: ["leak-detection", "water-treatment", "repairs"],
    homeownerTips: [
      "Use pressure-regulating safeguards in multi-level plumbing systems.",
      "Maintain treatment equipment to preserve fixture lifespan.",
      "Schedule periodic inspections for homes with older branch lines.",
    ],
    dispatchNote: "Lago Vista visits are scheduled in dedicated western route windows.",
  },
  "spicewood-tx": {
    localOverview:
      "Spicewood homes often require plumbing service that accounts for Hill Country conditions, larger properties, and hard-water exposure. We deliver clear plans with durable execution.",
    infrastructureContext:
      "Typical projects include treatment systems, leak detection, and water heater service matched to demanding residential layouts.",
    neighborhoods: ["Briarcliff", "West Cypress Hills", "Spicewood Trails", "Lakecliff", "Barton Creek Lakeside area"],
    commonIssues: [
      "Hard-water and mineral management across whole-home systems",
      "Leak response in longer, complex line routes",
      "Water heater optimization for larger households",
      "Fixture scale and wear in high-demand bath/kitchen zones",
    ],
    featuredServiceSlugs: ["water-treatment", "leak-detection", "water-heaters"],
    homeownerTips: [
      "Test and tune treatment systems as occupancy changes.",
      "Prioritize early leak detection in homes with long pipe runs.",
      "Schedule annual heater and fixture maintenance to control mineral wear.",
    ],
    dispatchNote: "Spicewood service is available through planned Hill Country dispatch windows.",
  },
};

const LOCATION_DETAIL_OVERRIDES: Partial<Record<string, LocationDetail>> = {
  "lakeway-tx": {
    slug: "lakeway-tx",
    heroDescription:
      "Lakeway plumbing calls usually involve higher-finish kitchens and baths, long interior runs, recirculation loops, and water-quality tuning that needs more precision than a generic repair visit. We serve Rough Hollow, Serene Hills, Flintrock Falls, Old Lakeway, and The Hills with work that stays technically sound and visually clean.",
    overviewHeading: "Lakeway Plumbing With Clean Workmanship and Respect for the Home",
    overviewParagraphs: [
      "Lakeway homeowners are usually not just trying to get water flowing again. They want a repair or upgrade that protects finished surfaces, preserves fixture quality, and avoids a sloppy installation story after the truck leaves.",
      "That means we spend more time here on detailed fixture work, leak isolation in larger layouts, recirculation and hot-water-delivery complaints, and treatment planning that keeps scale from dulling premium hardware too early.",
      "Because Lakeway sits in a defined west-side service corridor, we can usually give a clearer arrival window and a more organized next-step plan for leak, treatment, or fixture work instead of turning a single visit into a guessing exercise.",
    ],
    commonIssuesHeading: "Lakeway Plumbing Problems We See Most Often",
    commonIssues: [
      "Pressure and flow imbalance across multi-level homes with longer interior plumbing runs",
      "Scale-related wear showing up early on premium fixtures and shower components",
      "Hidden leak symptoms around slab edges, wall runs, or recirculation paths",
      "Water-heater and recirculation complaints in larger homes with multiple simultaneous demand points",
      "Treatment systems that need retuning after occupancy or fixture changes",
    ],
    neighborhoodHeading: "Lakeway Areas We Routinely Serve",
    neighborhoodBody:
      "Our Lakeway routes regularly include Rough Hollow, Serene Hills, Flintrock Falls, Old Lakeway, The Hills, and nearby lake-area neighborhoods where plumbing work has to balance performance, finish quality, and clean communication.",
    neighborhoods: ["Rough Hollow", "Serene Hills", "Flintrock Falls", "Old Lakeway", "The Hills", "Lakeway Highlands"],
    featuredServicesHeading: "Lakeway Services Homeowners Call Us For Most",
    featuredServiceSlugs: ["fixtures", "water-treatment", "leak-detection"],
    homeownerTipsHeading: "Lakeway Homeowner Tips Before the Next Problem Gets More Expensive",
    homeownerTips: [
      "Treat recurring low-flow or temperature complaints as a system-design question, not just a fixture issue.",
      "Keep treatment maintenance current if you want premium fixtures and glass enclosures to stay cleaner longer.",
      "Address small hidden-moisture signs early because larger homes can conceal leak damage for longer than expected.",
      "Review recirculation and heater performance together when hot-water complaints start showing up in different parts of the home.",
    ],
    processHeading: "How Lakeway Service Usually Runs",
    processSteps: [
      {
        number: "1",
        title: "Confirm layout and finish sensitivity",
        description: "We note whether the home has long runs, premium fixtures, recirculation, or remodel-sensitive areas before the visit starts.",
      },
      {
        number: "2",
        title: "Diagnose the real system condition",
        description: "Technicians check the active symptom plus the pressure, water-quality, or heater conditions that often sit behind it in Lakeway homes.",
      },
      {
        number: "3",
        title: "Scope the cleanest repair path",
        description: "You get written options that prioritize durable correction and minimize unnecessary disruption to the home.",
      },
      {
        number: "4",
        title: "Verify performance and document next steps",
        description: "We test the finished work and document any treatment, maintenance, or follow-up action that protects long-term performance.",
      },
    ],
    trustPoints: [
      {
        title: "High-finish fixture awareness",
        description: "We work with the care Lakeway homes need when finish quality matters as much as function.",
      },
      {
        title: "Water-quality and recirculation context",
        description: "We look beyond the failed part and account for the system conditions that usually caused the complaint.",
      },
      {
        title: "Organized west-corridor scheduling",
        description: "Lakeway service is routed with practical windows and clear communication before arrival.",
      },
    ],
    faqs: [
      {
        question: "Do you work on premium fixtures and specialty hardware in Lakeway?",
        answer:
          "Yes. We regularly handle higher-finish fixture installs and repairs where clean workmanship and manufacturer-aware installation details matter.",
      },
      {
        question: "Can you help with hot-water delays in larger Lakeway homes?",
        answer:
          "Yes. We evaluate heater sizing, recirculation behavior, and fixture demand together so the fix addresses the real reason hot water is lagging.",
      },
      {
        question: "Is water treatment worth it in Lakeway?",
        answer:
          "Usually, yes. Treatment helps protect heaters, valves, shower components, and premium finishes from the kind of hard-water wear we regularly see in Lakeway homes.",
      },
      {
        question: "Do you document completed work and next steps?",
        answer:
          "Yes. We provide clear completion notes and warranty-backed follow-up guidance so the homeowner is not left guessing after service.",
      },
    ],
  },
  "bee-cave-tx": {
    slug: "bee-cave-tx",
    heroDescription:
      "Bee Cave plumbing service often means supporting custom homes, outdoor living upgrades, gas-line work, and water-quality decisions that need more planning than a one-note repair visit. We serve Falconhead, Spanish Oaks, Bella Colinas, Homestead, and nearby neighborhoods with practical scopes and clean execution.",
    overviewHeading: "Bee Cave Plumbing for Repairs, Gas Lines, Fixtures, and Water Quality",
    overviewParagraphs: [
      "Bee Cave homes create a different service profile than a dense older neighborhood. We frequently move between custom-home fixture work, outdoor kitchen and fire-feature gas lines, heater performance questions, and treatment planning meant to protect more expensive finishes.",
      "That makes clarity important. Homeowners usually need to know whether the right answer is a targeted repair, a gas or fixture upgrade, or a treatment change that will prevent the same finish or scale issue from coming back.",
      "Bee Cave also sits in a route pattern where we can usually bundle detailed diagnostics with responsive follow-through, which matters when the project touches multiple systems or a higher-spec home schedule.",
    ],
    commonIssuesHeading: "Bee Cave Plumbing Issues We See Repeatedly",
    commonIssues: [
      "Outdoor kitchen, fireplace, and grill projects that need pressure-tested gas-line extensions",
      "Scale buildup on designer fixtures and shower systems in hard-water conditions",
      "Water-heater strain in larger homes with multiple simultaneous demand points",
      "Leak symptoms on longer runs or around recently upgraded fixture zones",
      "Treatment systems that need to match actual usage rather than generic package sizing",
    ],
    neighborhoodHeading: "Bee Cave Areas We Routinely Cover",
    neighborhoodBody:
      "Our Bee Cave routes regularly include Falconhead, Spanish Oaks, Bella Colinas, Homestead, The Uplands, and nearby custom-home neighborhoods where gas work, fixture quality, and water treatment often intersect on the same service call.",
    neighborhoods: ["Falconhead", "Spanish Oaks", "Bella Colinas", "Homestead", "The Uplands", "Rocky Creek"],
    featuredServicesHeading: "Bee Cave Services Homeowners Request Most",
    featuredServiceSlugs: ["gas-line-services", "water-treatment", "water-heaters"],
    homeownerTipsHeading: "Bee Cave Homeowner Tips for Fewer Callback Problems",
    homeownerTips: [
      "Pressure-test gas additions whenever an outdoor appliance package changes.",
      "Treat scale early if designer fixtures are already spotting or cartridge life is getting shorter.",
      "Revisit heater sizing when a home adds baths, guests, or heavier seasonal occupancy.",
      "Use one coordinated scope for leak, fixture, and treatment issues when they start showing up together.",
    ],
    processHeading: "How Bee Cave Service Usually Works",
    processSteps: [
      {
        number: "1",
        title: "Clarify project type",
        description: "We confirm whether the call is repair, gas expansion, fixture work, heater performance, or water-quality driven before dispatch.",
      },
      {
        number: "2",
        title: "Inspect the surrounding system",
        description: "Technicians check the related pressure, scale, gas, or fixture conditions so the repair scope reflects the full use case.",
      },
      {
        number: "3",
        title: "Present a durable plan",
        description: "You get written options that match the home, the finish level, and the longer-term reliability goal.",
      },
      {
        number: "4",
        title: "Complete and verify",
        description: "We test the completed work, confirm safe operation, and document the follow-up maintenance that keeps the same issue from returning.",
      },
    ],
    trustPoints: [
      {
        title: "Strong fit for custom-home service",
        description: "We regularly handle Bee Cave jobs where the plumbing work needs to respect finish quality and project sequencing.",
      },
      {
        title: "Gas and water-quality context",
        description: "We can connect outdoor-living gas work and hard-water planning instead of treating them like unrelated tasks.",
      },
      {
        title: "Clear western-route scheduling",
        description: "Bee Cave jobs are planned with realistic arrival windows and better pre-arrival communication.",
      },
    ],
    faqs: [
      {
        question: "Do you handle gas lines for outdoor kitchens and fire features in Bee Cave?",
        answer:
          "Yes. Outdoor gas-line additions are a common Bee Cave request, and we pressure-test and document the work so the appliance side can be commissioned cleanly.",
      },
      {
        question: "Can you help with fixture installs in custom homes?",
        answer:
          "Yes. We routinely handle fixture work where finish quality, compatibility, and clean final presentation matter just as much as function.",
      },
      {
        question: "Is water treatment worth it in Bee Cave?",
        answer:
          "For many homes, yes. Hard-water scale shows up quickly on higher-end fixtures and heater components, so treatment often prevents repeat maintenance and finish wear.",
      },
      {
        question: "Do you provide proactive inspections in Bee Cave?",
        answer:
          "Yes. Preventive inspections are useful in Bee Cave because gas, fixture, and treatment issues often show warning signs before they become expensive disruptions.",
      },
    ],
  },
  "west-lake-hills-tx": {
    slug: "west-lake-hills-tx",
    heroDescription:
      "West Lake Hills plumbing work often means navigating older infrastructure, remodel-era upgrades, concealed access, and multi-level layouts without creating unnecessary disruption. We serve Westwood, Treemont, Mesa Oaks, Wildcat Club, and Las Lomas with careful diagnostics and polished execution.",
    overviewHeading: "West Lake Hills Plumbing With Precision and Professionalism",
    overviewParagraphs: [
      "West Lake Hills homes often carry a combination of original plumbing decisions and newer remodel expectations. That mix changes the work: a leak, pressure complaint, or fixture issue can involve both aging infrastructure and high-finish surfaces at the same time.",
      "We regularly handle concealed leak diagnostics, upper-level flow complaints, valve and supply updates during remodel phases, and treatment planning that protects kitchens and baths where hard-water wear shows up fast.",
      "Because West Lake Hills sits close to our central-west routes, we can usually respond quickly while still keeping the work orderly, documented, and aligned with the level of finish homeowners expect.",
    ],
    commonIssuesHeading: "West Lake Hills Plumbing Calls We See Most Often",
    commonIssues: [
      "Leak detection in concealed wall, slab-edge, or difficult-access areas",
      "Pressure and flow inconsistency across upper levels or remodeled bath groups",
      "Aging shutoff, supply, and trim-support components in established homes",
      "Hard-water wear affecting premium kitchen and bath fixtures",
      "Drain and sewer concerns where older infrastructure meets renovation-era updates",
    ],
    neighborhoodHeading: "West Lake Hills Areas on Our Regular Routes",
    neighborhoodBody:
      "We routinely serve Westwood, Treemont, Mesa Oaks, Wildcat Club, Las Lomas, and nearby West Lake Hills pockets where the plumbing work often needs to respect remodel finishes and mixed-age system components.",
    neighborhoods: ["Westwood", "Treemont", "Mesa Oaks", "Wildcat Club", "Las Lomas", "West Rim"],
    featuredServicesHeading: "West Lake Hills Services We Most Often Recommend",
    featuredServiceSlugs: ["leak-detection", "repairs", "water-treatment"],
    homeownerTipsHeading: "West Lake Hills Homeowner Tips Before a Remodel or Leak Gets More Complicated",
    homeownerTips: [
      "Replace original shutoffs and supply components during remodel phases instead of waiting for them to fail later.",
      "Investigate low-flow or pressure imbalance quickly when it starts showing up on upper levels or newer fixtures.",
      "Add water treatment before installing premium fixture packages if scale is already visible elsewhere in the home.",
      "Use targeted leak diagnostics first when moisture appears because opening multiple finished areas rarely starts as the smartest move.",
    ],
    processHeading: "How West Lake Hills Service Usually Runs",
    processSteps: [
      {
        number: "1",
        title: "Understand the access and finish conditions",
        description: "We start by noting remodel sensitivity, concealed access points, and any schedule constraints before work begins.",
      },
      {
        number: "2",
        title: "Diagnose the underlying condition",
        description: "Technicians inspect the visible symptom plus the pressure, supply, or drain conditions that usually sit behind it in West Lake Hills homes.",
      },
      {
        number: "3",
        title: "Set the least-disruptive repair path",
        description: "You get written options designed to solve the problem cleanly without creating unnecessary disruption elsewhere in the home.",
      },
      {
        number: "4",
        title: "Document and protect the finish result",
        description: "We verify the completed work and leave clear notes on any maintenance or follow-up that protects long-term reliability.",
      },
    ],
    trustPoints: [
      {
        title: "Remodel-aware diagnostics",
        description: "We understand how to approach plumbing problems in homes where finished surfaces and recent upgrades raise the stakes.",
      },
      {
        title: "Precision before demolition",
        description: "Leak-location and system checks help us keep the scope targeted when access is tight or finish quality matters.",
      },
      {
        title: "Responsive central-west routing",
        description: "West Lake Hills is close to our central routes, which helps us communicate tighter windows and priority handling for urgent calls.",
      },
    ],
    faqs: [
      {
        question: "Do you coordinate plumbing work with remodeling timelines in West Lake Hills?",
        answer:
          "Yes. We regularly coordinate around remodel sequencing so fixture, valve, and rough-in work lands at the right time and does not create avoidable rework.",
      },
      {
        question: "Can you troubleshoot low flow on upper levels?",
        answer:
          "Yes. We check supply pressure, layout, fixture restrictions, and regulator behavior so the diagnosis goes beyond the room where the complaint shows up.",
      },
      {
        question: "What plumbing issue is most common in West Lake Hills?",
        answer:
          "Concealed leak concerns, pressure imbalance in multi-level homes, and upgrade work where older plumbing has to support newer finishes all show up frequently here.",
      },
      {
        question: "Do you offer discreet service windows and clear communication?",
        answer:
          "Yes. We schedule with realistic windows and provide pre-arrival communication because that matters in West Lake Hills service environments.",
      },
    ],
  },
  "rollingwood-tx": {
    slug: "rollingwood-tx",
    heroDescription:
      "Rollingwood plumbing service is usually about keeping older homes dependable without creating unnecessary disruption: hidden leaks, valve refreshes, fixture upgrades, and heater planning that needs to be handled cleanly and communicated clearly. We serve Hatley Drive, Nixon Drive, Rollingwood Drive, Riley Road, and nearby streets with a practical, polished process.",
    overviewHeading: "Rollingwood Plumbing With Clear Communication and Clean Execution",
    overviewParagraphs: [
      "Rollingwood homes tend to reward careful planning more than dramatic repair language. A lot of the work here involves established plumbing systems that need targeted updates, clean fixture replacement, and leak response that stays controlled instead of turning into a larger mess.",
      "We regularly see older shutoffs, concealed supply issues, heater replacement planning, and bath or kitchen fixture projects where the best result depends on solving adjacent reliability problems at the same time.",
      "Because Rollingwood sits close to our central routes, we can usually keep arrival timing tighter and service more predictable, which is especially helpful when the homeowner wants the work finished with as little disruption as possible.",
    ],
    commonIssuesHeading: "Rollingwood Plumbing Problems We Handle Most Often",
    commonIssues: [
      "Concealed supply leaks and moisture problems in older wall and floor assemblies",
      "Fixture and shutoff wear that shows up during planned kitchen or bath updates",
      "Water-heater replacement planning in homes with aging equipment and tight utility spaces",
      "Scale and pressure wear shortening the life of faucets, fill valves, and shower components",
      "Drain and vent corrections uncovered when older homes go through partial remodel cycles",
    ],
    neighborhoodHeading: "Rollingwood Streets and Areas We Routinely Cover",
    neighborhoodBody:
      "We regularly serve homes around Hatley Drive, Nixon Drive, Rollingwood Drive, Riley Road, Edgegrove, and nearby central-west streets where established plumbing and remodel-sensitive finishes often meet in the same service call.",
    neighborhoods: ["Hatley Drive", "Nixon Drive", "Rollingwood Drive", "Riley Road", "Edgegrove", "Bee Creek Road corridor"],
    featuredServicesHeading: "Rollingwood Services Homeowners Ask For Most",
    featuredServiceSlugs: ["leak-detection", "fixtures", "water-heaters"],
    homeownerTipsHeading: "Rollingwood Homeowner Tips for Cleaner Repairs and Fewer Surprises",
    homeownerTips: [
      "Replace shutoffs and supply hardware together when upgrading fixtures in older baths or kitchens.",
      "Treat hidden moisture early because small slow leaks can sit unnoticed behind finish work for longer than expected.",
      "Plan heater replacement before a hard failure if the unit is already aging and utility access is tight.",
      "Pair fixture refreshes with pressure and scale checks so new hardware lasts longer than the old set did.",
    ],
    processHeading: "How Rollingwood Service Usually Moves",
    processSteps: [
      {
        number: "1",
        title: "Confirm the age and sensitivity of the work area",
        description: "We start by understanding the home's age, access limits, and whether the call ties into a planned update or an urgent failure.",
      },
      {
        number: "2",
        title: "Diagnose the adjacent reliability risks",
        description: "Technicians inspect the active issue plus the stops, supply lines, or heater conditions that often turn a clean job into a callback when ignored.",
      },
      {
        number: "3",
        title: "Set a practical written scope",
        description: "You get clear options that emphasize durable repair and clean execution instead of vague recommendations.",
      },
      {
        number: "4",
        title: "Finish cleanly and leave the next-step plan",
        description: "We test the repair or install, clean the work area, and document the follow-up that keeps the same issue from resurfacing.",
      },
    ],
    trustPoints: [
      {
        title: "Strong fit for established homes",
        description: "We are comfortable working in Rollingwood houses where older plumbing needs targeted modernization instead of guesswork.",
      },
      {
        title: "Communication-first service",
        description: "Rollingwood homeowners usually want straight answers and a clean scope, and that is exactly how we run the job.",
      },
      {
        title: "Fast central-route access",
        description: "Rollingwood sits near our central dispatch pattern, which helps us keep schedules tighter on both urgent and planned work.",
      },
    ],
    faqs: [
      {
        question: "Do you handle plumbing updates during bathroom or kitchen remodels in Rollingwood?",
        answer:
          "Yes. We regularly coordinate fixture placement, valve refreshes, and code-conscious rough-in adjustments during Rollingwood remodel work.",
      },
      {
        question: "Can you locate hidden moisture quickly in an older Rollingwood home?",
        answer:
          "Yes. We use targeted leak diagnostics first so the repair scope can stay focused instead of opening more finish work than necessary.",
      },
      {
        question: "What service call is most common in Rollingwood?",
        answer:
          "Hidden leaks, fixture-side reliability upgrades, and water-heater planning show up frequently because many Rollingwood homes are in that established-home maintenance cycle.",
      },
      {
        question: "Do you provide warranty-backed repairs in Rollingwood?",
        answer:
          "Yes. Completed work is documented and backed by written workmanship coverage, with clear notes on any next-step maintenance.",
      },
    ],
  },
};

function toReadableList(items: string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  const start = items.slice(0, -1).join(", ");
  return `${start}, and ${items[items.length - 1]}`;
}

function buildFallbackProfile(location: LocationEntry): LocationProfile {
  return {
    localOverview: `${location.cityName} homeowners call us for both urgent repairs and planned upgrades, and we tailor our service to each home's age and layout.`,
    infrastructureContext:
      "We focus on durable plumbing outcomes with clear estimates, quality parts, and practical maintenance guidance for long-term reliability.",
    neighborhoods: [`North ${location.cityName}`, `Central ${location.cityName}`, `South ${location.cityName}`],
    commonIssues: [
      "Fixture wear and leak concerns",
      "Drain performance problems",
      "Water heater efficiency decline",
      "Hard-water scale impacts",
    ],
    featuredServiceSlugs: ["repairs", "drain-cleaning", "water-heaters"],
    homeownerTips: [
      "Address small leaks early to avoid larger repair scopes.",
      "Flush and maintain water heaters annually.",
      "Schedule drain inspection if clogs become recurring.",
    ],
    dispatchNote: `${location.cityName} is covered by our regular Greater Austin dispatch team.`,
  };
}

export function getLocationDetail(location: LocationEntry): LocationDetail {
  const override = LOCATION_DETAIL_OVERRIDES[location.slug];
  if (override) {
    return override;
  }

  const profile = LOCATION_PROFILE_BY_SLUG[location.slug] ?? buildFallbackProfile(location);
  const commonIssueSnippet = toReadableList(profile.commonIssues.slice(0, 2).map((entry) => entry.toLowerCase()));
  const neighborhoodSnippet = toReadableList(profile.neighborhoods.slice(0, 3));

  return {
    slug: location.slug,
    heroDescription: `${location.metaDescription} ${profile.dispatchNote}`,
    overviewHeading: `Professional Plumbing in ${location.cityName}, TX`,
    overviewParagraphs: [profile.localOverview, profile.infrastructureContext],
    commonIssuesHeading: `Common Plumbing Challenges in ${location.cityName}`,
    commonIssues: profile.commonIssues,
    neighborhoodHeading: `Neighborhoods We Serve in ${location.cityName}`,
    neighborhoodBody: `Our technicians work throughout ${location.cityName}, including ${neighborhoodSnippet}, plus surrounding communities in the same service corridor.`,
    neighborhoods: profile.neighborhoods,
    featuredServicesHeading: `Popular Services for ${location.cityName} Homes`,
    featuredServiceSlugs: profile.featuredServiceSlugs,
    homeownerTipsHeading: `${location.cityName} Homeowner Tips`,
    homeownerTips: profile.homeownerTips,
    processHeading: `How Service Works in ${location.cityName}`,
    processSteps: [
      {
        number: "1",
        title: "Book",
        description: `Book online or by phone and tell us what is happening at your ${location.cityName} property.`,
      },
      {
        number: "2",
        title: "Dispatch",
        description: profile.dispatchNote,
      },
      {
        number: "3",
        title: "Diagnose",
        description: "We inspect, explain root cause, and provide a written estimate before work begins.",
      },
      {
        number: "4",
        title: "Complete",
        description: "We complete the repair or installation, test performance, and clean the work area.",
      },
    ],
    trustPoints: [
      {
        title: "Upfront Written Pricing",
        description: "No hidden charges and no surprise add-ons after work begins.",
      },
      {
        title: "Licensed and Insured",
        description: `Professional plumbing service for ${location.cityName} homes with code-compliant workmanship.`,
      },
      {
        title: "Warranty-Backed Work",
        description: "Every completed job includes written warranty coverage details.",
      },
    ],
    faqs: [
      {
        question: `How quickly can Ironclad reach my home in ${location.cityName}?`,
        answer: `${profile.dispatchNote} For urgent issues, we prioritize the next available technician and provide the clearest ETA we can.`,
      },
      {
        question: `What plumbing issues are most common in ${location.cityName}?`,
        answer: `In this area, we frequently see ${commonIssueSnippet}. We diagnose first so the fix matches the real cause.`,
      },
      {
        question: `Do you serve all neighborhoods in ${location.cityName}?`,
        answer: `Yes. We regularly serve ${neighborhoodSnippet} and nearby communities within our Greater Austin service area.`,
      },
      {
        question: `Can I schedule same-day plumbing service in ${location.cityName}?`,
        answer: "Same-day availability depends on technician load and route demand, but we offer same-day windows whenever possible and emergency prioritization when needed.",
      },
    ],
  };
}
