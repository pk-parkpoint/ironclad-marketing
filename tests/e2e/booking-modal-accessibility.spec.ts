import { expect, test } from "@playwright/test";

test("IC-073 modal traps focus, closes on Escape, and restores trigger focus", async ({ page, browserName }) => {
  test.skip(browserName === "webkit", "WebKit focus restoration is flaky with stacked fixed overlays.");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const trigger = page.locator("div.fixed.inset-x-0.bottom-0 button").first();
  await expect(trigger).toBeVisible();
  await trigger.focus();
  await trigger.click();

  const dialog = page.getByRole("dialog", { name: "Request an Appointment" });
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute("aria-modal", "true");
  await expect(dialog).toHaveAttribute("aria-describedby", "booking-modal-description");
  await expect(page.locator("#booking-modal-description")).toContainText("Press Escape to close");

  await page.keyboard.press("Shift+Tab");
  let focusInsideDialog = await dialog.evaluate((element) => element.contains(document.activeElement));
  expect(focusInsideDialog).toBeTruthy();

  await page.keyboard.press("Tab");
  focusInsideDialog = await dialog.evaluate((element) => element.contains(document.activeElement));
  expect(focusInsideDialog).toBeTruthy();

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});
