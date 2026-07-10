import { BLOG_POSTS } from "../content/blog-posts";
import { GUIDE_ROUTE_PATHS } from "../content/guides";
import { TOP_QUESTIONS_GUIDE_PATH } from "../content/aeo-top-questions";
import { LOCATIONS } from "../content/locations";
import { getPpcServiceRouteEntries } from "../content/ppc-service-variants";
import { SERVICES } from "../content/services";
import robots from "../app/robots";
import { STATIC_ROUTE_PATHS } from "../lib/routes";
import {
  buildArticleSitemapEntries,
  buildCoreSitemapEntries,
  buildGuideSitemapEntries,
  buildServiceAreaSitemapEntries,
  buildServiceSitemapEntries,
  getSitemapBaseUrl,
  toAbsoluteSitemapUrl,
} from "../lib/sitemap-data";

function fail(message: string): never {
  console.error(`sitemap/robots audit failed: ${message}`);
  process.exit(1);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    fail(message);
  }
}

function getBaseUrl(): string {
  return getSitemapBaseUrl();
}

function normalizePath(path: string): string {
  if (!path) {
    return "/";
  }
  return path.startsWith("/") ? path : `/${path}`;
}

function routeToUrl(baseUrl: string, route: string): string {
  return route === "/" ? baseUrl : `${baseUrl}${route}`;
}

function entryToUrl(entry: { path: string }): string {
  return toAbsoluteSitemapUrl(entry.path);
}

function asArray<T>(value: T | T[] | undefined): T[] {
  if (value === undefined) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}

function main() {
  const baseUrl = getBaseUrl();
  const requiredAllowedCrawlerTokens = [
    "OAI-SearchBot",
    "Claude-SearchBot",
    "ChatGPT-User",
    "Claude-User",
    "Google-Extended",
  ];
  const expectedRoutes = new Set<string>([
    "/",
    ...STATIC_ROUTE_PATHS.map((path) => normalizePath(path)),
    ...SERVICES.map((service) => `/plumbing/${service.slug}`),
    ...getPpcServiceRouteEntries().map((entry) => entry.path),
    ...LOCATIONS.map((location) => `/service-area/${location.slug}`),
    ...BLOG_POSTS.map((post) => `/blog/${post.slug}`),
    "/guides",
    TOP_QUESTIONS_GUIDE_PATH,
    ...GUIDE_ROUTE_PATHS,
  ]);
  const expectedUrls = new Set([...expectedRoutes].map((route) => routeToUrl(baseUrl, route)));

  const sitemapEntries = [
    ...buildCoreSitemapEntries(),
    ...buildServiceSitemapEntries(),
    ...buildServiceAreaSitemapEntries(),
    ...buildArticleSitemapEntries(),
    ...buildGuideSitemapEntries(),
  ];
  assert(sitemapEntries.length > 0, "sitemap must contain at least one entry");

  const sitemapUrls = sitemapEntries.map((entry) => entryToUrl(entry));
  const uniqueSitemapUrls = new Set(sitemapUrls);
  assert(
    uniqueSitemapUrls.size === sitemapUrls.length,
    "sitemap contains duplicate URL entries",
  );

  for (const url of sitemapUrls) {
    if (url !== baseUrl && url.endsWith("/")) {
      fail(`sitemap URL has trailing slash: ${url}`);
    }
  }

  for (const expectedUrl of expectedUrls) {
    if (!uniqueSitemapUrls.has(expectedUrl)) {
      fail(`missing sitemap URL: ${expectedUrl}`);
    }
  }

  const topQuestionsEntry = sitemapEntries.find((entry) => entry.path === TOP_QUESTIONS_GUIDE_PATH);
  assert(topQuestionsEntry, "top plumbing questions hub must be in sitemap");
  assert(
    topQuestionsEntry.lastModified.startsWith("2026-05-26"),
    "top plumbing questions hub must carry its route-level lastmod",
  );

  const robotsConfig = robots();
  const rules = asArray(robotsConfig.rules);
  assert(rules.length > 0, "robots rules must be defined");

  const allowedCrawlerTokens = new Set<string>();
  for (const rule of rules) {
    const allowPaths = asArray(rule.allow);
    if (!allowPaths.includes("/")) {
      continue;
    }

    for (const userAgent of asArray(rule.userAgent)) {
      allowedCrawlerTokens.add(userAgent);
    }
  }

  for (const crawlerToken of requiredAllowedCrawlerTokens) {
    assert(
      allowedCrawlerTokens.has(crawlerToken),
      `robots must explicitly allow '${crawlerToken}'`,
    );
  }

  const wildcardRule = rules.find((rule) => {
    const userAgent = rule.userAgent;
    if (typeof userAgent === "string") {
      return userAgent === "*";
    }
    if (Array.isArray(userAgent)) {
      return userAgent.includes("*");
    }
    return false;
  });
  assert(wildcardRule, "robots must define wildcard user-agent rule");

  const allowPaths = asArray(wildcardRule.allow);
  assert(allowPaths.includes("/"), "robots wildcard rule must allow '/'");

  const disallowPaths = asArray(wildcardRule.disallow);
  assert(
    disallowPaths.includes("/api/") &&
      disallowPaths.includes("/preview/") &&
      disallowPaths.includes("/staging/"),
    "robots wildcard rule must block api/preview/staging paths",
  );

  const sitemapReferences = asArray(robotsConfig.sitemap);
  assert(
    sitemapReferences.includes(`${baseUrl}/sitemap.xml`),
    "robots must reference sitemap.xml",
  );

  console.log(
    `sitemap/robots audit passed: ${sitemapEntries.length} sitemap URLs, robots disallow=${disallowPaths.join(",")}`,
  );
}

main();
