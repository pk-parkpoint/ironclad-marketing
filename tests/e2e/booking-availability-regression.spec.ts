import { expect, test } from "@playwright/test";

function tomorrowId(): string {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
}

function rawWindow(date: string, hour: number, id: string) {
  const startHour = String(hour).padStart(2, "0");
  const endHour = String(hour + 2).padStart(2, "0");
  return {
    arrivalWindowLabel: `${startHour}:00 - ${endHour}:00`,
    displayLabel: `${startHour}:00 - ${endHour}:00`,
    endTime: `${date}T${endHour}:00:00-05:00`,
    isAvailable: true,
    offerId: id,
    startTime: `${date}T${startHour}:00:00-05:00`,
    windowId: id,
  };
}

test("tomorrow is selected and populated without a date click", async ({ page }) => {
  const searchedDates: string[] = [];
  const heldWindowIds: string[] = [];

  await page.route("**/api/scheduling/v3/availability/*", async (route) => {
    const action = route.request().url().split("/").pop() || "";
    const payload = route.request().postDataJSON() as Record<string, string>;
    if (action === "search") {
      searchedDates.push(payload.date);
      await route.fulfill({
        contentType: "application/json",
        json: {
          requestId: "search-regression",
          state: "available",
          windows: [
            rawWindow(payload.date, 12, "midday-primary"),
            rawWindow(payload.date, 13, "midday-fallback"),
            rawWindow(payload.date, 15, "afternoon-primary"),
          ],
        },
      });
      return;
    }
    if (action === "hold") {
      heldWindowIds.push(payload.windowId);
      if (payload.windowId === "midday-primary") {
        await route.fulfill({
          contentType: "application/json",
          json: { error: "Selected window is no longer available." },
          status: 409,
        });
        return;
      }
      await route.fulfill({
        contentType: "application/json",
        json: {
          expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
          holdId: "hold-fallback",
          offerId: payload.offerId,
          state: "hold_active",
          ttlSeconds: 300,
          windowId: payload.windowId,
        },
        status: 201,
      });
      return;
    }
    await route.fulfill({
      contentType: "application/json",
      json: { holdId: payload.holdId, released: true, state: "released" },
    });
  });

  await page.goto("/book");
  const dialog = page.getByRole("dialog", { name: "Request an Appointment" });
  await dialog.getByRole("button", { name: /Leaks, Blockages, or Sewer/i }).click();
  await dialog.getByRole("button", { name: /^Fix a Leak/i }).click();

  const textInputs = dialog.locator('input[type="text"]');
  await textInputs.nth(0).fill("Availability");
  await textInputs.nth(1).fill("Tester");
  await dialog.locator('input[type="tel"]').fill("5125550100");
  await textInputs.nth(2).fill("123 Test Street, Austin, TX 78701");
  await dialog.getByRole("button", { name: "Continue" }).click();

  const tomorrow = dialog.getByRole("button", { name: /^Tomorrow,/ });
  const midday = dialog.getByRole("button", { name: "12:00 PM - 3:00 PM" });
  await expect(tomorrow).toHaveAttribute("aria-pressed", "true");
  await expect(dialog.getByRole("button", { name: "9:00 AM - 12:00 PM" })).toHaveCount(0);
  await expect(midday).toBeVisible();
  await expect(dialog.getByRole("button", { name: "3:00 PM - 6:00 PM" })).toBeVisible();
  await expect(midday).toHaveAttribute("aria-pressed", "true");
  await expect(dialog.getByText(/This time is reserved for/)).toBeVisible();
  await expect(midday).toBeInViewport();

  expect(searchedDates).toEqual([tomorrowId()]);
  expect(heldWindowIds).toEqual(["midday-primary", "midday-fallback"]);
});
