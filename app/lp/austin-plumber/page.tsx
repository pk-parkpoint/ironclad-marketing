import { NewContentPage } from "@/components/layout/new-content-page";
import { getNewPageDefinition } from "@/content/new-pages";
import { buildPageMetadata } from "@/lib/seo";

const definition = getNewPageDefinition("lp/austin-plumber");

if (!definition) {
  throw new Error("Missing Austin plumber landing-page definition");
}

export const metadata = buildPageMetadata({
  description: definition.metaDescription,
  ogTemplate: "service",
  path: `/${definition.path}`,
  title: definition.titleTag,
});

export default function AustinPlumberLandingPage() {
  return <NewContentPage definition={definition} />;
}
