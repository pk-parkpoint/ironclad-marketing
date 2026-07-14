import { expect, test } from "@playwright/test";

const route = "/service-area/san-marcos-tx";

test("San Marcos has a complete service-area page", async ({ page }) => {
  const response = await page.goto(route);

  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle(/Plumber in San Marcos, TX/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "San Marcos Plumbing for Established Homes and Growing Neighborhoods",
  );
  await expect(page.locator("[data-motion-root]")).toHaveClass(/ic-anim/);
  await expect(page.getByText("Blanco Gardens", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Central Texas Homeowners Trust Ironclad" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Schedule Online" }).first()).toHaveAttribute(
    "href",
    "/book?location=san-marcos-tx",
  );
  const structuredData = await page.locator("#ld-local-city-san-marcos-tx").textContent();
  expect(structuredData).toContain("San Marcos, TX");
});

test("San Marcos is linked from the service-area hub and sitemap", async ({ page, request }) => {
  await page.goto("/service-area");

  await expect(page.getByRole("link", { name: /San Marcos/ })).toHaveAttribute("href", route);
  await expect(page.getByText("20 City Pages", { exact: true })).toBeVisible();

  const sitemap = await request.get("/sitemaps/service-areas.xml");
  expect(sitemap.ok()).toBe(true);
  expect(await sitemap.text()).toContain(route);
});
