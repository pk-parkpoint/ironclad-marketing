import type { MarketingPageContent } from "@/content/marketing-page-content";

export const MARKETING_PAGE_CONTENT_EXTRA: Record<string, MarketingPageContent> = {
  "privacy-policy": {
    intro:
      "This page explains how Ironclad collects, uses, and stores customer data related to website usage, communications, and service requests.",
    sections: [
      {
        heading: "Data Handling Summary",
        bullets: [
          "Information is used to respond to service requests",
          "Attribution parameters are retained for campaign measurement",
          "Submission records are protected and access-controlled",
        ],
        paragraphs: [],
      },
    ],
    ctaHeading: "Questions about privacy?",
    ctaBody: "Contact us for clarification on data handling practices.",
    pageType: "legal",
  },
  "special-offers": {
    intro:
      "Promotions and seasonal offers are published here when active. Eligibility and expiration details are shown with each offer.",
    sections: [
      {
        heading: "Offer Policy",
        bullets: [
          "One offer per qualifying job unless stated otherwise",
          "Not all services or emergency calls qualify",
          "Details are confirmed before work begins",
        ],
        paragraphs: [],
      },
    ],
    ctaHeading: "Want to confirm an active offer?",
    ctaBody: "Contact our team and we will verify eligibility.",
    pageType: "offers",
  },
  "terms": {
    intro:
      "This page summarizes customer responsibilities, scheduling expectations, and service conditions for Ironclad projects.",
    sections: [
      {
        heading: "Terms Summary",
        bullets: [
          "Scope and pricing are documented before work",
          "Customer approvals are required before changes",
          "Warranty terms are provided at closeout",
        ],
        paragraphs: [],
      },
    ],
    ctaHeading: "Need a terms clarification?",
    ctaBody: "Contact us and we will answer your question directly.",
    pageType: "legal",
  },
  "warranties": {
    intro:
      "Every completed job includes written workmanship coverage with clear terms. We define what is covered, for how long, and what to do if a follow-up is needed.",
    sections: [
      {
        heading: "Warranty Commitments",
        bullets: [
          "Written documentation at closeout",
          "Straightforward follow-up process",
          "Support from the original service team whenever possible",
        ],
        paragraphs: [],
      },
    ],
    ctaHeading: "Need warranty support?",
    ctaBody: "Call or contact us and include your service address.",
    pageType: "trust",
  },
  "why-choose-us": {
    intro:
      "Homeowners choose Ironclad for transparent communication, disciplined technical work, and a consistent experience from booking through final cleanup.",
    sections: [
      {
        heading: "Why Customers Stay With Ironclad",
        bullets: [
          "Option-based estimates before work starts",
          "Licensed workmanship and code awareness",
          "Clear scheduling communication",
          "Documented warranty support",
        ],
        paragraphs: [],
      },
    ],
    ctaHeading: "Experience the Ironclad standard",
    ctaBody: "Book service now or contact the team directly.",
    pageType: "trust",
  },
};
