export type BlogArticleFaq = {
  question: string;
  answer: string;
};

export type BlogArticleDetails = {
  slug: string;
  author: string;
  reviewer: string;
  publishedAt: string;
  updatedAt: string;
  relatedServiceSlugs: string[];
  faq: BlogArticleFaq[];
};

export const BLOG_ARTICLE_DETAILS: Record<string, BlogArticleDetails> = {
  "how-to-choose-water-heater-austin": {
    slug: "how-to-choose-water-heater-austin",
    author: "Ironclad Editorial Team",
    reviewer: "Licensed Master Plumber",
    publishedAt: "2026-02-10",
    updatedAt: "2026-03-06",
    relatedServiceSlugs: ["water-heaters", "tankless-water-heaters", "water-treatment"],
    faq: [
      {
        question: "Should Austin homeowners choose tank or tankless water heaters?",
        answer:
          "It depends on household demand, infrastructure constraints, and maintenance tolerance. We recommend sizing by simultaneous hot-water usage first.",
      },
      {
        question: "Does Austin hard water impact water heater lifespan?",
        answer:
          "Yes. Hard-water scale can reduce efficiency and shorten equipment life without routine flushing or descaling.",
      },
    ],
  },
  "slab-leak-warning-signs": {
    slug: "slab-leak-warning-signs",
    author: "Ironclad Editorial Team",
    reviewer: "Licensed Master Plumber",
    publishedAt: "2026-01-25",
    updatedAt: "2026-03-06",
    relatedServiceSlugs: ["leak-detection", "repairs", "emergency"],
    faq: [
      {
        question: "What is the first sign of a slab leak in Austin homes?",
        answer:
          "Homeowners often first notice unexplained water bill spikes, warm floor spots, or persistent water sounds when fixtures are off.",
      },
      {
        question: "Should I break concrete before professional testing?",
        answer:
          "No. Leak detection should locate likely failure points first so demolition is targeted and limited.",
      },
    ],
  },
  "hard-water-maintenance-checklist": {
    slug: "hard-water-maintenance-checklist",
    author: "Ironclad Editorial Team",
    reviewer: "Licensed Master Plumber",
    publishedAt: "2026-02-02",
    updatedAt: "2026-03-06",
    relatedServiceSlugs: ["water-treatment", "water-heaters", "fixtures"],
    faq: [
      {
        question: "How often should water heaters be maintained in Austin?",
        answer:
          "Most systems benefit from yearly service. Homes with high hardness or heavy usage may require tighter intervals.",
      },
      {
        question: "Can hard water reduce fixture lifespan?",
        answer:
          "Yes. Scale accumulation can affect valve performance, flow rates, and finish durability over time.",
      },
    ],
  },
};

export function getBlogArticleDetails(slug: string): BlogArticleDetails | null {
  return BLOG_ARTICLE_DETAILS[slug] ?? null;
}
