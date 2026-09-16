import { StructuredData } from "@/components/seo/structured-data";
import { DrainCleaningPage } from "@/components/service-template/drain-cleaning-page";
import type { DrainCleaningTemplateContent } from "@/components/service-template/service-template-types";
import { type NewPageDefinition } from "@/content/new-pages";
import { getPpcServiceVariant } from "@/content/ppc-service-variants";
import { getPublicContactInfo } from "@/lib/contact";
import {
  buildBreadcrumbListSchema,
  buildLocalBusinessSchema,
  buildOrganizationSchema,
  buildSchemaStack,
  buildServiceSchema,
  buildWebSiteSchema,
} from "@/lib/structured-data";

type NewContentPageProps = {
  definition: NewPageDefinition;
};

type ServiceCard = DrainCleaningTemplateContent["services"]["cards"][number];
type TextPair = DrainCleaningTemplateContent["signs"]["items"][number];

function projectPair(paragraph: string): TextPair {
  const separator = paragraph.indexOf(": ");
  return separator < 0
    ? [paragraph, "Completed with upfront scope, careful work, and final verification."]
    : [paragraph.slice(0, separator), paragraph.slice(separator + 2)];
}

function buildTemplateContent(definition: NewPageDefinition): DrainCleaningTemplateContent {
  const baseVariant = getPpcServiceVariant(definition.templateSlug);
  if (!baseVariant) {
    throw new Error(`Missing standard template content for ${definition.path}`);
  }

  const base = baseVariant.content;
  const firstSection = definition.content.sections[0];
  const projectPairs = definition.path === "projects"
    ? definition.content.sections.slice(0, 3).flatMap((section) => section.paragraphs.map(projectPair))
    : [];
  const projectCards: ServiceCard[] = projectPairs.map(([title, body], index) => [
    title,
    body,
    `Completed Ironclad project: ${title}`,
    base.services.cards[index % base.services.cards.length]?.[3],
  ]);

  return {
    ...base,
    hero: {
      ...base.hero,
      chipLabel: definition.locationBadge,
      eyebrow: definition.section.toUpperCase(),
      image: definition.heroImage,
      imageAlt: `${definition.h1} from Ironclad Plumbing`,
      pun: undefined,
      subhead: definition.metaDescription,
      supportLine: "",
      title: definition.h1,
    },
    signs: {
      ...base.signs,
      intro: firstSection?.paragraphs.join(" ") || definition.content.intro,
      items: projectPairs.length > 0 ? projectPairs.slice(0, 4) : base.signs.items,
      title: firstSection?.heading ?? base.signs.title,
    },
    services: projectCards.length > 0
      ? {
          cards: projectCards,
          intro: definition.content.intro,
          title: "Featured Greater Austin Projects",
        }
      : base.services,
    finalCta: {
      ...base.finalCta,
      body: definition.content.ctaBody,
      title: definition.content.ctaHeading,
    },
  };
}

export function NewContentPage({ definition }: NewContentPageProps) {
  const contactInfo = getPublicContactInfo();
  const pagePath = `/${definition.path}`;
  const templateContent = buildTemplateContent(definition);
  const schemaBreadcrumbs = [
    { name: "Home", path: "/" },
    { name: definition.breadcrumbParent.label, path: definition.breadcrumbParent.href },
    { name: definition.h1, path: pagePath },
  ];
  const schemas = buildSchemaStack(
    buildOrganizationSchema(),
    buildLocalBusinessSchema(pagePath),
    buildWebSiteSchema(),
    buildBreadcrumbListSchema(schemaBreadcrumbs),
    definition.serviceName
      ? buildServiceSchema({
          description: definition.metaDescription,
          name: definition.serviceName,
          path: pagePath,
        })
      : null,
  );

  return (
    <div data-new-content-page={definition.path}>
      <StructuredData data={schemas} id={`ld-new-page-${definition.path.replace(/\//g, "-")}`} />
      <DrainCleaningPage
        bookingHref={definition.bookingHref}
        content={templateContent}
        phoneDisplay={contactInfo.phoneDisplay}
        phoneHref={contactInfo.phoneHref}
      />
    </div>
  );
}
