import { BLOG_POSTS } from "../content/blog-posts";
import { LOCATIONS } from "../content/locations";
import { getPpcServiceRouteEntries } from "../content/ppc-service-variants";
import { SERVICES } from "../content/services";
import { STATIC_PAGES } from "../content/static-pages";
import {
  NOINDEX_FOLLOW_ROBOTS,
  type OgTemplate,
  type OgType,
} from "../lib/seo";
import type { Metadata } from "next";

export type MetadataEntry = {
  route: string;
  title: string;
  description: string;
  ogTemplate: OgTemplate;
  ogType: OgType;
  robots?: Metadata["robots"];
};

function getOgTemplateForStaticPath(pathname: string): OgTemplate {
  if (
    pathname === "commercial-plumbing" ||
    pathname === "plumbing" ||
    pathname.startsWith("plumbing/")
  ) {
    return "service";
  }
  if (pathname === "service-area" || pathname.startsWith("service-area/")) {
    return "location";
  }
  if (
    pathname === "blog" ||
    pathname.startsWith("blog/") ||
    pathname === "faq" ||
    pathname.startsWith("faq/") ||
    pathname === "plumbing-guides"
  ) {
    return "blog";
  }
  return "default";
}

function buildServiceEntries(): MetadataEntry[] {
  const entries = new Map<string, MetadataEntry>();

  for (const service of SERVICES) {
    entries.set(`/plumbing/${service.slug}`, {
      route: `/plumbing/${service.slug}`,
      title: service.titleTag,
      description: service.metaDescription,
      ogTemplate: "service",
      ogType: "website",
    });
  }

  for (const { path: route, service } of getPpcServiceRouteEntries()) {
    if (route === "/plumbing") continue;
    entries.set(route, {
      route,
      title: service.titleTag,
      description: service.metaDescription,
      ogTemplate: "service",
      ogType: "website",
    });
  }

  return [...entries.values()];
}

export function buildMetadataAuditEntries(): MetadataEntry[] {
  return [
    {
      route: "/",
      title: "Ironclad Plumbing | Austin's Modern Plumbing Company",
      description:
        "Licensed Austin plumber with on-time arrival windows, upfront pricing, and a written workmanship warranty.",
      ogTemplate: "default",
      ogType: "website",
    },
    ...STATIC_PAGES.map((page) => ({
      route: `/${page.path}`,
      title: page.titleTag,
      description: page.metaDescription,
      ogTemplate: getOgTemplateForStaticPath(page.path),
      ogType: "website" as const,
      robots: page.path === "book" ? NOINDEX_FOLLOW_ROBOTS : undefined,
    })),
    ...buildServiceEntries(),
    ...LOCATIONS.map((location) => ({
      route: `/service-area/${location.slug}`,
      title: location.titleTag,
      description: location.metaDescription,
      ogTemplate: "location" as const,
      ogType: "website" as const,
    })),
    ...BLOG_POSTS.map((post) => ({
      route: `/blog/${post.slug}`,
      title: post.titleTag,
      description: post.metaDescription,
      ogTemplate: "blog" as const,
      ogType: "article" as const,
    })),
    {
      route: "/404",
      title: "Page Not Found | Ironclad Plumbing",
      description:
        "The page you requested could not be found. Explore services, locations, or contact Ironclad Plumbing.",
      ogTemplate: "default",
      ogType: "website",
    },
  ];
}
