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
