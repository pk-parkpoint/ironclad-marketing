import { BLOG_POSTS } from "@/content/blog-posts";
import { LOCATIONS } from "@/content/locations";
import { STATIC_ROUTE_PATHS } from "@/lib/routes";
import { SERVICES } from "@/content/services";
import { CANONICAL_ORIGIN } from "@/lib/site-url";

export type SitemapEntry = {
  path: string;
  lastModified: string;
  changeFrequency: "daily" | "weekly" | "monthly";
  priority: number;
};

function buildTimestamp(): string {
  return new Date().toISOString();
}

function normalizePath(path: string): string {
  if (!path) {
    return "/";
  }
  return path.startsWith("/") ? path : `/${path}`;
}

export function getSitemapBaseUrl(): string {
  return CANONICAL_ORIGIN.replace(/\/+$/, "");
}

export function buildCoreSitemapEntries(): SitemapEntry[] {
  const lastModified = buildTimestamp();
  const routes = [
    "/",
    "/commercial-plumbing/austin-tx",
    "/resources",
    ...STATIC_ROUTE_PATHS.map((path) => normalizePath(path)),
  ];
  return routes.map((path) => ({
    changeFrequency: path === "/" ? "daily" : "weekly",
    lastModified,
    path,
    priority: path === "/" ? 1 : 0.85,
  }));
}

export function buildServiceSitemapEntries(): SitemapEntry[] {
  const lastModified = buildTimestamp();
  return SERVICES.map((service) => ({
    changeFrequency: "weekly",
    lastModified,
    path: `/plumbing/${service.slug}`,
    priority: 0.82,
  }));
}

export function buildServiceAreaSitemapEntries(): SitemapEntry[] {
  const lastModified = buildTimestamp();
  return LOCATIONS.map((location) => ({
    changeFrequency: "weekly",
    lastModified,
    path: `/service-area/${location.slug}`,
    priority: 0.8,
  }));
}

export function buildArticleSitemapEntries(): SitemapEntry[] {
  const lastModified = buildTimestamp();
  return BLOG_POSTS.map((post) => ({
    changeFrequency: "monthly",
    lastModified,
    path: `/blog/${post.slug}`,
    priority: 0.68,
  }));
}

export function toAbsoluteSitemapUrl(path: string): string {
  const normalized = normalizePath(path);
  return normalized === "/" ? getSitemapBaseUrl() : `${getSitemapBaseUrl()}${normalized}`;
}

export function buildSitemapGroups() {
  return {
    articles: buildArticleSitemapEntries(),
    core: buildCoreSitemapEntries(),
    serviceAreas: buildServiceAreaSitemapEntries(),
    services: buildServiceSitemapEntries(),
  };
}
