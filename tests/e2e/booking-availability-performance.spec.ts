import { expect, test, type Locator, type Page } from "@playwright/test";

const FROZEN_TIME = "2026-08-12T20:01:00Z";
const DEFAULT_DATE = "2026-08-13";

function rawWindow(date: string, hour: number) {
  const startHour = String(hour).padStart(2, "0");
  const endHour = String(hour + 2).padStart(2, "0");
  return {
    endTime: `${date}T${endHour}:00:00-05:00`,
    isAvailable: true,
    offerId: `offer-${date}-${hour}`,
    startTime: `${date}T${startHour}:00:00-05:00`,
    windowId: `window-${date}-${hour}`,
  };
}

function searchResponse(date: string) {
  return {
    requestId: `search-${date}`,
    state: "available",
    windows: [rawWindow(date, 9), rawWindow(date, 12), rawWindow(date, 15)],
  };
}

function holdResponse(payload: Record<string, string>, suffix: string) {
  return {
    expiresAt: new Date(new Date(FROZEN_TIME).getTime() + 5 * 60 * 1000).toISOString(),
    holdId: `hold-${suffix}`,
    offerId: payload.offerId,
    state: "hold_active",
    ttlSeconds: 300,
    windowId: payload.windowId,
  };
}

async function reachContactStep(page: Page) {
  await page.goto("/book");
  const dialog = page.getByRole("dialog", { name: "Request an Appointment" });
  await dialog.getByRole("button", { name: /Leaks, Blockages, or Sewer/i }).click();
  await dialog.getByRole("button", { name: /^Fix a Leak/i }).click();
  await expect(dialog.getByRole("heading", { name: "Enter your information" })).toBeVisible();
  return dialog;
}

async function completeContactStep(dialog: Locator) {
  const textInputs = dialog.locator('input[type="text"]');
  await textInputs.nth(0).fill("Availability");
  await textInputs.nth(1).fill("Tester");
  await dialog.locator('input[type="tel"]').fill("5125550100");
  await textInputs.nth(2).fill("123 Test Street, Austin, TX 78701");
  await dialog.getByRole("button", { name: "Continue" }).click();
  await expect(dialog.getByRole("heading", { name: "Choose an Appointment Time" })).toBeVisible();
}

test("prefetches nearby dates during contact entry and reuses them for instant date switches", async ({ page }) => {
  await page.clock.setFixedTime(new Date(FROZEN_TIME));
  const searchedDates: string[] = [];

  await page.route("**/api/scheduling/v3/availability/*", async (route) => {
    const action = route.request().url().split("/").pop() || "";
    const payload = route.request().postDataJSON() as Record<string, string>;
    if (action === "search") {
      searchedDates.push(payload.date);
      await new Promise((resolve) => setTimeout(resolve, 80));
      await route.fulfill({ contentType: "application/json", json: searchResponse(payload.date) });
      return;
    }
    if (action === "hold") {
      await route.fulfill({
        contentType: "application/json",
        json: holdResponse(payload, payload.windowId),
        status: 201,
      });
      return;
    }
    await route.fulfill({ contentType: "application/json", json: { released: true, state: "released" } });
  });

  const dialog = await reachContactStep(page);
  await expect.poll(() => new Set(searchedDates).size).toBe(3);
  expect(searchedDates[0]).toBe(DEFAULT_DATE);

  await completeContactStep(dialog);
  await expect(dialog.getByLabel("Loading available times")).toHaveCount(0);
  await expect(dialog.getByRole("button", { name: "9:00 AM - 12:00 PM" })).toBeVisible();
  expect(searchedDates).toHaveLength(3);

  await dialog.getByRole("button", { name: "Friday, Aug 14" }).click();
  await expect(dialog.getByRole("button", { name: "Friday, Aug 14" })).toHaveAttribute("aria-pressed", "true");
  await expect(dialog.getByRole("button", { name: "12:00 PM - 3:00 PM" })).toBeVisible();
  expect(searchedDates).toHaveLength(3);

  await dialog.getByRole("button", { name: "Thursday, Aug 13" }).click();
  await expect(dialog.getByRole("button", { name: "Thursday, Aug 13" })).toHaveAttribute("aria-pressed", "true");
  expect(searchedDates).toHaveLength(3);
});

test("highlights a new window immediately and releases the prior hold in parallel", async ({ page }) => {
  await page.clock.setFixedTime(new Date(FROZEN_TIME));
  let holdCount = 0;
  let releaseStartedAt = 0;
  let secondHoldStartedAt = 0;

  await page.route("**/api/scheduling/v3/availability/*", async (route) => {
    const action = route.request().url().split("/").pop() || "";
    const payload = route.request().postDataJSON() as Record<string, string>;
    if (action === "search") {
      await route.fulfill({ contentType: "application/json", json: searchResponse(payload.date) });
      return;
    }
    if (action === "hold") {
      holdCount += 1;
      if (holdCount > 1) {
        secondHoldStartedAt = Date.now();
        await new Promise((resolve) => setTimeout(resolve, 600));
      }
      await route.fulfill({
        contentType: "application/json",
        json: holdResponse(payload, String(holdCount)),
        status: 201,
      });
      return;
    }
    releaseStartedAt = Date.now();
    await new Promise((resolve) => setTimeout(resolve, 600));
    await route.fulfill({ contentType: "application/json", json: { released: true, state: "released" } });
  });

  const dialog = await reachContactStep(page);
  await completeContactStep(dialog);
  const firstWindow = dialog.getByRole("button", { name: "9:00 AM - 12:00 PM" });
  const secondWindow = dialog.getByRole("button", { name: "12:00 PM - 3:00 PM" });
  await expect(firstWindow).toHaveAttribute("aria-pressed", "true");
  await expect(dialog.getByText(/This time is reserved for/)).toBeVisible();

  await secondWindow.click();
  await expect(secondWindow).toHaveAttribute("aria-pressed", "true");
  await expect(secondWindow).toHaveAttribute("aria-busy", "true");
  await expect(dialog.getByRole("button", { name: "Reserving..." })).toBeDisabled();
  await expect.poll(() => releaseStartedAt > 0 && secondHoldStartedAt > 0).toBe(true);
  expect(Math.abs(secondHoldStartedAt - releaseStartedAt)).toBeLessThan(200);

  await expect(secondWindow).toHaveAttribute("aria-busy", "false");
  await expect(dialog.getByText(/This time is reserved for/)).toBeVisible();
});
