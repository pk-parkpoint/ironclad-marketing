import { StructuredData } from "@/components/seo/structured-data";
import { getServiceHeroImage } from "@/components/service/service-hero-images";
import { ServiceStandardPage } from "@/components/service/service-standard-page";
import {
  COMMERCIAL_PLUMBING_DETAIL,
  COMMERCIAL_PLUMBING_PATH,
  COMMERCIAL_PLUMBING_SERVICE,
  COMMERCIAL_QUICK_ANSWER,
} from "@/content/commercial-plumbing";
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

const heroImage = getServiceHeroImage(COMMERCIAL_PLUMBING_SERVICE.slug);

export const metadata = buildPageMetadata({
  title: COMMERCIAL_PLUMBING_SERVICE.titleTag,
  description: COMMERCIAL_PLUMBING_SERVICE.metaDescription,
  path: COMMERCIAL_PLUMBING_PATH,
  ogTemplate: "service",
});

export default function CommercialPlumbingPage() {
  const { phoneDisplay, phoneHref } = getPublicContactInfo();
  const schemas = buildSchemaStack(
    buildBreadcrumbListSchema(
      buildBreadcrumbItems(COMMERCIAL_PLUMBING_PATH, COMMERCIAL_PLUMBING_SERVICE.title),
    ),
    buildLocalBusinessSchema(COMMERCIAL_PLUMBING_PATH),
    buildServiceSchema({
      description: COMMERCIAL_PLUMBING_SERVICE.metaDescription,
      name: COMMERCIAL_PLUMBING_SERVICE.title,
      path: COMMERCIAL_PLUMBING_PATH,
      serviceType: "Commercial plumbing",
    }),
    buildServiceFaqSchema(COMMERCIAL_PLUMBING_SERVICE.slug, COMMERCIAL_PLUMBING_DETAIL.faqs),
    buildHowToSchema({
      name: "How Commercial Plumbing Service Works",
      description: COMMERCIAL_PLUMBING_DETAIL.heroDescription,
      path: COMMERCIAL_PLUMBING_PATH,
      steps: COMMERCIAL_PLUMBING_DETAIL.processSteps.map((step) => ({
        title: step.title,
        description: step.description,
      })),
    }),
    buildImageObjectSchema({
      alt: "Ironclad Plumbing commercial plumbing team in Austin, Texas",
      height: 864,
      path: heroImage,
      width: 1821,
    }),
  );

  return (
    <>
      <StructuredData data={schemas} id="ld-commercial-plumbing" />
      <ServiceStandardPage
        breadcrumbItems={[
          { label: "Home", href: "/" },
          { label: COMMERCIAL_PLUMBING_SERVICE.title },
        ]}
        contactPageType="commercial"
        detail={COMMERCIAL_PLUMBING_DETAIL}
        pagePath={COMMERCIAL_PLUMBING_PATH}
        phoneDisplay={phoneDisplay}
        phoneHref={phoneHref}
        quickAnswerText={COMMERCIAL_QUICK_ANSWER}
        relatedDescription="Explore related plumbing services, Greater Austin coverage, and practical maintenance resources for your property."
        service={COMMERCIAL_PLUMBING_SERVICE}
        symptomsIntro="We handle these issues for Austin businesses and property teams, with scheduling and communication designed to reduce disruption."
      />
    </>
  );
}
