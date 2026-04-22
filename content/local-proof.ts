export type LocalProjectCard = {
  title: string;
  summary: string;
  service: string;
};

export type LocalProofData = {
  citySlug: string;
  testimonialIds: string[];
  projectCards: LocalProjectCard[];
  neighborhoodBadges: string[];
  emergencyResponseNote: string;
};

const LOCAL_PROOF_BY_CITY: Partial<Record<string, LocalProofData>> = {
  "austin-tx": {
    citySlug: "austin-tx",
    testimonialIds: ["review-austin-john-d", "review-austin-sarah-m", "review-pflugerville-rachel-w"],
    projectCards: [
      {
        title: "South Austin Leak Isolation",
        service: "Leak Detection",
        summary: "Tracked slab leak source and completed targeted repair with minimal interior disruption.",
      },
      {
        title: "Hyde Park Drain Recovery",
        service: "Drain Cleaning",
        summary: "Camera verified root intrusion and restored flow with clearing plus prevention plan.",
      },
    ],
    neighborhoodBadges: ["South Austin", "Hyde Park", "Mueller", "Circle C"],
    emergencyResponseNote: "Emergency dispatch runs daily across North, Central, and South Austin.",
  },
  "round-rock-tx": {
    citySlug: "round-rock-tx",
    testimonialIds: ["review-round-rock-mike-r", "review-round-rock-david-r"],
    projectCards: [
      {
        title: "Teravista Heater Replacement",
        service: "Water Heaters",
        summary: "Converted failing unit to right-sized replacement with same-day install and cleanup.",
      },
      {
        title: "Brushy Creek Sewer Camera Review",
        service: "Sewer Services",
        summary: "Camera inspection prevented unnecessary excavation and guided targeted repair.",
      },
    ],
    neighborhoodBadges: ["Brushy Creek", "Teravista", "Forest Creek"],
    emergencyResponseNote: "Round Rock requests are handled on a dedicated same-day dispatch corridor.",
  },
  "cedar-park-tx": {
    citySlug: "cedar-park-tx",
    testimonialIds: ["review-cedar-park-lisa-k", "review-cedar-park-lena-t"],
    projectCards: [
      {
        title: "Twin Creeks Fixture Refresh",
        service: "Fixtures",
        summary: "Completed multi-fixture replacement with upgraded valves and tested pressure balance.",
      },
      {
        title: "Brushy Creek Mainline Cleanout",
        service: "Drain Cleaning",
        summary: "Resolved recurring backups and provided preventative maintenance recommendations.",
      },
    ],
    neighborhoodBadges: ["Twin Creeks", "Red Oaks", "Buttercup Creek"],
    emergencyResponseNote: "Cedar Park emergency requests are triaged for priority response windows.",
  },
  "lakeway-tx": {
    citySlug: "lakeway-tx",
    testimonialIds: ["review-lakeway-priya-s"],
    projectCards: [
      {
        title: "Rough Hollow Fixture and Stop Upgrade",
        service: "Fixtures",
        summary: "Reworked premium fixture rough-ins and stop hardware so a bath refresh finished cleanly and performed evenly across the home.",
      },
      {
        title: "Serene Hills Treatment Tune-Up",
        service: "Water Treatment",
        summary: "Reset softener and filtration settings after scale complaints started showing up on newer fixtures and glass enclosures.",
      },
      {
        title: "Old Lakeway Leak Isolation Plan",
        service: "Leak Detection",
        summary: "Localized a concealed supply leak before finish damage spread and mapped the smallest practical access point for repair.",
      },
    ],
    neighborhoodBadges: ["Rough Hollow", "Serene Hills", "Flintrock Falls", "Old Lakeway", "The Hills"],
    emergencyResponseNote:
      "Lakeway calls are routed through dedicated west-side windows, with leak, fixture, and no-hot-water issues prioritized when the route is already in corridor.",
  },
  "bee-cave-tx": {
    citySlug: "bee-cave-tx",
    testimonialIds: [],
    projectCards: [
      {
        title: "Spanish Oaks Outdoor Kitchen Gas Tie-In",
        service: "Gas Line Services",
        summary: "Extended and pressure-tested a new outdoor gas branch so the appliance package could be commissioned without rework.",
      },
      {
        title: "Falconhead Shower Valve Recovery",
        service: "Fixtures",
        summary: "Corrected scale-related valve wear and restored balanced shower performance in a high-use primary bath.",
      },
      {
        title: "Bella Colinas Softener and Filter Reset",
        service: "Water Treatment",
        summary: "Retuned a whole-home treatment setup after fixture spotting and premature cartridge wear started returning.",
      },
    ],
    neighborhoodBadges: ["Falconhead", "Spanish Oaks", "Bella Colinas", "Homestead", "The Uplands"],
    emergencyResponseNote:
      "Bee Cave service is staged through the western dispatch lane, so urgent gas, leak, and water-heater calls can usually be folded into the next available route window.",
  },
  "west-lake-hills-tx": {
    citySlug: "west-lake-hills-tx",
    testimonialIds: [],
    projectCards: [
      {
        title: "Treemont Leak Mapping Before Finish Damage",
        service: "Leak Detection",
        summary: "Tracked hidden moisture to a specific wall-run section so the homeowner avoided opening multiple finished areas to find the source.",
      },
      {
        title: "Westwood Multi-Level Pressure Reset",
        service: "Plumbing Repairs",
        summary: "Balanced pressure across a multi-story layout where upper-level fixtures kept dropping flow during simultaneous use.",
      },
      {
        title: "Las Lomas Remodel Valve Refresh",
        service: "Fixtures",
        summary: "Updated aging stops and trim-support hardware during a remodel phase to prevent callback leaks after finish installation.",
      },
    ],
    neighborhoodBadges: ["Treemont", "Westwood", "Mesa Oaks", "Wildcat Club", "Las Lomas"],
    emergencyResponseNote:
      "West Lake Hills appointments are scheduled with tighter communication windows and priority handling for concealed leaks, low-flow complaints, and remodel-sensitive service calls.",
  },
  "rollingwood-tx": {
    citySlug: "rollingwood-tx",
    testimonialIds: [],
    projectCards: [
      {
        title: "Hatley Drive Hidden Moisture Trace",
        service: "Leak Detection",
        summary: "Pinpointed a slow concealed leak before moisture spread past the bath wall into adjacent finish work.",
      },
      {
        title: "Rollingwood Drive Fixture and Stop Upgrade",
        service: "Fixtures",
        summary: "Replaced aging fixture-side hardware and tested shutoff reliability so a planned upgrade did not turn into an emergency callback.",
      },
      {
        title: "Riley Road Heater Planning Swap",
        service: "Water Heaters",
        summary: "Converted an aging heater replacement into a planned install window instead of waiting for a hard failure in an older home.",
      },
    ],
    neighborhoodBadges: ["Hatley Drive", "Nixon Drive", "Rollingwood Drive", "Riley Road", "Edgegrove"],
    emergencyResponseNote:
      "Rollingwood sits close to our central routes, which helps us respond quickly to active leaks and no-hot-water calls while keeping arrival timing predictable.",
  },
};

export function getLocalProofData(citySlug: string, cityName: string): LocalProofData {
  return (
    LOCAL_PROOF_BY_CITY[citySlug] ?? {
      citySlug,
      testimonialIds: [],
      projectCards: [
        {
          title: `${cityName} Preventive Inspection`,
          service: "General Plumbing",
          summary: "Annual inspection and risk review to reduce emergency failures.",
        },
      ],
      neighborhoodBadges: [cityName],
      emergencyResponseNote: `Emergency response requests in ${cityName} are routed for the fastest available window.`,
    }
  );
}
