import { defineField, defineType } from "sanity";

export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  fields: [
    defineField({ name: "titleTag", title: "Title Tag", type: "string", validation: (rule) => rule.required().max(60) }),
    defineField({
      name: "metaDescription",
      title: "Meta Description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().max(160),
    }),
    defineField({ name: "ogImage", title: "OG Image", type: "image", options: { hotspot: true } }),
    defineField({ name: "canonicalUrl", title: "Canonical URL", type: "url" }),
  ],
});
