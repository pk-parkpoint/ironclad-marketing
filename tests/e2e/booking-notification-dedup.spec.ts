import { expect, test } from "@playwright/test";

for (const path of ["/", "/plumbing/drain-clearing"]) {
  test(`one abandonment after navigating from ${path} and dismissing`, async ({ page }) => {
    const payloads: { sessionId: string; tracking: { abandonmentScreen: string } }[] = [];
    await page.route("**/api/bookings/abandon", async (route) => {
      payloads.push(route.request().postDataJSON());
      await route.fulfill({ status: 200, contentType: "application/json", body: '{"sent":true}' });
    });
    await page.goto(path);
    const link = path === "/plumbing/drain-clearing"
      ? page.getByRole("link", { name: "Schedule online", exact: true }).first()
      : page.locator('a[href^="/book"]').filter({ visible: true }).first();
    await link.click();
    const dialog = page.getByRole("dialog", { name: "Request an Appointment" });
    await expect(dialog).toBeVisible();
    await expect(page).toHaveURL(/\/book/);
    expect(payloads).toHaveLength(0);
    await dialog.getByRole("button", { name: "Close booking modal" }).first().click();
    await expect(dialog).toBeHidden();
    await expect(page).toHaveURL(/\/$/);
    await expect.poll(() => payloads.length).toBe(1);
    expect(payloads[0].sessionId).toMatch(/^booking_/);
    expect(payloads[0].tracking.abandonmentScreen).toBe(path === "/" ? "select_issue" : "contact_info");
  });
}

test("dismissal plus pagehide sends once and a deliberate reopen remains a separate attempt", async ({ page }) => {
  const attempts: string[] = [];
  await page.route("**/api/bookings/abandon", async (route) => {
    attempts.push(route.request().postDataJSON().sessionId);
    await route.fulfill({ status: 200, contentType: "application/json", body: '{"sent":true}' });
  });
  await page.goto("/book");
  const dialog = page.getByRole("dialog", { name: "Request an Appointment" });
  await expect(dialog).toBeVisible();
  expect(attempts).toHaveLength(0);
  await page.evaluate(() => {
    window.dispatchEvent(new Event("pagehide"));
    window.dispatchEvent(new Event("pagehide"));
  });
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect.poll(() => attempts.length).toBe(1);
  await page.locator('a[href^="/book"]').filter({ visible: true }).first().click();
  await expect(dialog).toBeVisible();
  expect(attempts).toHaveLength(1);
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect.poll(() => attempts.length).toBe(2);
  expect(new Set(attempts).size).toBe(2);
});

test("browser back emits exactly one abandonment for the departing wizard", async ({ page }) => {
  let requests = 0;
  await page.route("**/api/bookings/abandon", async (route) => {
    requests++;
    // WebKit does not expose the Blob body of a beacon to route interception.
    // Count actual outgoing requests here; payload coverage lives above.
    await route.fulfill({ status: 200, contentType: "application/json", body: '{"sent":true}' });
  });
  await page.goto("/");
  await page.locator('a[href^="/book"]').filter({ visible: true }).first().click();
  await expect(page.getByRole("dialog", { name: "Request an Appointment" })).toBeVisible();
  expect(requests).toBe(0);
  await page.goBack();
  await expect(page.getByRole("dialog", { name: "Request an Appointment" })).toBeHidden();
  await expect.poll(() => requests).toBe(1);
});

test("the current booking dialog retains keyboard focus containment and Escape dismissal", async ({ page }) => {
  await page.route("**/api/bookings/abandon", (route) => route.fulfill({ status: 200, body: '{"sent":true}' }));
  await page.goto("/book");
  const dialog = page.getByRole("dialog", { name: "Request an Appointment" });
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute("aria-modal", "true");
  await expect(dialog).toHaveAttribute("aria-describedby", "booking-modal-description");
  await expect(dialog.getByRole("button", { name: "Close booking modal" }).first()).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect.poll(() => dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true);
  await page.keyboard.press("Tab");
  await expect.poll(() => dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true);
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(page).toHaveURL(/\/$/);
});
