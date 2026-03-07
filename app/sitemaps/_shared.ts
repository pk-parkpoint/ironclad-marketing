import type { SitemapEntry } from "@/lib/sitemap-data";
import { toAbsoluteSitemapUrl } from "@/lib/sitemap-data";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function buildSitemapXml(entries: SitemapEntry[]): string {
  const body = entries
    .map((entry) => {
      const loc = escapeXml(toAbsoluteSitemapUrl(entry.path));
      const lastmod = escapeXml(entry.lastModified);
      return [
        "  <url>",
        `    <loc>${loc}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        `    <changefreq>${entry.changeFrequency}</changefreq>`,
        `    <priority>${entry.priority.toFixed(2)}</priority>`,
        "  </url>",
      ].join("\n");
    })
    .join("\n");

  return [
    "<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
    "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">",
    body,
    "</urlset>",
  ].join("\n");
}

export function xmlResponse(xml: string): Response {
  return new Response(xml, {
    headers: {
      "cache-control": "public, max-age=3600, s-maxage=3600",
      "content-type": "application/xml; charset=utf-8",
    },
  });
}
