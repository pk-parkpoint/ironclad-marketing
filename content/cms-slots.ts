export type CmsSlotId =
  | "hero"
  | "quick_answer"
  | "signs_when_to_call"
  | "service_scope"
  | "process"
  | "proof"
  | "faq"
  | "related_links"
  | "cta"
  | "local_hero"
  | "why_this_city"
  | "common_local_problems"
  | "neighborhoods"
  | "homeowner_tips"
  | "service_matrix"
  | "nearby_areas"
  | "trust_strip"
  | "feature_grid"
  | "team_story"
  | "contact_booking_modules";

export type CmsSlotConfig = {
  id: CmsSlotId;
  label: string;
};

export const SERVICE_PAGE_SLOTS: CmsSlotConfig[] = [
  { id: "hero", label: "Hero" },
  { id: "quick_answer", label: "Quick Answer" },
  { id: "signs_when_to_call", label: "Signs / When To Call" },
  { id: "service_scope", label: "Service Scope" },
  { id: "process", label: "Process" },
  { id: "proof", label: "Proof" },
  { id: "faq", label: "FAQ" },
  { id: "related_links", label: "Related Links" },
  { id: "cta", label: "CTA" },
];

export const CITY_PAGE_SLOTS: CmsSlotConfig[] = [
  { id: "local_hero", label: "Local Hero" },
  { id: "why_this_city", label: "Why This City" },
  { id: "common_local_problems", label: "Common Local Problems" },
  { id: "neighborhoods", label: "Neighborhoods" },
  { id: "homeowner_tips", label: "Homeowner Tips" },
  { id: "service_matrix", label: "Service Matrix" },
  { id: "faq", label: "FAQ" },
  { id: "nearby_areas", label: "Nearby Areas" },
  { id: "cta", label: "CTA" },
];

export const CORE_PAGE_SLOTS: CmsSlotConfig[] = [
  { id: "hero", label: "Hero" },
  { id: "trust_strip", label: "Trust Strip" },
  { id: "feature_grid", label: "Feature Grid" },
  { id: "team_story", label: "Team / Story" },
  { id: "contact_booking_modules", label: "Contact / Booking Modules" },
  { id: "faq", label: "FAQ" },
];
