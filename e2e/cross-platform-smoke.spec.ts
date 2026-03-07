import { expect, test, type Page } from "@playwright/test";

const CORE_ROUTES = [
  "/",
  "/plumbing",
  "/service-area",
  "/reviews",
  "/about",
  "/book",
  "/contact",
  "/our-process",
  "/why-choose-us",
  "/warranties",
  "/financing",
];

async function safeGoto(page: Page, route: string) {
  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await page.goto(route, { waitUntil: "domcontentloaded" });
      await page.waitForLoadState("networkidle");
      return response;
    } catch (error) {
      lastError = error;
      // iOS/WebKit can occasionally interrupt route hops during rapid navigations.
      await page.waitForTimeout(150);
    }
  }
  throw lastError;
}

test("core marketing routes render with visible h1", async ({ page }) => {
  for (const route of CORE_ROUTES) {
    const response = await safeGoto(page, route);
    expect(response, `missing response for ${route}`).not.toBeNull();
    expect(response!.ok(), `non-2xx response for ${route}`).toBeTruthy();
    await expect(page.locator("h1").first(), `${route} missing h1`).toBeVisible();
  }
});

test("dynamic route smoke: plumbing detail page renders", async ({ page }) => {
  const response = await safeGoto(page, "/plumbing/drain-cleaning");
  expect(response).not.toBeNull();
  expect(response!.ok()).toBeTruthy();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByText("Professional Drain Cleaning")).toBeVisible();
});

test("mobile-safe layout smoke: no horizontal overflow on core pages", async ({ page }) => {
  // Runs in every project, but this still verifies mobile layouts in mobile projects.
  for (const route of ["/", "/plumbing", "/service-area", "/reviews", "/contact"]) {
    await safeGoto(page, route);
    const hasOverflow = await page.evaluate(() => {
      const tolerance = 1;
      return document.documentElement.scrollWidth > window.innerWidth + tolerance;
    });
    expect(hasOverflow, `horizontal overflow on ${route}`).toBeFalsy();
  }
});
