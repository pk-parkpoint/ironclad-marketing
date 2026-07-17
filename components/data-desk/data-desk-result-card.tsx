import { Info, Phone } from "lucide-react";
import type { DataDeskResult } from "@/content/data-desk";

type DataDeskResultCardProps = {
  phoneHref: string;
  result: DataDeskResult;
  rowLabels: string[];
};

export function DataDeskResultCard({ phoneHref, result, rowLabels }: DataDeskResultCardProps) {
  return (
    <div aria-live="polite" className="dd-result-card ic-glass">
      <div className="dd-result-head">
        <div><span>Result</span><h3>{result.title}</h3></div>
        <strong className={`dd-status dd-status-${result.status}`}>{result.tag}</strong>
      </div>
      <dl className="dd-result-rows">
        {rowLabels.map((label, index) => (
          <div key={label}><dt>{label}</dt><dd>{result.values[index] ?? "—"}</dd></div>
        ))}
      </dl>
      <p className="dd-result-note"><Info aria-hidden="true" size={15} />{result.note ?? "Preview values show the product experience. Live releases will expose source links, timestamps and versioned assumptions."}</p>
      <div className="dd-result-actions">
        <a className="dd-green-button ic-cta" data-track-intent="phone" href={phoneHref}><Phone aria-hidden="true" size={17} />Talk to a plumber<span aria-hidden="true" className="ic-sheen" /></a>
        <a className="dd-ghost-button" href="#newsroom">Get the embed</a>
      </div>
    </div>
  );
}
