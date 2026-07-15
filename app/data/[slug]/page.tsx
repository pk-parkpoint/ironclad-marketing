import Link from "next/link";
import { notFound } from "next/navigation";
import { DataDeskBreadcrumbs } from "@/components/data-desk/data-desk-breadcrumbs";
import { DataDeskProductCard } from "@/components/data-desk/data-desk-product-card";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { StructuredData } from "@/components/seo/structured-data";
import {
  DATA_DESK_CATEGORY_BY_ID,
  DATA_DESK_PRODUCT_BY_SLUG,
  DATA_DESK_PRODUCTS,
  getDataDeskRelatedProducts,
} from "@/content/data-desk";
import { buildDataDeskProductSchema } from "@/lib/data-desk-schema";
import { buildPageMetadata } from "@/lib/seo";

type DataDeskRouteProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return DATA_DESK_PRODUCTS.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: DataDeskRouteProps) {
  const { slug } = await params;
  const product = DATA_DESK_PRODUCT_BY_SLUG.get(slug);
  if (!product) return {};

  return buildPageMetadata({
    title: product.metaTitle,
    description: product.metaDescription,
    path: `/data/${product.slug}`,
    ogTemplate: "blog",
    robots: { index: false, follow: true, googleBot: { index: false, follow: true } },
  });
}

const PLANNED_OUTPUTS = ["Canonical report and methodology", "Responsive partner embed", "Public JSON and CSV", "16:9 broadcast graphic"];

export default async function DataDeskProductPage({ params }: DataDeskRouteProps) {
  const { slug } = await params;
  const product = DATA_DESK_PRODUCT_BY_SLUG.get(slug);
  if (!product) notFound();

  const category = DATA_DESK_CATEGORY_BY_ID.get(product.category);
  const relatedProducts = getDataDeskRelatedProducts(product);

  return (
    <>
      <StructuredData data={buildDataDeskProductSchema(product)} id={`data-desk-product-${product.rank}`} />
      <SiteHeader />
      <main className="bg-soft-background">
        <section className="border-b border-border bg-white py-10 md:py-14">
          <div className="container-shell">
            <DataDeskBreadcrumbs current={product.shortTitle} />
            <div className="mt-8 max-w-[900px]">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-ink px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white">
                  Product {product.rank} of 25
                </span>
                <span className="rounded-full border border-border px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] text-body">
                  Template ready · data product in development
                </span>
              </div>
              <p className="mt-6 text-sm font-bold uppercase tracking-[0.12em] text-cta-blue">{category?.label}</p>
              <h1 className="mt-3 text-4xl font-bold leading-tight text-ink md:text-6xl">{product.title}</h1>
              <p className="mt-5 max-w-[800px] text-lg leading-8 text-body">{product.summary}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <span className="rounded-full bg-soft-background px-4 py-2 text-sm font-semibold text-ink">
                  Citation potential {product.citationPotential}/5
                </span>
                <span className="rounded-full bg-soft-background px-4 py-2 text-sm font-semibold text-ink">
                  Embed potential {product.embedPotential}/5
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container-shell grid gap-8 lg:grid-cols-[1.35fr_0.65fr]">
            <div className="space-y-8">
              <article className="rounded-2xl border border-border bg-white p-6 md:p-8">
                <p className="text-sm font-bold uppercase tracking-[0.12em] text-cta-blue">What it will show</p>
                <h2 className="mt-3 text-2xl font-bold text-ink">Planned signals and findings</h2>
                <ul className="mt-5 grid gap-3 p-0 sm:grid-cols-2">
                  {product.signals.map((signal) => (
                    <li className="flex list-none gap-3 rounded-xl bg-soft-background p-4 text-sm font-semibold text-ink" key={signal}>
                      <span aria-hidden="true" className="text-cta-blue">●</span>{signal}
                    </li>
                  ))}
                </ul>
              </article>

              <article className="rounded-2xl border border-border bg-white p-6 md:p-8">
                <p className="text-sm font-bold uppercase tracking-[0.12em] text-cta-blue">Publication package</p>
                <h2 className="mt-3 text-2xl font-bold text-ink">Four outputs from one documented source</h2>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {PLANNED_OUTPUTS.map((output) => (
                    <div className="rounded-xl border border-border p-4 text-sm font-semibold text-ink" key={output}>{output}</div>
                  ))}
                </div>
                <p className="mt-5 text-sm leading-6 text-body">
                  Download and embed endpoints will appear here only after the underlying data, validation and freshness monitoring are live.
                </p>
              </article>

              <article className="rounded-2xl border border-border bg-white p-6 md:p-8">
                <p className="text-sm font-bold uppercase tracking-[0.12em] text-cta-blue">Editorial value</p>
                <h2 className="mt-3 text-2xl font-bold text-ink">How partners could use it</h2>
                <p className="mt-4 leading-7 text-body">{product.editorialUse}</p>
                <h3 className="mt-6 font-bold text-ink">Intended audiences</h3>
                <ul className="mt-3 space-y-2 pl-5 text-sm leading-6 text-body">
                  {product.audiences.map((audience) => <li key={audience}>{audience}</li>)}
                </ul>
              </article>
            </div>

            <aside className="space-y-6">
              <section className="rounded-2xl border border-border bg-white p-6">
                <h2 className="text-lg font-bold text-ink">Planned data sources</h2>
                <ul className="mt-4 space-y-3 pl-5 text-sm leading-6 text-body">
                  {product.sources.map((source) => <li key={source}>{source}</li>)}
                </ul>
                <h3 className="mt-6 text-sm font-bold uppercase tracking-[0.1em] text-ink">Update cadence</h3>
                <p className="mt-2 text-sm leading-6 text-body">{product.cadence}</p>
              </section>

              <section className="rounded-2xl border border-amber-300 bg-amber-50 p-6">
                <h2 className="text-lg font-bold text-ink">Scope and limitation</h2>
                <p className="mt-3 text-sm leading-6 text-body">{product.guardrail}</p>
              </section>

              <section className="rounded-2xl border border-border bg-white p-6">
                <h2 className="text-lg font-bold text-ink">Published guidance available now</h2>
                <ul className="mt-4 space-y-3 p-0">
                  {category?.relatedGuideLinks.map((link) => (
                    <li className="list-none" key={link.href}>
                      <Link className="text-sm font-semibold text-cta-blue hover:underline" href={link.href}>{link.label} →</Link>
                    </li>
                  ))}
                </ul>
              </section>
            </aside>
          </div>
        </section>

        <section className="border-t border-border bg-white py-12 md:py-16">
          <div className="container-shell">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.12em] text-cta-blue">Continue exploring</p>
                <h2 className="mt-3 text-3xl font-bold text-ink">Related Data Desk products</h2>
              </div>
              <Link className="font-bold text-cta-blue hover:underline" href="/data">View all 25 products →</Link>
            </div>
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((related) => <DataDeskProductCard key={related.slug} product={related} />)}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
