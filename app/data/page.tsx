import Link from "next/link";
import { ArrowRight, Braces, ChartNoAxesCombined, FileText, Radio } from "lucide-react";
import type { CSSProperties } from "react";
import { DataDeskHeader } from "@/components/data-desk/data-desk-header";
import { DataDeskHubCard } from "@/components/data-desk/data-desk-hub-card";
import { DataDeskPoweredFooter } from "@/components/data-desk/data-desk-powered-footer";
import { StructuredData } from "@/components/seo/structured-data";
import {
  DATA_DESK_CATEGORIES,
  DATA_DESK_EXPERIENCE_BY_SLUG,
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

const FORMATS = [
  { title: "Canonical report", text: "Findings, charts, methodology, sources and archived versions.", icon: FileText },
  { title: "Responsive embed", text: "A clean interactive card for newsrooms, HOAs and property partners.", icon: ChartNoAxesCombined },
  { title: "Public data", text: "Documented JSON and CSV releases for independent analysis and reuse.", icon: Braces },
  { title: "Broadcast graphic", text: "Continuously refreshed 16:9 and social-ready images.", icon: Radio },
];

export default function DataDeskHubPage() {
  const style = { "--rc": "#2F8FE0", "--rc2": "#38D6E0" } as CSSProperties;
  return (
    <div className="dd-page" style={style}>
      <StructuredData data={buildDataDeskHubSchema(DATA_DESK_PRODUCTS)} id="data-desk-collection-schema" />
      <DataDeskHeader />
      <main>
        <section className="dd-hub-hero">
          <div aria-hidden="true" className="dd-conic-glow" />
          <div className="dd-container dd-hub-hero-grid" data-entrance>
            <div>
              <span className="dd-badge"><span className="ic-pulse-dot" />25 interactive product previews</span>
              <h1>Austin Home <span className="dd-accent-text">Data Desk</span></h1>
              <p>Source-documented tools for home-system costs, risks, permits, water conditions and homeowner decisions—designed for residents, newsrooms and property professionals.</p>
              <div className="dd-hero-actions"><a className="dd-green-button ic-cta" href="#products">Browse all 25 products<ArrowRight size={17} /><span className="ic-sheen" /></a><Link className="dd-ghost-button" href="/guides">Published homeowner guides</Link></div>
            </div>
            <aside className="dd-hub-panel ic-glass">
              <div><strong className="ic-count" data-count="25">25</strong><span>products</span></div>
              <div><strong className="ic-count" data-count="5">5</strong><span>categories</span></div>
              <div><strong className="ic-count" data-count="4">4</strong><span>release formats</span></div>
              <p>Interactive previews are ready now. Public datasets remain clearly labeled prelaunch until validated sources and freshness monitors go live.</p>
            </aside>
          </div>
        </section>

        <section className="dd-paper-section">
          <div className="dd-container"><div className="dd-light-heading" data-reveal><p>One source, four useful formats</p><h2>Designed to be cited, embedded and independently checked.</h2></div><div className="dd-four-grid">{FORMATS.map(({ icon: Icon, text, title }) => <article className="dd-format-card" data-reveal key={title}><span><Icon size={21} /></span><h3>{title}</h3><p>{text}</p></article>)}</div></div>
        </section>

        <div id="products">
          {DATA_DESK_CATEGORIES.map((category, index) => (
            <section className={index % 2 === 0 ? "dd-hub-products" : "dd-hub-products dd-hub-products-paper"} id={category.id} key={category.id}>
              <div className="dd-container"><div className="dd-light-heading" data-reveal><p>{getDataDeskProductsByCategory(category.id).length} interactive products</p><h2>{category.label}</h2><span>{category.description}</span></div><div className="dd-hub-grid">{getDataDeskProductsByCategory(category.id).map((product) => { const experience = DATA_DESK_EXPERIENCE_BY_SLUG.get(product.slug); return experience ? <DataDeskHubCard experience={experience} key={product.slug} product={product} /> : null; })}</div></div>
            </section>
          ))}
        </div>

        <section className="dd-hub-close"><div className="dd-container" data-reveal><p>Built for credibility</p><h2>Sources, limitations and corrections stay public.</h2><span>Every live product will use versioned source records, freshness checks and a manual review path. Stale or unavailable information will never be presented as current.</span><Link href="/guides">Browse current homeowner guidance <ArrowRight size={17} /></Link></div></section>
      </main>
      <DataDeskPoweredFooter />
    </div>
  );
}
