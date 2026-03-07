import { defineArrayMember, defineField, defineType } from "sanity";

export const review = defineType({
  name: "review",
  title: "Review",
  type: "document",
  fields: [
    defineField({ name: "reviewerName", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "location", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "rating", type: "number", validation: (rule) => rule.required().min(1).max(5) }),
    defineField({ name: "text", type: "text", rows: 5, validation: (rule) => rule.required() }),
    defineField({ name: "serviceType", type: "reference", to: [{ type: "service" }] }),
    defineField({ name: "date", type: "date", validation: (rule) => rule.required() }),
    defineField({
      name: "source",
      type: "string",
      options: { list: ["google", "yelp", "direct"] },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "verified", type: "boolean", initialValue: true }),
    defineField({ name: "featured", type: "boolean", initialValue: false }),
    defineField({ name: "showOnHomepage", type: "boolean", initialValue: false }),
    defineField({
      name: "showOnServicePage",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "service" }] })],
    }),
    defineField({
      name: "showOnLocationPage",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "location" }] })],
    }),
  ],
  preview: {
    select: { title: "reviewerName", subtitle: "location", rating: "rating" },
    prepare: ({ title, subtitle, rating }) => ({
      title,
      subtitle: `${subtitle} - ${rating ?? "?"} stars`,
    }),
  },
});
