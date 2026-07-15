import Link from "next/link";
import type { DataDeskProduct } from "@/content/data-desk";

export function DataDeskProductCard({ product }: { product: DataDeskProduct }) {
  return (
    <Link
      className="group flex h-full flex-col rounded-2xl border border-border bg-white p-6 transition hover:-translate-y-0.5 hover:border-cta-blue hover:shadow-lg"
      href={`/data/${product.slug}`}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs font-bold uppercase tracking-[0.12em] text-cta-blue">Product {product.rank}</span>
        <span className="rounded-full bg-soft-background px-3 py-1 text-xs font-semibold text-body">In development</span>
      </div>
      <h3 className="mt-4 text-xl font-bold leading-tight text-ink group-hover:text-cta-blue">{product.shortTitle}</h3>
      <p className="mt-3 flex-1 text-sm leading-6 text-body">{product.summary}</p>
      <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold text-body">
        <span className="rounded-full border border-border px-3 py-1">Citation {product.citationPotential}/5</span>
        <span className="rounded-full border border-border px-3 py-1">Embed {product.embedPotential}/5</span>
      </div>
      <span className="mt-5 text-sm font-bold text-cta-blue">View product plan →</span>
    </Link>
  );
}
