import { expect, test } from "@playwright/test";

const aliases = [
  ["/book-online", "/book"],
  ["/emergency-plumbing", "/plumbing/emergency"],
  ["/water-heaters", "/plumbing/water-heaters"],
  ["/drain-cleaning", "/plumbing/drain-clearing"],
  ["/plumbing/drain-cleaning", "/plumbing/drain-clearing"],
  ["/leak-detection", "/plumbing/leak-detection"],
] as const;

test("exact-label top-level URLs permanently forward to canonical pages", async ({ page }) => {
  for (const [alias, destination] of aliases) {
    const response = await page.request.get(alias, { maxRedirects: 0 });
    expect(response.status(), alias).toBe(308);
    expect(response.headers().location, alias).toBe(destination);

    await page.goto(alias);
    await expect(page, alias).toHaveURL(new RegExp(`${destination.replaceAll("/", "\\/")}$`));
    await expect(page.locator("h1:visible").first(), alias).toBeVisible();
  }
});

test("service area already has its exact top-level URL", async ({ page }) => {
  const response = await page.goto("/service-area");
  expect(response?.status()).toBe(200);
  await expect(page).toHaveURL(/\/service-area$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
