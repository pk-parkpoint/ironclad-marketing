import { defineArrayMember, defineField, defineType } from "sanity";

export const faq = defineType({
  name: "faq",
  title: "FAQ",
  type: "document",
  fields: [
    defineField({ name: "question", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "answer", type: "text", rows: 5, validation: (rule) => rule.required() }),
    defineField({
      name: "category",
      type: "string",
      options: {
        list: [
          "general",
          "pricing",
          "scheduling",
          "water-heaters",
          "drains-sewers",
          "leaks",
          "water-quality",
          "emergency",
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "relatedService", type: "reference", to: [{ type: "service" }] }),
    defineField({ name: "relatedLocation", type: "reference", to: [{ type: "location" }] }),
    defineField({ name: "sortOrder", type: "number", validation: (rule) => rule.required().min(0) }),
    defineField({ name: "showOnFaqHub", type: "boolean", initialValue: true }),
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
    select: { title: "question", subtitle: "category" },
  },
});
