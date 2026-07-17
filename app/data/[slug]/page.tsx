import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { DataDeskContentSections } from "@/components/data-desk/data-desk-content-sections";
import { DataDeskHeader } from "@/components/data-desk/data-desk-header";
import { DataDeskHero } from "@/components/data-desk/data-desk-hero";
import { DataDeskPoweredFooter } from "@/components/data-desk/data-desk-powered-footer";
import { DataDeskTool } from "@/components/data-desk/data-desk-tool";
import { StructuredData } from "@/components/seo/structured-data";
import {
  DATA_DESK_CATEGORY_BY_ID,
  DATA_DESK_EXPERIENCE_BY_SLUG,
  DATA_DESK_PRODUCT_BY_SLUG,
  DATA_DESK_PRODUCTS,
  getDataDeskRelatedProducts,
} from "@/content/data-desk";
import { getPublicContactInfo } from "@/lib/contact";
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

export default async function DataDeskProductPage({ params }: DataDeskRouteProps) {
  const { slug } = await params;
  const product = DATA_DESK_PRODUCT_BY_SLUG.get(slug);
  const experience = DATA_DESK_EXPERIENCE_BY_SLUG.get(slug);
  if (!product || !experience) notFound();
  const category = DATA_DESK_CATEGORY_BY_ID.get(product.category);
  const { phoneHref } = getPublicContactInfo();
  const style = { "--rc": experience.accent, "--rc2": experience.accent2 } as CSSProperties;

  return (
    <div className="dd-page" style={style}>
      <StructuredData data={buildDataDeskProductSchema(product)} id={`data-desk-product-${product.rank}`} />
      <DataDeskHeader />
      <main>
        <DataDeskHero experience={experience} product={product} />
        <DataDeskTool experience={experience} phoneHref={phoneHref} />
        <DataDeskContentSections category={category} product={product} relatedProducts={getDataDeskRelatedProducts(product)} />
      </main>
      <DataDeskPoweredFooter />
    </div>
  );
}
