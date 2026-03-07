import { MARKETING_PAGE_CONTENT_EXTRA } from "@/content/marketing-page-content-extra";

export type MarketingPageSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type MarketingPageContent = {
  intro: string;
  sections: MarketingPageSection[];
  ctaHeading: string;
  ctaBody: string;
  showContactForm?: boolean;
  pageType?:
    | "about"
    | "book"
    | "careers"
    | "contact"
    | "financing"
    | "legal"
    | "offers"
    | "process"
    | "reviews"
    | "trust";
};

export const MARKETING_PAGE_CONTENT: Record<string, MarketingPageContent> = {
  "about": {
    intro:
      "Ironclad was built to give Austin homeowners a plumbing company that communicates clearly, prices work transparently, and stands behind every job in writing.",
    sections: [
      {
        heading: "Our Standard",
        paragraphs: [
          "Every visit starts with diagnosis and a written estimate before work begins.",
          "We protect your home, complete tested repairs, and leave documentation that is easy to understand.",
        ],
      },
      {
        heading: "How We Operate",
        bullets: [
          "Licensed and insured technicians",
          "Upfront option-based pricing",
          "Arrival windows with active communication",
          "Written workmanship warranty",
        ],
        paragraphs: [],
      },
    ],
    ctaHeading: "Need plumbing help today?",
    ctaBody: "Book online in under a minute or contact our team by phone or text.",
    pageType: "about",
  },
  "book": {
    intro:
      "Use this page to request service quickly. Share your issue, preferred time, and contact details. Our team confirms details and dispatch timing right away.",
    sections: [
      {
        heading: "What Happens After You Submit",
        bullets: [
          "A coordinator reviews your request and confirms scope",
          "You get the next available service window",
          "Urgent requests are prioritized for rapid response",
        ],
        paragraphs: [],
      },
    ],
    ctaHeading: "Need immediate help?",
    ctaBody: "Call now for urgent plumbing response.",
    showContactForm: true,
    pageType: "book",
  },
  "careers": {
    intro:
      "Ironclad hires technicians and operations teammates who value craftsmanship, communication, and accountability on every job.",
    sections: [
      {
        heading: "What We Look For",
        bullets: [
          "Customer-first communication",
          "Strong technical fundamentals and safety habits",
          "Pride in clean, documented work",
        ],
        paragraphs: [],
      },
      {
        heading: "What You Can Expect",
        paragraphs: [
          "Structured onboarding, clear performance expectations, and a team committed to continuous improvement.",
        ],
      },
    ],
    ctaHeading: "Interested in joining the team?",
    ctaBody: "Submit your information and we will follow up about current opportunities.",
    showContactForm: true,
    pageType: "careers",
  },
  "contact": {
    intro:
      "Reach Ironclad by phone, text, or form submission. We route your request based on urgency and service area so you get the fastest realistic scheduling option.",
    sections: [
      {
        heading: "Fastest Contact Methods",
        bullets: [
          "Phone for urgent issues",
          "Text for quick triage and scheduling updates",
          "Form for non-urgent requests and detailed project notes",
        ],
        paragraphs: [],
      },
    ],
    ctaHeading: "Ready to get scheduled?",
    ctaBody: "Send your request and we will confirm next steps quickly.",
    showContactForm: true,
    pageType: "contact",
  },
  "financing": {
    intro:
      "Financing options are available for qualified projects where spreading payments improves affordability and project timing.",
    sections: [
      {
        heading: "When Financing Helps Most",
        bullets: [
          "Major repair or replacement work",
          "Unexpected emergency expenses",
          "Planned upgrades with long-term value",
        ],
        paragraphs: [],
      },
    ],
    ctaHeading: "Need options before deciding?",
    ctaBody: "Contact the team and we will walk through practical paths forward.",
    pageType: "financing",
  },
  "licenses": {
    intro:
      "Ironclad maintains the licensing and insurance standards expected for residential plumbing work across the Greater Austin service area.",
    sections: [
      {
        heading: "Proof and Compliance",
        bullets: [
          "Responsible Master Plumber oversight",
          "Current insurance coverage",
          "Code-aligned installation and repair practices",
        ],
        paragraphs: [],
      },
    ],
    ctaHeading: "Need documentation for a project?",
    ctaBody: "Contact us and we can provide details relevant to your scope.",
    pageType: "trust",
  },
  "our-process": {
    intro:
      "From first contact to final walkthrough, our process is designed for clarity, speed, and workmanship quality.",
    sections: [
      {
        heading: "Process Overview",
        bullets: [
          "Intake and issue triage",
          "On-site diagnosis and written options",
          "Approved work completion and testing",
          "Warranty and closeout documentation",
        ],
        paragraphs: [],
      },
    ],
    ctaHeading: "Want to start now?",
    ctaBody: "Book online and our team will confirm your service window.",
    pageType: "process",
  },
  "reviews": {
    intro:
      "Read verified customer feedback from homeowners across Austin and surrounding communities. We use real reviews to improve process, communication, and service quality.",
    sections: [
      {
        heading: "What Customers Mention Most",
        bullets: [
          "Clear communication and arrival updates",
          "Accurate diagnosis and practical options",
          "Professional cleanup and reliable outcomes",
        ],
        paragraphs: [],
      },
    ],
    ctaHeading: "Need help with a plumbing issue?",
    ctaBody: "Book your service request today.",
    pageType: "reviews",
  },
  ...MARKETING_PAGE_CONTENT_EXTRA,
};
