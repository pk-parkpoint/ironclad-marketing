import { buildServiceAreaSitemapEntries } from "@/lib/sitemap-data";
import { buildSitemapXml, xmlResponse } from "@/app/sitemaps/_shared";

export function GET() {
  return xmlResponse(buildSitemapXml(buildServiceAreaSitemapEntries()));
}
