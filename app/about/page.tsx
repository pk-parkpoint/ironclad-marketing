import { CompanyPage } from "@/components/company/company-page";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { StructuredData } from "@/components/seo/structured-data";
import { ABOUT_COMPANY_PAGE } from "@/content/company-page-about";
import { buildPageMetadata } from "@/lib/seo";
import {
  buildBreadcrumbItems,
  buildBreadcrumbListSchema,
  buildLocalBusinessSchema,
  buildOrganizationSchema,
  buildSchemaStack,
  buildWebSiteSchema,
} from "@/lib/structured-data";

export const metadata = buildPageMetadata({
  title: "About Ironclad Plumbing | Austin, TX",
  description: ABOUT_COMPANY_PAGE.intro,
  path: "/about",
});

export default function AboutPage() {
  const schemas = buildSchemaStack(
    buildBreadcrumbListSchema(buildBreadcrumbItems("/about", "About Ironclad Plumbing")),
    buildWebSiteSchema(),
    buildOrganizationSchema(),
    buildLocalBusinessSchema("/about"),
  );

  return (
    <>
      <SiteHeader />
      <StructuredData data={schemas} id="ld-about-page" />
      <CompanyPage config={ABOUT_COMPANY_PAGE} />
      <SiteFooter />
    </>
  );
}
