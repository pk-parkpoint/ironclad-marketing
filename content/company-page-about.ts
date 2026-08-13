import type { CompanyPageConfig } from "@/components/company/company-page-types";

export const ABOUT_COMPANY_PAGE: CompanyPageConfig = {
  slug: "about",
  eyebrow: "About Ironclad",
  heading: "Family Owned, Austin Grown",
  intro:
    "We answer our own phones, quote our own work, and stand behind every job we finish. Austin homeowners keep hiring us back for those three reasons.",
  heroSecondary: { label: "Schedule Now", href: "/book" },
  pillarHeading: "Our Ironclad Guarantee",
  pillars: [
    { title: "Fixed Right the First Time", body: "If it comes back, so do we." },
    { title: "Upfront Pricing, No Surprises", body: "You approve the price before we start." },
    { title: "On Time or We Call Ahead", body: "Late means a call, every time." },
    { title: "Guaranteed Work", body: "If it comes back, so do we." },
  ],
  rowsHeading: "What That Actually Means",
  rowsLead:
    "Plenty of companies say the right things on the truck. Here is what ours changes about the way we work inside your home.",
  rows: [
    {
      title: "You reach the people responsible",
      body: "No national call center, no franchise script, no rotating cast of subcontractors. The people who answer the phone are the people responsible for the work.",
    },
    {
      title: "One price, agreed before we start",
      body: "We quote one flat price. You approve the number before a wrench comes out, and it does not move because the job ran long. That is our problem to manage, not yours to pay for.",
    },
    {
      title: "Plain language, not pressure",
      body: "You get photos of what we found, your options, and a straight answer about what needs fixing now versus what can wait a year. Nobody sells you a repair you do not need.",
    },
    {
      title: "We live here too",
      body: "Our kids go to school here. Our trucks park in these neighborhoods overnight. Doing right by Austin is not a marketing line, it is how we keep working.",
    },
  ],
  callout: {
    title: "Have a question before you book?",
    body: "Call or text and talk to someone who actually works here.",
    label: "Call (512) 506-2470",
    href: "tel:+15125062470",
  },
  credo: {
    label: "Our Credo",
    quote:
      "Treat every home like it belongs to family, and every price like we have to explain it at the dinner table.",
    body: "It is a simple standard, and it decides everything else: who we hire, how we quote, and what we do when a job does not go to plan.",
  },
  processEyebrow: "Working With Us",
  processHeading: "What Hiring Ironclad Looks Like",
  process: [
    { title: "Book in Minutes", body: "Call, text, or schedule online. Tell us what is happening and pick a time that works around your family." },
    { title: "We Show Up On Time", body: "A licensed Ironclad plumber arrives in the window, and calls ahead if anything changes." },
    { title: "Upfront Diagnosis", body: "We inspect, show you photos, explain the fix in plain language, and give you a flat price before any work begins." },
    { title: "Fixed & Guaranteed", body: "We complete the repair, clean up after ourselves, and stand behind it. If it comes back, so do we." },
  ],
  whyEyebrow: "The Ironclad Difference",
  whyHeading: "Why Austin Keeps Calling",
  whyLead:
    "We are not the biggest plumber in Austin. We are the one your neighbors call back, and the one they hand to a friend.",
  whyItems: [
    { title: "4.9 Stars on Google", body: "142 reviews from real Austin-area homeowners, not paid placements." },
    { title: "Licensed & Insured", body: "Verify our Texas Master Plumber license with the State Board anytime." },
    { title: "Locally Owned", body: "Austin neighbors, not a private-equity roll-up or a national franchise." },
    { title: "24/7 Emergency Service", body: "A backup at 2 AM still reaches a real person, not voicemail." },
  ],
  reviewsHeading: "Austin Homeowners Trust Ironclad",
  reviews: [
    { initial: "M", name: "Mike R.", location: "Hyde Park", quote: "Three other plumbers wanted to dig up my yard. Ironclad ran a camera, found the root intrusion, and did a trenchless repair. Saved me thousands." },
    { initial: "J", name: "Jenna P.", location: "South Austin", quote: "They told me my water heater had a few good years left instead of selling me a new one. That is why they get every call from us now." },
    { initial: "D", name: "David L.", location: "Mueller", quote: "Water heater died on a Sunday. They answered, came Monday first thing, and the price matched the quote exactly." },
  ],
  faqHeading: "About Ironclad, Answered",
  faqs: [
    { question: "Who owns Ironclad?", answer: "The family that started it, here in Austin. The owners are involved in the daily work, from answering calls to running service." },
    { question: "What areas do you serve?", answer: "Austin and the surrounding metro, including Round Rock, Cedar Park, Georgetown, Pflugerville, Leander, Lakeway, Bee Cave, West Lake Hills, and Rollingwood." },
    { question: "How does your pricing work?", answer: "Flat and upfront. You see the price and approve it before any work starts, so the invoice never surprises you." },
    { question: "Are you licensed and insured?", answer: "Yes. We are a licensed Texas Master Plumber, fully insured, and every job is guaranteed." },
    { question: "Do you use subcontractors?", answer: "No. The plumber in your home is an Ironclad employee, background-checked and accountable to us." },
    { question: "What if something goes wrong after you leave?", answer: "Call us. Work we did is covered, and we come back to make it right at no charge inside the warranty term." },
  ],
  final: {
    badge: "Austin owned, Austin based",
    heading: "Ready to Work With a Plumber You Can Reach?",
    body: "Same-day appointments, 24/7 emergency service, and a price you approve before we start.",
    action: { label: "Schedule Online", href: "/book" },
  },
};
