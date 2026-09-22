import type { MarketingPageContent } from "@/content/marketing-page-content";
import type { DrainCleaningTemplateContent } from "@/components/service-template/service-template-types";

export type NewPageDefinition = {
  path: string;
  bookingHref: string;
  templateSlug: string;
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
  templateContent?: DrainCleaningTemplateContent;
  content: MarketingPageContent;
};
