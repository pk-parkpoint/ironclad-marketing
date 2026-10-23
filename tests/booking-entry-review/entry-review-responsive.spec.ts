import { expect, test } from "@playwright/test";
import { isolateBookingTraffic } from "./entry-review-safety";

for (const width of [320, 390, 640, 768, 1080, 1280]) {
  test(`Data Desk booking stays tappable at ${width}px`, async ({ page }, testInfo) => {
    await isolateBookingTraffic(page);
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/data");
    const booking = page.locator(".dd-schedule");
    await expect(booking).toBeVisible();
    const box = await booking.boundingBox();
    expect(box!.height).toBeGreaterThanOrEqual(44);
    expect(box!.width).toBeGreaterThanOrEqual(44);
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(width);
    const phone = page.locator(".dd-phone");
    await expect(phone).toBeVisible();
    const overflow = await page.evaluate(() => ({ width: document.documentElement.scrollWidth, elements: [...document.querySelectorAll("body *")].filter((e) => e.getBoundingClientRect().right > innerWidth + 1).map((e) => e.className) }));
    expect(overflow.width, JSON.stringify(overflow.elements)).toBeLessThanOrEqual(width);
    if (width === 390 || width === 768) {
      await page.screenshot({ path: testInfo.outputPath(`data-desk-${width}.png`), animations: "disabled", timeout: 5000 });
    }
    await booking.click();
    await expect(page).toHaveURL(/\/book$/);
    await expect(page.getByRole("dialog", { name: "Request an Appointment", exact: true })).toBeVisible();
  });
}
