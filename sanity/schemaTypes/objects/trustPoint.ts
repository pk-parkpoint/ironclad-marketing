import { defineField, defineType } from "sanity";

export const trustPoint = defineType({
  name: "trustPoint",
  title: "Trust Point",
  type: "object",
  fields: [
    defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "description", type: "text", rows: 3, validation: (rule) => rule.required() }),
  ],
});
