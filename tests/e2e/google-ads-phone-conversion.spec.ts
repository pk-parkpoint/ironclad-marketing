import { expect, test } from "@playwright/test";

test("phone links fire the Google Ads phone conversion exactly once", async ({ page }) => {
  await page.goto("/plumbing/drain-clearing");

  await expect.poll(async () => page.evaluate(() =>
    (window.dataLayer ?? []).filter((entry) => entry.event === "page_view").length,
  )).toBe(1);

  const phoneLink = page.locator('a[href^="tel:"]:visible').first();
  await expect(phoneLink).toBeVisible();
  await phoneLink.dispatchEvent("click");

  await expect.poll(async () => page.evaluate(() => {
    const entries = window.dataLayer ?? [];
    return entries.filter((entry) => {
      const args = Array.from(entry as unknown as ArrayLike<unknown>);
      const params = args[2] as Record<string, unknown> | undefined;
      return args[0] === "event"
        && args[1] === "conversion"
        && params?.send_to === "AW-18207846861/2WRhCLCe388cEM3jlupD";
    }).length;
  })).toBe(1);

  await expect.poll(async () => page.evaluate(() =>
    (window.dataLayer ?? []).filter((entry) => entry.event === "phone_click").length,
  )).toBe(1);
});

test("website-call replacement is configured for the public Ironclad number", async ({ page }) => {
  await page.goto("/plumbing/water-heater-repair");

  await expect.poll(async () => page.evaluate(() => {
    const entries = window.dataLayer ?? [];
    return entries.some((entry) => {
      const args = Array.from(entry as unknown as ArrayLike<unknown>);
      const params = args[2] as Record<string, unknown> | undefined;
      return args[0] === "config"
        && args[1] === "AW-18207846861/website-call-test-label"
        && params?.phone_conversion_number === "(512) 516-2470";
    });
  })).toBe(true);
});

test("mobile paid-search CTAs keep emergency traffic call-only", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });

  await page.goto("/plumbing/water-heater-repair");
  const standardBar = page.locator("div.fixed").filter({
    has: page.locator('a[data-track-intent="phone"]'),
  }).last();
  await expect(standardBar.getByRole("link", { name: "Call Now" })).toHaveAttribute("href", "tel:+15125162470");
  await expect(standardBar.getByRole("link", { name: "Book Online" })).toHaveAttribute("href", "/book");

  await page.goto("/emergency-plumbing");
  const emergencyBar = page.locator("div.fixed").filter({
    has: page.locator('a[data-track-intent="phone"]'),
  }).last();
  await expect(emergencyBar.getByRole("link", { name: "Call Now" })).toHaveAttribute("href", "tel:+15125162470");
  await expect(emergencyBar.getByRole("link", { name: "Book Online" })).toHaveCount(0);
  await expect(page.getByRole("contentinfo")).toContainText("RMP #39871");
});
