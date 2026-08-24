import { expect, test, type Page } from "@playwright/test";

type AvailabilityCase = {
  expectedDate: string;
  expectedWindowIds: string[];
  expectedVisible: string[];
  frozenTime: string;
  hidden: string[];
  name: string;
};

const cases: AvailabilityCase[] = [
  {
    expectedDate: "2026-08-12",
    expectedWindowIds: ["window-12", "window-13"],
    expectedVisible: ["12:00 PM - 3:00 PM", "3:00 PM - 6:00 PM"],
    frozenTime: "2026-08-12T15:00:00Z",
    hidden: ["9:00 AM - 12:00 PM"],
    name: "at 10 AM it opens today at the noon window",
  },
  {
    expectedDate: "2026-08-12",
    expectedWindowIds: ["window-15"],
    expectedVisible: ["3:00 PM - 6:00 PM"],
    frozenTime: "2026-08-12T19:00:00Z",
    hidden: ["9:00 AM - 12:00 PM", "12:00 PM - 3:00 PM"],
    name: "at 2 PM it opens today at the 3 PM window",
  },
  {
    expectedDate: "2026-08-13",
    expectedWindowIds: ["window-9"],
    expectedVisible: [
      "9:00 AM - 12:00 PM",
      "12:00 PM - 3:00 PM",
      "3:00 PM - 6:00 PM",
    ],
    frozenTime: "2026-08-12T20:01:00Z",
    hidden: [],
    name: "after 3 PM it opens tomorrow with all three windows",
  },
];

function rawWindow(date: string, hour: number) {
  const startHour = String(hour).padStart(2, "0");
  const endHour = String(hour + 2).padStart(2, "0");
  return {
    endTime: `${date}T${endHour}:00:00-05:00`,
    isAvailable: true,
    offerId: `offer-${hour}`,
    startTime: `${date}T${startHour}:00:00-05:00`,
    windowId: `window-${hour}`,
  };
}

async function reachScheduleStep(page: Page) {
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
  return dialog;
}

for (const scenario of cases) {
  test(scenario.name, async ({ page }) => {
    await page.clock.setFixedTime(new Date(scenario.frozenTime));
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
              rawWindow(payload.date, 9),
              rawWindow(payload.date, 12),
              ...(scenario.expectedWindowIds.length > 1
                ? [rawWindow(payload.date, 13)]
                : []),
              rawWindow(payload.date, 15),
            ],
          },
        });
        return;
      }
      if (action === "hold") {
        heldWindowIds.push(payload.windowId);
        if (scenario.expectedWindowIds.length > 1 && payload.windowId === "window-12") {
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
            expiresAt: new Date(
              new Date(scenario.frozenTime).getTime() + 5 * 60 * 1000,
            ).toISOString(),
            holdId: "hold-regression",
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

    const dialog = await reachScheduleStep(page);
    const selectedDate = dialog.getByRole("button", {
      name: scenario.expectedDate === "2026-08-12" ? /^Today,/ : /^Tomorrow,/,
    });
    await expect(selectedDate).toHaveAttribute("aria-pressed", "true");

    for (const label of scenario.expectedVisible) {
      await expect(dialog.getByRole("button", { name: label })).toBeVisible();
    }
    for (const label of scenario.hidden) {
      await expect(dialog.getByRole("button", { name: label })).toHaveCount(0);
    }

    const firstVisible = dialog.getByRole("button", { name: scenario.expectedVisible[0] });
    await expect(firstVisible).toHaveAttribute("aria-pressed", "true");
    await expect(dialog.getByText(/This time is reserved for/)).toBeVisible();
    await expect(firstVisible).toBeInViewport();
    await expect.poll(() => new Set(searchedDates).size).toBe(3);
    expect(searchedDates[0]).toBe(scenario.expectedDate);
    expect(heldWindowIds).toEqual(scenario.expectedWindowIds);
  });
}
