import type { DataDeskProduct } from "@/content/data-desk";

const SITE_URL = "https://ironcladtexas.com";

export function buildDataDeskHubSchema(products: DataDeskProduct[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Austin Home Data Desk",
    description:
      "Planned, source-documented Austin data products for home-system costs, risks, permits, water conditions and homeowner decisions.",
    url: `${SITE_URL}/data`,
    isPartOf: { "@type": "WebSite", name: "Ironclad Plumbing", url: SITE_URL },
    hasPart: {
      "@type": "ItemList",
      numberOfItems: products.length,
      itemListElement: products.map((product) => ({
        "@type": "ListItem",
        position: product.rank,
        name: product.title,
        url: `${SITE_URL}/data/${product.slug}`,
      })),
    },
  };
}

export function buildDataDeskProductSchema(product: DataDeskProduct) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: product.title,
    description: product.metaDescription,
    url: `${SITE_URL}/data/${product.slug}`,
    isPartOf: {
      "@type": "CollectionPage",
      name: "Austin Home Data Desk",
      url: `${SITE_URL}/data`,
    },
    about: product.signals.map((signal) => ({ "@type": "Thing", name: signal })),
    publisher: {
      "@type": "Organization",
      name: "Ironclad Plumbing",
      url: SITE_URL,
    },
  };
}
