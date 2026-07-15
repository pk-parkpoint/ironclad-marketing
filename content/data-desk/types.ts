export type DataDeskCategoryId =
  | "live-risk"
  | "market-costs"
  | "property-research"
  | "decision-tools"
  | "partner-operations";

export type DataDeskProduct = {
  rank: number;
  slug: string;
  title: string;
  shortTitle: string;
  metaTitle: string;
  metaDescription: string;
  category: DataDeskCategoryId;
  citationPotential: number;
  embedPotential: number;
  summary: string;
  signals: string[];
  sources: string[];
  cadence: string;
  audiences: string[];
  editorialUse: string;
  guardrail: string;
};

export type DataDeskCategory = {
  id: DataDeskCategoryId;
  label: string;
  description: string;
  relatedGuideLinks: Array<{ href: string; label: string }>;
};
