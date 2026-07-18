import { BLOG_POSTS } from "../content/blog-posts";
import { COMMERCIAL_PLUMBING_PATH, COMMERCIAL_PLUMBING_SERVICE } from "../content/commercial-plumbing";
import { FAQ_ENTRIES } from "../content/faqs";
import { LOCATIONS } from "../content/locations";
import { getPpcServiceRouteEntries } from "../content/ppc-service-variants";
import { REVIEWS } from "../content/reviews";
import { getServiceDetail } from "../content/service-details";
import { SERVICES } from "../content/services";
import { STATIC_PAGES } from "../content/static-pages";
import {
  buildBreadcrumbItems,
  buildBreadcrumbListSchema,
  buildFaqPageSchema,
  buildLocalBusinessSchema,
  buildServiceSchema,
  toAbsoluteUrl,
} from "../lib/structured-data";

function fail(message: string): never {
  console.error(`structured data audit failed: ${message}`);
  process.exit(1);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    fail(message);
  }
}

function asRecord(value: unknown, message: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    fail(message);
  }
  return value as Record<string, unknown>;
}

function main() {
  const homeBusiness = asRecord(buildLocalBusinessSchema("/"), "home LocalBusiness schema missing");
  const contactBusiness = asRecord(
    buildLocalBusinessSchema("/contact"),
    "contact LocalBusiness schema missing",
  );

  assert(homeBusiness["@type"] === "Plumber", "homepage schema must be Plumber");
  assert(contactBusiness["@type"] === "Plumber", "contact schema must be Plumber");
  assert(contactBusiness.url === toAbsoluteUrl("/contact"), "contact LocalBusiness URL mismatch");
  assert(
    !("aggregateRating" in homeBusiness) && !("review" in homeBusiness),
    "first-party Plumber schema must not aggregate self-controlled reviews",
  );

  const commercialServiceSchema = asRecord(
    buildServiceSchema({
      description: COMMERCIAL_PLUMBING_SERVICE.metaDescription,
      name: COMMERCIAL_PLUMBING_SERVICE.title,
      path: COMMERCIAL_PLUMBING_PATH,
      serviceType: "Commercial plumbing",
    }),
    "commercial service schema missing",
  );
  assert(commercialServiceSchema["@type"] === "Service", "commercial schema must be Service");
  assert(
    commercialServiceSchema.url === toAbsoluteUrl(COMMERCIAL_PLUMBING_PATH),
    "commercial service schema URL mismatch",
  );

  for (const service of SERVICES) {
    const serviceSchema = asRecord(
      buildServiceSchema(service),
      `service schema missing for ${service.slug}`,
    );
    assert(serviceSchema["@type"] === "Service", `service schema @type mismatch for ${service.slug}`);
    assert(
      serviceSchema.url === toAbsoluteUrl(`/plumbing/${service.slug}`),
      `service schema URL mismatch for ${service.slug}`,
    );

    const detail = getServiceDetail(service);
    const serviceFaqSchema = asRecord(
      buildFaqPageSchema(detail.faqs),
      `service FAQ schema missing for ${service.slug}`,
    );
    assert(serviceFaqSchema["@type"] === "FAQPage", `FAQPage schema missing for ${service.slug}`);
    const serviceFaqMainEntity = serviceFaqSchema.mainEntity;
    assert(
      Array.isArray(serviceFaqMainEntity) && serviceFaqMainEntity.length === detail.faqs.length,
      `FAQ mainEntity count mismatch for ${service.slug}`,
    );
  }

  for (const { path, service } of getPpcServiceRouteEntries()) {
    const serviceSchema = asRecord(
      buildServiceSchema({
        description: service.metaDescription,
        name: service.title,
        path,
        serviceType: service.title,
      }),
      `PPC service schema missing for ${path}`,
    );
    assert(serviceSchema["@type"] === "Service", `PPC service schema @type mismatch for ${path}`);
    assert(serviceSchema.url === toAbsoluteUrl(path), `PPC service schema URL mismatch for ${path}`);
  }

  const faqHubSchema = asRecord(buildFaqPageSchema(FAQ_ENTRIES), "faq hub schema missing");
  assert(faqHubSchema["@type"] === "FAQPage", "FAQ hub must emit FAQPage schema");
  const faqHubMainEntity = faqHubSchema.mainEntity;
  assert(
    Array.isArray(faqHubMainEntity) && faqHubMainEntity.length === FAQ_ENTRIES.length,
    "FAQ hub mainEntity count mismatch",
  );

  const routeSet = new Set<string>([
    ...STATIC_PAGES.map((entry) => `/${entry.path}`),
    "/blog",
    "/faq",
    "/faq/plumbing",
    "/plumbing-guides",
    "/404",
    ...SERVICES.map((service) => `/plumbing/${service.slug}`),
    ...getPpcServiceRouteEntries().map((entry) => entry.path),
    ...LOCATIONS.map((location) => `/service-area/${location.slug}`),
    ...BLOG_POSTS.map((post) => `/blog/${post.slug}`),
  ]);

  for (const route of routeSet) {
    if (route === "/") {
      continue;
    }

    const breadcrumbs = buildBreadcrumbItems(route);
    assert(breadcrumbs.length >= 2, `breadcrumb trail too short for ${route}`);

    const breadcrumbSchema = asRecord(
      buildBreadcrumbListSchema(breadcrumbs),
      `breadcrumb schema missing for ${route}`,
    );
    assert(breadcrumbSchema["@type"] === "BreadcrumbList", `breadcrumb schema @type mismatch for ${route}`);

    const breadcrumbItems = breadcrumbSchema.itemListElement;
    assert(
      Array.isArray(breadcrumbItems) && breadcrumbItems.length === breadcrumbs.length,
      `breadcrumb item count mismatch for ${route}`,
    );
  }

  assert(REVIEWS.length > 0, "reviews dataset must not be empty");
  for (const review of REVIEWS) {
    assert(review.reviewerName.trim().length > 0, `missing reviewerName for ${review.id}`);
    assert(review.text.trim().length > 0, `missing review text for ${review.id}`);
    assert(review.rating >= 1 && review.rating <= 5, `rating out of range for ${review.id}`);
  }

  console.log(
    `structured data audit passed: ${routeSet.size} routes, ${SERVICES.length} services, ${REVIEWS.length} reviews`,
  );
}

main();
