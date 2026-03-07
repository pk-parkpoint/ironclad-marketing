import { defineArrayMember, defineField, defineType } from "sanity";

export const location = defineType({
  name: "location",
  title: "Location",
  type: "document",
  fields: [
    defineField({ name: "cityName", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "state", type: "string", initialValue: "TX", validation: (rule) => rule.required() }),
    defineField({ name: "county", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "cityName" }, validation: (rule) => rule.required() }),
    defineField({ name: "seo", type: "seo", validation: (rule) => rule.required() }),
    defineField({
      name: "hero",
      type: "object",
      fields: [
        defineField({ name: "h1", type: "string", validation: (rule) => rule.required() }),
        defineField({ name: "description", type: "text", rows: 3, validation: (rule) => rule.required() }),
      ],
    }),
    defineField({
      name: "localProof",
      type: "object",
      fields: [
        defineField({ name: "reviewCount", type: "number", validation: (rule) => rule.required().min(0) }),
        defineField({ name: "averageRating", type: "number", validation: (rule) => rule.required().min(1).max(5) }),
        defineField({ name: "featuredReview", type: "reference", to: [{ type: "review" }] }),
        defineField({ name: "recentJobs", type: "array", of: [defineArrayMember({ type: "string" })] }),
      ],
    }),
    defineField({
      name: "commonIssues",
      type: "object",
      fields: [
        defineField({ name: "heading", type: "string", validation: (rule) => rule.required() }),
        defineField({ name: "body", type: "text", rows: 4, validation: (rule) => rule.required() }),
        defineField({
          name: "linkedServices",
          type: "array",
          of: [defineArrayMember({ type: "reference", to: [{ type: "service" }] })],
        }),
      ],
    }),
    defineField({
      name: "whyChooseUs",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "icon", type: "string" }),
            defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "description", type: "text", rows: 3, validation: (rule) => rule.required() }),
          ],
        }),
      ],
    }),
    defineField({ name: "faqs", type: "array", of: [defineArrayMember({ type: "faqItem" })] }),
    defineField({
      name: "featuredServices",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "service" }] })],
    }),
    defineField({
      name: "nearbyLocations",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "location" }] })],
    }),
    defineField({ name: "sortOrder", type: "number", validation: (rule) => rule.required().min(0) }),
    defineField({ name: "showInHomepageGrid", type: "boolean", initialValue: false }),
    defineField({ name: "showInNavPreview", type: "boolean", initialValue: false }),
    defineField({ name: "latitude", type: "number", validation: (rule) => rule.required() }),
    defineField({ name: "longitude", type: "number", validation: (rule) => rule.required() }),
    defineField({ name: "serviceRadius", type: "number" }),
  ],
  preview: {
    select: { title: "cityName", subtitle: "slug.current" },
    prepare: ({ title, subtitle }) => ({ title: `${title}, TX`, subtitle }),
  },
});
