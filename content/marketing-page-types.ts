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
