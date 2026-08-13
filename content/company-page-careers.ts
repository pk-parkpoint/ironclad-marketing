import type { CompanyPageConfig } from "@/components/company/company-page-types";

export const CAREERS_COMPANY_PAGE: CompanyPageConfig = {
  slug: "careers",
  eyebrow: "Careers at Ironclad",
  heading: "Build a Career With a Family That Works",
  intro:
    "We hire plumbers and office teammates who take pride in the work, talk to homeowners like adults, and want to stay somewhere for a long time.",
  heroSecondary: { label: "Get in Touch", href: "mailto:info@ironcladtexas.com?subject=Ironclad%20Careers" },
  pillarHeading: "What You Get Here",
  pillars: [
    { title: "Steady Year-Round Work", body: "Austin keeps us busy in every season." },
    { title: "Paid Training & Licensing", body: "We pay for the hours and the exam." },
    { title: "Take-Home Truck & Tools", body: "Stocked, maintained, and yours to run." },
    { title: "A Real Path Forward", body: "Apprentice to lead tech, mapped out." },
  ],
  rowsHeading: "What We Look For",
  rowsLead:
    "Skills can be taught. These four are what we hire on, whether you are a licensed journeyman or starting your apprenticeship.",
  rows: [
    {
      title: "Customer-first communication",
      body: "You can explain a repair to a homeowner without jargon and without pressure. People should feel informed when you leave, not sold to.",
    },
    {
      title: "Strong fundamentals and safe habits",
      body: "Clean workmanship, current code knowledge, and a job site you would be glad to have your name on.",
    },
    {
      title: "Accountability on every job",
      body: "You call ahead, you show up in the window, and you own the fix if something comes back. No blaming the last guy.",
    },
    {
      title: "A reason to stay",
      body: "We are building careers, not filling shifts. Tell us where you want to be in five years and we will help you get there.",
    },
  ],
  callout: {
    title: "Not seeing your role listed?",
    body: "Send us your resume anyway. Good people are worth making room for.",
    label: "Email Us",
    href: "mailto:info@ironcladtexas.com?subject=Ironclad%20Careers",
  },
  roles: {
    heading: "Open Roles",
    intro: "Current openings across the Austin metro. Every role is full time with benefits.",
    items: [
      {
        title: "Service Plumber",
        body: "Licensed journeyman or master running residential service calls across the Austin metro. Take-home truck, no commission quotas.",
        cta: "Apply now",
        href: "mailto:info@ironcladtexas.com?subject=Ironclad%20Careers",
      },
      {
        title: "Apprentice Plumber",
        body: "Learn the trade on paid hours with a lead tech. We cover licensing coursework and exam fees.",
        cta: "Apply now",
        href: "mailto:info@ironcladtexas.com?subject=Ironclad%20Careers",
      },
      {
        title: "Dispatcher / CSR",
        body: "Be the voice homeowners reach. Coordinate the board, keep techs moving, and keep customers informed.",
        cta: "Apply now",
        href: "mailto:info@ironcladtexas.com?subject=Ironclad%20Careers",
      },
    ],
    action: { label: "Send us your resume", href: "mailto:info@ironcladtexas.com?subject=Ironclad%20Careers" },
  },
  processEyebrow: "Hiring Process",
  processHeading: "How Hiring Works Here",
  process: [
    { title: "Apply in Minutes", body: "Send a resume or just tell us about your experience. No portal maze, no ten-page form." },
    { title: "A Real Conversation", body: "A phone call with someone on the team about what you want and what we need." },
    { title: "Ride-Along Day", body: "Spend a paid day in the field with a lead tech. You interview us as much as we interview you." },
    { title: "Offer & Onboarding", body: "Clear pay, clear expectations, truck and tools ready on day one." },
  ],
  whyEyebrow: "Life at Ironclad",
  whyHeading: "Why Our Techs Stay",
  whyLead:
    "Turnover is expensive for us and worse for customers. We would rather pay well, train hard, and keep people for a decade.",
  whyItems: [
    { title: "No Commission Quotas", body: "You are paid to fix problems, not to hit a sales number on a homeowner." },
    { title: "Backed on the Job", body: "A lead tech is a phone call away when something on site is unfamiliar." },
    { title: "Family Schedule Respected", body: "On-call rotates. Time off is time off. We plan the week so you get home." },
    { title: "Ownership You Can Reach", body: "The owners work here. Raise something and you get an answer, not a ticket." },
  ],
  faqHeading: "Careers Questions, Answered",
  faqs: [
    { question: "Do I need a license to apply?", answer: "Not for apprentice roles. For service plumber positions we look for a current Texas journeyman or master license." },
    { question: "Do you pay for licensing and continuing education?", answer: "Yes. We cover coursework, exam fees, and the hours it takes to get there." },
    { question: "What does the schedule look like?", answer: "Full-time weekday schedules with a rotating on-call. We plan the rotation ahead so you can plan your life." },
    { question: "Is pay commission based?", answer: "No. We do not put sales quotas on technicians. You are paid to diagnose honestly and fix it right." },
    { question: "What benefits do you offer?", answer: "Health coverage, paid time off, paid holidays, a take-home truck for field roles, and tools provided." },
    { question: "How long does hiring take?", answer: "Usually about a week from first call to offer, including a paid ride-along day." },
  ],
  final: {
    badge: "Now hiring in the Austin metro",
    heading: "Think You Would Fit Here?",
    body: "Send a resume or just tell us about your experience. We answer every application.",
    action: { label: "Apply Now", href: "mailto:info@ironcladtexas.com?subject=Ironclad%20Careers" },
  },
};
