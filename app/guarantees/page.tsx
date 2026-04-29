import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { QuickAnswer } from "@/components/seo/quick-answer";
import { StructuredData } from "@/components/seo/structured-data";
import { GUARANTEES_PAGE_INTRO, GUARANTEES_PAGE_SECTIONS } from "@/content/guarantees-page";
import { buildPageMetadata } from "@/lib/seo";
import { getPublicContactInfo } from "@/lib/contact";
import {
  buildBreadcrumbItems,
  buildBreadcrumbListSchema,
  buildOrganizationSchema,
  buildSchemaStack,
  buildWebSiteSchema,
} from "@/lib/structured-data";

export const dynamic = "force-static";

export function generateMetadata() {
  return buildPageMetadata({
    title: "The Ironclad Guarantees | Ironclad Plumbing - Austin, TX",
    description:
      "Read the six written guarantees Ironclad Plumbing makes to Austin homeowners before any residential plumbing job begins.",
    path: "/guarantees",
  });
}

export default function GuaranteesPage() {
  const contactInfo = getPublicContactInfo();
  const pagePath = "/guarantees";
  const breadcrumbs = buildBreadcrumbItems(pagePath, "The Ironclad Guarantee - In Writing, Not in Marketing Speak");
  const breadcrumbItems = breadcrumbs.map((item) => ({
    label: item.name,
    href: item.path === pagePath ? undefined : item.path,
  }));
  const schemas = buildSchemaStack(
    buildBreadcrumbListSchema(breadcrumbs),
    buildWebSiteSchema(),
    buildOrganizationSchema(),
  );

  return (
    <>
      <SiteHeader />
      <StructuredData data={schemas} id="ld-route-guarantees" />
      <main>
        <section className="bg-soft-background pt-6">
          <div className="container-shell">
            <nav aria-label="Breadcrumb" className="text-sm text-muted">
              <ol className="m-0 flex list-none flex-wrap gap-2 p-0">
                {breadcrumbItems.map((item, index) => (
                  <li className="flex items-center gap-2" key={`${item.label}-${index}`}>
                    {item.href ? (
                      <a className="focus-ring hover:text-ink hover:no-underline" href={item.href}>
                        {item.label}
                      </a>
                    ) : (
                      <span aria-current="page">{item.label}</span>
                    )}
                    {index < breadcrumbItems.length - 1 ? <span aria-hidden="true">›</span> : null}
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </section>

        <section className="section-block bg-soft-background">
          <div className="container-shell space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-muted">Trust</p>
            <h1 className="h1-display max-w-[var(--max-readable-width)]">
              The Ironclad Guarantee - In Writing, Not in Marketing Speak
            </h1>
            <p className="body-large max-w-[var(--max-readable-width)] text-muted">{GUARANTEES_PAGE_INTRO}</p>
            <QuickAnswer>
              Ironclad Plumbing gives Austin homeowners written service guarantees covering visit fees, callback
              accountability, advice quality, quote-locked pricing, warranties, and lifetime support. These promises are
              meant to make the service experience easier to compare before work begins.
            </QuickAnswer>
          </div>
        </section>

        <section className="section-block">
          <div className="container-shell card-shell p-6 md:p-8">
            <div className="space-y-10">
              {GUARANTEES_PAGE_SECTIONS.map((section) => (
                <section className="space-y-5" key={section.title}>
                  <h2 className="text-2xl font-semibold text-ink">{section.title}</h2>
                  <div className="space-y-4">
                    {section.items.map((item) => (
                      <div className="space-y-2" key={item.label}>
                        <h3 className="text-base font-semibold text-ink md:text-lg">{item.label}</h3>
                        <p className="text-sm leading-7 text-body md:text-base">{item.body}</p>
                      </div>
                    ))}
                  </div>
                </section>
              ))}

              <section className="rounded-[var(--radius-card)] border border-border bg-soft-background p-6">
                <h2 className="text-2xl font-semibold text-ink">If we miss one of these commitments</h2>
                <p className="mt-3 text-sm leading-7 text-body md:text-base">
                  These guarantees are not marketing. They are commitments. If we fail to meet any of them, tell us.
                  Call{" "}
                  <a className="font-semibold text-cta-blue hover:underline" href={contactInfo.phoneHref}>
                    {contactInfo.phoneDisplay}
                  </a>{" "}
                  or email{" "}
                  <a className="font-semibold text-cta-blue hover:underline" href={`mailto:${contactInfo.contactEmail}`}>
                    {contactInfo.contactEmail}
                  </a>
                  . We will make it right because the entire point of Ironclad is proving that a plumbing company can
                  succeed by keeping its word.
                </p>
              </section>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
