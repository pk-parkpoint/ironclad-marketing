import type { CompanyPageConfig } from "@/components/company/company-page-types";

export const GUARANTEES_COMPANY_PAGE: CompanyPageConfig = {
  slug: "guarantees",
  eyebrow: "Our Guarantees",
  heading: "The Ironclad Guarantee",
  intro:
    "Four clear promises guide every Ironclad job: fix it right, price it upfront, communicate about timing, and put the warranty in writing.",
  heroSecondary: { label: "Schedule Now", href: "/book" },
  pillarHeading: "Our Ironclad Guarantee",
  pillars: [
    { title: "Fixed Right the First Time", body: "If it comes back, so do we." },
    { title: "Upfront Pricing, No Surprises", body: "You approve the price before we start." },
    { title: "On Time or We Call Ahead", body: "Late means a call, every time." },
    { title: "Written Warranty on Every Job", body: "In writing, not just a handshake." },
  ],
  rowsHeading: "Four Promises We Put in Writing",
  rowsLead:
    "These are the same service standards shown across Ironclad's website. Your estimate and warranty provide the exact scope and coverage for your job.",
  rows: [
    {
      title: "Fixed Right the First Time",
      body: "We diagnose the problem, explain the approved repair, complete the work, and test it before we leave. If a covered workmanship issue comes back within the written warranty term, call us and we come back to address it.",
    },
    {
      title: "Upfront Pricing, No Surprises",
      body: "You see the scope and price before work begins. If we uncover something that changes the job, we stop, explain it, and give you an updated price to approve before any additional work moves forward.",
    },
    {
      title: "On Time or We Call Ahead",
      body: "We give you an arrival window and keep you informed. If the schedule changes, we call ahead with an update so you are not left wondering when your plumber will arrive.",
    },
    {
      title: "Written Warranty on Every Job",
      body: "Your completed job includes written warranty terms explaining what is covered, how long coverage lasts, any exclusions, and how to contact us. Coverage can vary by the work performed and the manufacturer's terms.",
    },
  ],
  callout: {
    title: "Question about a quote or warranty?",
    body: "Call with your estimate or invoice and we will walk through the exact terms for your job.",
    label: "Call (512) 506-2470",
    href: "tel:+15125062470",
  },
  processEyebrow: "What You Can Expect",
  processHeading: "How the Guarantee Shows Up",
  process: [
    { title: "We Diagnose & Explain", body: "Your plumber identifies the problem and explains the practical repair options in plain language." },
    { title: "You Approve the Price", body: "We provide the scope and price before work starts. Nothing moves forward without your approval." },
    { title: "We Keep You Updated", body: "You get a clear arrival window, and we call ahead if timing or the approved scope needs to change." },
    { title: "We Document the Work", body: "We test the repair and leave you with an invoice and the written warranty terms for your job." },
  ],
  whyEyebrow: "Built for Clarity",
  whyHeading: "What These Promises Protect",
  whyLead:
    "A guarantee should make the job easier to understand before, during, and after the repair. These four promises cover the parts homeowners should never have to guess about.",
  whyItems: [
    { title: "Your Repair", body: "The approved work is completed, tested, and backed according to its written warranty." },
    { title: "Your Budget", body: "You approve the price before work begins and approve any scope change before added work." },
    { title: "Your Time", body: "You receive an arrival window and a call ahead if the schedule changes." },
    { title: "Your Follow-Through", body: "You leave with written coverage details and a direct way to contact us with a concern." },
  ],
  reviewsHeading: "What Homeowners Notice",
  reviews: [
    { initial: "J", name: "John D.", location: "Austin", quote: "They showed up same day, found the problem fast, and had it fixed in under an hour. Price was exactly what they quoted, no surprises." },
    { initial: "L", name: "Lisa K.", location: "Cedar Park", quote: "Finally a plumber who shows up on time and doesn't try to upsell you on things you don't need. Straightforward, fair pricing, and genuinely friendly." },
    { initial: "P", name: "Priya N.", location: "Austin Area", quote: "Upfront pricing meant zero surprises. The invoice matched the quote to the dollar. Refreshing to work with a company that does what it says." },
  ],
  faqHeading: "Guarantee Questions, Answered",
  faqs: [
    { question: "What does fixed right the first time mean?", answer: "We diagnose the issue, explain the repair, complete the work you approve, and test it before we leave. If you have a covered workmanship concern during the written warranty term, contact us so we can review it." },
    { question: "When do I approve the price?", answer: "Before work starts. We explain the scope and price first, then move forward only after you approve them." },
    { question: "What if the scope changes after work begins?", answer: "We stop and explain what changed. Any additional scope and price must be presented to you and approved before that work continues." },
    { question: "What happens if the arrival window changes?", answer: "We call ahead with an updated arrival time. The promise is simple: if timing changes, you hear it from us instead of being left waiting." },
    { question: "What does the written warranty cover?", answer: "Coverage depends on the work performed, the parts involved, and any manufacturer terms. Your written warranty states the duration, coverage, exclusions, and claim steps for your specific job." },
    { question: "How do I ask about warranty service?", answer: "Call us with your invoice or job details. We will review the written terms with you and explain the appropriate next step." },
  ],
  final: {
    badge: "Four clear promises",
    heading: "Straight Answers Before the Work Starts",
    body: "Know the scope, approve the price, get timing updates, and leave with the warranty in writing.",
    action: { label: "Schedule Online", href: "/book" },
  },
};
