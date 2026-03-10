import type { LocationEntry } from "@/content/locations";
import { LOCATIONS } from "@/content/locations";
import type { ReviewEntry } from "@/content/reviews";
import type { ServiceEntry } from "@/content/services";
import { BUSINESS_SERVICE_TYPES, TRUST_FIELDS, buildAreaServedList } from "@/content/site-trust";
import { getPublicContactInfo } from "@/lib/contact";

const SCHEMA_CONTEXT = "https://schema.org";
const BUSINESS_NAME = "Ironclad Plumbing";
const DEFAULT_SITE_URL = "https://ironcladtexas.com";

/**
 * CSS selectors that voice assistants and AI answer engines should read aloud.
 * Each selector targets a `data-speakable` attribute on page elements.
 */
const SPEAKABLE_CSS_SELECTORS = [
  "[data-speakable='hero']",
  "[data-speakable='faq-answer']",
  "[data-speakable='service-desc']",
  "[data-speakable='trust']",
  "[data-speakable='city-overview']",
  "[data-speakable='article-body']",
];

function buildSpeakableSpec(): Record<string, unknown> {
  return {
    "@type": "SpeakableSpecification",
    cssSelector: SPEAKABLE_CSS_SELECTORS,
  };
}

type JsonLd = Record<string, unknown>;
type JsonLdInput = JsonLd | null | undefined;

export type BreadcrumbItem = {
  name: string;
  path: string;
};

const BREADCRUMB_LABEL_OVERRIDES: Record<string, string> = {
  faq: "FAQ",
  "service-area": "Service Areas",
  "our-process": "Our Process",
  "why-choose-us": "Why Choose Us",
  warranties: "Warranties",
  financing: "Financing",
  "special-offers": "Special Offers",
  careers: "Careers",
  licenses: "Licenses",
  "privacy-policy": "Privacy Policy",
  terms: "Terms",
  reviews: "Reviews",
  book: "Book Online",
};

function getBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL).replace(/\/+$/, "");
}

function resolveSocialUrls(): string[] {
  const candidates = [
    process.env.NEXT_PUBLIC_FACEBOOK_URL,
    process.env.NEXT_PUBLIC_INSTAGRAM_URL,
    process.env.NEXT_PUBLIC_GBP_URL,
  ]
    .map((value) => value?.trim())
    .filter((value): value is string => Boolean(value));

  const resolved: string[] = [];
  for (const candidate of candidates) {
    try {
      const url = new URL(candidate);
      if (url.protocol === "http:" || url.protocol === "https:") {
        resolved.push(url.toString());
      }
    } catch {
      // Ignore invalid URLs.
    }
  }
  return resolved;
}

function normalizePath(path: string): string {
  if (!path) {
    return "/";
  }
  return path.startsWith("/") ? path : `/${path}`;
}

function segmentToLabel(segment: string): string {
  const override = BREADCRUMB_LABEL_OVERRIDES[segment];
  if (override) {
    return override;
  }
  return segment
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function schemaId(type: string, suffix?: string): string {
  const normalizedSuffix = suffix ? suffix.replace(/^#/, "") : type.toLowerCase();
  return `${getBaseUrl()}#${normalizedSuffix}`;
}

export function toAbsoluteUrl(path: string): string {
  return `${getBaseUrl()}${normalizePath(path)}`;
}

export function buildSchemaStack(...schemas: Array<JsonLdInput | JsonLdInput[]>): JsonLd[] {
  const flattened = schemas.flat().filter(Boolean) as JsonLd[];
  const seen = new Set<string>();
  const unique: JsonLd[] = [];

  for (const schema of flattened) {
    const schemaType = typeof schema["@type"] === "string" ? schema["@type"] : "unknown";
    const key =
      (typeof schema["@id"] === "string" && schema["@id"]) ||
      (typeof schema.url === "string" && `${schemaType}:${schema.url}`) ||
      (typeof schema.name === "string" && `${schemaType}:${schema.name}`) ||
      `${schemaType}:${JSON.stringify(schema).slice(0, 80)}`;

    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    unique.push(schema);
  }

  return unique;
}

export function buildBreadcrumbItems(path: string, finalLabel?: string): BreadcrumbItem[] {
  const cleanPath = normalizePath(path).replace(/^\/|\/$/g, "");
  if (!cleanPath) {
    return [{ name: "Home", path: "/" }];
  }

  const segments = cleanPath.split("/").filter(Boolean);
  const items: BreadcrumbItem[] = [{ name: "Home", path: "/" }];
  let cursor = "";

  for (const [index, segment] of segments.entries()) {
    cursor = `${cursor}/${segment}`;
    const isLast = index === segments.length - 1;
    items.push({
      name: isLast && finalLabel ? finalLabel : segmentToLabel(segment),
      path: cursor,
    });
  }

  return items;
}

export function buildBreadcrumbListSchema(items: BreadcrumbItem[]): JsonLd {
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "BreadcrumbList",
    "@id": schemaId("BreadcrumbList", `breadcrumbs:${items.map((item) => item.path).join("|")}`),
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: toAbsoluteUrl(item.path),
    })),
  };
}

export function buildWebSiteSchema(): JsonLd {
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "WebSite",
    "@id": schemaId("WebSite", "website"),
    name: BUSINESS_NAME,
    url: getBaseUrl(),
    potentialAction: {
      "@type": "SearchAction",
      target: `${getBaseUrl()}/plumbing-guides?query={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildOrganizationSchema(): JsonLd {
  const contactInfo = getPublicContactInfo();
  const socialUrls = resolveSocialUrls();

  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "Organization",
    "@id": schemaId("Organization", "organization"),
    name: BUSINESS_NAME,
    legalName: BUSINESS_NAME,
    url: getBaseUrl(),
    logo: toAbsoluteUrl("/media/ip-logo.svg"),
    email: contactInfo.contactEmail,
    telephone: contactInfo.phoneHref.replace(/^tel:/, ""),
    areaServed: buildAreaServedList(),
    ...(socialUrls.length > 0 ? { sameAs: socialUrls } : {}),
  };
}

export function buildLocalBusinessSchema(path: string): JsonLd {
  const contactInfo = getPublicContactInfo();
  const socialUrls = resolveSocialUrls();

  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "Plumber",
    "@id": schemaId("Plumber", "business"),
    name: BUSINESS_NAME,
    url: toAbsoluteUrl(path),
    speakable: buildSpeakableSpec(),
    image: toAbsoluteUrl("/og/ironclad-default.png"),
    logo: toAbsoluteUrl("/media/ip-logo.svg"),
    email: contactInfo.contactEmail,
    telephone: contactInfo.phoneHref.replace(/^tel:/, ""),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Austin",
      addressRegion: "TX",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 30.2672,
      longitude: -97.7431,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "07:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "08:00",
        closes: "14:00",
      },
    ],
    priceRange: "$$",
    areaServed: buildAreaServedList(),
    serviceType: [...BUSINESS_SERVICE_TYPES],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Residential plumbing services",
      itemListElement: BUSINESS_SERVICE_TYPES.map((serviceName) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: serviceName,
        },
      })),
    },
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Master plumber license",
        value: TRUST_FIELDS.masterPlumberLicense,
      },
      {
        "@type": "PropertyValue",
        name: "Insurance status",
        value: TRUST_FIELDS.insuredStatus,
      },
      {
        "@type": "PropertyValue",
        name: "Warranty",
        value: TRUST_FIELDS.writtenWarranty,
      },
      {
        "@type": "PropertyValue",
        name: "Emergency service",
        value: TRUST_FIELDS.sameDayEmergency,
      },
      {
        "@type": "PropertyValue",
        name: "Background checks",
        value: TRUST_FIELDS.backgroundCheckedTeam,
      },
    ],
    ...(socialUrls.length > 0 ? { sameAs: socialUrls } : {}),
  };
}

type ServiceSchemaInput =
  | ServiceEntry
  | {
      name: string;
      description: string;
      path: string;
      serviceType?: string;
      areaServed?: string | string[];
    };

function isServiceEntry(input: ServiceSchemaInput): input is ServiceEntry {
  return "slug" in input && "metaDescription" in input;
}

export function buildServiceSchema(input: ServiceSchemaInput): JsonLd {
  const serviceData = isServiceEntry(input)
    ? {
        areaServed: "Greater Austin, TX",
        description: input.metaDescription,
        name: input.title,
        path: `/plumbing/${input.slug}`,
        serviceType: input.title,
      }
    : {
        areaServed: input.areaServed ?? "Greater Austin, TX",
        description: input.description,
        name: input.name,
        path: input.path,
        serviceType: input.serviceType ?? input.name,
      };

  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "Service",
    "@id": schemaId("Service", `service:${normalizePath(serviceData.path)}`),
    name: serviceData.name,
    serviceType: serviceData.serviceType,
    description: serviceData.description,
    url: toAbsoluteUrl(serviceData.path),
    provider: {
      "@id": schemaId("Plumber", "business"),
      "@type": "Plumber",
      name: BUSINESS_NAME,
      url: toAbsoluteUrl("/"),
    },
    areaServed: serviceData.areaServed,
  };
}

export function buildLocationServiceSchema(location: LocationEntry): JsonLd {
  return buildServiceSchema({
    areaServed: `${location.cityName}, TX`,
    description: location.metaDescription,
    name: `Plumbing Services in ${location.cityName}, TX`,
    path: `/service-area/${location.slug}`,
    serviceType: "Residential plumbing service",
  });
}

export function buildImageObjectSchema({
  alt,
  height,
  path,
  width,
}: {
  path: string;
  alt: string;
  width: number;
  height: number;
}): JsonLd {
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "ImageObject",
    "@id": schemaId("ImageObject", `image:${normalizePath(path)}`),
    contentUrl: toAbsoluteUrl(path),
    name: alt,
    caption: alt,
    width,
    height,
  };
}

export function buildFaqPageSchema(faqs: Array<{ question: string; answer: string }>): JsonLd {
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "FAQPage",
    "@id": schemaId("FAQPage", `faq:${faqs.length}`),
    speakable: buildSpeakableSpec(),
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function buildAggregateRatingSchema(reviews: ReviewEntry[]): JsonLd {
  if (reviews.length === 0) {
    throw new Error("reviews are required for AggregateRating schema");
  }

  const ratingTotal = reviews.reduce((sum, entry) => sum + entry.rating, 0);
  const ratingValue = Number((ratingTotal / reviews.length).toFixed(1));

  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "Plumber",
    "@id": schemaId("Plumber", "rating"),
    name: BUSINESS_NAME,
    url: toAbsoluteUrl("/reviews"),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue,
      reviewCount: reviews.length,
      bestRating: 5,
      worstRating: 1,
    },
    review: reviews.map((entry) => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: entry.reviewerName,
      },
      reviewBody: entry.text,
      datePublished: entry.date,
      reviewRating: {
        "@type": "Rating",
        ratingValue: entry.rating,
        bestRating: 5,
        worstRating: 1,
      },
      publisher: {
        "@type": "Organization",
        name: entry.source === "google" ? "Google" : entry.source,
      },
    })),
  };
}

export function buildArticleSchema({
  authorName,
  body,
  dateModified,
  datePublished,
  description,
  path,
  title,
}: {
  title: string;
  description: string;
  path: string;
  body: string;
  authorName: string;
  datePublished: string;
  dateModified?: string;
}): JsonLd {
  const modified = dateModified ?? datePublished;
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "Article",
    "@id": schemaId("Article", `article:${normalizePath(path)}`),
    headline: title,
    description,
    articleBody: body,
    datePublished,
    dateModified: modified,
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@id": schemaId("Organization", "organization"),
      "@type": "Organization",
      name: BUSINESS_NAME,
      logo: {
        "@type": "ImageObject",
        url: toAbsoluteUrl("/media/ip-logo.svg"),
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": toAbsoluteUrl(path),
    },
    image: [toAbsoluteUrl("/og/ironclad-blog.png")],
    speakable: buildSpeakableSpec(),
  };
}

export function buildHowToSchema({
  name,
  description,
  path,
  steps,
}: {
  name: string;
  description: string;
  path: string;
  steps: Array<{ title: string; description: string }>;
}): JsonLd {
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "HowTo",
    "@id": schemaId("HowTo", `howto:${normalizePath(path)}`),
    name,
    description,
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.title,
      text: step.description,
    })),
  };
}

export function buildCityFaqSchema(locationSlug: string, faqs: Array<{ question: string; answer: string }>): JsonLd {
  return {
    ...buildFaqPageSchema(faqs),
    "@id": schemaId("FAQPage", `faq:city:${locationSlug}`),
  };
}

export function buildServiceFaqSchema(serviceSlug: string, faqs: Array<{ question: string; answer: string }>): JsonLd {
  return {
    ...buildFaqPageSchema(faqs),
    "@id": schemaId("FAQPage", `faq:service:${serviceSlug}`),
  };
}

export function getAllServiceAreaLabels(): string[] {
  return LOCATIONS.map((location) => `${location.cityName}, TX`);
}
