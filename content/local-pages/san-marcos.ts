import type { LocalCityPageData } from "./index";

export const SAN_MARCOS_CITY_PAGE: Omit<LocalCityPageData, "eta"> = {
  name: "San Marcos",
  slug: "san-marcos-tx",
  path: "/service-area/san-marcos-tx",
  h1: "San Marcos Plumbing for Established Homes and Growing Neighborhoods",
  intro:
    "Ironclad provides San Marcos homeowners with licensed plumbing repairs, drain and sewer service, water-heater work, and clear pricing before work begins.",
  challengesLead:
    "From active leaks to aging fixtures and recurring clogs, we diagnose the cause first and explain the repair options clearly.",
  challenges: [
    [
      "Recurring drain and sewer clogs",
      "We clear the immediate blockage, then recommend camera inspection when repeat symptoms point to a deeper line problem.",
    ],
    [
      "Water-heater sediment and recovery issues",
      "We test the system, explain repair versus replacement, and size new equipment for the home's actual hot-water demand.",
    ],
    [
      "Hidden fixture and supply-line leaks",
      "Targeted diagnostics help locate the source before water damage spreads or unnecessary surfaces are opened.",
    ],
    [
      "Worn valves, toilets, and faucets",
      "We repair or replace high-use components and test shutoffs, pressure, and drainage before the job is closed.",
    ],
  ],
  services: [
    [
      "Drain Cleaning",
      "Professional clearing for sinks, tubs, toilets, branch lines, and recurring main-line stoppages.",
      "drain-cleaning",
    ],
    [
      "Water Heaters",
      "Diagnosis, repair, replacement, and tankless planning with straightforward equipment options.",
      "water-heaters",
    ],
    [
      "Leak Detection",
      "Focused diagnostics for concealed leaks, unexplained water use, and moisture around the home.",
      "leak-detection",
    ],
  ],
  neighborhoods: [
    "Downtown",
    "Dunbar / Heritage",
    "Blanco Gardens",
    "Willow Creek",
    "Hughson Heights",
    "Rio Vista",
    "Cottonwood Creek",
    "Kissing Tree",
  ],
  reviews: [],
  faqs: [
    [
      "Do you provide plumbing service throughout San Marcos?",
      "Yes. We schedule service across San Marcos, including Downtown, Blanco Gardens, Willow Creek, Rio Vista, Cottonwood Creek, and nearby neighborhoods.",
    ],
    [
      "Can I book San Marcos plumbing service online?",
      "Yes. Use the online scheduler and include your San Marcos address and issue details so the team can confirm the clearest available arrival window.",
    ],
    [
      "Do you handle drain and sewer problems in San Marcos?",
      "Yes. We handle fixture clogs, branch-line blockages, main-line backups, drain cleaning, and sewer camera inspections when diagnosis calls for one.",
    ],
    [
      "What should I do if I have an active leak?",
      "Shut off the affected fixture or the home's main water valve if it is safe, move belongings away from the water, and call for urgent plumbing service.",
    ],
  ],
};
