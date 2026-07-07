import { expect, test } from "@playwright/test";

const dialogName = "Request an Appointment";

test("booking links open the wizard without waiting for route navigation", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: "Schedule Now" }).first().click();

  await expect(page.getByRole("dialog", { name: dialogName })).toBeVisible();
  expect(new URL(page.url()).pathname).toBe("/");
});

test("booking links reopen the wizard after closing on the book route", async ({ page }) => {
  await page.goto("/book");

  const dialog = page.getByRole("dialog", { name: dialogName });
  await expect(dialog).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();

  await page.getByRole("link", { name: "Schedule Now" }).first().click();
  await expect(dialog).toBeVisible();
  expect(new URL(page.url()).pathname).toBe("/book");
});

test("location booking links with query strings open the wizard in place", async ({ page }) => {
  await page.goto("/service-area/austin-tx");

  await page.getByRole("link", { name: "Book in Austin" }).first().click();

  await expect(page.getByRole("dialog", { name: dialogName })).toBeVisible();
  expect(new URL(page.url()).pathname).toBe("/service-area/austin-tx");
});

test("standard service page booking links open the wizard in place", async ({ page }) => {
  await page.goto("/plumbing/repairs");

  await page.getByRole("link", { name: "Schedule Now" }).first().click();

  await expect(page.getByRole("dialog", { name: dialogName })).toBeVisible();
  expect(new URL(page.url()).pathname).toBe("/plumbing/repairs");
});

test("service template booking links open the wizard in place", async ({ page }) => {
  await page.goto("/plumbing/drain-cleaning");

  await page.getByRole("link", { name: "Schedule Now" }).first().click();

  await expect(page.getByRole("dialog", { name: dialogName })).toBeVisible();
  expect(new URL(page.url()).pathname).toBe("/plumbing/drain-cleaning");
});
