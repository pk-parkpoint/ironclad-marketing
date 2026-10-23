import { expect, type Page } from "@playwright/test";
import { expectedIssueChoice } from "./entry-review-prefill";
import type { EntryReviewEvents } from "./entry-review-safety";

/** Complete the actual wizard, checking input/confirmation through intercepted transport. */
export async function completeEntryBooking(page: Page, events: EntryReviewEvents, offset: number) {
  const dialog = page.getByRole("dialog", { name: "Request an Appointment", exact: true });
  await expect(dialog).toHaveCount(1);
  await expect(dialog.getByRole("heading", { name: "Choose an Appointment Time" })).toBeVisible();
  await expect(page.locator("#ironclad-booking-preboot-shell")).toHaveCount(0);
  const time = dialog.getByRole("button", { name: "12:00 PM - 3:00 PM", exact: true });
  await expect(time).toBeVisible();
  await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
  const automaticHold = events.actions.slice(offset).some((event) => event.action === "hold")
    || await time.getAttribute("aria-pressed") === "true";
  const findings: string[] = [];
  if (automaticHold) findings.push("appointment time reserved before customer choice");
  if (!automaticHold) {
    await expect(time).toHaveAttribute("aria-pressed", "false");
    await dialog.getByRole("button", { name: "Continue", exact: true }).click();
    await expect(dialog.getByText("Please choose an available appointment time.")).toBeVisible();
    await expect(dialog.getByRole("heading", { name: "Choose an Appointment Time" })).toBeVisible();
  }
  await time.click();
  await expect(dialog.getByText(/This time is reserved for/)).toBeVisible();
  await dialog.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(dialog.getByRole("heading", { name: "Enter your information" })).toBeVisible();
  await dialog.getByLabel("First name", { exact: true }).fill("Entry");
  await dialog.getByLabel("Last name", { exact: true }).fill("Review");
  await dialog.getByLabel("Phone number", { exact: true }).fill("5125550199");
  await dialog.getByLabel("Email (optional)", { exact: true }).fill("entry-review@example.test");
  await dialog.getByLabel("Service address", { exact: true }).fill("100 Test Street");
  await dialog.getByLabel("City", { exact: true }).fill("Austin");
  await dialog.getByLabel("State", { exact: true }).fill("TX");
  await dialog.getByLabel("ZIP code", { exact: true }).fill("78701");
  await dialog.getByRole("button", { name: "Continue", exact: true }).click();
  const category = dialog.getByRole("button", { name: /^Leaks, Blockages, or Sewer/ });
  const detail = dialog.getByRole("button", { name: /^Fix a Leak/ });
  const installation = dialog.getByRole("button", { name: /^Water Heater/ });
  await expect(dialog.getByText(/Pick what best|helps us send/)).toBeVisible();
  const initialIssue = await dialog.locator('button[class*="optionCardSelected"]').allTextContents();
  const service = new URL(page.url()).searchParams.get("service");
  if (service) {
    expect(initialIssue).toHaveLength(1);
    expect(initialIssue[0]).toContain(expectedIssueChoice(service));
  } else {
    expect(initialIssue).toEqual([]);
  }
  let editedIssue = "Fix a Leak";
  let issueSummary = "Leaks Blockages Sewer > Fix A Leak";
  if (await category.isVisible()) {
    await category.click();
    await detail.click();
  } else if (await detail.isVisible()) {
    await detail.click();
  } else {
    await expect(installation).toBeVisible();
    editedIssue = "Water Heater";
    issueSummary = "Installations Replacements > Water Heater";
    await installation.click();
  }
  const confirm = dialog.getByTestId("booking-step-4");
  await expect(confirm.getByRole("heading", { name: "Confirm your appointment details" })).toBeVisible();
  await expect(confirm.getByText("Entry Review", { exact: true })).toBeVisible();
  await expect(confirm.getByText(editedIssue, { exact: true })).toBeVisible();
  await expect(confirm.getByText("12:00 PM - 3:00 PM", { exact: true })).toBeVisible();
  const before = events.actions.filter((event) => event.action === "book").length;
  await confirm.getByRole("button", { name: "Confirm Appointment", exact: true }).click();
  await expect(dialog.getByTestId("booking-confirmation").getByRole("heading", {
    name: "Your appointment is confirmed!", exact: true,
  })).toBeVisible();
  const books = events.actions.filter((event) => event.action === "book");
  expect(books).toHaveLength(before + 1);
  expect(books.at(-1)?.payload).toMatchObject({
    holdId: "entry-review-hold",
    booking: {
      issueSummary,
      name: "Entry Review", phone: "(512) 555-0199", email: "entry-review@example.test",
      address: { city: "Austin", state: "TX", postalCode: "78701" },
    },
  });
  return { findings, initialIssue };
}
