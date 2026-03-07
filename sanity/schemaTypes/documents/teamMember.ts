import { defineField, defineType } from "sanity";

export const teamMember = defineType({
  name: "teamMember",
  title: "Team Member",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "role", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "photo", type: "image", options: { hotspot: true } }),
    defineField({ name: "bio", type: "text", rows: 4 }),
    defineField({ name: "licenseNumber", type: "string" }),
    defineField({ name: "sortOrder", type: "number", validation: (rule) => rule.required().min(0) }),
    defineField({ name: "showOnAboutPage", type: "boolean", initialValue: true }),
  ],
  preview: {
    select: { title: "name", subtitle: "role", media: "photo" },
  },
});
