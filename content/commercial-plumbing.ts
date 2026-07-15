import type { ServiceDetail } from "./service-details";
import type { ServiceEntry } from "./services";

export const COMMERCIAL_PLUMBING_PATH = "/commercial-plumbing";

export const COMMERCIAL_PLUMBING_SERVICE: ServiceEntry = {
  slug: "commercial-plumbing",
  title: "Commercial Plumbing",
  titleTag: "Commercial Plumber Austin, TX | Ironclad Plumbing",
  metaDescription:
    "Commercial plumbing in Austin for restaurants, retail spaces, offices, and tenant improvements. Clear scopes, practical scheduling, and upfront pricing.",
  h1: "Commercial Plumbing for Austin Businesses",
};

export const COMMERCIAL_PLUMBING_DETAIL: ServiceDetail = {
  slug: COMMERCIAL_PLUMBING_SERVICE.slug,
  heroDescription:
    "Ironclad supports light commercial properties with responsive plumbing service, clear scheduling, and written scopes. We help restaurants, retail spaces, offices, and tenant improvement teams resolve problems while limiting disruption to daily operations.",
  symptomsHeading: "Commercial Plumbing Problems We Handle",
  symptoms: [
    "Active leaks disrupting customers, employees, or tenants",
    "Recurring drain backups in kitchens, restrooms, or floor drains",
    "Commercial hot water that is unreliable or undersized",
    "Restroom fixtures that leak, run, clog, or fail",
    "Tenant improvement plumbing that needs a clear scope and schedule",
    "Water pressure or supply issues affecting normal operations",
  ],
  solutionsHeading: "Commercial Plumbing Support",
  solutions: [
    "Leak diagnosis and plumbing repairs",
    "Drain clearing, camera inspection, and hydro jetting",
    "Water heater repair and replacement planning",
    "Restroom and fixture repair or installation",
    "Tenant improvement plumbing and fixture connections",
    "Written findings and next-step recommendations",
  ],
  austinNoteTitle: "Austin Commercial Plumbing",
  austinNoteBody:
    "Austin businesses often need plumbing work coordinated around customers, tenants, deliveries, and property access. Ironclad communicates the scope, timing, and next steps clearly so owners and managers can plan around the work.",
  processHeading: "How Commercial Plumbing Service Works",
  processSteps: [
    {
      number: "1",
      title: "Intake",
      description: "We gather the property, access, urgency, and operating details needed to route the request correctly.",
    },
    {
      number: "2",
      title: "Triage",
      description: "A technician identifies the cause, immediate risks, and the practical options for restoring service.",
    },
    {
      number: "3",
      title: "Scope",
      description: "You receive a clear scope, price, and scheduling plan before approved work begins.",
    },
    {
      number: "4",
      title: "Complete",
      description: "We complete and test the work, clean the area, and document any recommended follow-up.",
    },
  ],
  trustPoints: [
    { title: "Clear communication", description: "Property and operations contacts receive practical status updates." },
    { title: "Written scope", description: "Know the approved work and price before service begins." },
    { title: "Tested work", description: "Repairs and installations are tested before the job is closed." },
  ],
  faqs: [
    {
      question: "Does Ironclad provide commercial plumbing in Austin?",
      answer:
        "Yes. Ironclad provides light commercial plumbing for restaurants, retail spaces, offices, and tenant improvement projects across Greater Austin.",
    },
    {
      question: "What commercial plumbing problems do you handle?",
      answer:
        "We handle leaks, recurring drain backups, fixture and restroom problems, water heater issues, water pressure concerns, and plumbing work for light tenant improvements.",
    },
    {
      question: "Can plumbing work be scheduled around business operations?",
      answer:
        "We gather access hours and operating constraints during intake, then provide a realistic scheduling plan. Available timing depends on the scope, urgency, and technician availability.",
    },
    {
      question: "Do you handle urgent commercial plumbing calls?",
      answer:
        "Yes. Call us with the affected fixtures, active water or sewage, property address, and access details. We will triage the risk and give you the clearest available response window.",
    },
    {
      question: "Will I receive pricing and documentation before work starts?",
      answer:
        "Yes. We explain the findings and provide a written scope and price for approval before work begins. We can also document completed work and recommended follow-up for the property team.",
    },
  ],
  bookingCtaText: "Request Commercial Service",
};

export const COMMERCIAL_QUICK_ANSWER =
  "Ironclad provides light commercial plumbing across Greater Austin for restaurants, retail spaces, offices, and tenant improvements. We triage the issue, coordinate access and timing, provide a clear written scope and price, complete and test the work, and document next steps for owners, managers, and operations teams.";
