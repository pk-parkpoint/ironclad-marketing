import { expect, test } from "@playwright/test";

test("an appointment requires a deliberate time selection and an unexpired hold", async ({ page }, testInfo) => {
  let holds = 0;
  let completeHold: (() => void) | undefined;
  await page.clock.install({ time: new Date("2026-10-22T15:00:00Z") });
  await page.route("**/api/scheduling/v3/availability/*", async (route) => {
    const action = route.request().url().split("/").pop();
    const payload = route.request().postDataJSON();
    if (action === "search") {
      await route.fulfill({ json: { state: "available", windows: [{
        startTime: `${payload.date}T12:00:00-05:00`, endTime: `${payload.date}T15:00:00-05:00`,
        windowId: `window-${payload.date}`, offerId: `offer-${payload.date}`, isAvailable: true,
      }] } });
    } else if (action === "hold") {
      holds++;
      await new Promise<void>((resolve) => { completeHold = resolve; });
      await route.fulfill({ status: 201, json: {
        state: "hold_active", holdId: `hold-${holds}`, offerId: payload.offerId,
        windowId: payload.windowId, ttlSeconds: 30, expiresAt: "2026-10-22T15:00:30Z",
      } });
    } else await route.fulfill({ json: { released: true, state: "released" } });
  });
  await page.goto("/book?service=drain-clearing");
  const dialog = page.getByRole("dialog");
  const time = dialog.getByRole("button", { name: "12:00 PM - 3:00 PM", exact: true });
  await expect(time).toBeVisible();
  await expect(time).toHaveAttribute("aria-pressed", "false");
  await dialog.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(dialog.getByText("Please choose an available appointment time.")).toBeVisible();
  await expect(dialog.getByRole("heading", { name: "Choose an Appointment Time" })).toBeVisible();
  expect(holds).toBe(0);
  await page.screenshot({ path: testInfo.outputPath("time-unselected.png") });
  await time.click();
  await expect.poll(() => holds).toBe(1);
  await expect(dialog.getByRole("button", { name: "Reserving...", exact: true })).toBeDisabled();
  completeHold?.();
  await expect(dialog.getByText(/This time is reserved for/)).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("time-selected.png") });
  await dialog.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(dialog.getByRole("heading", { name: "Enter your information" })).toBeVisible();
  await dialog.getByRole("button", { name: "Return to Schedule Time" }).click();
  await page.clock.fastForward(31_000);
  await dialog.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(dialog.getByRole("heading", { name: "Choose an Appointment Time" })).toBeVisible();
  await expect(dialog.getByText("Please choose an available appointment time.")).toBeVisible();
});
