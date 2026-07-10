import { DrainCleaningPage } from "@/components/service-template/drain-cleaning-page";
import { getPpcServiceVariant } from "@/content/ppc-service-variants";
import { getPublicContactInfo } from "@/lib/contact";
import { buildPageMetadata } from "@/lib/seo";
import {
  buildBreadcrumbItems,
  buildBreadcrumbListSchema,
  buildFaqPageSchema,
  buildLocalBusinessSchema,
  buildSchemaStack,
  buildServiceSchema,
} from "@/lib/structured-data";
import { StructuredData } from "@/components/seo/structured-data";

const ROOT_PLUMBING_SLUG = "plumbing";

function getRootPlumbingVariant() {
  const variant = getPpcServiceVariant(ROOT_PLUMBING_SLUG);
  if (!variant) {
    throw new Error("Missing root plumbing PPC variant");
  }
  return variant;
}

const rootVariant = getRootPlumbingVariant();

export const metadata = buildPageMetadata({
  title: rootVariant.service.titleTag,
  description: rootVariant.service.metaDescription,
  path: "/plumbing",
  ogTemplate: "service",
});

export default function PlumbingHubPage() {
  const { phoneDisplay, phoneHref } = getPublicContactInfo();
  const faqItems = rootVariant.content.faqs.map(([question, answer]) => ({ question, answer }));
  const schemas = buildSchemaStack(
    buildBreadcrumbListSchema(buildBreadcrumbItems("/plumbing", rootVariant.service.title)),
    buildLocalBusinessSchema("/plumbing"),
    buildServiceSchema({
      description: rootVariant.service.metaDescription,
      name: rootVariant.service.title,
      path: "/plumbing",
      serviceType: rootVariant.service.title,
    }),
    buildFaqPageSchema(faqItems),
  );

  return (
    <>
      <StructuredData data={schemas} id="ld-plumbing-root" />
      <DrainCleaningPage
        bookingHref="/book?service=plumbing"
        content={rootVariant.content}
        phoneDisplay={phoneDisplay}
        phoneHref={phoneHref}
      />
    </>
  );
}
