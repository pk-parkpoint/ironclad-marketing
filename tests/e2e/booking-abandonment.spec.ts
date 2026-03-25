import { expect, test, type Locator, type Page } from "@playwright/test";

function uniqueSuffix(): string {
  return `${Date.now()}${Math.floor(Math.random() * 900) + 100}`;
}

async function startBookingFlow(page: Page): Promise<Locator> {
  await page.goto("/book");

  const dialog = page.getByRole("dialog", { name: "Request an Appointment" });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: /Installations or Replacements/i }).click();
  await dialog.getByRole("button", { name: /Fixture \(sink, toilet, etc\.\)/i }).click();
  await expect(dialog.getByRole("heading", { name: /Choose a Day for Your Appointment/i })).toBeVisible();

  const firstAvailableDay = dialog.locator("button:not([disabled])").filter({ hasText: /^\d+$/ }).first();
  await firstAvailableDay.click();
  await dialog.getByRole("button", { name: "Continue" }).click();

  await expect(dialog.getByRole("heading", { name: /Enter your information/i })).toBeVisible();
  return dialog;
}

test("booking wizard sends captured contact data when abandoned before submit", async ({ page }) => {
  const suffix = uniqueSuffix();
  const testEmail = `abandon-before-submit-${suffix}@example.com`;
  const testPhone = `(512) 555-${suffix.slice(-4)}`;
  let capturedPayload: {
    booking: Record<string, string>;
    status: string;
    tracking: {
      abandonmentScreen: string;
      bookingApiSubmitted: string;
      screensVisited: string[];
    };
  } | null = null;

  await page.route("**/api/bookings/abandon", async (route) => {
    capturedPayload = route.request().postDataJSON() as typeof capturedPayload;
    await route.fulfill({
      body: JSON.stringify({ sent: true }),
      contentType: "application/json",
      status: 200,
    });
  });

  const dialog = await startBookingFlow(page);
  const textInputs = dialog.locator('input[type="text"]');

  await textInputs.nth(0).fill("Abandon");
  await textInputs.nth(1).fill("Tester");
  await dialog.locator('input[type="tel"]').fill(testPhone);
  await dialog.locator('input[type="email"]').fill(testEmail);
  await textInputs.nth(2).fill("123 Test Street, Austin, TX 78701");

  await dialog.getByRole("button", { name: "Close booking modal" }).first().click();
  await expect.poll(() => capturedPayload !== null).toBeTruthy();

  expect(capturedPayload?.status).toBe("abandoned");
  expect(capturedPayload?.booking.customerName).toBe("Abandon Tester");
  expect(capturedPayload?.booking.phone).toBe(testPhone);
  expect(capturedPayload?.booking.email).toBe(testEmail);
  expect(capturedPayload?.booking.address).toBe("123 Test Street, Austin, TX 78701");
  expect(capturedPayload?.booking.serviceCategory).toBe("Installations Replacements");
  expect(capturedPayload?.booking.serviceDetail).toBe("Fixture");
  expect(capturedPayload?.booking.serviceDisplay).toBe("Installations Replacements > Fixture");
  expect(capturedPayload?.booking.preferredDate).not.toBe("NA");
  expect(capturedPayload?.booking.preferredWindow).toBe("Flexible");
  expect(capturedPayload?.booking.notes).toBe("NA");
  expect(capturedPayload?.booking.gateCode).toBe("NA");
  expect(capturedPayload?.booking.propertyType).toBe("NA");
  expect(capturedPayload?.booking.ownershipStatus).toBe("NA");
  expect(capturedPayload?.booking.petsOnPremise).toBe("NA");
  expect(capturedPayload?.booking.contactPreference).toBe("NA");
  expect(capturedPayload?.tracking.bookingApiSubmitted).toBe("No");
  expect(capturedPayload?.tracking.abandonmentScreen).toBe("contact_info");
  expect(capturedPayload?.tracking.screensVisited).toEqual(["select_issue", "schedule_time", "contact_info"]);
});

test("booking wizard keeps step-four answers when abandoned after submit", async ({ page }) => {
  const suffix = uniqueSuffix();
  const testEmail = `abandon-after-submit-${suffix}@example.com`;
  const testPhone = `(512) 555-${suffix.slice(-4)}`;
  let capturedPayload: {
    booking: Record<string, string>;
    status: string;
    tracking: {
      abandonmentScreen: string;
      bookingApiSubmitted: string;
      screensVisited: string[];
    };
  } | null = null;

  await page.route("**/api/bookings/abandon", async (route) => {
    capturedPayload = route.request().postDataJSON() as typeof capturedPayload;
    await route.fulfill({
      body: JSON.stringify({ sent: true }),
      contentType: "application/json",
      status: 200,
    });
  });

  const dialog = await startBookingFlow(page);
  const textInputs = dialog.locator('input[type="text"]');

  await textInputs.nth(0).fill("Later");
  await textInputs.nth(1).fill("Closer");
  await dialog.locator('input[type="tel"]').fill(testPhone);
  await dialog.locator('input[type="email"]').fill(testEmail);
  await textInputs.nth(2).fill("456 Test Avenue, Austin, TX 78702");
  await dialog.locator('input[type="checkbox"]').check();
  await dialog.getByRole("button", { name: "Submit" }).click();

  await expect(dialog.getByRole("heading", { name: /Your appointment is confirmed!/i })).toBeVisible();

  await dialog.locator("textarea").fill("Use the alley gate.");
  await dialog.getByRole("button", { name: "Commercial" }).click();
  await dialog.getByRole("button", { name: "Someone else owns" }).click();
  await dialog.locator('input[type="text"]').fill("4242");
  await dialog.getByRole("checkbox", { name: /Pets on premise/i }).check();
  await dialog.getByRole("radio", { name: "Text" }).check();

  await dialog.getByRole("button", { name: "Close booking modal" }).first().click();
  await expect.poll(() => capturedPayload !== null).toBeTruthy();

  expect(capturedPayload?.status).toBe("abandoned");
  expect(capturedPayload?.booking.bookingId).toMatch(/^book_/);
  expect(capturedPayload?.booking.customerName).toBe("Later Closer");
  expect(capturedPayload?.booking.phone).toBe(testPhone);
  expect(capturedPayload?.booking.email).toBe(testEmail);
  expect(capturedPayload?.booking.address).toBe("456 Test Avenue, Austin, TX 78702");
  expect(capturedPayload?.booking.notes).toBe("Use the alley gate.");
  expect(capturedPayload?.booking.gateCode).toBe("4242");
  expect(capturedPayload?.booking.propertyType).toBe("Commercial");
  expect(capturedPayload?.booking.ownershipStatus).toBe("Someone Else");
  expect(capturedPayload?.booking.petsOnPremise).toBe("Yes");
  expect(capturedPayload?.booking.contactPreference).toBe("Text");
  expect(capturedPayload?.tracking.bookingApiSubmitted).toBe("Yes");
  expect(capturedPayload?.tracking.abandonmentScreen).toBe("confirm_details");
  expect(capturedPayload?.tracking.screensVisited).toEqual([
    "select_issue",
    "schedule_time",
    "contact_info",
    "confirm_details",
  ]);
});
