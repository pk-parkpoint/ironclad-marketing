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
