import { defineArrayMember, defineField, defineType } from "sanity";

export const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: (rule) => rule.required() }),
    defineField({ name: "seo", type: "seo", validation: (rule) => rule.required() }),
    defineField({
      name: "hero",
      type: "object",
      fields: [
        defineField({ name: "h1", type: "string", validation: (rule) => rule.required() }),
        defineField({ name: "description", type: "text", rows: 3, validation: (rule) => rule.required() }),
        defineField({ name: "backgroundImage", type: "image", options: { hotspot: true } }),
      ],
    }),
    defineField({
      name: "symptoms",
      type: "object",
      fields: [
        defineField({ name: "heading", type: "string", validation: (rule) => rule.required() }),
        defineField({ name: "items", type: "array", of: [defineArrayMember({ type: "string" })] }),
      ],
    }),
    defineField({
      name: "solutions",
      type: "object",
      fields: [
        defineField({ name: "heading", type: "string", validation: (rule) => rule.required() }),
        defineField({ name: "items", type: "array", of: [defineArrayMember({ type: "string" })] }),
        defineField({ name: "image", type: "image", options: { hotspot: true } }),
      ],
    }),
    defineField({
      name: "austinNote",
      type: "object",
      fields: [
        defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
        defineField({ name: "body", type: "text", rows: 3, validation: (rule) => rule.required() }),
      ],
    }),
    defineField({
      name: "process",
      type: "object",
      fields: [
        defineField({ name: "heading", type: "string", validation: (rule) => rule.required() }),
        defineField({
          name: "steps",
          type: "array",
          of: [defineArrayMember({ type: "processStep" })],
          validation: (rule) => rule.required().min(1),
        }),
      ],
    }),
    defineField({
      name: "trustPoints",
      type: "array",
      of: [defineArrayMember({ type: "trustPoint" })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "faqs",
      type: "array",
      of: [defineArrayMember({ type: "faqItem" })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "relatedServices",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "service" }] })],
    }),
    defineField({ name: "bookingCtaText", type: "string" }),
    defineField({ name: "icon", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "shortDescription", type: "text", rows: 2, validation: (rule) => rule.required() }),
    defineField({ name: "sortOrder", type: "number", validation: (rule) => rule.required().min(0) }),
    defineField({ name: "showInNav", type: "boolean", initialValue: true }),
    defineField({ name: "showInHomepageGrid", type: "boolean", initialValue: true }),
  ],
  preview: {
    select: { title: "title", subtitle: "slug.current", media: "hero.backgroundImage" },
  },
});
