export type CompanyCopyItem = {
  title: string;
  body: string;
};

export type CompanyAction = {
  label: string;
  href: string;
};

export type CompanyCallout = CompanyAction & {
  title: string;
  body: string;
};

export type CompanyCredo = {
  label: string;
  quote: string;
  body: string;
};

export type CompanyRole = CompanyCopyItem & {
  cta: string;
  href: string;
};

export type CompanyReview = {
  initial: string;
  name: string;
  location: string;
  quote: string;
};

export type CompanyFaq = {
  question: string;
  answer: string;
};

export type CompanyPageConfig = {
  slug: "about" | "careers" | "guarantees";
  eyebrow: string;
  heading: string;
  intro: string;
  heroSecondary: CompanyAction;
  pillarHeading: string;
  pillars: CompanyCopyItem[];
  rowsHeading: string;
  rowsLead: string;
  rows: CompanyCopyItem[];
  callout: CompanyCallout;
  credo?: CompanyCredo;
  roles?: {
    heading: string;
    intro: string;
    items: CompanyRole[];
    action: CompanyAction;
  };
  processEyebrow: string;
  processHeading: string;
  process: CompanyCopyItem[];
  whyEyebrow: string;
  whyHeading: string;
  whyLead: string;
  whyItems: CompanyCopyItem[];
  reviewsHeading?: string;
  reviews?: CompanyReview[];
  faqHeading: string;
  faqs: CompanyFaq[];
  final: {
    badge: string;
    heading: string;
    body: string;
    action: CompanyAction;
  };
};
