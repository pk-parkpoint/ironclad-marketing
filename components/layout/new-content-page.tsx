import { MarketingPageContent } from "@/components/layout/marketing-page-content";
import { PageScaffold } from "@/components/layout/page-scaffold";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { StructuredData } from "@/components/seo/structured-data";
import { NEW_CUSTOMER_OFFER, type NewPageDefinition } from "@/content/new-pages";
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

export function NewContentPage({ definition }: NewContentPageProps) {
  const contactInfo = getPublicContactInfo();
  const pagePath = `/${definition.path}`;
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    definition.breadcrumbParent,
    { label: definition.h1 },
  ];
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
      <SiteHeader promotionText={NEW_CUSTOMER_OFFER.banner} />
      <StructuredData data={schemas} id={`ld-new-page-${definition.path.replace(/\//g, "-")}`} />
      <PageScaffold
        breadcrumbs={breadcrumbItems}
        description={definition.metaDescription}
        eyebrow={definition.section}
        hero={{
          actions: [
            { href: "/book", label: "Book Service", variant: "primary" },
            { href: contactInfo.phoneHref, label: `Call ${contactInfo.phoneDisplay}`, variant: "secondary" },
            { href: contactInfo.smsHref, label: "Text Us", variant: "text" },
          ],
          alignment: "left",
          backgroundSrc: definition.heroImage,
          backgroundType: "image",
          locationBadge: definition.locationBadge ? { text: definition.locationBadge } : undefined,
          trustChips: definition.trustChips,
        }}
        pathLabel={pagePath}
        title={definition.h1}
      >
        <MarketingPageContent content={definition.content} path={definition.path} />
      </PageScaffold>
      <SiteFooter />
    </div>
  );
}
