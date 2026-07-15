import { expect, test } from "@playwright/test";
import { DATA_DESK_PRODUCTS } from "../../content/data-desk";

test("Data Desk hub exposes all 25 products through Guides", async ({ page }) => {
  await page.goto("/data");

  await expect(page.getByRole("heading", { level: 1, name: "Austin Home Data Desk" })).toBeVisible();
  await expect(page.locator('main a[href^="/data/"]')).toHaveCount(25);
  await expect(page.locator('nav[aria-label="Primary"] a[href="/data"]')).toHaveCount(1);
  await expect(page.locator('nav[aria-label="Mobile primary"] a[href="/data"]')).toHaveCount(1);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/data$/);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
});

test("every Data Desk product has a stable route, unique metadata and related products", async ({ request }) => {
  for (const product of DATA_DESK_PRODUCTS) {
    const response = await request.get(`/data/${product.slug}`);
    expect(response.status(), product.slug).toBe(200);
    const html = await response.text();
    const escapedTitle = product.metaTitle.replaceAll("&", "&amp;");

    expect(html, `${product.slug} title`).toContain(`<title>${escapedTitle}</title>`);
    expect(html, `${product.slug} description`).toContain(`content="${product.metaDescription}"`);
    expect(html, `${product.slug} canonical`).toMatch(
      new RegExp(`<link rel="canonical" href="[^"]*/data/${product.slug}"`),
    );
    expect(html, `${product.slug} robots`).toMatch(/<meta name="robots" content="[^"]*noindex[^"]*follow/);
    expect(html, `${product.slug} development status`).toContain("data product in development");
    expect(html, `${product.slug} related links`).toContain("Related Data Desk products");
  }
});

test("Guides hub links prominently to the Data Desk", async ({ page }) => {
  await page.goto("/guides");
  await expect(page.getByRole("link", { name: /Explore 25 planned Austin home-data products/ })).toHaveAttribute("href", "/data");
});
