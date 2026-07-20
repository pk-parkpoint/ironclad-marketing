import { expect, test, type Page } from "@playwright/test";

const dialogName = "Request an Appointment";

async function clickBookingTrigger(page: Page, name = "Schedule Now") {
  const link = page.getByRole("link", { name }).first();
  try {
    await link.waitFor({ state: "visible", timeout: 1500 });
    await link.click();
    return;
  } catch {
    const bookLink = page.getByRole("link", { name: "Book Service" }).first();
    try {
      await bookLink.waitFor({ state: "visible", timeout: 1500 });
      await bookLink.click();
      return;
    } catch {
      await page.getByRole("button", { name: "Book Service" }).click();
    }
  }
}

test("booking links open the wizard on the book route and preserve browser back", async ({ page }) => {
  await page.goto("/");

  await clickBookingTrigger(page);

  await expect(page.getByRole("dialog", { name: dialogName })).toBeVisible();
  expect(new URL(page.url()).pathname).toBe("/book");

  await page.goBack();
  await expect(page.getByRole("dialog", { name: dialogName })).toBeHidden();
  expect(new URL(page.url()).pathname).toBe("/");
});

test("booking links show an immediate loading shell while the wizard chunk loads", async ({ page }) => {
  await page.route("**/_next/static/chunks/**", async (route) => {
    if (route.request().url().includes("booking-wizard")) {
      await new Promise((resolve) => setTimeout(resolve, 1200));
    }
    await route.continue();
  });

  await page.goto("/");

  await clickBookingTrigger(page);

  await expect(page.locator("#ironclad-booking-preboot-shell")).toBeVisible({
    timeout: 1000,
  });
  await expect(page.getByRole("dialog", { name: dialogName })).toBeVisible();
  await expect(page.locator("#ironclad-booking-preboot-shell")).toHaveCount(0);
  expect(new URL(page.url()).pathname).toBe("/book");
});

test("booking links reopen the wizard after closing on the book route", async ({ page }) => {
  await page.goto("/book");

  const dialog = page.getByRole("dialog", { name: dialogName });
  await expect(dialog).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();

  await clickBookingTrigger(page);
  await expect(dialog).toBeVisible();
  expect(new URL(page.url()).pathname).toBe("/book");
});

test("location booking links with query strings open the wizard on the book route", async ({ page }) => {
  await page.goto("/service-area/austin-tx");

  await clickBookingTrigger(page, "Book in Austin");

  await expect(page.getByRole("dialog", { name: dialogName })).toBeVisible();
  const url = new URL(page.url());
  expect(url.pathname).toBe("/book");
  expect(url.searchParams.get("location")).toBe("austin-tx");

  await page.goBack();
  await expect(page.getByRole("dialog", { name: dialogName })).toBeHidden();
  expect(new URL(page.url()).pathname).toBe("/service-area/austin-tx");
});

test("standard service page booking links open the wizard on the book route", async ({ page }) => {
  await page.goto("/plumbing/repairs");

  await clickBookingTrigger(page);

  await expect(page.getByRole("dialog", { name: dialogName })).toBeVisible();
  expect(new URL(page.url()).pathname).toBe("/book");
});

test("service template booking links preserve service query on the book route", async ({ page }) => {
  await page.goto("/plumbing/drain-clearing");

  await page.getByRole("link", { name: "Schedule online" }).first().click();

  await expect(page.getByRole("dialog", { name: dialogName })).toBeVisible();
  const url = new URL(page.url());
  expect(url.pathname).toBe("/book");
  expect(url.searchParams.get("service")).toBe("drain-clearing");
});
