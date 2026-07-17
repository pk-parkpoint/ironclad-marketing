import Link from "next/link";
import { Activity, ArrowRight, Clock3, Database } from "lucide-react";
import type { DataDeskExperience, DataDeskProduct } from "@/content/data-desk";

function AccentHeadline({ headline, highlight }: { headline: string; highlight: string }) {
  const index = headline.toLowerCase().indexOf(highlight.toLowerCase());
  if (index < 0) return headline;
  return (
    <>
      {headline.slice(0, index)}
      <span className="dd-accent-text">{headline.slice(index, index + highlight.length)}</span>
      {headline.slice(index + highlight.length)}
    </>
  );
}

export function DataDeskHero({ experience, product }: { experience: DataDeskExperience; product: DataDeskProduct }) {
  return (
    <section className="dd-hero">
      <div aria-hidden="true" className="dd-conic-glow" />
      <div aria-hidden="true" className="dd-particles">
        {Array.from({ length: 5 }, (_, index) => <i key={index} />)}
      </div>
      <div className="dd-container dd-hero-grid" data-entrance>
        <div className="dd-hero-copy">
          <div className="dd-badge"><span className="ic-pulse-dot" />Austin Home Data Desk · Product {product.rank} of 25</div>
          <h1><AccentHeadline headline={experience.headline} highlight={experience.highlight} /></h1>
          <p className="dd-hero-subhead">{product.summary}</p>
          <p className="dd-cadence"><Clock3 aria-hidden="true" size={16} />{product.cadence}</p>
          <div className="dd-hero-actions">
            <a className="dd-green-button ic-cta" href="#newsroom">
              <Database aria-hidden="true" size={18} />Get the embed &amp; data<span aria-hidden="true" className="ic-sheen" />
            </a>
            <Link className="dd-ghost-button" href="/data">All data products <ArrowRight aria-hidden="true" size={17} /></Link>
          </div>
        </div>
        <aside className="dd-hero-panel ic-glass" aria-label={`${product.shortTitle} signature statistic`}>
          <span aria-hidden="true" className="dd-panel-glow" />
          <div className="dd-panel-top">
            <span className="dd-icon-tile"><Activity aria-hidden="true" size={22} /></span>
            <span className="dd-live-tag">Interactive preview</span>
          </div>
          <div className="dd-signature">
            <strong>{experience.signature.value}</strong>
            {experience.signature.unit ? <span>{experience.signature.unit}</span> : null}
          </div>
          <p>{experience.signature.label}</p>
          <div className="dd-stat-row">
            {experience.signature.stats.map((stat) => (
              <div key={stat.label}>
                <strong className={stat.count !== undefined ? "ic-count" : undefined} data-count={stat.count}>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
