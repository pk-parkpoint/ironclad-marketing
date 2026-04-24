import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { BLOG_POSTS } from "../content/blog-posts";

const APP_BUILD_DIR = path.join(process.cwd(), ".next", "server", "app");
const ALLOWED_NON_PAGE_PATHS = new Set(["/favicon.ico", "/robots.txt", "/sitemap.xml"]);
const REDIRECT_ONLY_ROUTES = new Set([
  "/plumbing-guides",
  ...BLOG_POSTS.map((post) => `/guides/${post.slug}`),
]);

type RouteAudit = {
  route: string;
  targets: string[];
  bookingLinks: number;
};

function fail(message: string): never {
  console.error(`internal link audit failed: ${message}`);
  process.exit(1);
}

function collectHtmlFiles(dir: string): string[] {
  const entries = readdirSync(dir);
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      files.push(...collectHtmlFiles(fullPath));
      continue;
    }
    if (fullPath.endsWith(".html")) {
      files.push(fullPath);
    }
  }

  return files;
}

function normalizePathTarget(href: string): string | null {
  if (!href) {
    return null;
  }
  if (href.startsWith("http://") || href.startsWith("https://") || href.startsWith("mailto:")) {
    return null;
  }
  if (href.startsWith("tel:") || href.startsWith("sms:") || href.startsWith("#")) {
    return null;
  }
  if (!href.startsWith("/")) {
    return null;
  }
  if (href.startsWith("//") || href.startsWith("/_next/")) {
    return null;
  }

  const noQuery = href.split("?")[0].split("#")[0];
  if (noQuery === "/") {
    return "/";
  }
  return noQuery.replace(/\/+$/, "");
}

function filePathToRoute(filePath: string): string {
  const relative = path.relative(APP_BUILD_DIR, filePath).replace(/\\/g, "/");
  const withoutExt = relative.replace(/\.html$/, "");

  if (withoutExt === "index") {
    return "/";
  }
  if (withoutExt === "_not-found") {
    return "/404";
  }
  return `/${withoutExt}`;
}

function extractTargets(html: string): string[] {
  const matches: string[] = [];
  const hrefRegex = /<a[^>]+href="([^"]+)"/g;
  const actionRegex = /action="([^"]+)"/g;

  let hrefMatch: RegExpExecArray | null;
  while ((hrefMatch = hrefRegex.exec(html)) !== null) {
    const normalized = normalizePathTarget(hrefMatch[1]);
    if (normalized) {
      matches.push(normalized);
    }
  }

  let actionMatch: RegExpExecArray | null;
  while ((actionMatch = actionRegex.exec(html)) !== null) {
    const normalized = normalizePathTarget(actionMatch[1]);
    if (normalized) {
      matches.push(normalized);
    }
  }

  return matches;
}

function main() {
  const htmlFiles = collectHtmlFiles(APP_BUILD_DIR);
  if (htmlFiles.length === 0) {
    fail("no built HTML files found; run `npm run build` first");
  }

  const audits: RouteAudit[] = htmlFiles.map((filePath) => {
    const html = readFileSync(filePath, "utf8");
    const route = filePathToRoute(filePath);
    const targets = extractTargets(html);
    const bookingLinks = targets.filter((target) => target === "/book").length;
    return { route, targets, bookingLinks };
  });

  const routeSet = new Set(audits.map((audit) => audit.route));
  const brokenTargets: Array<{ route: string; target: string }> = [];

  for (const audit of audits) {
    for (const target of audit.targets) {
      if (routeSet.has(target) || ALLOWED_NON_PAGE_PATHS.has(target)) {
        continue;
      }
      brokenTargets.push({ route: audit.route, target });
    }
  }

  if (brokenTargets.length > 0) {
    const detail = brokenTargets
      .slice(0, 12)
      .map((entry) => `${entry.route} -> ${entry.target}`)
      .join(" | ");
    fail(`broken internal targets detected: ${detail}`);
  }

  for (const audit of audits) {
    if (REDIRECT_ONLY_ROUTES.has(audit.route)) {
      continue;
    }
    if (audit.bookingLinks < 2) {
      fail(`route ${audit.route} has ${audit.bookingLinks} booking links (minimum is 2)`);
    }
  }

  const subPageHubRules: Array<{ prefix: string; hub: string }> = [
    { prefix: "/plumbing/", hub: "/plumbing" },
    { prefix: "/service-area/", hub: "/service-area" },
    { prefix: "/blog/", hub: "/blog" },
    { prefix: "/faq/", hub: "/faq" },
  ];

  for (const audit of audits) {
    if (REDIRECT_ONLY_ROUTES.has(audit.route)) {
      continue;
    }
    for (const rule of subPageHubRules) {
      if (audit.route.startsWith(rule.prefix)) {
        if (!audit.targets.includes(rule.hub)) {
          fail(`sub-page ${audit.route} is missing required hub link to ${rule.hub}`);
        }
      }
    }
  }

  for (const audit of audits) {
    if (audit.route.startsWith("/plumbing/")) {
      if (!audit.targets.some((target) => target.startsWith("/service-area"))) {
        fail(`service page ${audit.route} must link to at least one location page`);
      }
    }
    if (audit.route.startsWith("/service-area/")) {
      if (!audit.targets.some((target) => target.startsWith("/plumbing"))) {
        fail(`location page ${audit.route} must link to at least one service page`);
      }
    }
  }

  console.log(
    `internal link audit passed: ${audits.length} pages, ${routeSet.size} route targets, no broken links`,
  );
}

main();
