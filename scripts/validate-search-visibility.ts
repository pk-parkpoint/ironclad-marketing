import fs from "node:fs";
import path from "node:path";
import robots from "../app/robots";
import { getPublicContactInfo } from "../lib/contact";
import {
  buildArticleSitemapEntries,
  buildCoreSitemapEntries,
  buildGuideSitemapEntries,
  buildServiceAreaSitemapEntries,
  buildServiceSitemapEntries,
  getSitemapBaseUrl,
  toAbsoluteSitemapUrl,
} from "../lib/sitemap-data";
import { buildLocalBusinessSchema } from "../lib/structured-data";

const DEFAULT_SITE_URL = "https://ironcladtexas.com";
const REQUIRED_BRAND = "Ironclad Plumbing";
const REQUIRED_CITY = "Austin";
const REQUIRED_REGION = "TX";
const REQUIRED_COUNTRY = "US";
const REQUIRED_PHONE_DIGITS = "5125062470";
const RETIRED_PHONE_PATTERNS = [
  /(?:\+?1[\s.-]*)?\(?512\)?[\s.-]*516[\s.-]*2470/g,
  /(?:\+?1[\s.-]*)?\(?833\)?[\s.-]*597[\s.-]*1932/g,
];
const PUBLIC_SOURCE_ROOTS = [
  ".env.example",
  "app",
  "components",
  "content",
  "lib",
  "next.config.ts",
  "public",
  "scripts",
];

function fail(message: string): never {
  console.error(`search visibility audit failed: ${message}`);
  process.exit(1);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    fail(message);
  }
}

function getBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? getSitemapBaseUrl() ?? DEFAULT_SITE_URL).replace(/\/+$/, "");
}

function asArray<T>(value: T | T[] | undefined): T[] {
  if (!value) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}

function asRecord(value: unknown, message: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    fail(message);
  }
  return value as Record<string, unknown>;
}

function digitsOnly(value: string): string {
  return value.replace(/[^\d]/g, "");
}

function read(relativePath: string): string {
  const filePath = path.resolve(process.cwd(), relativePath);
  return fs.readFileSync(filePath, "utf8");
}

function assertContains(fileLabel: string, source: string, snippet: string): void {
  if (!source.includes(snippet)) {
    fail(`${fileLabel} is missing required snippet: ${snippet}`);
  }
}

function publicSourceFiles(relativePath: string): string[] {
  const absolutePath = path.resolve(process.cwd(), relativePath);
  const stat = fs.statSync(absolutePath);
  if (stat.isFile()) {
    return [absolutePath];
  }
  return fs.readdirSync(absolutePath, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name === "node_modules" || entry.name === ".next" || entry.name === "out") {
      return [];
    }
    return publicSourceFiles(path.join(relativePath, entry.name));
  });
}

function assertNoRetiredPhoneNumbers(): void {
  for (const sourceRoot of PUBLIC_SOURCE_ROOTS) {
    for (const filePath of publicSourceFiles(sourceRoot)) {
      const source = fs.readFileSync(filePath, "utf8");
      for (const retiredPhonePattern of RETIRED_PHONE_PATTERNS) {
        assert(
          !retiredPhonePattern.test(source),
          `${path.relative(process.cwd(), filePath)} contains a retired public phone number`,
        );
        retiredPhonePattern.lastIndex = 0;
      }
    }
  }
}

function main() {
  const baseUrl = getBaseUrl();
  assert(baseUrl.startsWith("https://"), "NEXT_PUBLIC_SITE_URL must be https");

  const robotConfig = robots();
  const sitemapRef = asArray(robotConfig.sitemap);
  assert(
    sitemapRef.includes(`${baseUrl}/sitemap.xml`),
    "robots must include canonical sitemap.xml reference",
  );

  const routes = [
    ...buildCoreSitemapEntries(),
    ...buildServiceSitemapEntries(),
    ...buildServiceAreaSitemapEntries(),
    ...buildArticleSitemapEntries(),
    ...buildGuideSitemapEntries(),
  ];
  assert(routes.length > 0, "sitemap must contain at least one URL");
  const urls = routes.map((entry) => toAbsoluteSitemapUrl(entry.path));
  const uniqueUrls = new Set(urls);
  assert(uniqueUrls.size === urls.length, "sitemap contains duplicate URLs");

  assert(urls.includes(baseUrl), "sitemap missing canonical homepage URL");
  assert(urls.includes(`${baseUrl}/contact`), "sitemap missing /contact URL");
  for (const url of urls) {
    assert(url.startsWith(baseUrl), `sitemap URL must use canonical base URL: ${url}`);
  }

  const localBusiness = asRecord(
    buildLocalBusinessSchema("/"),
    "LocalBusiness schema missing for homepage",
  );
  assert(localBusiness["@type"] === "Plumber", "homepage schema @type must be Plumber");
  assert(localBusiness.name === REQUIRED_BRAND, "LocalBusiness name mismatch");

  const address = asRecord(localBusiness.address, "LocalBusiness address missing");
  assert(address.addressLocality === REQUIRED_CITY, "LocalBusiness addressLocality mismatch");
  assert(address.addressRegion === REQUIRED_REGION, "LocalBusiness addressRegion mismatch");
  assert(address.addressCountry === REQUIRED_COUNTRY, "LocalBusiness addressCountry mismatch");

  const contactInfo = getPublicContactInfo();
  assert(contactInfo.phoneDisplay.trim().length > 0, "contact phone display is empty");
  assert(contactInfo.textDisplay.trim().length > 0, "contact text display is empty");
  assert(contactInfo.phoneHref.startsWith("tel:"), "contact phone href must use tel:");
  assert(contactInfo.smsHref.startsWith("sms:"), "contact sms href must use sms:");
  assert(
    digitsOnly(contactInfo.phoneHref).slice(-10) === REQUIRED_PHONE_DIGITS,
    `contact phone must be ${REQUIRED_PHONE_DIGITS}`,
  );
  assert(
    digitsOnly(contactInfo.smsHref).slice(-10) === REQUIRED_PHONE_DIGITS,
    `contact text number must be ${REQUIRED_PHONE_DIGITS}`,
  );
  assertNoRetiredPhoneNumbers();

  const schemaTelephoneRaw = String(localBusiness.telephone ?? "");
  assert(schemaTelephoneRaw.length > 0, "LocalBusiness telephone missing");
  const schemaTelephoneDigits = digitsOnly(schemaTelephoneRaw);
  const contactTelephoneDigits = digitsOnly(contactInfo.phoneHref);
  assert(schemaTelephoneDigits.length >= 10, "LocalBusiness telephone must include at least 10 digits");
  assert(
    schemaTelephoneDigits.slice(-10) === contactTelephoneDigits.slice(-10),
    "LocalBusiness telephone must match shared contact phone",
  );

  const footerSource = read("components/layout/site-footer.tsx");
  assertContains("components/layout/site-footer.tsx", footerSource, "getPublicContactInfo");

  const layoutSource = read("app/layout.tsx");
  assertContains("app/layout.tsx", layoutSource, "Ironclad Plumbing");
  assertContains("app/layout.tsx", layoutSource, "Austin");

  console.log(
    `search visibility audit passed: sitemap=${urls.length} urls, canonical=${baseUrl}, phone=${contactInfo.phoneDisplay}, locality=${REQUIRED_CITY}`,
  );
}

main();
