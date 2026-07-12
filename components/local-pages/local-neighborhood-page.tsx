import { StructuredData } from "@/components/seo/structured-data";
import type { LocalNeighborhoodPageData } from "@/content/local-pages";
import { getFaqItems } from "@/content/local-pages";
import { getPublicContactInfo } from "@/lib/contact";
import {
  buildBreadcrumbListSchema,
  buildFaqPageSchema,
  buildLocalBusinessSchema,
  buildSchemaStack,
  buildServiceSchema,
} from "@/lib/structured-data";
import { LocalPageBody } from "./local-page-body";
import { LocalPageChrome } from "./local-page-shared";

function getBreadcrumbs(page: LocalNeighborhoodPageData) {
  return [
    { name: "Home", path: "/" },
    { name: "Service Areas", path: "/service-area" },
    { name: "Austin", path: "/service-area/austin-tx" },
    { name: page.name, path: page.path },
  ];
}

export function LocalNeighborhoodPage({ page }: { page: LocalNeighborhoodPageData }) {
  const contactInfo = getPublicContactInfo();
  const bookingHref = `/book?location=austin-tx&neighborhood=${page.slug}`;
  const schemas = buildSchemaStack(
    buildBreadcrumbListSchema(getBreadcrumbs(page)),
    buildLocalBusinessSchema(page.path),
    buildServiceSchema({
      areaServed: `${page.name}, Austin, TX`,
      description: page.intro,
      name: `Plumbing Services in ${page.name}, Austin, TX`,
      path: page.path,
      serviceType: "Residential plumbing service",
    }),
    buildFaqPageSchema(getFaqItems(page)),
  );

  return (
    <LocalPageChrome>
      <StructuredData data={schemas} id={`ld-local-neighborhood-${page.slug}`} />
      <LocalPageBody
        bookingHref={bookingHref}
        page={page}
        phoneDisplay={contactInfo.phoneDisplay}
        phoneHref={contactInfo.phoneHref}
      />
    </LocalPageChrome>
  );
}
