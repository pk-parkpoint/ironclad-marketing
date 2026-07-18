import { readFileSync } from "node:fs";
import path from "node:path";
import { GUIDE_ENTRIES } from "../content/guides";
import { PRICING_SERVICE_GUIDE_SPECS_BY_SLUG } from "../content/pricing-service-guides";
import {
  buildRouteMarkdownMap,
  extractDescription,
  sanitizeGuideMarkdown,
} from "../content/guide-source-markdown";

const EDITORIAL_MARKERS = [
  "IMPLEMENTATION NOTES",
  "CONSUMER TOOLKIT — Full-Length Guides",
  "PAGE METADATA: Reading Order",
];

function fail(message: string): never {
  console.error(`guide content audit failed: ${message}`);
  process.exit(1);
}

function main() {
  const source = readFileSync(path.join(process.cwd(), "docs/seo/Ironclad_FINAL_CONTENT.md"), "utf8");
  const sourceBySlug = buildRouteMarkdownMap(source);
  const descriptions = new Map<string, string[]>();
  let audited = 0;

  for (const guide of GUIDE_ENTRIES) {
    if (PRICING_SERVICE_GUIDE_SPECS_BY_SLUG.has(guide.slug)) {
      continue;
    }
    const sourceMarkdown = sourceBySlug.get(guide.slug);
    if (!sourceMarkdown) {
      fail(`missing source markdown for ${guide.path}`);
    }
    const markdown = sanitizeGuideMarkdown(sourceMarkdown, guide.slug);
    if (/^# /m.test(markdown)) {
      fail(`${guide.path} contains an H1 inside the article body`);
    }

    for (const marker of EDITORIAL_MARKERS) {
      if (markdown.includes(marker)) {
        fail(`${guide.path} exposes editorial marker ${JSON.stringify(marker)}`);
      }
    }

    const description = extractDescription(markdown, `${guide.title} by Ironclad Plumbing for Austin homeowners.`);
    const routes = descriptions.get(description) ?? [];
    descriptions.set(description, [...routes, guide.path]);
    audited += 1;
  }

  const duplicates = [...descriptions.entries()].filter(([, routes]) => routes.length > 1);
  if (duplicates.length > 0) {
    fail(
      `duplicate descriptions: ${duplicates
        .map(([description, routes]) => `${JSON.stringify(description)} => ${routes.join(", ")}`)
        .join(" | ")}`,
    );
  }

  console.log(`guide content audit passed: ${audited} source-backed guides`);
}

main();
