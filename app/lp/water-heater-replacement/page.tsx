import { NewContentPage } from "@/components/layout/new-content-page";
import { getNewPageDefinition } from "@/content/new-pages";
import { buildPageMetadata } from "@/lib/seo";

const definition = getNewPageDefinition("lp/water-heater-replacement");

if (!definition) {
  throw new Error("Missing water-heater replacement landing-page definition");
}

export const metadata = buildPageMetadata({
  description: definition.metaDescription,
  ogTemplate: "service",
  path: `/${definition.path}`,
  title: definition.titleTag,
});

export default function WaterHeaterReplacementLandingPage() {
  return <NewContentPage definition={definition} />;
}
