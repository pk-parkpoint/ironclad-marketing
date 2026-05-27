import {
  buildArticleSitemapEntries,
  buildCoreSitemapEntries,
  buildGuideSitemapEntries,
  buildImageSitemapEntries,
  buildServiceAreaSitemapEntries,
  buildServiceSitemapEntries,
  getLatestLastModified,
  getSitemapBaseUrl,
} from "@/lib/sitemap-data";

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
  const sitemapPaths = [
    { lastmod: getLatestLastModified(buildCoreSitemapEntries()), path: "/sitemaps/core.xml" },
    { lastmod: getLatestLastModified(buildGuideSitemapEntries()), path: "/sitemaps/guides.xml" },
    { lastmod: getLatestLastModified(buildServiceSitemapEntries()), path: "/sitemaps/services.xml" },
    { lastmod: getLatestLastModified(buildServiceAreaSitemapEntries()), path: "/sitemaps/service-areas.xml" },
    { lastmod: getLatestLastModified(buildArticleSitemapEntries()), path: "/sitemaps/articles.xml" },
    { lastmod: getLatestLastModified(buildImageSitemapEntries().map((entry) => ({
      changeFrequency: "monthly",
      lastModified: "2026-04-23T00:00:00.000Z",
      path: entry.pagePath,
      priority: 0.5,
    }))), path: "/sitemaps/images.xml" },
  ];

  const body = sitemapPaths
    .map((entry) => {
      const loc = escapeXml(`${base}${entry.path}`);
      return [
        "  <sitemap>",
        `    <loc>${loc}</loc>`,
        `    <lastmod>${escapeXml(entry.lastmod)}</lastmod>`,
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
