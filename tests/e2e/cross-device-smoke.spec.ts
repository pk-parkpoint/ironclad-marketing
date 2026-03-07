import { expect, test } from "@playwright/test";

test("IC-076 cross-device smoke: sticky header, no horizontal overflow, and mobile booking UX", async ({ page }) => {
  await page.goto("/");

  const header = page.locator("header").first();
  await expect(header).toBeVisible();

  const headerTopBefore = await header.evaluate((element) => Math.round(element.getBoundingClientRect().top));
  expect(Math.abs(headerTopBefore)).toBeLessThanOrEqual(2);

  await page.evaluate(() => window.scrollTo(0, 900));
  await page.waitForTimeout(250);

  const headerTopAfter = await header.evaluate((element) => Math.round(element.getBoundingClientRect().top));
  expect(Math.abs(headerTopAfter)).toBeLessThanOrEqual(2);

  const hasHorizontalOverflow = await page.evaluate(() => {
    const docOverflow = document.documentElement.scrollWidth - window.innerWidth;
    const bodyOverflow = document.body.scrollWidth - window.innerWidth;
    return docOverflow > 1 || bodyOverflow > 1;
  });

  expect(hasHorizontalOverflow).toBeFalsy();

  const mobileBottomBar = page.locator("div.fixed.inset-x-0.bottom-0").first();
  const viewportWidth = page.viewportSize()?.width ?? (await page.evaluate(() => window.innerWidth));
  const expectsMobileBar = viewportWidth < 768;

  if (!expectsMobileBar) {
    await expect(mobileBottomBar).toBeHidden();
    return;
  }

  await expect(mobileBottomBar).toBeVisible();
  await page.getByRole("button", { name: "Book Service" }).first().click();

  const dialog = page.getByRole("dialog", { name: "Request an Appointment" });
  await expect(dialog).toBeVisible();

  const [dialogHeight, viewportHeight] = await Promise.all([
    dialog.evaluate((element) => element.getBoundingClientRect().height),
    page.evaluate(() => window.innerHeight),
  ]);

  expect(dialogHeight).toBeGreaterThan(viewportHeight * 0.9);

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});
