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
  serviceArea?: string;
  serviceInterest?: string;
  pageType?:
    | "about"
    | "book"
    | "careers"
    | "contact"
    | "financing"
    | "landing"
    | "legal"
    | "offers"
    | "process"
    | "reviews"
    | "service"
    | "trust";
};
