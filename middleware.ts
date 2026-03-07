import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { CANONICAL_HOST, stripTrailingSlashes } from "@/lib/site-url";

// Enforce a single canonical hostname and path shape to reduce duplicate indexing
// (e.g. www vs apex, and trailing-slash variants).
export function middleware(request: NextRequest) {
  const url = new URL(request.url);

  // In some deployments `request.url` can reflect the internal upstream hostname (e.g. localhost),
  // so always canonicalize using the forwarded/host headers.
  const rawHost =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? url.host ?? "";
  const hostname = rawHost.split(",")[0]?.trim().split(":")[0]?.toLowerCase().replace(/\.$/, "") ?? "";

  const isIroncladDomain = hostname === CANONICAL_HOST || hostname === `www.${CANONICAL_HOST}`;

  if (!isIroncladDomain) {
    return NextResponse.next();
  }

  // Cloud Run requests can carry an internal upstream port (for example :8080) in request.url.
  // Canonical public redirects must never expose that port.
  url.port = "";

  let shouldRedirect = false;

  if (hostname === `www.${CANONICAL_HOST}`) {
    url.host = CANONICAL_HOST;
    shouldRedirect = true;
  }

  if (url.pathname === "/index.html") {
    url.pathname = "/";
    shouldRedirect = true;
  }

  const stripped = stripTrailingSlashes(url.pathname);
  if (stripped !== url.pathname) {
    url.pathname = stripped;
    shouldRedirect = true;
  }

  if (!shouldRedirect) {
    const response = NextResponse.next();
    response.headers.set("Cache-Control", "public, max-age=300, s-maxage=300, stale-while-revalidate=60");
    return response;
  }

  const destination = `https://${CANONICAL_HOST}${url.pathname}${url.search}`;

  // Permanent redirect; safe for bots and preserves method semantics.
  return NextResponse.redirect(destination, 308);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico).*)"],
};
