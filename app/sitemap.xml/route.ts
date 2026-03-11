import { getSitemapBaseUrl } from "@/lib/sitemap-data";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function GET() {
  const base = getSitemapBaseUrl();
  const now = new Date().toISOString();
  const sitemapPaths = [
    "/sitemaps/core.xml",
    "/sitemaps/guides.xml",
    "/sitemaps/services.xml",
    "/sitemaps/service-areas.xml",
    "/sitemaps/articles.xml",
    "/sitemaps/images.xml",
  ];

  const body = sitemapPaths
    .map((path) => {
      const loc = escapeXml(`${base}${path}`);
      return [
        "  <sitemap>",
        `    <loc>${loc}</loc>`,
        `    <lastmod>${escapeXml(now)}</lastmod>`,
        "  </sitemap>",
      ].join("\n");
    })
    .join("\n");

  const xml = [
    "<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
    "<sitemapindex xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">",
    body,
    "</sitemapindex>",
  ].join("\n");

  return new Response(xml, {
    headers: {
      "cache-control": "public, max-age=3600, s-maxage=3600",
      "content-type": "application/xml; charset=utf-8",
    },
  });
}
