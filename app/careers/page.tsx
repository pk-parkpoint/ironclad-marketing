import { CompanyPage } from "@/components/company/company-page";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { StructuredData } from "@/components/seo/structured-data";
import { CAREERS_COMPANY_PAGE } from "@/content/company-page-careers";
import { buildPageMetadata } from "@/lib/seo";
import {
  buildBreadcrumbItems,
  buildBreadcrumbListSchema,
  buildOrganizationSchema,
  buildSchemaStack,
  buildWebSiteSchema,
} from "@/lib/structured-data";

export const metadata = buildPageMetadata({
  title: "Careers at Ironclad Plumbing | Austin, TX Plumbing Jobs",
  description: CAREERS_COMPANY_PAGE.intro,
  path: "/careers",
});

export default function CareersPage() {
  const schemas = buildSchemaStack(
    buildBreadcrumbListSchema(buildBreadcrumbItems("/careers", "Careers")),
    buildWebSiteSchema(),
    buildOrganizationSchema(),
  );

  return (
    <>
      <SiteHeader />
      <StructuredData data={schemas} id="ld-careers-page" />
      <CompanyPage config={CAREERS_COMPANY_PAGE} />
      <SiteFooter />
    </>
  );
}
