import { buildSitemapXml, xmlResponse } from "@/app/sitemaps/_shared";
import { buildGuideSitemapEntries } from "@/lib/sitemap-data";

export function GET() {
  return xmlResponse(buildSitemapXml(buildGuideSitemapEntries()));
}
