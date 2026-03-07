import { expect, test } from "@playwright/test";

test("IC-074 reduced motion disables review carousel auto-advance", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const dots = page.locator('button[aria-label^="Show review from"]');
  await expect(dots.first()).toBeVisible();

  const startIndex = await dots.evaluateAll((elements) =>
    elements.findIndex((element) => element.className.includes("bg-cta-blue")),
  );

  expect(startIndex).toBeGreaterThanOrEqual(0);

  await page.waitForTimeout(6200);

  const endIndex = await dots.evaluateAll((elements) =>
    elements.findIndex((element) => element.className.includes("bg-cta-blue")),
  );

  expect(endIndex).toBe(startIndex);
});
