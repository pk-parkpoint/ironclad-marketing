import { DRAIN_CLEANING_TEMPLATE } from "@/components/service-template/drain-cleaning-data";
import type { DrainCleaningTemplateContent } from "@/components/service-template/service-template-types";
import type { ServiceEntry } from "@/content/services";
import variantRecords from "@/content/ppc-service-variants.json";

type VariantText = {
  title: string;
  body: string;
};

type VariantService = VariantText & {
  image: string;
};

type VariantFaq = {
  q: string;
  a: string;
};

type VariantImage = {
  label: string;
  path: string;
};

type VariantRecord = {
  index: number;
  key: string;
  slug: string;
  bookUrl: string;
  heroImage?: string;
  heroImageAlt?: string;
  seoTitle: string;
  metaDescription: string;
  eyebrow: string;
  h1: string;
  valueLine: string;
  pun: string;
  punFirst?: boolean;
  callFirst?: boolean;
  signsHeading: string;
  signsIntro: string;
  signs: VariantText[];
  servicesHeading: string;
  servicesIntro: string;
  services: VariantService[];
  calloutHeadline: string;
  calloutSub: string;
  whyLine: string;
  process: VariantText[];
  serviceAreaHeader: string;
  serviceAreaSub: string;
  serviceAreaCta: string;
  faqHeading: string;
  faqs: VariantFaq[];
  finalHeading: string;
  finalBody: string;
  finalCta: string;
  images: VariantImage[];
};

export type PpcServiceVariant = {
  bookingHref: string;
  content: DrainCleaningTemplateContent;
  service: ServiceEntry;
  slug: string;
};

export type PpcServiceRouteEntry = {
  path: string;
  service: ServiceEntry;
  variant: PpcServiceVariant;
};

const ROOT_PLUMBING_SLUG = "plumbing";
const ASSET_SERVICE_PREFIX = "assets/services/";
const VARIANTS = variantRecords as VariantRecord[];
let cache: PpcServiceVariant[] | undefined;

function serviceImagePath(assetPath: string): string {
  if (!assetPath.startsWith(ASSET_SERVICE_PREFIX)) {
    return assetPath;
  }
  return `/media/services/${assetPath.slice(ASSET_SERVICE_PREFIX.length)}`;
}

function bookingHref(bookUrl: string): string {
  const url = new URL(bookUrl, "https://ironcladtexas.com");
  return `${url.pathname}${url.search}`;
}

function textPairs(items: VariantText[]): Array<readonly [string, string]> {
  return items.map((item) => [item.title, item.body] as const);
}

function buildVariant(record: VariantRecord): PpcServiceVariant {
  const imageLabels = new Map(record.images.map((image) => [image.path, image.label]));
  const heroImageSource = record.heroImage ?? record.services[0]?.image;
  const content: DrainCleaningTemplateContent = {
    ...DRAIN_CLEANING_TEMPLATE,
    callout: {
      body: record.calloutSub,
      title: record.calloutHeadline,
    },
    faqTitle: record.faqHeading,
    faqs: record.faqs.map((faq) => [faq.q, faq.a] as const),
    finalCta: {
      body: record.finalBody,
      callFirst: record.callFirst,
      primaryLabel: record.finalCta,
      title: record.finalHeading,
    },
    hero: {
      ...DRAIN_CLEANING_TEMPLATE.hero,
      eyebrow: record.eyebrow,
      pun: record.pun,
      punFirst: record.punFirst,
      subhead: record.valueLine,
      supportLine: "",
      title: record.h1,
      ...(heroImageSource
        ? {
            image: serviceImagePath(heroImageSource),
            imageAlt:
              record.heroImageAlt
              ?? imageLabels.get(heroImageSource)
              ?? `${record.key} service in Austin`,
          }
        : {}),
    },
    process: textPairs(record.process),
    serviceArea: {
      body: record.serviceAreaSub,
      ctaLabel: record.serviceAreaCta,
      title: record.serviceAreaHeader,
    },
    services: {
      cards: record.services.map(
        (service) =>
          [
            service.title,
            service.body,
            imageLabels.get(service.image) ?? `Photo: ${service.title}`,
            serviceImagePath(service.image),
          ] as const,
      ),
      intro: record.servicesIntro,
      title: record.servicesHeading,
    },
    signs: {
      intro: record.signsIntro,
      items: textPairs(record.signs),
      title: record.signsHeading,
    },
    whyLine: record.whyLine,
  };

  return {
    bookingHref: bookingHref(record.bookUrl),
    content,
    service: {
      h1: record.h1,
      metaDescription: record.metaDescription,
      slug: record.slug,
      title: record.key,
      titleTag: record.seoTitle,
    },
    slug: record.slug,
  };
}

export function getPpcServiceVariants(): PpcServiceVariant[] {
  cache ??= VARIANTS.map(buildVariant);
  return cache;
}

export function getPpcServiceVariant(slug: string): PpcServiceVariant | undefined {
  return getPpcServiceVariants().find((variant) => variant.slug === slug);
}

export function getPpcServiceVariantSlugs(): string[] {
  return getPpcServiceVariants()
    .map((variant) => variant.slug)
    .filter((slug) => slug !== ROOT_PLUMBING_SLUG);
}

export function getPpcServiceRoutePath(slug: string): string {
  return slug === ROOT_PLUMBING_SLUG ? "/plumbing" : `/plumbing/${slug}`;
}

export function getPpcServiceRouteEntries(): PpcServiceRouteEntry[] {
  return getPpcServiceVariants().map((variant) => ({
    path: getPpcServiceRoutePath(variant.slug),
    service: variant.service,
    variant,
  }));
}
