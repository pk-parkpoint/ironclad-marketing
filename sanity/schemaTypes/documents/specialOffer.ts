import { defineArrayMember, defineField, defineType } from "sanity";

export const specialOffer = defineType({
  name: "specialOffer",
  title: "Special Offer",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "description", type: "text", rows: 3, validation: (rule) => rule.required() }),
    defineField({ name: "terms", type: "text", rows: 3, validation: (rule) => rule.required() }),
    defineField({ name: "code", type: "string" }),
    defineField({ name: "validFrom", type: "datetime", validation: (rule) => rule.required() }),
    defineField({ name: "validUntil", type: "datetime", validation: (rule) => rule.required() }),
    defineField({ name: "active", type: "boolean", initialValue: true }),
    defineField({
      name: "applicableServices",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "service" }] })],
    }),
    defineField({ name: "newCustomersOnly", type: "boolean", initialValue: false }),
    defineField({ name: "sortOrder", type: "number", validation: (rule) => rule.required().min(0) }),
  ],
  preview: {
    select: { title: "title", subtitle: "code" },
  },
});
