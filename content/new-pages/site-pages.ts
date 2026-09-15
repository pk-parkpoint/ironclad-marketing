import { getLocalProofData } from "@/content/local-proof";
import { NEW_CUSTOMER_OFFER } from "./offer";
import type { NewPageDefinition } from "./types";

const austinProjects = getLocalProofData("austin-tx", "Austin").projectCards;
const roundRockProjects = getLocalProofData("round-rock-tx", "Round Rock").projectCards;
const westLakeProjects = getLocalProofData("west-lake-hills-tx", "West Lake Hills").projectCards;
const rollingwoodProjects = getLocalProofData("rollingwood-tx", "Rollingwood").projectCards;

function projectCopy(project: { title: string; summary: string }) {
  return `${project.title}: ${project.summary}`;
}

export const SITE_PAGE_DEFINITIONS: Record<string, NewPageDefinition> = {
  projects: {
    path: "projects",
    titleTag: "Austin Plumbing Projects | Ironclad Plumbing",
    metaDescription:
      "See examples of Ironclad plumbing diagnostics, repairs, and replacements completed for Greater Austin homes.",
    h1: "Plumbing Work Across Greater Austin",
    section: "Project Examples",
    heroImage: "/media/company/ironclad-team-hero-2400x1350.jpg",
    locationBadge: "Field examples from Austin-area homes",
    trustChips: ["Diagnose First", "Options in Writing", "Work Verified Before Closeout"],
    breadcrumbParent: { href: "/about", label: "About Ironclad" },
    content: {
      intro:
        "These field examples show how Ironclad approaches plumbing problems across Greater Austin: identify the cause, explain the options, complete the approved work, and verify performance before closeout.",
      sections: [
        {
          heading: "Austin Diagnostics and Repairs",
          paragraphs: austinProjects.map(projectCopy),
        },
        {
          heading: "Water-Heater and Pressure Work",
          paragraphs: [roundRockProjects[0], westLakeProjects[1], rollingwoodProjects[2]]
            .filter(Boolean)
            .map(projectCopy),
        },
        {
          heading: "Drain and Sewer Investigations",
          paragraphs: [austinProjects[1], roundRockProjects[1]].filter(Boolean).map(projectCopy),
        },
        {
          heading: "What Every Project Has in Common",
          paragraphs: [],
          bullets: [
            "Diagnosis before a repair recommendation",
            "Scope and price reviewed before approved work begins",
            "Home protection and cleanup during the visit",
            "System testing or camera verification when appropriate",
            "Written closeout and warranty information",
          ],
        },
        {
          heading: "New to Ironclad?",
          paragraphs: [
            NEW_CUSTOMER_OFFER.sentence,
            "Tell the team about the project and service address. We will confirm scheduling, scope, and the discount before work begins.",
          ],
        },
      ],
      ctaHeading: "Have a plumbing project to plan?",
      ctaBody: "Call, text, or book online to describe the problem and the result you need.",
      pageType: "trust",
    },
  },
  "plumbing/water-softener-repair": {
    path: "plumbing/water-softener-repair",
    titleTag: "Water Softener Repair Austin | Ironclad Plumbing",
    metaDescription:
      "Diagnose and repair water softener problems in Austin, including hard-water return, salt issues, leaks, and control faults.",
    h1: "Water Softener Repair in Austin",
    section: "Water Treatment",
    heroImage: "/media/services/plumbing-repairs.jpg",
    locationBadge: "Austin hard-water diagnosis and repair",
    trustChips: ["Test Before Replacing", "Upfront Repair Options", "Whole-Home System Support"],
    breadcrumbParent: { href: "/plumbing/water-treatment", label: "Water Treatment" },
    serviceName: "Water Softener Repair",
    content: {
      intro:
        "When hard-water symptoms return, the cause may be a setting, salt bridge, valve, injector, resin, drain, or control problem rather than a reason to replace the entire softener. Ironclad tests the system before recommending the next step.",
      sections: [
        {
          heading: "Signs the Softener Needs Service",
          paragraphs: [
            "A repair visit starts with the symptoms in the home and the equipment's current operation. Water testing helps confirm whether the system is actually reducing hardness.",
          ],
          bullets: [
            "Scale or spotting has returned at fixtures and glassware",
            "The brine tank is not using salt or is filling with too much water",
            "The system regenerates too often, too rarely, or continuously",
            "Water pressure changed after a regeneration cycle",
            "The valve, bypass, drain line, or connections are leaking",
            "The display shows an error or loses its programming",
          ],
        },
        {
          heading: "How We Diagnose the System",
          paragraphs: [
            "We review the equipment age, water source, household demand, hardness settings, regeneration history, bypass position, brine draw, drain flow, and visible component condition.",
            "You receive an explanation of the fault and the available repair or replacement options before approved work begins.",
          ],
        },
        {
          heading: "Repair, Rebed, or Replace",
          paragraphs: [
            "Controls, injectors, seals, brine components, and setup problems may be repairable. Exhausted resin, structural tank damage, unavailable parts, or a badly undersized system can make replacement more practical.",
            "If replacement is the stronger option, Ironclad sizes the system using water conditions and household usage rather than relying on square footage alone.",
          ],
        },
        {
          heading: "Austin Water Conditions Matter",
          paragraphs: [
            "Central Texas hardness puts a high workload on treatment equipment. Correct settings, salt level, regeneration frequency, and periodic inspection help the system protect fixtures, appliances, and water heaters.",
            "We finish the visit with operating guidance appropriate for the repaired equipment and explain any follow-up maintenance it needs.",
          ],
        },
        {
          heading: "New-Customer Softener Discount",
          paragraphs: [
            NEW_CUSTOMER_OFFER.sentence,
            "The repair scope and discount are confirmed before work begins. The total discount will not exceed $300.",
          ],
        },
      ],
      ctaHeading: "Get your water softener tested",
      ctaBody: "Share the equipment brand, symptoms, and service address so we can prepare for the visit.",
      pageType: "service",
      serviceArea: "Greater Austin, TX",
      serviceInterest: "Water Softener Repair",
      showContactForm: true,
    },
  },
};
