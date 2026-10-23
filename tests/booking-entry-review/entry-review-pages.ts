import { readFileSync } from "node:fs";

function buildPaths(): string[] {
  const prerender = JSON.parse(readFileSync(".next/prerender-manifest.json", "utf8"));
  const routes = JSON.parse(readFileSync(".next/routes-manifest.json", "utf8"));
  return [
    ...Object.keys(prerender.routes),
    ...routes.staticRoutes.map((route: { page: string }) => route.page),
    ...routes.redirects.map((route: { source: string }) => route.source),
    "/entry-review-missing-page",
  ];
}

/** A frozen catalog lets a live review run independently of a local rebuild. */
export function entryReviewPages(): string[] {
  const catalog = process.env.BOOKING_REVIEW_CATALOG;
  const paths = new Set<string>(catalog ? JSON.parse(readFileSync(catalog, "utf8")) : buildPaths());
  const requested = process.env.BOOKING_REVIEW_PAGES?.split(",");
  return [...paths].filter((path) => {
    if (/[:\[\]\\()*]|\.[a-z0-9]+$/i.test(path)) return false;
    if (/^\/(?:_|api|admin|studio)(?:\/|$)/.test(path) || path.startsWith("/_")) return false;
    return !requested || requested.includes(path);
  }).sort();
}
