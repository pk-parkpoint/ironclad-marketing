import { GUIDE_ROUTE_PATHS } from "@/content/guides";
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

/** Fixed deploy date — update when content changes substantially. Avoids noisy
 *  crawl signaling from stamping every URL with "right now" on each build. */
const CONTENT_LAST_MODIFIED = "2026-03-16T00:00:00.000Z";

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
  const lastModified = CONTENT_LAST_MODIFIED;
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
  const lastModified = CONTENT_LAST_MODIFIED;
  return SERVICES.map((service) => ({
    changeFrequency: "weekly",
    lastModified,
    path: `/plumbing/${service.slug}`,
    priority: 0.82,
  }));
}

export function buildServiceAreaSitemapEntries(): SitemapEntry[] {
  const lastModified = CONTENT_LAST_MODIFIED;
  return LOCATIONS.map((location) => ({
    changeFrequency: "weekly",
    lastModified,
    path: `/service-area/${location.slug}`,
    priority: 0.8,
  }));
}

export function buildArticleSitemapEntries(): SitemapEntry[] {
  const lastModified = CONTENT_LAST_MODIFIED;
  return BLOG_POSTS.map((post) => ({
    changeFrequency: "monthly",
    lastModified,
    path: `/blog/${post.slug}`,
    priority: 0.68,
  }));
}

export function buildGuideSitemapEntries(): SitemapEntry[] {
  const lastModified = CONTENT_LAST_MODIFIED;
  const routes = ["/guides", ...GUIDE_ROUTE_PATHS];

  return routes.map((path) => ({
    changeFrequency: "weekly",
    lastModified,
    path,
    priority: path === "/guides" ? 0.86 : 0.72,
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
    "drain-cleaning": { file: "drain-cleaning.jpg", alt: "Professional drain cleaning service in Austin" },
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
