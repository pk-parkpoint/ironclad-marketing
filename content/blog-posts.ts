export type BlogEntry = {
  slug: string;
  title: string;
  titleTag: string;
  metaDescription: string;
  h1: string;
};

export const BLOG_POSTS: BlogEntry[] = [
  {
    slug: "how-to-choose-water-heater-austin",
    title: "How to Choose a Water Heater in Austin",
    titleTag: "How to Choose a Water Heater in Austin | Ironclad Blog",
    metaDescription:
      "A practical guide to choosing tank or tankless systems based on Austin household demand and hard-water conditions.",
    h1: "How to Choose a Water Heater in Austin",
  },
  {
    slug: "slab-leak-warning-signs",
    title: "Slab Leak Warning Signs Austin Homeowners Should Not Ignore",
    titleTag: "Slab Leak Warning Signs | Ironclad Plumbing",
    metaDescription:
      "Learn the early warning signs of slab leaks and what to do before structural damage gets expensive.",
    h1: "Slab Leak Warning Signs Austin Homeowners Should Not Ignore",
  },
  {
    slug: "hard-water-maintenance-checklist",
    title: "Austin Hard Water Maintenance Checklist",
    titleTag: "Hard Water Maintenance Checklist | Ironclad Plumbing",
    metaDescription:
      "Prevent scale buildup in fixtures, heaters, and appliances with this Austin-focused maintenance checklist.",
    h1: "Austin Hard Water Maintenance Checklist",
  },
];

export const BLOG_SLUG_SET = new Set(BLOG_POSTS.map((post) => post.slug));
