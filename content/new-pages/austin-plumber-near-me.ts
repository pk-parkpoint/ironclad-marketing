import type { DrainCleaningTemplateContent } from "@/components/service-template/service-template-types";
import { getPpcServiceVariant } from "@/content/ppc-service-variants";

const plumbingContent = getPpcServiceVariant("plumbing")?.content;

if (!plumbingContent) {
  throw new Error("Missing plumbing template content for Austin plumber landing page");
}

export const AUSTIN_PLUMBER_NEAR_ME_CONTENT: DrainCleaningTemplateContent = {
  ...plumbingContent,
  hero: {
    chipLabel: "Serving Austin and nearby communities",
    eyebrow: "AUSTIN PLUMBER · SAME-DAY WINDOWS",
    image: "/media/services/ironclad-team-hero-fallback.jpg",
    imageAlt: "Local Ironclad plumbers serving homeowners near Austin",
    primaryCtaLabel: "Check Availability",
    secondaryCtaLabel: "Call an Austin Plumber",
    subhead:
      "Searching for an “Austin plumber near me”? Tell us what is wrong and get upfront pricing from a licensed local plumber.",
    supportLine: "",
    title: "Need an Austin Plumber Near You?",
  },
  signs: {
    title: "When to Call a Plumber Nearby",
    intro:
      "You do not need to diagnose the problem before you call. If you searched for a plumber near me because something looks, sounds, or smells wrong, start with what you can observe.",
    items: [
      ["Water is leaking or spreading", "A dripping connection, wet cabinet, ceiling stain, or active pipe leak needs a nearby plumber before the damage travels farther."],
      ["Drains are slow or backing up", "One stubborn drain may be a local clog. Several fixtures acting up together can point to a main sewer-line problem."],
      ["There is no hot water", "A cold shower, leaking tank, or inconsistent temperature can require water-heater repair or replacement."],
      ["Pressure dropped or water stopped", "Low pressure throughout the house can come from a regulator, valve, supply-line, or main-line issue that needs on-site diagnosis."],
    ],
  },
  callout: {
    title: "Not sure which plumbing service to book?",
    body: "Tell us what you see, hear, or smell. We will route your request to the right Austin plumber and confirm the next realistic service window.",
  },
  services: {
    title: "Plumbing Help Near You for the Problem at Hand",
    intro: "Ironclad provides nearby plumbing service across Greater Austin. Choose the problem that sounds closest; your plumber will confirm the cause before recommending work.",
    cards: [
      ["Leaks & broken pipes", "Find the source and repair leaking joints, supply lines, hidden leaks, and damaged pipe.", "Austin plumber repairing a leaking pipe", "/media/services/plumbing/03-leak-detection-and-repair.webp"],
      ["Clogged drains & sewer backups", "Clear the blockage, inspect recurring problems, and restore flow to the affected fixtures.", "Austin drain and sewer plumbing service", "/media/services/plumbing/01-drain-and-sewer.webp"],
      ["Water-heater problems", "Diagnose no-hot-water calls, leaking tanks, and repair-versus-replacement options.", "Local water-heater service near Austin", "/media/services/plumbing/02-water-heaters.webp"],
      ["Toilets, faucets & fixtures", "Repair running toilets, dripping faucets, failed disposals, sinks, and other fixtures.", "Nearby plumber for faucet and fixture repair", "/media/services/plumbing/04-fixtures-and-faucets.webp"],
      ["Low pressure & water lines", "Diagnose pressure trouble and repair failing valves, supply lines, and main water lines.", "Austin plumber working on a home water line", "/media/services/plumbing/05-repiping-and-water-lines.webp"],
      ["Urgent plumbing problems", "Call the 24/7 emergency line for active flooding, major leaks, backups, or no-water situations.", "Emergency plumber available near Austin", "/media/services/plumbing/06-24-7-emergency-service.webp"],
    ],
  },
  whyLine: "When you need a plumber nearby, you should get a clear arrival window, an honest diagnosis, and a price before the work starts.",
  process: [
    ["Tell us what is happening", "Call or book online with the problem and your Austin service address."],
    ["We confirm availability", "Our team gives you the next realistic service window for your location."],
    ["A licensed plumber diagnoses it", "We find the cause and explain the repair options before work begins."],
    ["You approve the price", "We complete the approved work, test the system, and provide warranty details."],
  ],
  serviceArea: {
    title: "Find a Plumber Near You in Greater Austin",
    body: "Our local plumbers serve Austin and nearby communities. Appointment windows depend on technician capacity and the active route for your address.",
    ctaLabel: "Check Availability Near You",
  },
  faqTitle: "Austin Plumber Near Me FAQ",
  faqs: [
    ["How do I find a reliable plumber near me in Austin?", "Look for a licensed and insured local company that explains the diagnosis, gives you the price before work begins, and provides a written warranty. Ironclad includes all four on residential plumbing work."],
    ["Can a plumber nearby come today?", "Same-day windows are often available, but timing depends on demand and your address. Call or book online and we will give you the next realistic window before you commit."],
    ["How much does an Austin plumber cost?", "The price depends on the problem, access, materials, and repair selected. Your plumber diagnoses the issue and presents upfront pricing for your approval before work starts."],
    ["Are your Austin plumbers licensed and insured?", "Yes. Ironclad is licensed and insured, and completed work includes written warranty information."],
    ["What plumbing problems do you handle near Austin?", "We handle leaks, broken pipes, clogged drains, sewer backups, water heaters, toilets, faucets, fixtures, water-pressure problems, water lines, and urgent residential plumbing calls."],
    ["What areas do your nearby plumbers serve?", "We serve Austin, Round Rock, Cedar Park, Pflugerville, Georgetown, Leander, Lakeway, Bee Cave, Buda, Kyle, Hutto, Dripping Springs, and surrounding communities."],
  ],
  finalCta: {
    body: "Tell us what is happening and where you are. We will match the problem to the right plumber and confirm the next available Austin service window.",
    primaryLabel: "Check Availability",
    title: "Need a Plumber Near You?",
  },
};
