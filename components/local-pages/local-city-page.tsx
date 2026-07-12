import { StructuredData } from "@/components/seo/structured-data";
import type { LocalCityPageData } from "@/content/local-pages";
import { getFaqItems } from "@/content/local-pages";
import { getPublicContactInfo } from "@/lib/contact";
import {
  buildBreadcrumbItems,
  buildBreadcrumbListSchema,
  buildFaqPageSchema,
  buildLocalBusinessSchema,
  buildSchemaStack,
  buildServiceSchema,
} from "@/lib/structured-data";
import { LocalPageBody } from "./local-page-body";
import { LocalPageChrome } from "./local-page-shared";

export function LocalCityPage({ page }: { page: LocalCityPageData }) {
  const contactInfo = getPublicContactInfo();
  const bookingHref = `/book?location=${page.slug}`;
  const schemas = buildSchemaStack(
    buildBreadcrumbListSchema(buildBreadcrumbItems(page.path, page.name)),
    buildLocalBusinessSchema(page.path),
    buildServiceSchema({
      areaServed: `${page.name}, TX`,
      description: page.intro,
      name: `Plumbing Services in ${page.name}, TX`,
      path: page.path,
      serviceType: "Residential plumbing service",
    }),
    buildFaqPageSchema(getFaqItems(page)),
  );

  return (
    <LocalPageChrome bookingHref={bookingHref}>
      <StructuredData data={schemas} id={`ld-local-city-${page.slug}`} />
      <LocalPageBody
        bookingHref={bookingHref}
        page={page}
        phoneDisplay={contactInfo.phoneDisplay}
        phoneHref={contactInfo.phoneHref}
      />
    </LocalPageChrome>
  );
}
