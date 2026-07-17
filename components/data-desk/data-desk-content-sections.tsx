import Link from "next/link";
import { Braces, ChartNoAxesCombined, FileText, Image as ImageIcon, Info, RefreshCw } from "lucide-react";
import type { DataDeskCategory, DataDeskProduct } from "@/content/data-desk";

const NEWSROOM_ITEMS = [
  { title: "Responsive embed", body: "Drop the interactive card into a partner story or resident resource.", code: "<iframe src=\"…/embed\">", icon: ChartNoAxesCombined },
  { title: "Broadcast graphic", body: "Use continuously refreshed 16:9 and social-ready visuals.", code: "…/graphic-16x9.png", icon: ImageIcon },
  { title: "Machine-readable", body: "Analyze the same versioned release through documented JSON and CSV.", code: "…/latest.json · .csv", icon: Braces },
  { title: "Methodology & archive", body: "Check sources, definitions, corrections and every prior public release.", code: "…/methodology", icon: FileText },
];

function audienceBody(audience: string, product: DataDeskProduct): string {
  return `${audience} can use ${product.shortTitle} as a source-linked starting point for ${product.editorialUse.charAt(0).toLowerCase()}${product.editorialUse.slice(1)}`;
}

type DataDeskContentSectionsProps = {
  category?: DataDeskCategory;
  product: DataDeskProduct;
  relatedProducts: DataDeskProduct[];
};

export function DataDeskContentSections({ category, product, relatedProducts }: DataDeskContentSectionsProps) {
  const signalCards = [
    ...product.signals.map((signal) => ({ title: signal, body: `A clearly labeled view of ${signal.toLowerCase()}, with its source and freshness visible.` })),
    { title: "Practical context", body: product.editorialUse },
  ];

  return (
    <>
      <section className="dd-paper-section">
        <div className="dd-container">
          <div className="dd-light-heading" data-reveal><p>What it shows</p><h2>Four signals, one usable local picture.</h2></div>
          <div className="dd-four-grid">
            {signalCards.map((card) => <article className="dd-content-card" data-reveal key={card.title}><i /><h3>{card.title}</h3><p>{card.body}</p></article>)}
          </div>
        </div>
      </section>

      <section className="dd-dark-section">
        <div className="dd-container dd-how-grid">
          <div data-reveal><p className="dd-eyebrow">How it works</p><h2>Built to show its work.</h2><p>{product.editorialUse} Every published value will carry a source, timestamp, release version and visible limitation.</p></div>
          <aside className="dd-how-card ic-glass" data-reveal>
            <h3>Built from</h3><div className="dd-source-chips">{product.sources.map((source) => <span key={source}>{source}</span>)}</div>
            <p><RefreshCw aria-hidden="true" size={16} /><strong>Update cadence</strong>{product.cadence}</p>
          </aside>
        </div>
      </section>

      <section className="dd-paper-section">
        <div className="dd-container">
          <div className="dd-light-heading" data-reveal><p>Who cites or embeds it</p><h2>Made for the people explaining Austin homes.</h2></div>
          <div className="dd-three-grid">{product.audiences.map((audience) => <article className="dd-audience-card" data-reveal key={audience}><h3>{audience}</h3><p>{audienceBody(audience, product)}</p></article>)}</div>
        </div>
      </section>

      <section className="dd-dark-section" id="newsroom">
        <div className="dd-container">
          <div className="dd-dark-heading" data-reveal><p>Newsroom package</p><h2>One documented release, four reusable formats.</h2><span>Preview endpoints are intentionally inactive until validated live data launches.</span></div>
          <div className="dd-four-grid dd-newsroom-grid">
            {NEWSROOM_ITEMS.map(({ body, code, icon: Icon, title }) => <article className="dd-newsroom-card ic-glass" data-reveal key={title}><span><Icon aria-hidden="true" size={21} /></span><h3>{title}</h3><p>{body}</p><code>{code}</code></article>)}
          </div>
        </div>
      </section>

      <section className="dd-methodology">
        <div className="dd-container">
          <div className="dd-light-heading" data-reveal><p>Methodology</p><h2>Sources, cadence and limitations stay attached.</h2></div>
          <div className="dd-method-grid">
            <div data-reveal><h3>Sources</h3><ul>{product.sources.map((source) => <li key={source}>{source}</li>)}</ul></div>
            <div data-reveal><h3>Update cadence</h3><p>{product.cadence}</p></div>
            <div data-reveal><h3>Limitations</h3><p>{product.guardrail}</p></div>
          </div>
          <p className="dd-attribution" data-reveal><Info aria-hidden="true" size={17} />Free to embed or reproduce with visible attribution to Ironclad Plumbing and a link to the canonical Data Desk release.</p>
          <nav aria-label="Related Data Desk products" className="dd-related" data-reveal>
            <div><h3>Related Data Desk products</h3>{relatedProducts.map((related) => <Link href={`/data/${related.slug}`} key={related.slug}>{related.shortTitle} <span>→</span></Link>)}</div>
            <div><h3>Published guidance available now</h3>{category?.relatedGuideLinks.map((guide) => <Link href={guide.href} key={guide.href}>{guide.label} <span>→</span></Link>)}</div>
          </nav>
        </div>
      </section>
    </>
  );
}
