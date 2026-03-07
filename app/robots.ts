import type { MetadataRoute } from "next";
import { CANONICAL_HOST, CANONICAL_ORIGIN } from "@/lib/site-url";

function getBaseUrl(): string {
  // Canonicalize robots.txt to the production origin to avoid indexing duplicates (www, preview domains).
  return CANONICAL_ORIGIN;
}

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/preview/",
          "/staging/",
          "/test/",
          "/book/confirmation",
          "/*?preview=*",
          "/*?staging=*",
          "/*?test=*",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    // "Host" is not used by Google, but keep it syntactically correct for other crawlers.
    host: CANONICAL_HOST,
  };
}
