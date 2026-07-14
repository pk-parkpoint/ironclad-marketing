import { expect, test } from "@playwright/test";

test("phone links fire the Google Ads phone conversion exactly once", async ({ page }) => {
  await page.goto("/plumbing/drain-clearing");

  await expect.poll(async () => page.evaluate(() =>
    (window.dataLayer ?? []).filter((entry) => entry.event === "page_view").length,
  )).toBe(1);

  const phoneLink = page.locator('a[href^="tel:"]').first();
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
