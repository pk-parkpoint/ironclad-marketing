import { notFound } from "next/navigation";
import { MarketingPageContent } from "@/components/layout/marketing-page-content";
import { PageScaffold } from "@/components/layout/page-scaffold";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { MARKETING_PAGE_CONTENT } from "@/content/marketing-page-content";
import { StructuredData } from "@/components/seo/structured-data";
import { REVIEWS } from "@/content/reviews";
import { STATIC_PAGE_BY_PATH } from "@/content/static-pages";
import { DEDICATED_MARKETING_PATHS, STATIC_ROUTE_PATHS } from "@/lib/routes";
import { buildPageMetadata, type OgTemplate } from "@/lib/seo";
import {
  buildAggregateRatingSchema,
  buildBreadcrumbItems,
  buildBreadcrumbListSchema,
  buildLocalBusinessSchema,
  buildOrganizationSchema,
  buildSchemaStack,
  buildWebSiteSchema,
} from "@/lib/structured-data";

type RouteParams = {
  marketingPath: string[];
};
type RouteProps = {
  params: Promise<RouteParams>;
};

export const dynamicParams = false;
const PHASE0_SCAFFOLD_NOINDEX_PATHS = new Set(["book", "careers"]);

function getOgTemplateForPath(path: string): OgTemplate {
  if (path === "plumbing" || path.startsWith("plumbing/")) {
    return "service";
  }
  if (path === "service-area" || path.startsWith("service-area/")) {
    return "location";
  }
  if (
    path === "blog" ||
    path.startsWith("blog/") ||
    path === "faq" ||
    path.startsWith("faq/")
  ) {
    return "blog";
  }
  return "default";
}

export function generateStaticParams(): RouteParams[] {
  return STATIC_ROUTE_PATHS.filter((path) => !DEDICATED_MARKETING_PATHS.has(path)).map((path) => ({
    marketingPath: path.split("/"),
  }));
}

export async function generateMetadata({ params }: RouteProps) {
  const { marketingPath } = await params;
  const path = marketingPath.join("/");
  const page = STATIC_PAGE_BY_PATH.get(path);
  const content = MARKETING_PAGE_CONTENT[path];
  const forceNoindex = PHASE0_SCAFFOLD_NOINDEX_PATHS.has(path);

  if (!page) {
    return {};
  }

  return buildPageMetadata({
    title: page.titleTag,
    description: page.metaDescription,
    path: `/${path}`,
    ogTemplate: getOgTemplateForPath(path),
    robots: !forceNoindex && content
      ? undefined
      : {
          index: false,
          follow: false,
        },
  });
}

export default async function MarketingRoutePage({ params }: RouteProps) {
  const { marketingPath } = await params;
  const path = marketingPath.join("/");
  const page = STATIC_PAGE_BY_PATH.get(path);
  const content = MARKETING_PAGE_CONTENT[path];

  if (!page) {
    notFound();
  }

  if (!content) {
    notFound();
  }

  const pagePath = `/${path}`;
  const breadcrumbItems = buildBreadcrumbItems(pagePath, page.h1).map((item) => ({
    label: item.name,
    href: item.path === pagePath ? undefined : item.path,
  }));
  const schemas = buildSchemaStack(
    buildBreadcrumbListSchema(buildBreadcrumbItems(pagePath, page.h1)),
    buildWebSiteSchema(),
    buildOrganizationSchema(),
  );

  if (path === "contact") {
    schemas.push(buildLocalBusinessSchema(pagePath));
  }

  if (path === "reviews") {
    schemas.push(buildAggregateRatingSchema(REVIEWS));
  }

  return (
    <>
      <SiteHeader />
      <StructuredData data={schemas} id={`ld-route-${path.replace(/\//g, "-")}`} />
      <PageScaffold
        breadcrumbs={breadcrumbItems}
        description={page.metaDescription}
        eyebrow={page.section}
        pathLabel={pagePath}
        title={page.h1}
      >
        <MarketingPageContent content={content} path={path} />
      </PageScaffold>
      <SiteFooter />
    </>
  );
}
