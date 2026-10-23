import { expect, test } from "@playwright/test";
import { isolateBookingTraffic } from "./entry-review-safety";

test.use({ actionTimeout: 10_000 });

test("fresh wizard disables October 20 on October 23 without reserving a time", async ({ page }) => {
  const events = await isolateBookingTraffic(page, new Date("2026-10-23T15:00:00Z"));
  await page.goto("/book");
  const dialog = page.getByRole("dialog", { name: "Request an Appointment", exact: true });
  await expect(dialog.getByRole("button", { name: "Tuesday, Oct 20", exact: true })).toBeDisabled();
  await expect(dialog.getByRole("button", { name: /^Today, Friday, Oct 23$/ })).toHaveAttribute("aria-pressed", "true");
  expect(events.actions.filter((a) => a.action === "hold")).toHaveLength(0);
});

for (const contact of [false, true]) {
  test(`returning to an October 20 tab on October 23 refreshes ${contact ? "contact step" : "calendar"}`, async ({ page }, testInfo) => {
    const now = new Date("2026-10-20T15:00:00Z");
    const events = await isolateBookingTraffic(page, now);
    await page.goto("/book");
    const dialog = page.getByRole("dialog", { name: "Request an Appointment", exact: true });
    await expect(dialog.getByRole("button", { name: /^Today, Tuesday, Oct 20$/ })).toHaveAttribute("aria-pressed", "true");
    if (contact) {
      await dialog.getByRole("button", { name: "12:00 PM - 3:00 PM", exact: true }).click();
      await expect(dialog.getByText(/This time is reserved for/)).toBeVisible();
      await dialog.getByRole("button", { name: "Continue", exact: true }).click();
      await dialog.getByRole("textbox", { name: "First name", exact: true }).fill("Retained");
    }
    const offset = events.actions.length;
    now.setTime(Date.parse("2026-10-23T15:00:00Z"));
    await page.clock.setFixedTime(now);
    await page.evaluate(() => window.dispatchEvent(new Event("focus")));
    await expect(dialog.getByRole("heading", { name: "Choose an Appointment Time" })).toBeVisible();
    await expect(dialog.getByRole("button", { name: /^Today, Friday, Oct 23$/ })).toHaveAttribute("aria-pressed", "true");
    await expect(dialog.getByRole("button", { name: "Tuesday, Oct 20", exact: true })).toBeDisabled();
    await expect(dialog.getByRole("status")).toContainText("date from your earlier visit has passed");
    await expect(dialog.getByRole("button", { name: "12:00 PM - 3:00 PM", exact: true })).toHaveAttribute("aria-pressed", "false");
    expect(events.actions.slice(offset).filter((a) => a.action === "hold" || a.action === "book")).toHaveLength(0);
    await page.screenshot({ path: testInfo.outputPath("resumed-date.png"), animations: "disabled" });
    if (contact) {
      await dialog.getByRole("button", { name: "12:00 PM - 3:00 PM", exact: true }).click();
      await dialog.getByRole("button", { name: "Continue", exact: true }).click();
      await expect(dialog.getByRole("textbox", { name: "First name", exact: true })).toHaveValue("Retained");
    }
    expect(events.unexpectedWrites).toEqual([]);
    expect(events.pageErrors).toEqual([]);
  });
}

test("a resumed stale calendar advances into the current month", async ({ page }) => {
  const now = new Date("2026-10-20T15:00:00Z");
  await isolateBookingTraffic(page, now);
  await page.goto("/book");
  const dialog = page.getByRole("dialog", { name: "Request an Appointment", exact: true });
  await expect(dialog.getByRole("button", { name: /^Today, Tuesday, Oct 20$/ })).toHaveAttribute("aria-pressed", "true");
  now.setTime(Date.parse("2026-11-01T16:00:00Z"));
  await page.clock.setFixedTime(now);
  await page.evaluate(() => window.dispatchEvent(new Event("pageshow")));
  await expect(dialog.getByText("November 2026", { exact: true })).toBeVisible();
  await expect(dialog.getByRole("button", { name: /^Today, Sunday, Nov 1$/ })).toHaveAttribute("aria-pressed", "true");
});
