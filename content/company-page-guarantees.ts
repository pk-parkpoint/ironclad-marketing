import type { CompanyPageConfig } from "@/components/company/company-page-types";

export const GUARANTEES_COMPANY_PAGE: CompanyPageConfig = {
  slug: "guarantees",
  eyebrow: "Our Guarantees",
  heading: "The Ironclad Guarantee",
  intro:
    "Five promises covering how fast we answer, what we charge, and how long we stand behind the work. If we miss one, it costs us and not you. That is the whole point.",
  heroSecondary: { label: "Schedule Now", href: "/book" },
  pillarHeading: "How Our Guarantees Work",
  pillars: [
    { title: "We Answer Fast", body: "A real person calls you back within the hour." },
    { title: "With Consequences", body: "If we miss, it costs us, not you." },
    { title: "On Every Job", body: "No tiers, no upgrades, no membership." },
    { title: "No Fine Print", body: "Five promises, stated in plain language." },
  ],
  rowsHeading: "The Five Guarantees",
  rowsLead:
    "These apply to every residential plumbing job we perform in the Austin metro, from a dripping faucet to a full repipe.",
  rows: [
    {
      title: "One-Hour Callback or Your Project Is Free",
      body: "Contact us during business hours by phone, text, or online form and a real person calls you back within 60 minutes. Not an automated confirmation. Not a chatbot. A person from our team who can answer your question or schedule your service. If we miss the hour, your project is free.",
    },
    {
      title: "Right Advice or We Pay for the Second Opinion",
      body: "If you want another licensed plumber to review what we recommended, get one. If they disagree with our diagnosis, we pay for that second opinion. We would rather be corrected than be wrong in your home.",
    },
    {
      title: "Quote-Locked Pricing",
      body: "The price you approve is the price you pay. If the job takes longer than we estimated, that is our problem to solve, not a line added to your invoice. No hourly creep, no surprise charges on the way out.",
    },
    {
      title: "Written Warranty on Parts and Labor",
      body: "Every repair leaves with a written warranty, not a handshake. If covered work fails inside the term, we come back and fix it at no charge.",
    },
    {
      title: "Lifetime Support on Work We Did",
      body: "Call us about anything we installed, any time, for as long as you own the home. Questions and advice about our work are always free.",
    },
  ],
  callout: {
    title: "Need to use a guarantee?",
    body: "Call us directly and reference your invoice. We handle it same day.",
    label: "Call (512) 506-2470",
    href: "tel:+15125062470",
  },
  processEyebrow: "Making a Claim",
  processHeading: "How to Use a Guarantee",
  process: [
    { title: "Call or Write Us", body: "Phone, text, or email with your invoice number. No claim portal, no forms to chase." },
    { title: "We Verify Same Day", body: "We pull the job record and confirm what was done and what is covered." },
    { title: "We Make It Right", body: "We schedule the return visit, refund, or credit that the guarantee calls for." },
    { title: "We Follow Up", body: "You hear from us after the fix to confirm the problem is actually closed out." },
  ],
  whyEyebrow: "Why This Matters",
  whyHeading: "Why We Care About This",
  whyLead:
    "A plumbing problem is stressful enough without wondering what the bill will be, or who to call when something fails a year later. These guarantees exist so you never have to wonder.",
  whyItems: [
    { title: "Known Before You Book", body: "You know the terms before a truck is dispatched, not after the work is done." },
    { title: "Same Terms for Everyone", body: "No premium plan, no membership tier, no better deal for a bigger job." },
    { title: "Consequences We Absorb", body: "A missed callback or a bad diagnosis costs us money. That keeps us honest." },
    { title: "Backed by a Licensed Company", body: "A licensed, insured Texas Master Plumber stands behind all five." },
  ],
  reviewsHeading: "Guarantees, Put to the Test",
  reviews: [
    { initial: "S", name: "Sarah K.", location: "Tarrytown", quote: "The quote did not change even though the repair took two extra hours. They said the price was the price and they meant it." },
    { initial: "B", name: "Brian K.", location: "Round Rock", quote: "A valve they installed started weeping a year later. One call, they came out, replaced it, no charge, no argument." },
    { initial: "A", name: "Anne M.", location: "Davenport Ranch", quote: "I asked for a second opinion on a big job. They encouraged it and offered to cover it. That told me everything." },
  ],
  faqHeading: "Guarantee Questions, Answered",
  faqs: [
    { question: "Do these guarantees apply to every job?", answer: "Yes, every residential plumbing job we perform in the Austin metro, regardless of size or price." },
    { question: "Is there a membership or plan I have to buy?", answer: "No. There are no tiers and no fees. The same guarantees apply to every customer." },
    { question: "How long is the warranty?", answer: "The term depends on the work and the parts involved, and you will know it before you approve the job." },
    { question: "What counts as business hours for the one-hour callback?", answer: "Our standard business hours, stated on our contact page. Outside those hours, emergency calls still reach a live dispatcher." },
    { question: "How do I make a claim?", answer: "Call or email us with your invoice number. We verify the job the same day and schedule the fix." },
    { question: "Do the guarantees transfer if I sell my home?", answer: "Lifetime support covers you as long as you own the home. Ask us about the specific warranty terms on your invoice for transfer details." },
  ],
  final: {
    badge: "Every job, every customer",
    heading: "Hire a Plumber Who Stands Behind the Work",
    body: "Five guarantees, one flat price, and a licensed team that answers the phone.",
    action: { label: "Schedule Online", href: "/book" },
  },
};
