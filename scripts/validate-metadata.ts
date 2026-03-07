import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { BLOG_POSTS } from "../content/blog-posts";
import { LOCATIONS } from "../content/locations";
import { SERVICES } from "../content/services";
import { STATIC_PAGES } from "../content/static-pages";
import {
  buildPageMetadata,
  OG_IMAGE_BY_TEMPLATE,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
  normalizeCanonicalPath,
  type OgTemplate,
  type OgType,
} from "../lib/seo";

type MetadataEntry = {
  route: string;
  title: string;
  description: string;
  ogTemplate: OgTemplate;
  ogType: OgType;
};

const REQUIRED_OG_DIMENSIONS = { width: 1200, height: 630 };
const REQUIRED_TWITTER_CARD = "summary_large_image";

function getOgTemplateForStaticPath(pathname: string): OgTemplate {
  if (pathname === "plumbing" || pathname.startsWith("plumbing/")) {
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

function buildEntries(): MetadataEntry[] {
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
    })),
    ...SERVICES.map((service) => ({
      route: `/plumbing/${service.slug}`,
      title: service.titleTag,
      description: service.metaDescription,
      ogTemplate: "service" as const,
      ogType: "website" as const,
    })),
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

function fail(message: string): never {
  console.error(`metadata audit failed: ${message}`);
  process.exit(1);
}

function readPngDimensions(diskPath: string): { width: number; height: number } {
  const buffer = readFileSync(diskPath);
  // PNG signature: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer.length < 24 ||
    buffer[0] !== 0x89 ||
    buffer[1] !== 0x50 ||
    buffer[2] !== 0x4e ||
    buffer[3] !== 0x47 ||
    buffer[4] !== 0x0d ||
    buffer[5] !== 0x0a ||
    buffer[6] !== 0x1a ||
    buffer[7] !== 0x0a
  ) {
    fail(`invalid PNG signature for ${diskPath}`);
  }

  const chunkType = buffer.toString("ascii", 12, 16);
  if (chunkType !== "IHDR") {
    fail(`PNG missing IHDR chunk for ${diskPath}`);
  }

  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

function readSvgDimensions(diskPath: string): { width: number; height: number } {
  const source = readFileSync(diskPath, "utf8");
  return {
    width: Number(source.match(/\bwidth="(\d+)"/)?.[1] ?? 0),
    height: Number(source.match(/\bheight="(\d+)"/)?.[1] ?? 0),
  };
}

function main() {
  const entries = buildEntries();

  if (entries.length === 0) {
    fail("no metadata entries found");
  }

  const seenRoutes = new Set<string>();
  const seenTitles = new Map<string, string[]>();
  const usedOgTemplates = new Set<OgTemplate>();

  if (
    OG_IMAGE_WIDTH !== REQUIRED_OG_DIMENSIONS.width ||
    OG_IMAGE_HEIGHT !== REQUIRED_OG_DIMENSIONS.height
  ) {
    fail(
      `OG image dimensions must be ${REQUIRED_OG_DIMENSIONS.width}x${REQUIRED_OG_DIMENSIONS.height}; got ${OG_IMAGE_WIDTH}x${OG_IMAGE_HEIGHT}`,
    );
  }

  for (const entry of entries) {
    if (!entry.title.trim()) {
      fail(`empty title for route ${entry.route}`);
    }
    if (!entry.description.trim()) {
      fail(`empty description for route ${entry.route}`);
    }
    if (entry.title.length > 60) {
      fail(`title exceeds 60 chars for ${entry.route} (${entry.title.length})`);
    }
    if (entry.description.length > 160) {
      fail(`description exceeds 160 chars for ${entry.route} (${entry.description.length})`);
    }
    if (seenRoutes.has(entry.route)) {
      fail(`duplicate route metadata entry for ${entry.route}`);
    }
    seenRoutes.add(entry.route);

    const metadata = buildPageMetadata({
      title: entry.title,
      description: entry.description,
      path: entry.route,
      ogTemplate: entry.ogTemplate,
      ogType: entry.ogType,
    });

    const canonicalRaw = metadata.alternates?.canonical;
    if (!canonicalRaw) {
      fail(`missing canonical URL for ${entry.route}`);
    }
    const canonicalUrl = typeof canonicalRaw === "string"
      ? canonicalRaw
      : canonicalRaw.toString();
    const expectedCanonical = normalizeCanonicalPath(entry.route);
    if (canonicalUrl !== expectedCanonical) {
      fail(`canonical mismatch for ${entry.route}; expected ${expectedCanonical}, got ${canonicalUrl}`);
    }
    if (canonicalUrl !== "/" && canonicalUrl.endsWith("/")) {
      fail(`canonical has trailing slash for ${entry.route}: ${canonicalUrl}`);
    }

    const openGraph = metadata.openGraph;
    if (!openGraph) {
      fail(`missing openGraph metadata for ${entry.route}`);
    }
    if (openGraph.title !== entry.title) {
      fail(`og:title mismatch for ${entry.route}`);
    }
    if (openGraph.description !== entry.description) {
      fail(`og:description mismatch for ${entry.route}`);
    }
    const openGraphType = "type" in openGraph ? openGraph.type : undefined;
    if (openGraphType !== entry.ogType) {
      fail(`og:type mismatch for ${entry.route}; expected ${entry.ogType}, got ${openGraphType}`);
    }
    const openGraphUrlRaw = "url" in openGraph ? openGraph.url : undefined;
    const openGraphUrl = openGraphUrlRaw
      ? typeof openGraphUrlRaw === "string"
        ? openGraphUrlRaw
        : openGraphUrlRaw.toString()
      : undefined;
    if (openGraphUrl !== expectedCanonical) {
      fail(`og:url mismatch for ${entry.route}; expected ${expectedCanonical}, got ${openGraphUrl}`);
    }

    const openGraphImagesRaw = "images" in openGraph ? openGraph.images : undefined;
    const openGraphImages = Array.isArray(openGraphImagesRaw)
      ? openGraphImagesRaw
      : [openGraphImagesRaw];
    const firstOpenGraphImage = openGraphImages[0];
    if (
      !firstOpenGraphImage ||
      typeof firstOpenGraphImage === "string" ||
      firstOpenGraphImage instanceof URL
    ) {
      fail(`missing structured og:image for ${entry.route}`);
    }

    const expectedImage = OG_IMAGE_BY_TEMPLATE[entry.ogTemplate];
    const openGraphImageUrl = typeof firstOpenGraphImage.url === "string"
      ? firstOpenGraphImage.url
      : firstOpenGraphImage.url.toString();
    if (openGraphImageUrl !== expectedImage) {
      fail(`og:image mismatch for ${entry.route}; expected ${expectedImage}, got ${openGraphImageUrl}`);
    }
    if (firstOpenGraphImage.width !== REQUIRED_OG_DIMENSIONS.width) {
      fail(
        `og:image width mismatch for ${entry.route}; expected ${REQUIRED_OG_DIMENSIONS.width}, got ${firstOpenGraphImage.width}`,
      );
    }
    if (firstOpenGraphImage.height !== REQUIRED_OG_DIMENSIONS.height) {
      fail(
        `og:image height mismatch for ${entry.route}; expected ${REQUIRED_OG_DIMENSIONS.height}, got ${firstOpenGraphImage.height}`,
      );
    }

    const twitter = metadata.twitter;
    if (!twitter) {
      fail(`missing twitter metadata for ${entry.route}`);
    }
    const twitterCard = "card" in twitter ? twitter.card : undefined;
    if (twitterCard !== REQUIRED_TWITTER_CARD) {
      fail(
        `twitter:card mismatch for ${entry.route}; expected ${REQUIRED_TWITTER_CARD}, got ${twitterCard}`,
      );
    }
    const twitterImagesRaw = "images" in twitter ? twitter.images : undefined;
    const twitterImages = Array.isArray(twitterImagesRaw) ? twitterImagesRaw : [twitterImagesRaw];
    if (!twitterImages[0] || twitterImages[0] !== expectedImage) {
      fail(`twitter:image mismatch for ${entry.route}; expected ${expectedImage}, got ${twitterImages[0]}`);
    }

    usedOgTemplates.add(entry.ogTemplate);
    const existing = seenTitles.get(entry.title) ?? [];
    seenTitles.set(entry.title, [...existing, entry.route]);
  }

  const duplicateTitles = [...seenTitles.entries()].filter(([, routes]) => routes.length > 1);
  if (duplicateTitles.length > 0) {
    const detail = duplicateTitles
      .map(([title, routes]) => `${JSON.stringify(title)} => ${routes.join(", ")}`)
      .join(" | ");
    fail(`duplicate titles detected: ${detail}`);
  }

  const requiredTemplates: OgTemplate[] = ["default", "service", "location", "blog"];
  for (const template of requiredTemplates) {
    if (!usedOgTemplates.has(template)) {
      fail(`missing OG template coverage for ${template}`);
    }
  }

  const uniqueImagePaths = new Set(
    [...usedOgTemplates].map((template) => OG_IMAGE_BY_TEMPLATE[template]),
  );
  for (const imagePath of uniqueImagePaths) {
    if (!imagePath.startsWith("/og/")) {
      fail(`og:image must be in /og/: ${imagePath}`);
    }
    const diskPath = path.join(process.cwd(), "public", imagePath.slice(1));
    if (!existsSync(diskPath)) {
      fail(`missing og:image asset at ${diskPath}`);
    }

    const ext = path.extname(diskPath).toLowerCase();
    const { width, height } = ext === ".png"
      ? readPngDimensions(diskPath)
      : ext === ".svg"
        ? readSvgDimensions(diskPath)
        : (() => fail(`unsupported og:image format for ${imagePath} (${ext || "no extension"})`))();
    if (width !== REQUIRED_OG_DIMENSIONS.width || height !== REQUIRED_OG_DIMENSIONS.height) {
      fail(
        `invalid og:image dimensions for ${imagePath}; expected ${REQUIRED_OG_DIMENSIONS.width}x${REQUIRED_OG_DIMENSIONS.height}, got ${width}x${height}`,
      );
    }
  }

  console.log(
    `metadata audit passed: ${entries.length} entries, ${uniqueImagePaths.size} OG templates, twitter card ${REQUIRED_TWITTER_CARD}`,
  );
}

main();
