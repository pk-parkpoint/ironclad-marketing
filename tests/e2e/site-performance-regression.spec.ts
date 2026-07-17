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

test("service and local heroes use the responsive image optimizer", async ({ page }) => {
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
  expect(decodeURIComponent((await localHero.getAttribute("src")) ?? "")).toContain(
    "/_next/image?url=/media/services/ironclad-team-hero.png",
  );
  await expectLeanInnerPageShell(page);
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
