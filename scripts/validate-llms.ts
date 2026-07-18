import { existsSync, readFileSync } from "node:fs";
import {
  TOP_QUESTIONS_GUIDE_PATH,
  TOP_QUESTIONS_GUIDE_TITLE,
} from "../content/aeo-top-questions";
import { LOCATIONS } from "../content/locations";
import { getPpcServiceRouteEntries } from "../content/ppc-service-variants";
import { SERVICES } from "../content/services";

const BASE_URL = "https://ironcladtexas.com";
const REQUIRED_LANDING_HEADINGS = [
  "## Canonical Site",
  "## Business Context",
  "## Core Pages",
  "## Top Answer Pages",
  "## Service Pages",
  "## High-Value Service Areas",
  "## Crawl And Indexing Notes",
];
const REQUIRED_FULL_HEADINGS = [
  "## Business Facts",
  "## Top Questions",
  "## Priority Guide Summaries",
  "## Official Source Index",
];
const REQUIRED_PATHS = [
  "/",
  "/llms-full.txt",
  "/plumbing",
  "/commercial-plumbing",
  "/service-area",
  "/questions",
  "/faq/plumbing",
  "/guides",
  TOP_QUESTIONS_GUIDE_PATH,
  "/guides/what-plumbing-costs-austin",
  "/guides/questions-to-ask-your-plumber",
  "/guides/plumbing-emergency-first-10-minutes",
  ...SERVICES.map((service) => `/plumbing/${service.slug}`),
  ...getPpcServiceRouteEntries().map((entry) => entry.path),
  ...LOCATIONS.slice(0, 10).map((location) => `/service-area/${location.slug}`),
];

function fail(message: string): never {
  console.error(`llms audit failed: ${message}`);
  process.exit(1);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    fail(message);
  }
}

function readRequiredFile(path: string): string {
  assert(existsSync(path), `${path} is missing`);
  const source = readFileSync(path, "utf8");
  assert(source.trim().length > 0, `${path} is empty`);
  return source;
}

function extractMarkdownLinks(source: string): Array<{ label: string; url: string }> {
  return [...source.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)].map((match) => ({
    label: match[1],
    url: match[2],
  }));
}

function canonicalUrl(path: string): string {
  return path === "/" ? BASE_URL : `${BASE_URL}${path}`;
}

function validateCanonicalLinks(source: string, path: string): Set<string> {
  const links = extractMarkdownLinks(source);
  assert(links.length > 0, `${path} must contain markdown links`);

  const canonicalUrls = new Set<string>();
  for (const link of links) {
    assert(link.label.trim().length > 0, `${path} contains an empty link label`);
    assert(!link.url.includes(" "), `${path} contains a URL with spaces: ${link.url}`);
    if (link.url.startsWith(BASE_URL)) {
      assert(!link.url.endsWith("/") || link.url === `${BASE_URL}/`, `${path} URL has trailing slash: ${link.url}`);
      canonicalUrls.add(link.url.replace(/\/$/, ""));
    }
  }
  return canonicalUrls;
}

function main() {
  const llms = readRequiredFile("public/llms.txt");
  const full = readRequiredFile("public/llms-full.txt");

  assert(llms.startsWith("# Ironclad Plumbing\n"), "llms.txt must start with '# Ironclad Plumbing'");
  assert(llms.includes("\n> Ironclad Plumbing"), "llms.txt must include a blockquote summary");
  for (const heading of REQUIRED_LANDING_HEADINGS) {
    assert(llms.includes(heading), `llms.txt missing ${heading}`);
  }
  assert(llms.includes(TOP_QUESTIONS_GUIDE_TITLE), "llms.txt missing top-questions hub title");

  assert(
    full.startsWith("# Ironclad Plumbing Full LLM Context\n"),
    "llms-full.txt must start with the full-context H1",
  );
  for (const heading of REQUIRED_FULL_HEADINGS) {
    assert(full.includes(heading), `llms-full.txt missing ${heading}`);
  }
  assert(full.includes("Official references:"), "llms-full.txt must include official references per answer");

  const llmsUrls = validateCanonicalLinks(llms, "public/llms.txt");
  validateCanonicalLinks(full, "public/llms-full.txt");
  assert(!llmsUrls.has(`${BASE_URL}/faq`), "llms.txt must not link to the /faq redirect alias");

  for (const path of REQUIRED_PATHS) {
    const expected = canonicalUrl(path).replace(/\/$/, "");
    assert(llmsUrls.has(expected), `llms.txt missing canonical route ${expected}`);
  }

  console.log(
    `llms audit passed: ${REQUIRED_PATHS.length} required routes, ${extractMarkdownLinks(full).length} full-context links`,
  );
}

main();
