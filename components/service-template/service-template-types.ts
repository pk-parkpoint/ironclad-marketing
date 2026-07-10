type TextPair = readonly [string, string];
type ServiceCard = readonly [string, string, string, string?];

export type DrainCleaningTemplateContent = {
  hero: {
    chipLabel?: string;
    eyebrow?: string;
    primaryCtaLabel?: string;
    pun?: string;
    punFirst?: boolean;
    ratingLabel?: string;
    secondaryCtaLabel?: string;
    title: string;
    subhead: string;
    supportLine: string;
    image: string;
    imageAlt: string;
  };
  guarantees: readonly TextPair[];
  signs: {
    title: string;
    intro: string;
    items: readonly TextPair[];
  };
  callout: {
    title: string;
    body: string;
  };
  services: {
    title: string;
    intro: string;
    cards: readonly ServiceCard[];
  };
  reviews: readonly (readonly [string, string, string, string])[];
  whyLine: string;
  why: readonly TextPair[];
  stats: readonly TextPair[];
  process: readonly TextPair[];
  serviceArea: {
    title: string;
    body: string;
    ctaLabel: string;
  };
  areas: readonly string[];
  faqTitle: string;
  faqs: readonly TextPair[];
  finalCta: {
    title: string;
    body: string;
    primaryLabel: string;
    callFirst?: boolean;
  };
};
