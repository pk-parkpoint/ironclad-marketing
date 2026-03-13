import "server-only";

import fs from "node:fs";
import path from "node:path";
import MarkdownIt from "markdown-it";
import { GUIDE_ENTRIES, GUIDE_ENTRY_BY_SLUG, GUIDE_HUB_GROUPS, type GuideEntry } from "@/content/guides";
import {
  PRICING_SERVICE_GUIDE_SPECS,
  PRICING_SERVICE_GUIDE_SPECS_BY_SLUG,
  type PricingServiceGuideSpec,
} from "@/content/pricing-service-guides";

export type GuideTocItem = {
  depth: 2 | 3;
  id: string;
  title: string;
};

export type GuidePageData = {
  slug: string;
  title: string;
  routeLabel: string;
  hubGroup: GuideEntry["hubGroup"];
  path: string;
  description: string;
  eyebrow: string;
  publishedDate: string;
  publishedLabel: string;
  updatedDate: string;
  updatedLabel: string;
  html: string;
  articleText: string;
  toc: GuideTocItem[];
  relatedGuides: GuideEntry[];
  prevGuide: GuideEntry | null;
  nextGuide: GuideEntry | null;
};

const GUIDE_SOURCE_PATH = path.join(process.cwd(), "docs/seo/Ironclad_FINAL_CONTENT.md");
const GUIDE_SOURCE = fs.readFileSync(GUIDE_SOURCE_PATH, "utf8");
const PUBLISHED_DATE = "2026-03-11";
const PUBLISHED_LABEL = "March 11, 2026";
const UPDATED_DATE = "2026-03-13";
const UPDATED_LABEL = "March 13, 2026";

const GROUP_EYEBROW: Record<GuideEntry["hubGroup"], string> = {
  pricing: "Pricing Guide",
  "before-hire": "Consumer Guide",
  comparisons: "Decision Guide",
  reference: "Austin Reference",
  "cost-guides": "Cost Guide",
  "replacement-signs": "Replacement Guide",
  tools: "Tool & Download",
};

const RELATED_GUIDE_OVERRIDES: Partial<Record<string, string[]>> = {
  "what-plumbing-costs-austin": [
    "how-plumbing-pricing-works",
    "how-to-read-a-plumbing-estimate",
    "questions-to-ask-your-plumber",
  ],
  "how-plumbing-pricing-works": [
    "what-plumbing-costs-austin",
    "plumbing-pricing-tricks",
    "how-to-read-a-plumbing-estimate",
  ],
  "questions-to-ask-your-plumber": ["plumber-red-flags", "how-to-research-a-plumber", "plumber-call-script"],
  "plumber-red-flags": ["questions-to-ask-your-plumber", "how-to-research-a-plumber", "plumbing-pricing-tricks"],
  "how-to-research-a-plumber": [
    "questions-to-ask-your-plumber",
    "plumber-red-flags",
    "how-to-read-a-plumbing-estimate",
  ],
  "plumbing-emergency-first-10-minutes": [
    "winter-plumbing-prep-austin",
    "slab-leak-signs-austin",
    "what-plumbing-costs-austin",
  ],
  "slab-leak-signs-austin": ["leak-detection-cost-austin", "slab-leak-repair-options", "slab-leak-reroute-cost-austin"],
  tools: ["plumber-call-script", "questions-to-ask-your-plumber", "before-the-plumber-arrives"],
};

const markdown = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
});

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildRouteMarkdownMap(source: string): Map<string, string> {
  const matches = [...source.matchAll(/^`\/guides\/([^`]+)`$/gm)];
  const entries = new Map<string, string>();

  matches.forEach((match, index) => {
    const slug = match[1];
    const matchIndex = match.index ?? 0;
    const lineEnd = source.indexOf("\n", matchIndex);
    const blockStart = lineEnd === -1 ? matchIndex + match[0].length : lineEnd + 1;
    const blockEnd = index + 1 < matches.length ? matches[index + 1].index ?? source.length : source.length;
    const block = source.slice(blockStart, blockEnd).trim();
    entries.set(slug, block);
  });

  return entries;
}

function trimTrailingPageBoundary(markdownSource: string): string {
  return markdownSource
    .replace(/\n---\n---\n\n# (?:PART|PAGE|ARTICLE|ARTICLES|COMPARISON|GUIDES HUB PAGE)\b[\s\S]*$/m, "")
    .trim();
}

function removeSection(markdownSource: string, heading: string): string {
  const pattern = new RegExp(`^## ${escapeRegex(heading)}\\n[\\s\\S]*?(?=^## |\\Z)`, "gm");
  return markdownSource.replace(pattern, "").trim();
}

function sanitizeGuideMarkdown(markdownSource: string, slug: string): string {
  let sanitized = trimTrailingPageBoundary(markdownSource);

  sanitized = sanitized
    .replace(/^## H1:.*$/gm, "")
    .replace(/^\[If applicable,.*$/gm, "")
    .replace(/^\[INSERT.*$/gm, "")
    .replace(/^## TLDR$/gm, "## Quick Answer")
    .replace(/^# Ironclad Open Price Guide.*$/gm, "")
    .replace(/^## Services [0-9-]+$/gm, "")
    .replace(/^Ironclad Plumbing publishes this guide because /gm, "Ironclad Plumbing publishes this guide because ")
    .trim();

  if (slug === "what-plumbing-costs-austin") {
    const blockedSections = [
      "Updated Quick-Scan Table (Full 30 Services)",
      "Additional Quick-Scan Table Rows",
      "Updated Quick-Scan Table Rows (Services 31-40)",
      "Updated Quick-Scan Table Rows (Services 41-50)",
      "Full Price Guide Now Covers 40 Services",
      "Full Price Guide Now Covers 50 Services",
    ];

    blockedSections.forEach((heading) => {
      sanitized = removeSection(sanitized, heading);
    });
  }

  return sanitized.replace(/\n{3,}/g, "\n\n").trim();
}

function extractTitle(markdownSource: string, fallback: string): string {
  const match = markdownSource.match(/^## H1:\s*(.+)$/m);
  return match?.[1]?.trim() || fallback;
}

function stripMarkdown(value: string): string {
  return value
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
    .replace(/[*_>#-]/g, " ")
    .replace(/\|/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractDescription(markdownSource: string, fallback: string): string {
  const lines = markdownSource.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith("|") || trimmed === "---") {
      continue;
    }
    const plain = stripMarkdown(trimmed);
    if (plain.length >= 80) {
      return plain;
    }
  }
  return fallback;
}

function collectHeadingIds(markdownSource: string): GuideTocItem[] {
  const seen = new Map<string, number>();
  const headings: GuideTocItem[] = [];

  for (const line of markdownSource.split("\n")) {
    const match = line.match(/^(##|###)\s+(.*)$/);
    if (!match) {
      continue;
    }

    const raw = stripMarkdown(match[2]);
    if (!raw) {
      continue;
    }

    const base = slugify(raw);
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    headings.push({
      depth: match[1] === "##" ? 2 : 3,
      id: count === 0 ? base : `${base}-${count + 1}`,
      title: raw,
    });
  }

  return headings;
}

markdown.renderer.rules.heading_open = (
  tokens: Array<{ content?: string; attrSet: (name: string, value: string) => void }>,
  index: number,
  _options: unknown,
  _env: unknown,
  self: { renderToken: (tokens: unknown, index: number, options: unknown) => string },
) => {
  const title = tokens[index + 1]?.content ?? "section";
  const env = (_env || {}) as { headingIds?: Map<string, number> };
  env.headingIds ??= new Map<string, number>();
  const base = slugify(title);
  const count = env.headingIds.get(base) ?? 0;
  env.headingIds.set(base, count + 1);
  tokens[index].attrSet("id", count === 0 ? base : `${base}-${count + 1}`);
  return self.renderToken(tokens, index, _options);
};

function renderMarkdown(markdownSource: string): string {
  return markdown.render(markdownSource, { headingIds: new Map<string, number>() });
}

function buildIndexMap<T extends { slug: string }>(items: T[]): Map<string, T> {
  return new Map(items.map((item) => [item.slug, item]));
}

const SOURCE_ROUTE_MARKDOWN_BY_SLUG = buildRouteMarkdownMap(GUIDE_SOURCE);
const GUIDE_ENTRY_BY_GROUP = new Map(
  GUIDE_HUB_GROUPS.map((group) => [
    group.id,
    GUIDE_ENTRIES.filter((entry) => entry.hubGroup === group.id),
  ]),
);

function getPrevAndNext(entry: GuideEntry): { prevGuide: GuideEntry | null; nextGuide: GuideEntry | null } {
  const index = GUIDE_ENTRIES.findIndex((candidate) => candidate.slug === entry.slug);
  return {
    prevGuide: index > 0 ? GUIDE_ENTRIES[index - 1] : null,
    nextGuide: index >= 0 && index < GUIDE_ENTRIES.length - 1 ? GUIDE_ENTRIES[index + 1] : null,
  };
}

function resolveRelatedGuides(entry: GuideEntry): GuideEntry[] {
  const overrideSlugs = RELATED_GUIDE_OVERRIDES[entry.slug];
  const defaultSlugs =
    overrideSlugs ??
    (entry.hubGroup === "cost-guides"
      ? ["what-plumbing-costs-austin", "how-plumbing-pricing-works", "how-to-read-a-plumbing-estimate"]
      : (GUIDE_ENTRY_BY_GROUP.get(entry.hubGroup) ?? [])
          .filter((candidate) => candidate.slug !== entry.slug)
          .slice(0, 3)
          .map((candidate) => candidate.slug));

  return defaultSlugs
    .map((slug) => GUIDE_ENTRY_BY_SLUG.get(slug))
    .filter((guide): guide is GuideEntry => guide !== undefined)
    .filter((guide) => guide.slug !== entry.slug)
    .slice(0, 3);
}

function buildPricingServiceSummaryMarkdown(spec: PricingServiceGuideSpec): string {
  return [
    "## Quick price snapshot",
    "",
    "| Your Problem | What It's Called | Ironclad Price | Austin Range | Ask Why If Over |",
    "|---|---|---|---|---|",
    `| ${spec.problem} | ${spec.tableLabel} | **${spec.ironcladPrice}** | ${spec.austinRange} | ${spec.askWhyOver} |`,
    "",
  ].join("\n");
}

function buildPricingServiceOverviewMarkdown(spec: PricingServiceGuideSpec): string {
  return [
    "## What this price usually includes",
    "",
    `This page isolates Ironclad's published number for ${spec.tableLabel.toLowerCase()} so you can compare one quote against the Austin market before you book anyone.`,
    "",
    `At Ironclad, the published reference point is **${spec.ironcladPrice}**. The broader Austin range we track is **${spec.austinRange}**. If you are being quoted **${spec.askWhyOver.toLowerCase()}**, the burden is on the company to explain the access problem, code upgrade, emergency timing, or scope change that pushes it there.`,
    "",
    "## What moves the number up or down",
    "",
    "Final pricing usually changes for one of four reasons: access, material grade, code-driven add-ons, or bundled work discovered after diagnosis. A clean quote should spell out which of those is driving the difference instead of hiding it behind vague line items.",
    "",
  ].join("\n");
}

function buildPricingServiceCompareMarkdown(spec: PricingServiceGuideSpec): string {
  return [
    "## How to compare this quote",
    "",
    "Use this checklist before you approve the work:",
    "",
    `- Does the scope clearly match **${spec.problem.toLowerCase()}** or is the company quietly selling a bigger job?`,
    `- Are they showing why the quote is above **${spec.askWhyOver}** with photos, test results, or code notes?`,
    "- Are disposal, permit, restoration, and emergency premiums separated so you can see what is real and what is markup?",
    "- If another option exists, did they quote it side by side instead of forcing one path?",
    "",
    `If the answer is no, step back and compare against the full [Austin plumbing price guide](/guides/what-plumbing-costs-austin) before approving anything.`,
    "",
  ].join("\n");
}

function extractMasterPricingDetailMarkdown(sectionTitle: string): string | null {
  const master = SOURCE_ROUTE_MARKDOWN_BY_SLUG.get("what-plumbing-costs-austin");
  if (!master) {
    return null;
  }

  const pattern = new RegExp(
    `^### ${escapeRegex(sectionTitle)}\\n[\\s\\S]*?(?=^### |^## |\\Z)`,
    "m",
  );
  const match = master.match(pattern);

  if (!match) {
    return null;
  }

  return match[0].replace(new RegExp(`^### ${escapeRegex(sectionTitle)}\\n+`), "## Detailed breakdown\n\n").trim();
}

function linkMasterPricingGuideMarkdown(markdownSource: string): string {
  let linked = markdownSource;

  for (const spec of PRICING_SERVICE_GUIDE_SPECS) {
    const rowPattern = new RegExp(
      `\\| ${escapeRegex(spec.problem)} \\| ${escapeRegex(spec.tableLabel)} \\|`,
      "g",
    );
    linked = linked.replace(rowPattern, `| ${spec.problem} | [${spec.tableLabel}](/guides/${spec.slug}) |`);

    if (spec.detailHeading) {
      linked = linked.replace(
        new RegExp(`^### ${escapeRegex(spec.detailHeading)}$`, "gm"),
        `### [${spec.detailHeading}](/guides/${spec.slug})`,
      );
    }
  }

  return linked;
}

function buildPricingServiceGuide(entry: GuideEntry): GuidePageData {
  const spec = PRICING_SERVICE_GUIDE_SPECS_BY_SLUG.get(entry.slug);
  if (!spec) {
    throw new Error(`Missing pricing guide spec for ${entry.slug}`);
  }

  const description = `${spec.problem}. Published Austin pricing for ${spec.tableLabel.toLowerCase()}, including Ironclad's reference number and what to question in an estimate.`;
  const sections = [
    buildPricingServiceSummaryMarkdown(spec),
    buildPricingServiceOverviewMarkdown(spec),
  ];

  const detailMarkdown = spec.detailHeading ? extractMasterPricingDetailMarkdown(spec.detailHeading) : null;
  if (detailMarkdown) {
    sections.push(detailMarkdown);
  }

  sections.push(buildPricingServiceCompareMarkdown(spec));
  const markdownSource = sections.join("\n");
  const toc = collectHeadingIds(markdownSource);
  const { prevGuide, nextGuide } = getPrevAndNext(entry);

  return {
    slug: entry.slug,
    title: spec.title,
    routeLabel: entry.routeLabel,
    hubGroup: entry.hubGroup,
    path: `/guides/${entry.slug}`,
    description,
    eyebrow: GROUP_EYEBROW[entry.hubGroup],
    publishedDate: PUBLISHED_DATE,
    publishedLabel: PUBLISHED_LABEL,
    updatedDate: UPDATED_DATE,
    updatedLabel: UPDATED_LABEL,
    html: renderMarkdown(markdownSource),
    articleText: stripMarkdown(markdownSource),
    toc,
    relatedGuides: resolveRelatedGuides(entry),
    prevGuide,
    nextGuide,
  };
}

function buildSourceGuide(entry: GuideEntry): GuidePageData {
  const rawMarkdown = SOURCE_ROUTE_MARKDOWN_BY_SLUG.get(entry.slug);
  if (!rawMarkdown) {
    throw new Error(`Missing source markdown for ${entry.slug}`);
  }

  let markdownSource = sanitizeGuideMarkdown(rawMarkdown, entry.slug);
  const title = extractTitle(rawMarkdown, entry.title);

  if (entry.slug === "what-plumbing-costs-austin") {
    markdownSource = linkMasterPricingGuideMarkdown(markdownSource);
  }

  const description = extractDescription(markdownSource, `${title} by Ironclad Plumbing for Austin homeowners.`);
  const toc = collectHeadingIds(markdownSource);
  const { prevGuide, nextGuide } = getPrevAndNext(entry);

  return {
    slug: entry.slug,
    title,
    routeLabel: entry.routeLabel,
    hubGroup: entry.hubGroup,
    path: `/guides/${entry.slug}`,
    description,
    eyebrow: GROUP_EYEBROW[entry.hubGroup],
    publishedDate: PUBLISHED_DATE,
    publishedLabel: PUBLISHED_LABEL,
    updatedDate: UPDATED_DATE,
    updatedLabel: UPDATED_LABEL,
    html: renderMarkdown(markdownSource),
    articleText: stripMarkdown(markdownSource),
    toc,
    relatedGuides: resolveRelatedGuides(entry),
    prevGuide,
    nextGuide,
  };
}

const GUIDE_PAGES = GUIDE_ENTRIES.map((entry) =>
  PRICING_SERVICE_GUIDE_SPECS_BY_SLUG.has(entry.slug) ? buildPricingServiceGuide(entry) : buildSourceGuide(entry),
);

const GUIDE_PAGE_BY_SLUG = buildIndexMap(GUIDE_PAGES);

export function getGuidePageData(slug: string): GuidePageData | null {
  return GUIDE_PAGE_BY_SLUG.get(slug) ?? null;
}

export function getAllGuidePages(): GuidePageData[] {
  return GUIDE_PAGES;
}
