import type { MetadataRoute } from "next";
import { CANONICAL_HOST, CANONICAL_ORIGIN } from "@/lib/site-url";

const SEARCH_AND_ANSWER_CRAWLERS = [
  "Googlebot",
  "Bingbot",
  "OAI-SearchBot",
  "PerplexityBot",
  "Claude-SearchBot",
] as const;

const AI_CRAWLERS = [
  "GPTBot",
  "ClaudeBot",
  "CCBot",
] as const;

const USER_TRIGGERED_AI_FETCHERS = [
  "ChatGPT-User",
  "Claude-User",
] as const;

const AI_PRODUCT_TOKENS = [
  "Google-Extended",
] as const;

function getBaseUrl(): string {
  // Canonicalize robots.txt to the production origin to avoid indexing duplicates (www, preview domains).
  return CANONICAL_ORIGIN;
}

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();

  return {
    rules: [
      {
        userAgent: [...SEARCH_AND_ANSWER_CRAWLERS],
        allow: "/",
      },
      {
        userAgent: [...AI_CRAWLERS],
        allow: "/",
      },
      {
        userAgent: [...USER_TRIGGERED_AI_FETCHERS, ...AI_PRODUCT_TOKENS],
        allow: "/",
      },
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
