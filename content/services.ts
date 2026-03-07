export type ServiceEntry = {
  slug: string;
  title: string;
  titleTag: string;
  metaDescription: string;
  h1: string;
};

export const SERVICES: ServiceEntry[] = [
  {
    slug: "repairs",
    title: "Plumbing Repairs",
    titleTag: "Plumbing Repairs in Austin, TX | Ironclad Plumbing",
    metaDescription:
      "Leaky faucets, running toilets, burst pipes - repaired right the first time with upfront pricing.",
    h1: "Plumbing Repairs That Last",
  },
  {
    slug: "drain-cleaning",
    title: "Drain Cleaning",
    titleTag: "Drain Cleaning in Austin, TX | Ironclad Plumbing",
    metaDescription:
      "Slow drains and recurring clogs cleared fast with professional drain cleaning and camera inspection.",
    h1: "Professional Drain Cleaning - Find the Cause, Not Just the Clog",
  },
  {
    slug: "sewer-services",
    title: "Sewer Line Services",
    titleTag: "Sewer Line Repair in Austin, TX | Ironclad Plumbing",
    metaDescription:
      "Sewer camera inspections, trenchless repair, and full-line replacement with minimal disruption.",
    h1: "Sewer Line Services - Accurate Diagnosis, Lasting Repair",
  },
  {
    slug: "water-heaters",
    title: "Water Heaters",
    titleTag: "Water Heater Service in Austin, TX | Ironclad Plumbing",
    metaDescription:
      "Tank water heater repair, replacement, and installation with same-day Austin service.",
    h1: "Water Heater Service - Repair, Replace, or Upgrade",
  },
  {
    slug: "tankless-water-heaters",
    title: "Tankless Water Heaters",
    titleTag: "Tankless Water Heater Service | Austin, TX | Ironclad",
    metaDescription:
      "Tankless assessments and code-compliant installations for endless hot water and lower energy use.",
    h1: "Tankless Water Heaters - Endless Hot Water, Smaller Footprint",
  },
  {
    slug: "leak-detection",
    title: "Leak Detection",
    titleTag: "Leak Detection in Austin, TX | Ironclad Plumbing",
    metaDescription:
      "Electronic and thermal leak detection for slabs, walls, and ceilings across Greater Austin.",
    h1: "Leak Detection - Find It Before It Finds Your Foundation",
  },
  {
    slug: "gas-line-services",
    title: "Gas Line Services",
    titleTag: "Gas Line Service in Austin, TX | Ironclad Plumbing",
    metaDescription:
      "Licensed residential gas leak testing, repair, and installations for appliances and outdoor features.",
    h1: "Gas Line Services - Safe, Code-Compliant, Tested",
  },
  {
    slug: "fixtures",
    title: "Fixtures",
    titleTag: "Fixture Service in Austin, TX | Ironclad Plumbing",
    metaDescription:
      "Faucets, sinks, toilets, showers, and tubs installed correctly with clean workmanship.",
    h1: "Fixture Installation & Repair - The Details Matter",
  },
  {
    slug: "water-treatment",
    title: "Water Treatment",
    titleTag: "Water Treatment in Austin, TX | Ironclad Plumbing",
    metaDescription:
      "Whole-home softeners and filtration tuned for Austin hard water and local water chemistry.",
    h1: "Water Treatment - Protect Your Home from Austin's Hard Water",
  },
  {
    slug: "emergency",
    title: "Emergency Plumbing",
    titleTag: "Emergency Plumber in Austin, TX | Ironclad Plumbing",
    metaDescription:
      "Burst pipes, sewer backups, and gas smells handled fast with 24/7 emergency response.",
    h1: "Emergency Plumbing - When Minutes Matter",
  },
];

export const SERVICE_SLUG_SET = new Set(SERVICES.map((service) => service.slug));
