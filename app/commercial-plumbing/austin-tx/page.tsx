import { CommercialRequestForm } from "@/components/commercial/commercial-request-form";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { StructuredData } from "@/components/seo/structured-data";
import { buildPageMetadata } from "@/lib/seo";
import {
  buildBreadcrumbItems,
  buildBreadcrumbListSchema,
  buildServiceSchema,
  buildSchemaStack,
} from "@/lib/structured-data";

export const metadata = buildPageMetadata({
  title: "Commercial Plumbing in Austin, TX | Ironclad Plumbing",
  description:
    "Light commercial plumbing for restaurants, retail, offices, and tenant improvements in Austin. Fast triage and clear scheduling.",
  path: "/commercial-plumbing/austin-tx",
  ogTemplate: "service",
});

export default function CommercialPlumbingAustinPage() {
  const schemas = buildSchemaStack(
    buildBreadcrumbListSchema(buildBreadcrumbItems("/commercial-plumbing/austin-tx", "Commercial Plumbing")),
    buildServiceSchema({
      name: "Commercial Plumbing in Austin, TX",
      path: "/commercial-plumbing/austin-tx",
      serviceType: "Commercial plumbing",
      areaServed: "Austin, TX",
      description:
        "Light commercial plumbing for restaurants, offices, and retail properties across Austin with clear scheduling and communication.",
    }),
  );

  return (
    <>
      <SiteHeader />
      <StructuredData data={schemas} id="ld-commercial-austin" />
      <main>
        <section className="section-block bg-soft-background">
          <div className="container-shell">
            <Breadcrumbs
              currentPath="/commercial-plumbing/austin-tx"
              items={[
                { label: "Home", href: "/" },
                { label: "Commercial Plumbing", href: "/commercial-plumbing/austin-tx" },
                { label: "Austin, TX" },
              ]}
            />
            <h1 className="h1-display mt-4 max-w-[var(--max-readable-width)]">Commercial Plumbing in Austin, TX</h1>
            <p className="body-large mt-4 max-w-[var(--max-readable-width)] text-muted">
              We support light commercial properties with triage-first service, clear scheduling, and insurance-aware documentation.
            </p>
          </div>
        </section>

        <section className="section-block">
          <div className="container-shell grid gap-8 lg:grid-cols-[3fr_2fr]">
            <div className="space-y-4">
              <h2 className="h2-display">Built for Real-World Commercial Constraints</h2>
              <p className="text-sm text-body md:text-base">
                Ironclad handles tenant improvements, restaurants, offices, and retail plumbing needs with strict communication and schedule discipline.
              </p>
              <ul className="m-0 list-none space-y-2 p-0">
                <li className="text-sm text-body md:text-base">Emergency triage and prioritization</li>
                <li className="text-sm text-body md:text-base">Documentation for insurance and property teams</li>
                <li className="text-sm text-body md:text-base">Clear scope, pricing, and scheduling updates</li>
              </ul>
            </div>
            <div className="card-shell p-6 md:p-7">
              <h2 className="text-2xl font-semibold text-ink">Request Commercial Service</h2>
              <p className="mt-2 text-sm text-muted md:text-base">
                Include business and site details so we can route the request accurately.
              </p>
              <CommercialRequestForm />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
