import { NewContentPage } from "@/components/layout/new-content-page";
import { getNewPageDefinition } from "@/content/new-pages";
import { buildPageMetadata } from "@/lib/seo";

const definition = getNewPageDefinition("projects");

if (!definition) {
  throw new Error("Missing projects page definition");
}

export const metadata = buildPageMetadata({
  description: definition.metaDescription,
  path: `/${definition.path}`,
  title: definition.titleTag,
});

export default function ProjectsPage() {
  return <NewContentPage definition={definition} />;
}
