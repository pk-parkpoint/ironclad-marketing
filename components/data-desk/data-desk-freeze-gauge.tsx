import { Info, Phone } from "lucide-react";
import type { CSSProperties } from "react";
import type { DataDeskResult } from "@/content/data-desk";

export function DataDeskFreezeGauge({ phoneHref, result }: { phoneHref: string; result: DataDeskResult }) {
  const score = Number.parseInt(result.values[0] ?? "0", 10) || 0;
  const circumference = 302;
  const offset = circumference - (circumference * score) / 100;
  const conditions = (result.values[1] ?? "").split("·").map((item) => item.trim());
  const zips = (result.values[3] ?? "").split("·").map((item) => item.trim());
  const actions = (result.values[4] ?? "").split("·").map((item) => item.trim());
  const bars = [38, 44, 51, 62, 74, 86, 96, 88, 70, 58, 46, 40].map((height) => Math.max(18, Math.round((height * Math.max(score, 28)) / 83)));
  const ramp = score >= 75 ? ["#1E5FD6", "#3DD6E6"] : score >= 55 ? ["#2F8FE0", "#5AC8EC"] : score >= 35 ? ["#5AACE6", "#8FD6F0"] : ["#86C7EE", "#BEE4F7"];
  const freezeStyle = { "--freeze1": ramp[0], "--freeze2": ramp[1] } as CSSProperties;

  return (
    <div aria-live="polite" className="dd-result-card dd-freeze-result ic-glass" style={freezeStyle}>
      <div className="dd-result-head">
        <div><span>Live scenario</span><h3>{result.title} freeze risk</h3></div>
        <strong className="dd-status dd-status-freeze">{result.tag}</strong>
      </div>
      <div className="dd-freeze-summary">
        <div className="dd-gauge" aria-label={`${score} out of 100`}>
          <svg viewBox="0 0 120 120" role="img">
            <circle className="dd-gauge-track" cx="60" cy="60" fill="none" r="48" strokeWidth="10" />
            <circle key={score} className="dd-gauge-fill" cx="60" cy="60" fill="none" r="48" strokeWidth="10" style={{ strokeDasharray: circumference, strokeDashoffset: offset }} />
          </svg>
          <span><strong>{score}</strong><small>/100</small></span>
        </div>
        <div className="dd-condition-grid">
          {conditions.map((condition) => <span key={condition}>{condition}</span>)}
          <p>{result.values[2]}</p>
        </div>
      </div>
      <div className="dd-freeze-chart" aria-label="Illustrative 48-hour risk trend">
        <div className="dd-chart-label"><span>48-hour risk window</span><span>Now →</span></div>
        <div className="dd-bars">{bars.map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div>
      </div>
      <div className="dd-freeze-lower">
        <div><h4>Neighborhood bands</h4><div className="dd-zip-grid">{zips.map((zip) => <span key={zip}><i />{zip}</span>)}</div></div>
        <div><h4>Do before the window</h4><ol>{actions.map((action) => <li key={action}>{action}</li>)}</ol></div>
      </div>
      <p className="dd-result-note"><Info aria-hidden="true" size={15} />Area conditions model only—not a property inspection or a guarantee that a pipe will freeze.</p>
      <div className="dd-result-actions">
        <a className="dd-green-button ic-cta" data-track-intent="phone" href={phoneHref}><Phone aria-hidden="true" size={17} />Talk to a plumber<span aria-hidden="true" className="ic-sheen" /></a>
        <a className="dd-ghost-button" href="#newsroom">Get the embed</a>
      </div>
    </div>
  );
}
