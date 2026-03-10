import { buildImageSitemapEntries, getSitemapBaseUrl, toAbsoluteSitemapUrl } from "@/lib/sitemap-data";

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
  const entries = buildImageSitemapEntries();

  const body = entries
    .map((entry) => {
      const loc = escapeXml(toAbsoluteSitemapUrl(entry.pagePath));
      const imageElements = entry.images
        .map((img) => {
          const imgLoc = escapeXml(`${base}${img.path}`);
          const caption = escapeXml(img.caption);
          return [
            "    <image:image>",
            `      <image:loc>${imgLoc}</image:loc>`,
            `      <image:caption>${caption}</image:caption>`,
            "    </image:image>",
          ].join("\n");
        })
        .join("\n");

      return ["  <url>", `    <loc>${loc}</loc>`, imageElements, "  </url>"].join("\n");
    })
    .join("\n");

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
    body,
    "</urlset>",
  ].join("\n");

  return new Response(xml, {
    headers: {
      "cache-control": "public, max-age=3600, s-maxage=3600",
      "content-type": "application/xml; charset=utf-8",
    },
  });
}
