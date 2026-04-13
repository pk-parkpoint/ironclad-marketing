import dns from "node:dns/promises";

const DEFAULT_BASE_URL = "https://ironcladtexas.com";
const REQUIRED_ROUTES = ["/", "/plumbing", "/service-area", "/reviews", "/book", "/contact"];
const BOOKING_PATH = "/api/bookings";
const REQUIRED_BOOKING_STATUS = 201;

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

function envFlag(name: string): boolean {
  const value = getEnv(name);
  if (!value) {
    return false;
  }

  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
}

function joinRoute(baseUrl: string, route: string): string {
  return route === "/" ? baseUrl : `${baseUrl}${route}`;
}

function normalizeComparableUrl(raw: string): string {
  const parsed = new URL(raw);
  if ((parsed.protocol === "https:" && parsed.port === "443") || (parsed.protocol === "http:" && parsed.port === "80")) {
    parsed.port = "";
  }
  return parsed.toString().replace(/\/+$/, "");
}

function assertRedirectLocation(response: Response, requestUrl: string, expectedUrl: string, context: string): void {
  assert(
    [301, 302, 307, 308].includes(response.status),
    `${context} must redirect. Got ${response.status}`,
  );

  const location = response.headers.get("location");
  assert(!!location, `${context} redirect location is missing`);
  assert(!location.includes(":443"), `${context} redirect location exposes :443 (${location})`);

  const absoluteLocation = new URL(location, requestUrl).toString();
  assert(
    normalizeComparableUrl(absoluteLocation) === normalizeComparableUrl(expectedUrl),
    `${context} redirect location was ${absoluteLocation}; expected ${expectedUrl}`,
  );
}

function buildBookingSmokePayload() {
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  return {
    address: {
      formatted: "123 Test St, Austin, TX 78701",
    },
    contactPreference: "either",
    customerName: "IC-081 Smoke Test",
    phone: "+15125550123",
    preferredDate: tomorrow,
    preferredWindow: "Morning",
    serviceCategory: "leak-detection",
  };
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
  const requireAnalytics = envFlag("PROD_REQUIRE_ANALYTICS");

  const parsedBase = new URL(baseUrl);
  assert(parsedBase.protocol === "https:", `base URL must be https. Got ${baseUrl}`);

  const resolved = await resolveHost(parsedBase.hostname);
  assert(resolved.length > 0, `no DNS A/AAAA records resolved for ${parsedBase.hostname}`);

  const httpUrl = new URL(baseUrl);
  httpUrl.protocol = "http:";
  const insecureResponse = await fetchWithTimeout(httpUrl.toString(), { redirect: "manual" });
  assertRedirectLocation(
    insecureResponse,
    httpUrl.toString(),
    baseUrl,
    `http://${parsedBase.hostname}`,
  );

  const insecureFollow = await fetchWithTimeout(httpUrl.toString(), { redirect: "follow" });
  assert(
    normalizeComparableUrl(insecureFollow.url) === normalizeComparableUrl(baseUrl),
    `http://${parsedBase.hostname} must resolve to ${baseUrl}. Final URL: ${insecureFollow.url}`,
  );

  const wwwUrl = new URL(baseUrl);
  wwwUrl.hostname = `www.${parsedBase.hostname}`;

  const wwwSecureResponse = await fetchWithTimeout(wwwUrl.toString(), { redirect: "manual" });
  assertRedirectLocation(
    wwwSecureResponse,
    wwwUrl.toString(),
    baseUrl,
    `https://www.${parsedBase.hostname}`,
  );

  const wwwSecureFollow = await fetchWithTimeout(wwwUrl.toString(), { redirect: "follow" });
  assert(
    normalizeComparableUrl(wwwSecureFollow.url) === normalizeComparableUrl(baseUrl),
    `https://www.${parsedBase.hostname} must resolve to ${baseUrl}. Final URL: ${wwwSecureFollow.url}`,
  );

  const wwwHttpUrl = new URL(wwwUrl.toString());
  wwwHttpUrl.protocol = "http:";

  const wwwInsecureResponse = await fetchWithTimeout(wwwHttpUrl.toString(), { redirect: "manual" });
  assertRedirectLocation(
    wwwInsecureResponse,
    wwwHttpUrl.toString(),
    baseUrl,
    `http://www.${parsedBase.hostname}`,
  );

  const wwwInsecureFollow = await fetchWithTimeout(wwwHttpUrl.toString(), { redirect: "follow" });
  assert(
    normalizeComparableUrl(wwwInsecureFollow.url) === normalizeComparableUrl(baseUrl),
    `http://www.${parsedBase.hostname} must resolve to ${baseUrl}. Final URL: ${wwwInsecureFollow.url}`,
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
  if (hasGtm || hasGtag) {
    assert(hasDataLayer, "home page is missing dataLayer marker");
  } else if (requireAnalytics) {
    fail("home page is missing GTM/GA bootstrap scripts");
  } else {
    console.warn("production launch audit warning: home page is missing GTM/GA bootstrap scripts");
  }

  for (const route of REQUIRED_ROUTES) {
    const routeUrl = joinRoute(baseUrl, route);
    const response = await fetchWithTimeout(routeUrl, { redirect: "follow" });
    assert(response.ok, `route ${routeUrl} returned ${response.status}`);
  }

  const bookingUrl = `${baseUrl}${BOOKING_PATH}`;
  const bookingResponse = await fetchWithTimeout(bookingUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(buildBookingSmokePayload()),
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
