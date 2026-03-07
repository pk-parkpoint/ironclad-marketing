import Link from "next/link";
import { ResourceSearch } from "@/components/resources/resource-search";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { StructuredData } from "@/components/seo/structured-data";
import { buildPageMetadata } from "@/lib/seo";
import { buildBreadcrumbItems, buildBreadcrumbListSchema } from "@/lib/structured-data";

export const metadata = buildPageMetadata({
  title: "Plumbing Resources | Ironclad Plumbing",
  description:
    "Search practical plumbing resources and homeowner guides by problem type, service, or maintenance topic.",
  path: "/resources",
  ogTemplate: "blog",
});

export default function ResourcesPage() {
  const breadcrumbSchema = buildBreadcrumbListSchema(buildBreadcrumbItems("/resources", "Resources"));

  return (
    <>
      <SiteHeader />
      <StructuredData data={breadcrumbSchema} id="ld-breadcrumb-resources" />
      <main>
        <section className="section-block bg-soft-background">
          <div className="container-shell">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-muted">Resource Center</p>
            <h1 className="h1-display mt-4 max-w-[var(--max-readable-width)]">Search Plumbing Guides</h1>
            <p className="body-large mt-4 max-w-[var(--max-readable-width)] text-muted">
              Find the right guide quickly, then jump to related service pages when you need hands-on help.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="focus-ring primary-button" href="/book">
                Book Service
              </Link>
              <Link className="focus-ring secondary-button" href="/plumbing">
                Explore Services
              </Link>
            </div>
          </div>
        </section>

        <section className="section-block">
          <div className="container-shell">
            <ResourceSearch />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
