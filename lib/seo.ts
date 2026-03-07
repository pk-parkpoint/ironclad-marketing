import type { Metadata } from "next";

export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

export const OG_IMAGE_BY_TEMPLATE = {
  // PNG is more broadly supported by link preview renderers (iMessage, Slack, etc.)
  default: "/og/ironclad-default.png",
  service: "/og/ironclad-service.png",
  location: "/og/ironclad-location.png",
  blog: "/og/ironclad-blog.png",
} as const;

export type OgTemplate = keyof typeof OG_IMAGE_BY_TEMPLATE;
export type OgType = "website" | "article";

export function normalizeCanonicalPath(path: string): string {
  const withLeadingSlash = path.startsWith("/") ? path : `/${path}`;
  if (withLeadingSlash === "/") {
    return withLeadingSlash;
  }
  return withLeadingSlash.replace(/\/+$/, "");
}

export function buildPageMetadata({
  title,
  description,
  path,
  ogTemplate = "default",
  ogType = "website",
  robots,
}: {
  title: string;
  description: string;
  path: string;
  ogTemplate?: OgTemplate;
  ogType?: OgType;
  robots?: Metadata["robots"];
}): Metadata {
  const canonical = normalizeCanonicalPath(path);
  const ogImage = OG_IMAGE_BY_TEMPLATE[ogTemplate];

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: ogType,
      title,
      description,
      url: canonical,
      images: [
        {
          url: ogImage,
          width: OG_IMAGE_WIDTH,
          height: OG_IMAGE_HEIGHT,
          alt: "Ironclad Plumbing",
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    ...(robots ? { robots } : {}),
  };
}
