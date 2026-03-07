import { defineArrayMember, defineField, defineType } from "sanity";

export const blogPost = defineType({
  name: "blogPost",
  title: "Blog Post",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: (rule) => rule.required() }),
    defineField({ name: "seo", type: "seo", validation: (rule) => rule.required() }),
    defineField({ name: "heroImage", type: "image", options: { hotspot: true } }),
    defineField({ name: "excerpt", type: "text", rows: 3, validation: (rule) => rule.required() }),
    defineField({ name: "body", type: "array", of: [defineArrayMember({ type: "block" })], validation: (rule) => rule.required() }),
    defineField({ name: "readTimeMinutes", type: "number", validation: (rule) => rule.required().min(1) }),
    defineField({ name: "category", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "tags", type: "array", of: [defineArrayMember({ type: "string" })] }),
    defineField({
      name: "relatedServices",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "service" }] })],
    }),
    defineField({
      name: "relatedLocations",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "location" }] })],
    }),
    defineField({
      name: "relatedPosts",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "blogPost" }] })],
    }),
    defineField({ name: "author", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "publishDate", type: "datetime", validation: (rule) => rule.required() }),
    defineField({ name: "updatedDate", type: "datetime" }),
    defineField({
      name: "status",
      type: "string",
      options: { list: ["draft", "published"] },
      initialValue: "draft",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "featured", type: "boolean", initialValue: false }),
  ],
  preview: {
    select: { title: "title", subtitle: "category", media: "heroImage" },
  },
});
