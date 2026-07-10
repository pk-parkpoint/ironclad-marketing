import { notFound } from "next/navigation";
import { StructuredData } from "@/components/seo/structured-data";
import { getServiceHeroImage } from "@/components/service/service-hero-images";
import { ServiceStandardPage } from "@/components/service/service-standard-page";
import { DrainCleaningPage } from "@/components/service-template/drain-cleaning-page";
import type { DrainCleaningTemplateContent } from "@/components/service-template/service-template-types";
import { getPpcServiceVariant, getPpcServiceVariantSlugs } from "@/content/ppc-service-variants";
import { SERVICES, type ServiceEntry } from "@/content/services";
import { getServiceDetail, type ServiceDetail } from "@/content/service-details";
import { getPublicContactInfo } from "@/lib/contact";
import { buildPageMetadata } from "@/lib/seo";
import {
  buildBreadcrumbItems,
  buildBreadcrumbListSchema,
  buildHowToSchema,
  buildImageObjectSchema,
  buildLocalBusinessSchema,
  buildSchemaStack,
  buildServiceFaqSchema,
  buildServiceSchema,
} from "@/lib/structured-data";

type RouteParams = {
  slug: string;
};

type RouteProps = {
  params: Promise<RouteParams>;
};

export const dynamicParams = false;

function getRouteService(slug: string): ServiceEntry | undefined {
  return getPpcServiceVariant(slug)?.service ?? SERVICES.find((entry) => entry.slug === slug);
}

function getStaticServiceSlugs(): string[] {
  return Array.from(new Set([...SERVICES.map((service) => service.slug), ...getPpcServiceVariantSlugs()]));
}

function buildServicePageSchemas({
  detail,
  heroImage,
  pagePath,
  service,
  templateContent,
}: {
  detail: ServiceDetail;
  heroImage: string;
  pagePath: string;
  service: ServiceEntry;
  templateContent?: DrainCleaningTemplateContent;
}) {
  const faqItems = templateContent
    ? templateContent.faqs.map(([question, answer]) => ({ question, answer }))
    : detail.faqs;
  const processSteps = templateContent
    ? templateContent.process.map(([title, description]) => ({ description, title }))
    : detail.processSteps.map((step) => ({
        title: step.title,
        description: step.description,
      }));

  return buildSchemaStack(
    buildBreadcrumbListSchema(buildBreadcrumbItems(pagePath, service.title)),
    buildLocalBusinessSchema(pagePath),
    buildServiceSchema(service),
    buildServiceFaqSchema(service.slug, faqItems),
    buildHowToSchema({
      name: `How ${service.title} Works`,
      description: detail.heroDescription,
      path: pagePath,
      steps: processSteps,
    }),
    buildImageObjectSchema({
      alt: `${service.title} service in Austin, Texas`,
      height: 900,
      path: heroImage,
      width: 1600,
    }),
  );
}

export function generateStaticParams(): RouteParams[] {
  return getStaticServiceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: RouteProps) {
  const { slug } = await params;
  const service = getRouteService(slug);

  if (!service) {
    return {};
  }

  return buildPageMetadata({
    title: service.titleTag,
    description: service.metaDescription,
    path: `/plumbing/${service.slug}`,
  });
}

export default async function ServiceDetailPage({ params }: RouteProps) {
  const { slug } = await params;
  const variant = getPpcServiceVariant(slug);
  const service = variant?.service ?? SERVICES.find((entry) => entry.slug === slug);

  if (!service) {
    notFound();
  }

  const { phoneDisplay, phoneHref } = getPublicContactInfo();
  const detail = getServiceDetail(service);
  const pagePath = `/plumbing/${service.slug}`;
  const heroImage = variant?.content.hero.image ?? getServiceHeroImage(service.slug);
  const schemas = buildServicePageSchemas({ detail, heroImage, pagePath, service, templateContent: variant?.content });

  if (variant) {
    return (
      <>
        <StructuredData data={schemas} id={`ld-service-${service.slug}`} />
        <DrainCleaningPage
          bookingHref={`/book?service=${variant.slug}`}
          content={variant.content}
          phoneDisplay={phoneDisplay}
          phoneHref={phoneHref}
        />
      </>
    );
  }

  return (
    <>
      <StructuredData data={schemas} id={`ld-service-${service.slug}`} />
      <ServiceStandardPage detail={detail} phoneDisplay={phoneDisplay} phoneHref={phoneHref} service={service} />
    </>
  );
}
