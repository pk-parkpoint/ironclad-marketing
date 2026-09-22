import { expect, test } from "@playwright/test";

const STANDARD_HEADER_TEXT = "Book Today and Get 15% Off — Up to $300 →";
const STANDARD_SHORT_TEXT = "15% off your first service, up to $300";
const DRAIN_OFFER_TEXT = "Drain Cleaning for $89";
const CANONICAL_ORIGIN = "https://ironcladtexas.com";

const NEW_PAGES = [
  {
    route: "/lp/austin-plumber-near-me",
    heading: "Need an Austin Plumber Near You?",
    sectionHeading: "When to Call a Plumber Nearby",
    heroCta: "Check Availability",
  },
  {
    route: "/lp/water-heater-replacement",
    heading: "Water Heater Replacement in Austin",
    sectionHeading: "When Replacement Usually Makes Sense",
    heroCta: "Schedule Now",
  },
  {
    route: "/projects",
    heading: "Plumbing Work Across Greater Austin",
    sectionHeading: "Austin Diagnostics and Repairs",
    heroCta: "Schedule Now",
  },
  {
    route: "/plumbing/water-softener-repair",
    heading: "Water Softener Repair in Austin",
    sectionHeading: "Signs the Softener Needs Service",
    heroCta: "Schedule Now",
  },
] as const;

for (const pageConfig of NEW_PAGES) {
  test(`${pageConfig.route} uses the established service-page template`, async ({ page }) => {
    const runtimeErrors: string[] = [];
    page.on("pageerror", (error) => runtimeErrors.push(error.message));

    const response = await page.goto(pageConfig.route);
    expect(response?.status()).toBe(200);

    const root = page.locator(`[data-new-content-page="${pageConfig.route.slice(1)}"]`);
    await expect(root).toBeVisible();
    await expect(root.locator("#dc-root")).toBeVisible();
    await expect(root.getByRole("heading", { level: 1, name: pageConfig.heading })).toBeVisible();
    await expect(root.getByRole("heading", { level: 2, name: pageConfig.sectionHeading })).toBeVisible();
    await expect(root.getByText(STANDARD_HEADER_TEXT, { exact: true })).toBeVisible();
    await expect(root.getByRole("link", { name: pageConfig.heroCta }).first()).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `${CANONICAL_ORIGIN}${pageConfig.route}`,
    );

    expect(runtimeErrors).toEqual([]);
  });
}

test("the previous Austin plumber landing URL redirects to the near-me page", async ({ page }) => {
  await page.goto("/lp/austin-plumber");
  await expect(page).toHaveURL(/\/lp\/austin-plumber-near-me$/);
  await expect(page.getByRole("heading", { level: 1, name: "Need an Austin Plumber Near You?" })).toBeVisible();
});

test("the Austin landing page uses near-me search language naturally", async ({ page }) => {
  await page.goto("/lp/austin-plumber-near-me");
  await expect(page).toHaveTitle(/Austin Plumber Near Me/);
  await expect(page.getByText(/Searching for an “Austin plumber near me”/)).toBeVisible();
  await expect(page.getByRole("heading", { name: "Austin Plumber Near Me FAQ" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "When to Call a Plumber Nearby" })).toBeVisible();
});

test("new pages preserve the existing mobile layout without body overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });

  for (const pageConfig of NEW_PAGES) {
    await page.goto(pageConfig.route);
    const hasBodyOverflow = await page.evaluate(
      () => document.body.scrollWidth > window.innerWidth,
    );
    expect(hasBodyOverflow, `${pageConfig.route} has horizontal overflow`).toBe(false);
  }
});

test("existing pages use the standard 15% offer", async ({ page }) => {
  const response = await page.goto("/service-area/austin-tx");
  expect(response?.status()).toBe(200);
  await expect(page.getByText(STANDARD_HEADER_TEXT, { exact: true })).toBeVisible();
  await expect(page.getByText(STANDARD_SHORT_TEXT, { exact: true })).toBeVisible();
  await page.getByText("Do you offer any first-time or new-customer discounts?", { exact: true }).click();
  await expect(page.getByText("Drain cleaning is a separate $89 offer.", { exact: false })).toBeVisible();
});

for (const route of ["/reviews", "/questions", "/plumbing/water-heater-repair"]) {
  test(`${route} uses the standard 15% offer`, async ({ page }) => {
    const response = await page.goto(route);
    expect(response?.status(), route).toBe(200);
    await expect(page.getByText(STANDARD_HEADER_TEXT, { exact: true })).toBeVisible();
    await expect(page.getByText(STANDARD_SHORT_TEXT, { exact: true })).toBeVisible();
  });
}

test("the offers page shows both current deals", async ({ page }) => {
  const offersResponse = await page.goto("/special-offers");
  expect(offersResponse?.status()).toBe(200);
  await expect(page.getByRole("heading", { name: "15% Off for New Customers" })).toBeVisible();
  await expect(page.getByRole("heading", { name: DRAIN_OFFER_TEXT })).toBeVisible();
});

test("drain cleaning shows only its separate $89 deal", async ({ page }) => {
  const drainResponse = await page.goto("/plumbing/drain-clearing");
  expect(drainResponse?.status()).toBe(200);
  await expect(page.getByText(`${DRAIN_OFFER_TEXT} →`, { exact: true })).toBeVisible();
  await expect(page.getByText(DRAIN_OFFER_TEXT, { exact: true })).toBeVisible();
  await expect(page.getByText(STANDARD_SHORT_TEXT, { exact: true })).toHaveCount(0);
});
