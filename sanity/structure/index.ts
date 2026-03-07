import type { StructureResolver } from "sanity/structure";

const singletonTypes = new Set(["companyInfo"]);

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Company Info")
        .id("companyInfo")
        .child(S.document().schemaType("companyInfo").documentId("companyInfo")),
      ...S.documentTypeListItems().filter((item) => {
        const id = item.getId();
        return id ? !singletonTypes.has(id) : true;
      }),
    ]);
