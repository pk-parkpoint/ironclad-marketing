import Link from "next/link";
import { ArrowUpRight, Database } from "lucide-react";
import type { CSSProperties } from "react";
import type { DataDeskExperience, DataDeskProduct } from "@/content/data-desk";

export function DataDeskHubCard({ experience, product }: { experience: DataDeskExperience; product: DataDeskProduct }) {
  const style = { "--rc": experience.accent, "--rc2": experience.accent2 } as CSSProperties;
  return (
    <Link className="dd-hub-card" data-reveal href={`/data/${product.slug}`} style={style}>
      <div className="dd-hub-card-top"><span><Database aria-hidden="true" size={19} /></span><small>{String(product.rank).padStart(2, "0")}</small></div>
      <p>{product.category.replaceAll("-", " ")}</p>
      <h3>{product.shortTitle}</h3>
      <span className="dd-hub-summary">{product.summary}</span>
      <div className="dd-hub-scores"><span>Citation {product.citationPotential}/5</span><span>Embed {product.embedPotential}/5</span></div>
      <strong>Open interactive preview <ArrowUpRight aria-hidden="true" size={16} /></strong>
    </Link>
  );
}
