import { defineField, defineType } from "sanity";

export const companyInfo = defineType({
  name: "companyInfo",
  title: "Company Info",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "phone", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "textNumber", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "email", type: "string", validation: (rule) => rule.required().email() }),
    defineField({
      name: "address",
      type: "object",
      fields: [
        defineField({ name: "street", type: "string", validation: (rule) => rule.required() }),
        defineField({ name: "city", type: "string", validation: (rule) => rule.required() }),
        defineField({ name: "state", type: "string", validation: (rule) => rule.required() }),
        defineField({ name: "zip", type: "string", validation: (rule) => rule.required() }),
        defineField({ name: "latitude", type: "number", validation: (rule) => rule.required() }),
        defineField({ name: "longitude", type: "number", validation: (rule) => rule.required() }),
      ],
    }),
    defineField({
      name: "hours",
      type: "object",
      fields: [
        defineField({ name: "weekday", type: "string", validation: (rule) => rule.required() }),
        defineField({ name: "saturday", type: "string", validation: (rule) => rule.required() }),
        defineField({ name: "sunday", type: "string", validation: (rule) => rule.required() }),
        defineField({ name: "emergency", type: "string", validation: (rule) => rule.required() }),
      ],
    }),
    defineField({
      name: "license",
      type: "object",
      fields: [
        defineField({ name: "number", type: "string", validation: (rule) => rule.required() }),
        defineField({ name: "board", type: "string", validation: (rule) => rule.required() }),
      ],
    }),
    defineField({
      name: "insurance",
      type: "object",
      fields: [
        defineField({ name: "generalLiability", type: "boolean", initialValue: true }),
        defineField({ name: "workersComp", type: "boolean", initialValue: true }),
      ],
    }),
    defineField({ name: "serviceAreasText", type: "text", rows: 4 }),
    defineField({ name: "bookingPrompt", type: "string" }),
  ],
  preview: {
    select: { title: "name" },
  },
});
