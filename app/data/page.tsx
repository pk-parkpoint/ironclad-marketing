import Link from "next/link";
import { DataDeskBreadcrumbs } from "@/components/data-desk/data-desk-breadcrumbs";
import { DataDeskProductCard } from "@/components/data-desk/data-desk-product-card";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { StructuredData } from "@/components/seo/structured-data";
import {
  DATA_DESK_CATEGORIES,
  DATA_DESK_HUB_DESCRIPTION,
  DATA_DESK_PRODUCTS,
  getDataDeskProductsByCategory,
} from "@/content/data-desk";
import { buildDataDeskHubSchema } from "@/lib/data-desk-schema";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Austin Home Data Desk | Ironclad Plumbing",
  description: DATA_DESK_HUB_DESCRIPTION,
  path: "/data",
  ogTemplate: "blog",
  robots: { index: false, follow: true, googleBot: { index: false, follow: true } },
});

const PLANNED_FORMATS = [
  { title: "Canonical report", text: "Findings, charts, methodology, sources and archived versions on IroncladTexas.com." },
  { title: "Responsive embed", text: "A clean iframe or component for newsrooms, HOAs, agents and property partners." },
  { title: "Public data", text: "Documented JSON and CSV downloads for independent analysis and reuse." },
  { title: "Broadcast graphic", text: "Continuously updated 16:9 and social-ready images for editorial use." },
];

export default function DataDeskHubPage() {
  return (
    <>
      <StructuredData data={buildDataDeskHubSchema(DATA_DESK_PRODUCTS)} id="data-desk-collection-schema" />
      <SiteHeader />
      <main className="bg-soft-background">
        <section className="border-b border-border bg-white py-12 md:py-16">
          <div className="container-shell">
            <DataDeskBreadcrumbs />
            <div className="mt-8 max-w-[880px]">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-ink px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white">
                  25 product templates ready
                </span>
                <span className="text-sm font-semibold text-body">Prelaunch preview · data products in development</span>
              </div>
              <h1 className="mt-6 text-4xl font-bold leading-tight text-ink md:text-6xl">Austin Home Data Desk</h1>
              <p className="mt-5 max-w-[780px] text-lg leading-8 text-body">
                A planned public source for Austin home-system costs, risks, emergencies, permits, water conditions and
                homeowner decisions—built for residents, newsrooms and property professionals.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container-shell">
            <div className="max-w-[760px]">
              <p className="text-sm font-bold uppercase tracking-[0.12em] text-cta-blue">One source, four useful formats</p>
              <h2 className="mt-3 text-3xl font-bold text-ink">Designed to be cited, embedded and independently checked.</h2>
              <p className="mt-4 leading-7 text-body">
                These are honest development previews, not live datasets. Each finished product is planned to publish
                the same documented information in four reusable forms.
              </p>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {PLANNED_FORMATS.map((format) => (
                <article className="rounded-2xl border border-border bg-white p-5" key={format.title}>
                  <h3 className="font-bold text-ink">{format.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-body">{format.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {DATA_DESK_CATEGORIES.map((category, index) => {
          const products = getDataDeskProductsByCategory(category.id);
          return (
            <section className={index % 2 === 0 ? "border-y border-border bg-white py-12 md:py-16" : "py-12 md:py-16"} id={category.id} key={category.id}>
              <div className="container-shell">
                <div className="max-w-[760px]">
                  <p className="text-sm font-bold uppercase tracking-[0.12em] text-cta-blue">{products.length} planned products</p>
                  <h2 className="mt-3 text-3xl font-bold text-ink">{category.label}</h2>
                  <p className="mt-3 leading-7 text-body">{category.description}</p>
                </div>
                <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {products.map((product) => <DataDeskProductCard key={product.slug} product={product} />)}
                </div>
              </div>
            </section>
          );
        })}

        <section className="border-t border-border bg-ink py-12 text-white md:py-16">
          <div className="container-shell grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.12em] text-blue-200">Built for credibility</p>
              <h2 className="mt-3 text-3xl font-bold">Sources, limitations and corrections will be public.</h2>
              <p className="mt-4 max-w-[760px] leading-7 text-slate-200">
                Live products will use versioned source records, freshness checks and a manual review path for safety,
                emergency, regulatory and water-quality changes. Stale data will be labeled unavailable rather than current.
              </p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 p-6">
              <h3 className="font-bold">Looking for current homeowner guidance?</h3>
              <p className="mt-2 text-sm leading-6 text-slate-200">The existing guide library is published and available now.</p>
              <Link className="mt-4 inline-flex font-bold text-white underline underline-offset-4" href="/guides">Browse homeowner guides</Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
