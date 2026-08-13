import { expect, test } from "@playwright/test";

const HOME_MEDIA = ["hero-video", "ironclad-hero-poster"];

async function expectLeanInnerPageShell(page: import("@playwright/test").Page) {
  const preloadHrefs = await page.locator('link[rel="preload"][href]').evaluateAll((links) =>
    links.map((link) => link.getAttribute("href") ?? ""),
  );
  expect(preloadHrefs.some((href) => HOME_MEDIA.some((asset) => href.includes(asset)))).toBe(false);
  await expect(page.locator('link[href*="fonts.googleapis.com"]')).toHaveCount(0);

  const faviconHrefs = await page.locator('link[href*="favicon.ico"]').evaluateAll((links) =>
    links.map((link) => link.getAttribute("href") ?? ""),
  );
  expect(faviconHrefs.length).toBeLessThanOrEqual(1);
}

test("critical heroes avoid cold runtime transforms while service images stay optimized", async ({ page }) => {
  await page.goto("/plumbing/toilet-repair-installation");
  const serviceHero = page.locator('[data-slot="hero-image"]');
  await expect(serviceHero).toBeVisible();
  expect(decodeURIComponent((await serviceHero.getAttribute("src")) ?? "")).toContain(
    "/_next/image?url=/media/services/toilet-repair-installation/",
  );
  await expectLeanInnerPageShell(page);

  await page.goto("/service-area/cedar-park-tx");
  const localHero = page.locator(".local-hero-image");
  await expect(localHero).toBeVisible();
  expect((await localHero.getAttribute("src")) ?? "").toBe("/media/services/ironclad-team-hero-fallback.jpg");
  expect((await localHero.evaluate((image) => (image as HTMLImageElement).currentSrc))).toContain(
    "/media/services/ironclad-team-hero-fast-",
  );
  await expectLeanInnerPageShell(page);

  await page.goto("/about");
  const companyHero = page.locator('[data-company-section="hero"] img');
  await expect(companyHero).toBeVisible();
  expect(await companyHero.evaluate((image) => (image as HTMLImageElement).currentSrc)).toContain(
    "/media/company/ironclad-team-hero-fast-",
  );

  await page.goto("/reviews");
  const reviewsHero = page.locator("main section").first().locator("img");
  await expect(reviewsHero).toBeVisible();
  expect(await reviewsHero.evaluate((image) => (image as HTMLImageElement).currentSrc)).toContain(
    "/media/reviews/ironclad-team-hero-fast-",
  );
});

test("About navigation keeps the human site map out of the company menu", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/about");
  const primaryNav = page.getByRole("navigation", { name: "Primary" });
  await primaryNav.getByRole("link", { name: "About Us", exact: true }).first().hover();

  await expect(primaryNav.getByRole("link", { name: "Our Reviews" })).toBeVisible();
  await expect(primaryNav.getByRole("link", { name: "Our Guarantees" })).toBeVisible();
  await expect(primaryNav.getByRole("link", { name: "Careers", exact: true })).toBeVisible();
  await expect(primaryNav.getByRole("link", { name: "Site Map", exact: true })).toHaveCount(0);
});

test("mobile home defers a compact video until after the poster paints", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "load" });

  await expect(page.locator('video source[src="/media/hero-video-mobile-fast.mp4"]')).toHaveCount(1);
  const response = await page.request.get("/media/hero-video-mobile-fast.mp4");
  expect(response.ok()).toBe(true);
  expect(Number(response.headers()["content-length"] ?? 0)).toBeLessThan(650_000);
  expect(await page.locator('img[src="/hero/ironclad-hero-poster.jpg"]').getAttribute("fetchpriority")).toBe("high");
});

test("booking code is warm before a company-page CTA is clicked", async ({ page }) => {
  await page.goto("/about", { waitUntil: "networkidle" });

  await expect.poll(() => page.evaluate(() =>
    performance.getEntriesByType("resource").some((entry) => entry.name.includes("booking-wizard")),
  )).toBe(true);

  await page.locator('[data-company-page="about"] a[href="/book"]').first().click();
  await expect(page.getByRole("dialog", { name: "Request an Appointment" })).toBeVisible({ timeout: 1_000 });
});

test("toilet replacement has a dedicated search and booking destination", async ({ page }) => {
  await page.goto("/plumbing/toilet-replacement");

  await expect(page).toHaveTitle("Toilet Replacement Austin | Ironclad Plumbing");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Toilet Replacement & Installation in Austin");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /Professional toilet replacement in Austin/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://ironcladtexas.com/plumbing/toilet-replacement",
  );

  const hero = page.locator('[data-slot="hero-image"]');
  expect(decodeURIComponent((await hero.getAttribute("src")) ?? "")).toContain(
    "/media/services/toilet-repair-installation/04-toilet-installation.webp",
  );
  await expect(page.locator('a[href="/book?service=toilet-repair-installation"]')).not.toHaveCount(0);
  await expectLeanInnerPageShell(page);

  const sitemap = await page.request.get("/sitemaps/services.xml");
  expect(sitemap.ok()).toBe(true);
  expect(await sitemap.text()).toContain("https://ironcladtexas.com/plumbing/toilet-replacement");
});
