import { GUIDE_ROUTE_PATHS } from "@/content/guides";
import { TOP_QUESTIONS_GUIDE_PATH } from "@/content/aeo-top-questions";
import { QUESTION_ROUTE_PATHS } from "@/components/questions/question-data";
import { BLOG_POSTS } from "@/content/blog-posts";
import { LOCAL_NEIGHBORHOOD_PAGES } from "@/content/local-pages";
import { LOCATIONS } from "@/content/locations";
import { getPpcServiceRouteEntries } from "@/content/ppc-service-variants";
import { STATIC_ROUTE_PATHS } from "@/lib/routes";
import { SERVICES } from "@/content/services";
import { CANONICAL_ORIGIN } from "@/lib/site-url";

export type SitemapEntry = {
  path: string;
  lastModified: string;
  changeFrequency: "daily" | "weekly" | "monthly";
  priority: number;
};

const LASTMOD = {
  articles: "2026-03-16T00:00:00.000Z",
  core: "2026-05-26T00:00:00.000Z",
  guides: "2026-05-26T00:00:00.000Z",
  serviceAreas: "2026-07-12T00:00:00.000Z",
  services: "2026-04-23T00:00:00.000Z",
} as const;

const ROUTE_LASTMOD_OVERRIDES: Record<string, string> = {
  [TOP_QUESTIONS_GUIDE_PATH]: "2026-05-26T00:00:00.000Z",
  "/faq/plumbing": "2026-05-26T00:00:00.000Z",
  "/guides": "2026-05-26T00:00:00.000Z",
};

function normalizePath(path: string): string {
  if (!path) {
    return "/";
  }
  return path.startsWith("/") ? path : `/${path}`;
}

export function getSitemapBaseUrl(): string {
  return CANONICAL_ORIGIN.replace(/\/+$/, "");
}

function getRouteLastModified(path: string, fallback: string): string {
  return ROUTE_LASTMOD_OVERRIDES[normalizePath(path)] ?? fallback;
}

function getServiceRoutePaths(): string[] {
  const paths = new Set(SERVICES.map((service) => `/plumbing/${service.slug}`));

  for (const entry of getPpcServiceRouteEntries()) {
    if (entry.path !== "/plumbing") {
      paths.add(entry.path);
    }
  }

  return [...paths];
}

export function buildCoreSitemapEntries(): SitemapEntry[] {
  const routes = [
    "/",
    "/commercial-plumbing/austin-tx",
    "/resources",
    "/site-map",
    ...STATIC_ROUTE_PATHS.map((path) => normalizePath(path)),
  ];
  return routes.map((path) => ({
    changeFrequency: path === "/" ? "daily" : "weekly",
    lastModified: getRouteLastModified(path, LASTMOD.core),
    path,
    priority: path === "/" ? 1 : 0.85,
  }));
}

export function buildServiceSitemapEntries(): SitemapEntry[] {
  return getServiceRoutePaths().map((path) => ({
    changeFrequency: "weekly",
    lastModified: getRouteLastModified(path, LASTMOD.services),
    path,
    priority: 0.82,
  }));
}

export function buildServiceAreaSitemapEntries(): SitemapEntry[] {
  const cityEntries: SitemapEntry[] = LOCATIONS.map((location) => ({
    changeFrequency: "weekly",
    lastModified: getRouteLastModified(`/service-area/${location.slug}`, LASTMOD.serviceAreas),
    path: `/service-area/${location.slug}`,
    priority: 0.8,
  }));
  const neighborhoodEntries: SitemapEntry[] = LOCAL_NEIGHBORHOOD_PAGES.map((page) => ({
    changeFrequency: "weekly",
    lastModified: getRouteLastModified(page.path, LASTMOD.serviceAreas),
    path: page.path,
    priority: 0.6,
  }));

  return [...cityEntries, ...neighborhoodEntries];
}

export function buildArticleSitemapEntries(): SitemapEntry[] {
  return BLOG_POSTS.map((post) => ({
    changeFrequency: "monthly",
    lastModified: getRouteLastModified(`/blog/${post.slug}`, LASTMOD.articles),
    path: `/blog/${post.slug}`,
    priority: 0.68,
  }));
}

export function buildGuideSitemapEntries(): SitemapEntry[] {
  const routes = ["/guides", TOP_QUESTIONS_GUIDE_PATH, ...GUIDE_ROUTE_PATHS, ...QUESTION_ROUTE_PATHS];

  return routes.map((path) => ({
    changeFrequency: "weekly",
    lastModified: getRouteLastModified(path, LASTMOD.guides),
    path,
    priority: path === "/guides" ? 0.86 : path === TOP_QUESTIONS_GUIDE_PATH ? 0.78 : 0.72,
  }));
}

export function toAbsoluteSitemapUrl(path: string): string {
  const normalized = normalizePath(path);
  return normalized === "/" ? getSitemapBaseUrl() : `${getSitemapBaseUrl()}${normalized}`;
}

export type ImageSitemapEntry = {
  pagePath: string;
  images: Array<{ path: string; caption: string }>;
};

export function buildImageSitemapEntries(): ImageSitemapEntry[] {
  const entries: ImageSitemapEntry[] = [];

  // Service page hero images
  const heroImages: Record<string, { file: string; alt: string }> = {
    repairs: { file: "plumbing-repairs.jpg", alt: "Plumbing repair technician working in Austin home" },
    "drain-clearing": { file: "drain-cleaning.jpg", alt: "Professional drain clearing service in Austin" },
    "sewer-services": { file: "sewer-line-services.jpg", alt: "Sewer camera and diagnostic equipment in Austin" },
    "water-heaters": { file: "water-heaters.jpg", alt: "Water heater installation and service in Austin" },
    fixtures: { file: "fixture-installation.jpg", alt: "Plumbing fixture installation in Austin bathroom" },
    emergency: { file: "emergency-plumbing.jpg", alt: "Emergency plumbing response in Austin" },
  };

  for (const service of SERVICES) {
    const hero = heroImages[service.slug];
    if (hero) {
      entries.push({
        pagePath: `/plumbing/${service.slug}`,
        images: [{ path: `/media/services/${hero.file}`, caption: hero.alt }],
      });
    }
  }

  // Homepage OG image
  entries.push({
    pagePath: "/",
    images: [{ path: "/og/ironclad-default.png", caption: "Ironclad Plumbing — Austin licensed plumber" }],
  });

  return entries;
}

export function buildSitemapGroups() {
  return {
    articles: buildArticleSitemapEntries(),
    core: buildCoreSitemapEntries(),
    guides: buildGuideSitemapEntries(),
    serviceAreas: buildServiceAreaSitemapEntries(),
    services: buildServiceSitemapEntries(),
  };
}

export function getLatestLastModified(entries: SitemapEntry[]): string {
  return entries.reduce((latest, entry) => {
    return Date.parse(entry.lastModified) > Date.parse(latest) ? entry.lastModified : latest;
  }, "1970-01-01T00:00:00.000Z");
}
