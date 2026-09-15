import { NewContentPage } from "@/components/layout/new-content-page";
import { getNewPageDefinition } from "@/content/new-pages";
import { buildPageMetadata } from "@/lib/seo";

const definition = getNewPageDefinition("plumbing/water-softener-repair");

if (!definition) {
  throw new Error("Missing water-softener repair page definition");
}

export const metadata = buildPageMetadata({
  description: definition.metaDescription,
  ogTemplate: "service",
  path: `/${definition.path}`,
  title: definition.titleTag,
});

export default function WaterSoftenerRepairPage() {
  return <NewContentPage definition={definition} />;
}
