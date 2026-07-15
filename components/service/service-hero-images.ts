const HERO_IMAGES: Record<string, string> = {
  repairs: "/media/services/plumbing-repairs.jpg",
  "drain-clearing": "/media/services/drain-cleaning.jpg",
  "sewer-services": "/media/services/sewer-line-services.jpg",
  "water-heaters": "/media/services/water-heaters.jpg",
  fixtures: "/media/services/fixture-installation.jpg",
  emergency: "/media/services/emergency-plumbing.jpg",
  "commercial-plumbing": "/media/services/ironclad-team-hero.png",
};

const HERO_IMAGE_ALTS: Partial<Record<string, string>> = {
  repairs: "Technician repairing residential plumbing hardware in Austin",
  "drain-clearing": "Drain clearing service for a household line in Austin",
  "sewer-services": "Sewer camera and service equipment staged for line diagnostics",
  "water-heaters": "Technician servicing a residential water heater system",
  fixtures: "Plumber installing updated plumbing fixtures in a bathroom",
  emergency: "Emergency plumbing technician responding to urgent home service call",
  "commercial-plumbing": "Ironclad Plumbing commercial plumbing team in Austin",
};

export function getServiceHeroImage(slug: string): string {
  return HERO_IMAGES[slug] || "/media/services/plumbing-repairs.jpg";
}

export function getServiceHeroAlt(slug: string, title: string): string {
  return HERO_IMAGE_ALTS[slug] ?? `${title} in Austin, Texas`;
}
