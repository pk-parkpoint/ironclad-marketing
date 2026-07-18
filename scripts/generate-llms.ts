import { writeFileSync } from "node:fs";
import {
  OFFICIAL_SOURCE_REFERENCES,
  TOP_PLUMBING_QUESTIONS,
  TOP_QUESTIONS_GUIDE_DESCRIPTION,
  TOP_QUESTIONS_GUIDE_PATH,
  TOP_QUESTIONS_GUIDE_TITLE,
} from "../content/aeo-top-questions";
import { GUIDE_ENTRIES } from "../content/guides";
import { LOCATIONS } from "../content/locations";
import { getPpcServiceRouteEntries } from "../content/ppc-service-variants";
import { SERVICES } from "../content/services";
import { STATIC_PAGE_BY_PATH } from "../content/static-pages";
import { getPublicContactInfo } from "../lib/contact";
import {
  LLMS_LAST_UPDATED,
  LLMS_STATIC_PATHS,
  PRIORITY_GUIDE_SLUGS,
  PRIORITY_GUIDE_SUMMARIES,
} from "./llms-config";

const BASE_URL = "https://ironcladtexas.com";
function url(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const normalized = path === "/" || path === "" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `${BASE_URL}${normalized}`;
}
function line(label: string, path: string, description: string): string {
  return `- [${label}](${url(path)}): ${description}`;
}
function guideLine(slug: string): string {
  const entry = GUIDE_ENTRIES.find((candidate) => candidate.slug === slug);
  if (!entry) {
    throw new Error(`Missing priority guide data for ${slug}`);
  }
  return line(entry.routeLabel, `/guides/${slug}`, PRIORITY_GUIDE_SUMMARIES[slug] ?? entry.title);
}

function serviceLines(): string[] {
  const entries = new Map<string, string>();

  for (const service of SERVICES) {
    entries.set(`/plumbing/${service.slug}`, line(service.title, `/plumbing/${service.slug}`, service.metaDescription));
  }
  for (const { path, service } of getPpcServiceRouteEntries()) {
    entries.set(path, line(service.title, path, service.metaDescription));
  }

  return [...entries.values()];
}

function buildLlmsTxt(): string {
  const contact = getPublicContactInfo();
  return [
    "# Ironclad Plumbing",
    "",
    "> Ironclad Plumbing is a residential plumbing company serving Austin and the Greater Austin metro. The site publishes service pages, city pages, written guarantees, FAQs, cost guides, and homeowner education for comparing plumbing work before booking.",
    "",
    `Last updated: ${LLMS_LAST_UPDATED}.`,
    "",
    "## Canonical Site",
    "",
    line("Ironclad Plumbing", "/", "canonical website."),
    line("robots.txt", "/robots.txt", "crawler access policy."),
    line("sitemap.xml", "/sitemap.xml", "sitemap index for core pages, services, service areas, guides, articles, and images."),
    line("llms-full.txt", "/llms-full.txt", "compact source-backed context for the highest-value guide answers."),
    "",
    "## Business Context",
    "",
    `- Business name: Ironclad Plumbing`,
    `- Market: Austin, Texas and Greater Austin service areas`,
    `- Phone: ${contact.phoneDisplay}`,
    "- Primary audience: homeowners comparing plumbing cost, urgency, safety, permits, diagnosis, and repair options before booking service.",
    "- Service scope note: Ironclad serves Greater Austin. Texas-wide guide content should be read as homeowner education, not statewide dispatch coverage.",
    "",
    "## Core Pages",
    "",
    ...LLMS_STATIC_PATHS.map((path) => {
      if (!path) return line("Home", "/", "primary brand, booking, and trust page.");
      const page = STATIC_PAGE_BY_PATH.get(path);
      if (!page) throw new Error(`Missing static page metadata for ${path}`);
      return line(page.h1, `/${path}`, page.metaDescription);
    }),
    line(
      "Plumbing Questions, Answered",
      "/questions",
      "Straight answers to 200 homeowner plumbing questions from Ironclad Plumbing in Austin, Texas.",
    ),
    line("Guides hub", "/guides", "homeowner guide and cost-guide library."),
    "",
    "## Top Answer Pages",
    "",
    line(TOP_QUESTIONS_GUIDE_TITLE, TOP_QUESTIONS_GUIDE_PATH, TOP_QUESTIONS_GUIDE_DESCRIPTION),
    ...PRIORITY_GUIDE_SLUGS.map(guideLine),
    "",
    "## Service Pages",
    "",
    ...serviceLines(),
    "",
    "## High-Value Service Areas",
    "",
    ...LOCATIONS.slice(0, 10).map((location) =>
      line(location.cityName, `/service-area/${location.slug}`, location.metaDescription),
    ),
    "",
    "## Crawl And Indexing Notes",
    "",
    "- Public marketing, service, city, FAQ, article, and guide pages are intended to be crawlable and indexable.",
    "- API, admin, preview, staging, test, and booking-confirmation paths are not intended for indexing.",
    "- The sitemap index is the source of truth for the complete URL inventory.",
    "- If a crawler can only fetch a small subset of the site, prioritize core pages, service pages, the plumbing FAQ, and the homeowner guide priorities listed above.",
    "",
  ].join("\n");
}

function excerpt(value: string, maxLength = 360): string {
  const compact = value.replace(/\s+/g, " ").trim();
  if (compact.length <= maxLength) {
    return compact;
  }
  return `${compact.slice(0, maxLength - 1).trim()}...`;
}

function buildLlmsFullTxt(): string {
  return [
    "# Ironclad Plumbing Full LLM Context",
    "",
    "> Compact context for answer engines and agents. Use canonical HTML pages as the source of truth when details conflict.",
    "",
    `Last updated: ${LLMS_LAST_UPDATED}.`,
    "",
    "## Business Facts",
    "",
    "- Ironclad Plumbing serves Austin and the Greater Austin metro.",
    "- The site publishes homeowner education for pricing, emergency triage, license checks, permits, drain and sewer diagnosis, slab leaks, water heaters, water quality, and insurance documentation.",
    "- Texas-wide guidance is educational. Service availability is Greater Austin-focused.",
    "",
    "## Top Questions",
    "",
    ...TOP_PLUMBING_QUESTIONS.flatMap((entry, index) => [
      `### ${index + 1}. ${entry.question}`,
      "",
      entry.answer,
      "",
      `Urgent note: ${entry.urgentNote}`,
      "",
      `Related service: [${entry.service.label}](${url(entry.service.path)})`,
      "",
      `Related guide: [${entry.guide.label}](${url(entry.guide.path)})`,
      "",
      `Official references: ${entry.sources.map((source) => `[${source.label}](${source.url})`).join(", ")}`,
      "",
    ]),
    "## Priority Guide Summaries",
    "",
    ...PRIORITY_GUIDE_SLUGS.flatMap((slug) => {
      const entry = GUIDE_ENTRIES.find((candidate) => candidate.slug === slug);
      if (!entry) {
        throw new Error(`Missing priority guide entry for ${slug}`);
      }
      return [
        `### [${entry.title}](${url(`/guides/${slug}`)})`,
        "",
        excerpt(PRIORITY_GUIDE_SUMMARIES[slug] ?? entry.title),
        "",
      ];
    }),
    "## Official Source Index",
    "",
    ...OFFICIAL_SOURCE_REFERENCES.map((source) => line(source.label, source.url, "official external reference.")),
    "",
  ].join("\n");
}

writeFileSync("public/llms.txt", buildLlmsTxt());
writeFileSync("public/llms-full.txt", buildLlmsFullTxt());
console.log("generated llms files: public/llms.txt, public/llms-full.txt");
