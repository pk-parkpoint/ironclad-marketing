import dns from "node:dns/promises";

const DEFAULT_BASE_URL = "https://ironcladtexas.com";
const REQUIRED_ROUTES = ["/", "/plumbing", "/service-area", "/reviews", "/book", "/contact"];
const BOOKING_PATH = "/api/bookings";
const REQUIRED_BOOKING_STATUS = 202;

function normalizeBaseUrl(raw?: string): string {
  return (raw ?? DEFAULT_BASE_URL).replace(/\/+$/, "");
}

function fail(message: string): never {
  console.error(`production launch audit failed: ${message}`);
  process.exit(1);
}

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    fail(message);
  }
}

function getEnv(name: string): string | undefined {
  const value = process.env[name];
  if (!value || value.trim().length === 0) {
    return undefined;
  }
  return value.trim();
}

function joinRoute(baseUrl: string, route: string): string {
  return route === "/" ? baseUrl : `${baseUrl}${route}`;
}

async function fetchWithTimeout(url: string, init?: RequestInit): Promise<Response> {
  const timeoutMs = Number(process.env.PROD_AUDIT_TIMEOUT_MS ?? 10000);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } catch (error) {
    fail(`request failed for ${url}: ${error instanceof Error ? error.message : String(error)}`);
  } finally {
    clearTimeout(timeout);
  }
}

async function resolveHost(hostname: string): Promise<string[]> {
  const records = new Set<string>();
  try {
    for (const record of await dns.resolve4(hostname)) {
      records.add(record);
    }
  } catch {}
  try {
    for (const record of await dns.resolve6(hostname)) {
      records.add(record);
    }
  } catch {}
  return Array.from(records);
}

async function main() {
  const baseUrl = normalizeBaseUrl(getEnv("PROD_SITE_URL") ?? getEnv("NEXT_PUBLIC_SITE_URL"));
  const expectedBrand = getEnv("PROD_EXPECTED_BRAND") ?? "Ironclad Plumbing";
  const expectedMarket = getEnv("PROD_EXPECTED_MARKET") ?? "Austin";

  const parsedBase = new URL(baseUrl);
  assert(parsedBase.protocol === "https:", `base URL must be https. Got ${baseUrl}`);

  const resolved = await resolveHost(parsedBase.hostname);
  assert(resolved.length > 0, `no DNS A/AAAA records resolved for ${parsedBase.hostname}`);

  const httpUrl = new URL(baseUrl);
  httpUrl.protocol = "http:";
  const insecureResponse = await fetchWithTimeout(httpUrl.toString(), { redirect: "manual" });
  assert(
    [301, 302, 307, 308].includes(insecureResponse.status),
    `http://${parsedBase.hostname} must redirect to HTTPS. Got ${insecureResponse.status}`,
  );
  const insecureLocation = insecureResponse.headers.get("location");
  assert(!!insecureLocation, `http://${parsedBase.hostname} redirect location is missing`);

  const insecureFollow = await fetchWithTimeout(httpUrl.toString(), { redirect: "follow" });
  assert(
    insecureFollow.url.startsWith("https://"),
    `http://${parsedBase.hostname} must resolve to an HTTPS URL. Final URL: ${insecureFollow.url}`,
  );

  const homeResponse = await fetchWithTimeout(baseUrl, { redirect: "follow" });
  assert(homeResponse.ok, `home page returned ${homeResponse.status}`);
  assert(
    homeResponse.url.startsWith("https://"),
    `home page final URL must be HTTPS. Got ${homeResponse.url}`,
  );
  const homeHtml = await homeResponse.text();

  assert(
    homeHtml.toLowerCase().includes(expectedBrand.toLowerCase()),
    `home page does not include expected brand string "${expectedBrand}"`,
  );
  assert(
    homeHtml.toLowerCase().includes(expectedMarket.toLowerCase()),
    `home page does not include expected market string "${expectedMarket}"`,
  );

  const hasGtm = homeHtml.includes("googletagmanager.com/gtm.js");
  const hasGtag = homeHtml.includes("googletagmanager.com/gtag/js");
  const hasDataLayer = homeHtml.includes("dataLayer");
  assert(hasGtm || hasGtag, "home page is missing GTM/GA bootstrap scripts");
  assert(hasDataLayer, "home page is missing dataLayer marker");

  for (const route of REQUIRED_ROUTES) {
    const routeUrl = joinRoute(baseUrl, route);
    const response = await fetchWithTimeout(routeUrl, { redirect: "follow" });
    assert(response.ok, `route ${routeUrl} returned ${response.status}`);
  }

  const bookingUrl = `${baseUrl}${BOOKING_PATH}`;
  const bookingResponse = await fetchWithTimeout(bookingUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      name: "IC-081 Smoke Test",
      phone: "+15125550123",
      service: "leak-detection",
      source: "ic081_prod_audit",
    }),
  });
  assert(
    bookingResponse.status === REQUIRED_BOOKING_STATUS,
    `${bookingUrl} returned ${bookingResponse.status}; expected ${REQUIRED_BOOKING_STATUS}`,
  );

  const bookingJson = (await bookingResponse.json().catch(() => null)) as
    | { bookingId?: string; status?: string }
    | null;
  assert(!!bookingJson, `${bookingUrl} returned non-JSON body`);
  assert(typeof bookingJson?.bookingId === "string", `${bookingUrl} response missing bookingId`);
  assert(bookingJson?.status === "accepted", `${bookingUrl} response status was not "accepted"`);

  console.log(
    `production launch audit passed: host=${parsedBase.hostname}, dnsRecords=${resolved.length}, routes=${REQUIRED_ROUTES.length}, bookingStatus=${bookingResponse.status}`,
  );
}

main();
