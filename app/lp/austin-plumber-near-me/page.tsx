import { NewContentPage } from "@/components/layout/new-content-page";
import { getNewPageDefinition } from "@/content/new-pages";
import { buildPageMetadata } from "@/lib/seo";

const definition = getNewPageDefinition("lp/austin-plumber-near-me");

if (!definition) {
  throw new Error("Missing Austin plumber near me landing-page definition");
}

export const metadata = buildPageMetadata({
  description: definition.metaDescription,
  ogTemplate: "service",
  path: `/${definition.path}`,
  title: definition.titleTag,
});

export default function AustinPlumberNearMeLandingPage() {
  return <NewContentPage definition={definition} />;
}
