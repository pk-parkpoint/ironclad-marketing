import { test, expect } from "@playwright/test";

for (const outcome of ["abandoned", "completed", "manual"] as const) {
test(`${outcome === "manual" ? "Manual entry" : "Google selection"} preserves locality in ${outcome} booking payloads`, async ({ page }, testInfo) => {
  if (outcome !== "manual") await page.addInitScript(() => {
    const components = [
      ["1100", "1100", "street_number"], ["Congress Avenue", "Congress Ave", "route"],
      ["Austin", "Austin", "locality"], ["Texas", "TX", "administrative_area_level_1"],
      ["78701", "78701", "postal_code"], ["United States", "US", "country"],
    ].map(([long_name, short_name, type]) => ({ long_name, short_name, types: [type] }));
    Object.assign(window, { google: { maps: { places: {
      AutocompleteSessionToken: class {},
      Autocomplete: class {
        constructor(private input: HTMLInputElement) {}
        addListener(_event: string, callback: () => void) { this.input.addEventListener("change", callback); }
        getPlace() { return { address_components: components, formatted_address: "1100 Congress Ave, Austin, TX 78701, USA" }; }
      },
    } } } });
  });
  let booked: Record<string, unknown> | undefined;
  await page.route("**/api/scheduling/v3/availability/*", async route => {
    const action = route.request().url().split("/").pop();
    const day = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
    const response = action === "search" ? { state: "available", windows: [{ offerId: "offer-1", windowId: "window-1", isAvailable: true, startTime: `${day}T10:00:00-05:00`, endTime: `${day}T12:00:00-05:00` }] }
      : action === "hold" ? { state: "hold_active", holdId: "hold-1", ttlSeconds: 480 }
      : action === "book" ? { state: "booked", bookingId: "booking-address", appointmentId: "appointment-address" }
      : { state: "released" };
    if (action === "book") booked = route.request().postDataJSON().booking;
    await route.fulfill({ json: response });
  });
  let completed: { booking: Record<string, string> } | undefined;
  await page.route("**/api/bookings/notify", async route => {
    completed = route.request().postDataJSON();
    await route.fulfill({ json: { sent: false, suppressed: true } });
  });
  await page.goto("/book");
  await expect(page.getByText(/This time is reserved for/)).toBeVisible();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByLabel("First name", { exact: true }).fill("Address");
  await page.getByLabel("Last name", { exact: true }).fill("Test");
  await page.getByLabel("Phone number", { exact: true }).fill("5125550100");
  if (outcome === "manual") {
    await page.getByLabel("City", { exact: true }).fill("Austin");
    await page.getByLabel("State", { exact: true }).fill("TX");
    await page.getByLabel("ZIP code", { exact: true }).fill("78701");
    await page.getByRole("button", { name: "Continue", exact: true }).click();
    await expect(page.getByText("Service address is required.", { exact: true })).toBeVisible();
    await page.getByLabel("Service address", { exact: true }).pressSequentially("1100 Congress Avenue");
    await page.getByRole("button", { name: "Continue", exact: true }).click();
    await expect(page.getByText("City is required.", { exact: true })).toBeVisible();
    await expect(page.getByText("Enter a two-letter state.", { exact: true })).toBeVisible();
    await expect(page.getByText("Enter a valid ZIP code.", { exact: true })).toBeVisible();
    await page.getByLabel("City", { exact: true }).fill("Austin");
    await page.getByLabel("State", { exact: true }).fill("tx");
    await page.getByLabel("ZIP code", { exact: true }).fill("78701");
  } else {
    await page.getByLabel("Service address", { exact: true }).fill("1100 Congress");
  }
  await page.getByLabel("Service address", { exact: true }).press("Tab");
  await expect(page.getByLabel("City", { exact: true })).toHaveValue("Austin");
  await expect(page.getByLabel("State", { exact: true })).toHaveValue("TX");
  await expect(page.getByLabel("ZIP code", { exact: true })).toHaveValue("78701");
  if (outcome === "completed") {
    await page.getByLabel("ZIP code", { exact: true }).scrollIntoViewIfNeeded();
    await page.screenshot({ animations: "disabled", path: testInfo.outputPath("address-fields.png"), fullPage: true });
  }
  // Capture the same persisted draft used by the real abandonment lifecycle.
  let abandoned: { booking: Record<string, string> } | undefined;
  await page.route("**/api/bookings/abandon", async route => {
    abandoned = route.request().postDataJSON();
    await route.fulfill({ json: { sent: false, suppressed: true } });
  });
  if (outcome === "abandoned") {
    await page.getByRole("button", { name: "Close booking modal" }).click();
    await expect.poll(() => abandoned?.booking.address).toBe("1100 Congress Avenue, Austin, TX 78701");
    expect(abandoned?.booking).toMatchObject({ street: "1100 Congress Avenue", city: "Austin", state: "TX", zip: "78701" });
    return;
  }
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: /Leaks, Blockages, or Sewer/i }).click();
  await page.getByRole("button", { name: /^Fix a Leak/i }).click();
  await expect(page.getByTestId("booking-step-4")).toContainText("1100 Congress Avenue, Austin, TX 78701");
  await expect(page.getByTestId("booking-step-4")).not.toContainText("USA");
  await page.getByRole("button", { name: /Confirm.*appointment|Confirm booking/i }).click();
  await expect.poll(() => completed?.booking.address).toBe("1100 Congress Avenue, Austin, TX 78701");
  expect(booked?.address).toMatchObject({ fullAddress: "1100 Congress Avenue, Austin, TX 78701", street: "1100 Congress Avenue", city: "Austin", state: "TX", postalCode: "78701" });
  expect(completed?.booking).toMatchObject({ city: "Austin", state: "TX", zip: "78701" });
  expect(abandoned).toBeUndefined();
});
}
