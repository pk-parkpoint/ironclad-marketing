import { expect, test, type Page } from "@playwright/test";

const dialogName = "Request an Appointment";

async function clickBookingTrigger(page: Page, name = "Schedule Now") {
  const link = page.getByRole("link", { name }).first();
  try {
    await link.waitFor({ state: "visible", timeout: 1500 });
    await link.click();
    return;
  } catch {
    await page.getByRole("button", { name: "Book Service" }).click();
  }
}

test("booking links open the wizard without waiting for route navigation", async ({ page }) => {
  await page.goto("/");

  await clickBookingTrigger(page);

  await expect(page.getByRole("dialog", { name: dialogName })).toBeVisible();
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

  await expect(page.getByRole("dialog", { name: "Opening booking" })).toBeVisible({ timeout: 1000 });
  await expect(page.getByRole("dialog", { name: dialogName })).toBeVisible();
  expect(new URL(page.url()).pathname).toBe("/");
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

test("location booking links with query strings open the wizard in place", async ({ page }) => {
  await page.goto("/service-area/austin-tx");

  await clickBookingTrigger(page, "Book in Austin");

  await expect(page.getByRole("dialog", { name: dialogName })).toBeVisible();
  expect(new URL(page.url()).pathname).toBe("/service-area/austin-tx");
});

test("standard service page booking links open the wizard in place", async ({ page }) => {
  await page.goto("/plumbing/repairs");

  await clickBookingTrigger(page);

  await expect(page.getByRole("dialog", { name: dialogName })).toBeVisible();
  expect(new URL(page.url()).pathname).toBe("/plumbing/repairs");
});

test("service template booking links open the wizard in place", async ({ page }) => {
  await page.goto("/plumbing/drain-cleaning");

  await clickBookingTrigger(page);

  await expect(page.getByRole("dialog", { name: dialogName })).toBeVisible();
  expect(new URL(page.url()).pathname).toBe("/plumbing/drain-cleaning");
});
