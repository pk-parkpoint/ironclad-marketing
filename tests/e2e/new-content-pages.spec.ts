import { expect, test } from "@playwright/test";

const OFFER_TEXT = "New customers save 15% — up to $300 total discount →";
const CANONICAL_ORIGIN = "https://ironcladtexas.com";

const NEW_PAGES = [
  {
    route: "/lp/austin-plumber",
    heading: "Need a Plumber Near You in Austin?",
    sectionHeading: "Plumbing Help for the Problem in Front of You",
    hasForm: true,
    serviceInterest: "Residential Plumbing",
  },
  {
    route: "/lp/water-heater-replacement",
    heading: "Water Heater Replacement in Austin",
    sectionHeading: "When Replacement Usually Makes Sense",
    hasForm: true,
    serviceInterest: "Water Heaters",
  },
  {
    route: "/projects",
    heading: "Plumbing Work Across Greater Austin",
    sectionHeading: "Austin Diagnostics and Repairs",
    hasForm: false,
    serviceInterest: null,
  },
  {
    route: "/plumbing/water-softener-repair",
    heading: "Water Softener Repair in Austin",
    sectionHeading: "Signs the Softener Needs Service",
    hasForm: true,
    serviceInterest: "Water Softener Repair",
  },
] as const;

for (const pageConfig of NEW_PAGES) {
  test(`${pageConfig.route} uses the established content-page format`, async ({ page }) => {
    const runtimeErrors: string[] = [];
    page.on("pageerror", (error) => runtimeErrors.push(error.message));

    const response = await page.goto(pageConfig.route);
    expect(response?.status()).toBe(200);

    const root = page.locator(`[data-new-content-page="${pageConfig.route.slice(1)}"]`);
    await expect(root).toBeVisible();
    await expect(root.getByRole("heading", { level: 1, name: pageConfig.heading })).toBeVisible();
    await expect(root.getByRole("heading", { level: 2, name: pageConfig.sectionHeading })).toBeVisible();
    await expect(root.getByText(OFFER_TEXT, { exact: true })).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `${CANONICAL_ORIGIN}${pageConfig.route}`,
    );
    const formIdPrefix = `marketing-${pageConfig.route.slice(1).replace(/\//g, "-")}`;
    await expect(root.locator(`form:has(input[id^="${formIdPrefix}"])`)).toHaveCount(
      pageConfig.hasForm ? 1 : 0,
    );
    if (pageConfig.serviceInterest) {
      await expect(root.locator(`input[name="service_interest"][value="${pageConfig.serviceInterest}"]`)).toHaveCount(1);
      await expect(root.locator(`#${formIdPrefix}-service`)).toHaveValue(pageConfig.serviceInterest);
    }

    expect(runtimeErrors).toEqual([]);
  });
}

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

test("phase-one pages do not change the existing Austin page offer", async ({ page }) => {
  const response = await page.goto("/service-area/austin-tx");
  expect(response?.status()).toBe(200);
  await expect(
    page.getByText("Book Today and Get 10% Off Your First Service →", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText(OFFER_TEXT, { exact: true })).toHaveCount(0);
});
