import type { MarketingPageContent } from "@/content/marketing-page-content";

export type NewPageDefinition = {
  path: string;
  titleTag: string;
  metaDescription: string;
  h1: string;
  section: string;
  heroImage: string;
  locationBadge?: string;
  trustChips: string[];
  breadcrumbParent: {
    href: string;
    label: string;
  };
  serviceName?: string;
  content: MarketingPageContent;
};
