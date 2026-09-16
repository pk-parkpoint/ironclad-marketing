import { NEW_CUSTOMER_OFFER } from "./offer";
import type { NewPageDefinition } from "./types";

export const PAID_LANDING_PAGE_DEFINITIONS: Record<string, NewPageDefinition> = {
  "lp/austin-plumber": {
    path: "lp/austin-plumber",
    bookingHref: "/book?service=plumbing",
    templateSlug: "plumbing",
    titleTag: "Austin Plumber Near You | Ironclad Plumbing",
    metaDescription:
      "Call a licensed Austin plumber for leaks, drains, water heaters, repairs, and urgent service with upfront pricing.",
    h1: "Need a Plumber Near You in Austin?",
    section: "Austin Plumbing Service",
    heroImage: "/media/services/ironclad-team-hero-fallback.jpg",
    locationBadge: "Serving Austin and nearby communities",
    trustChips: ["Licensed & Insured", "Upfront Pricing", "Same-Day Windows When Available"],
    breadcrumbParent: { href: "/plumbing", label: "Plumbing" },
    serviceName: "Residential Plumbing",
    content: {
      intro:
        "Tell us what is happening at your home and we will route you to the right plumbing service. Ironclad handles everyday repairs, urgent leaks, clogged drains, water-heater problems, and larger replacements throughout Austin.",
      sections: [
        {
          heading: "Plumbing Help for the Problem in Front of You",
          paragraphs: [
            "You do not need to diagnose the issue before calling. Describe what you can see, hear, or smell, and our team will help determine the right next step.",
          ],
          bullets: [
            "Active leaks, broken pipes, and water-pressure problems",
            "Slow drains, recurring clogs, and sewer backups",
            "No hot water, leaking tanks, and water-heater replacement",
            "Running toilets, dripping faucets, disposals, and fixture repairs",
            "Urgent plumbing problems that need priority scheduling",
          ],
        },
        {
          heading: "What Happens After You Contact Ironclad",
          paragraphs: [
            "We confirm your Austin service address, ask a few focused questions, and provide the next realistic appointment window. Once on site, the plumber inspects the problem and explains the available repair options.",
            "You receive pricing before approved work begins. After the repair, we test the affected system, clean the work area, and provide written warranty information for completed work.",
          ],
        },
        {
          heading: "Local Coverage Without the Guesswork",
          paragraphs: [
            "Ironclad serves central, north, south, east, and west Austin, including Hyde Park, Allandale, Mueller, Crestview, Tarrytown, South Austin, and Circle C. Nearby service areas are scheduled according to the active dispatch route.",
            "Same-day windows depend on technician capacity and location. Call, text, or submit the form for the next available time for your address.",
          ],
        },
        {
          heading: "New-Customer Plumbing Discount",
          paragraphs: [
            NEW_CUSTOMER_OFFER.sentence,
            "The team will show the discount with the approved job price before work begins.",
          ],
        },
        {
          heading: "Questions Austin Homeowners Ask First",
          paragraphs: [
            "Ironclad is licensed and insured, serves residential plumbing needs across Greater Austin, and provides upfront pricing before approved work starts.",
            "For an active leak, shut off the nearest fixture valve or the home's main water supply if it is safe to do so. For a suspected gas leak, leave the property and contact emergency services before calling a plumber.",
          ],
        },
      ],
      ctaHeading: "Get the next available Austin service window",
      ctaBody: "Call, text, or send the request form and tell us what is happening.",
      pageType: "landing",
      serviceArea: "Austin, TX",
      serviceInterest: "Residential Plumbing",
      showContactForm: true,
    },
  },
  "lp/water-heater-replacement": {
    path: "lp/water-heater-replacement",
    bookingHref: "/book?service=water-heater-installation",
    templateSlug: "water-heater-installation",
    titleTag: "Water Heater Replacement Austin | Ironclad Plumbing",
    metaDescription:
      "Replace a leaking, aging, or undersized water heater in Austin with upfront options and code-aligned installation.",
    h1: "Water Heater Replacement in Austin",
    section: "Austin Water Heaters",
    heroImage: "/media/services/water-heaters.jpg",
    locationBadge: "Tank and tankless options for Austin homes",
    trustChips: ["Repair-or-Replace Guidance", "Upfront Options", "Written Warranty"],
    breadcrumbParent: { href: "/plumbing/water-heaters", label: "Water Heaters" },
    serviceName: "Water Heater Replacement",
    content: {
      intro:
        "A failing water heater does not always need replacement, but a leaking tank, advanced corrosion, repeated breakdowns, or insufficient capacity can make replacement the practical choice. Ironclad compares the options before you commit.",
      sections: [
        {
          heading: "When Replacement Usually Makes Sense",
          paragraphs: [
            "We assess the tank, controls, connections, venting, safety hardware, age, and household hot-water demand. If a durable repair is still reasonable, we explain it alongside replacement.",
          ],
          bullets: [
            "The tank is leaking or visibly corroded",
            "The heater is near or beyond its expected service life",
            "Repairs are becoming frequent or expensive",
            "Hot water runs out during normal household use",
            "The existing installation has safety or code deficiencies",
          ],
        },
        {
          heading: "What the Replacement Visit Covers",
          paragraphs: [
            "Ironclad sizes the replacement for actual household demand and reviews gas, electric, tank, and tankless options that fit the home's infrastructure.",
            "The approved scope can include removal of the old unit, new connections, required safety components, startup testing, cleanup, and written warranty documentation. Permit and code requirements are addressed when they apply.",
          ],
        },
        {
          heading: "Austin Hard Water and Heater Life",
          paragraphs: [
            "Central Texas mineral buildup can reduce recovery performance and accelerate wear. We account for sediment history, maintenance, and water quality when recommending the next heater.",
            "Before the visit ends, we explain temperature settings, routine flushing, and other maintenance appropriate for the installed equipment.",
          ],
        },
        {
          heading: "New-Customer Replacement Discount",
          paragraphs: [
            NEW_CUSTOMER_OFFER.sentence,
            "The discount is shown with the written replacement scope so the approved total is clear before installation begins.",
          ],
        },
        {
          heading: "Replacement Timing and Scheduling",
          paragraphs: [
            "A straightforward tank replacement can often be completed in one visit. Access constraints, fuel conversion, venting changes, electrical work, or code corrections can extend the scope.",
            "Send the model information and a photo of the existing heater when possible. That helps the team prepare the right questions before confirming the appointment window.",
          ],
        },
      ],
      ctaHeading: "Get a water-heater replacement assessment",
      ctaBody: "Share the heater type, age, symptoms, and Austin service address to start.",
      pageType: "landing",
      serviceArea: "Greater Austin, TX",
      serviceInterest: "Water Heaters",
      showContactForm: true,
    },
  },
};
