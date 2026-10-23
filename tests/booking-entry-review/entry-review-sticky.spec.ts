import { expect, test } from "@playwright/test";
import { isolateBookingTraffic } from "./entry-review-safety";

const cases = [
  { path: "/reviews", own: '[class*="stickyCta"] a[href="/book"]' },
  { path: "/service-area/austin-tx", own: '.local-sticky-bar a[href^="/book"]' },
  { path: "/service-area/austin-tx/bouldin-creek", own: '.local-sticky-bar a[href^="/book"]' },
  { path: "/", own: "" },
  { path: "/service-area", own: "" },
  { path: "/plumbing/drain-clearing", own: "" },
  { path: "/entry-review-missing-page", own: "" },
  { path: "/service-area/entry-review-missing-city", own: "" },
];

for (const fixture of cases) {
  test(`one usable mobile booking bar: ${fixture.path}`, async ({ page }, testInfo) => {
    await isolateBookingTraffic(page);
    await page.setViewportSize({ width: 390, height: 844 });
    const response = await page.goto(fixture.path);
    expect(response?.status()).toBe(fixture.path.includes("entry-review-missing") ? 404 : 200);
    const shared = page.locator(".site-mobile-bottom-bar");
    const control = fixture.own ? page.locator(fixture.own) : shared.getByRole("link", { name: "Book Online", exact: true });
    if (fixture.own) await expect(shared).toBeHidden();
    else await expect(shared).toBeVisible();
    await expect(control).toBeVisible();
    const href = await control.getAttribute("href");
    if (fixture.path === "/service-area/austin-tx") {
      await page.screenshot({ path: testInfo.outputPath("city-mobile-booking-bar.png"), animations: "disabled", timeout: 5000 });
    }
    await control.click();
    await expect(page).toHaveURL((url) => url.pathname === "/book");
    const destination = new URL(page.url());
    expect(destination.pathname).toBe("/book");
    if (fixture.own) expect(destination.search).toBe(new URL(href!, "https://ironcladtexas.com").search);
    await expect(page.getByRole("dialog", { name: "Request an Appointment", exact: true })).toHaveCount(1);
  });
}
