import { expect, test, type Locator, type Page } from "@playwright/test";

type CapturedAbandonmentPayload = {
  booking: Record<string, string>;
  status: string;
  tracking: {
    abandonmentScreen: string;
    bookingApiSubmitted: string;
    screensVisited: string[];
  };
};

function uniqueSuffix(): string {
  return `${Date.now()}${Math.floor(Math.random() * 900) + 100}`;
}

function nextDateId(offsetDays: number): string {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().slice(0, 10);
}

async function mockSchedulingFacade(page: Page): Promise<void> {
  const appointmentDate = nextDateId(1);
  const startTime = `${appointmentDate}T10:00:00-05:00`;
  const endTime = `${appointmentDate}T12:00:00-05:00`;

  await page.route("**/api/scheduling/v3/availability/*", async (route) => {
    const action = route.request().url().split("/").pop() || "";
    if (action === "search") {
      await route.fulfill({
        contentType: "application/json",
        json: {
          requestId: "search-1",
          state: "available",
          windows: [
            {
              arrivalWindowLabel: "10:00 AM - 12:00 PM",
              displayLabel: "Tomorrow, 10:00 AM - 12:00 PM",
              endTime,
              isAvailable: true,
              offerId: "offer-1",
              startTime,
              windowId: "window-1",
            },
          ],
        },
      });
      return;
    }
    if (action === "hold") {
      await route.fulfill({
        contentType: "application/json",
        json: {
          expiresAt: new Date(Date.now() + 8 * 60 * 1000).toISOString(),
          holdId: "hold-1",
          offerId: "offer-1",
          state: "hold_active",
          ttlSeconds: 480,
          windowId: "window-1",
        },
        status: 201,
      });
      return;
    }
    if (action === "book") {
      await route.fulfill({
        contentType: "application/json",
        json: {
          appointmentId: "appointment-1",
          bookingId: "booking-1",
          confirmationNumber: "IC-1234",
          state: "booked",
        },
      });
      return;
    }
    await route.fulfill({ contentType: "application/json", json: { released: true, state: "released" } });
  });
}

async function startBookingFlow(page: Page): Promise<Locator> {
  await mockSchedulingFacade(page);
  await page.goto("/book");

  const dialog = page.getByRole("dialog", { name: "Request an Appointment" });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: /Installations or Replacements/i }).click();
  await dialog.getByRole("button", { name: /Fixture \(sink, toilet, etc\.\)/i }).click();
  await expect(dialog.getByRole("heading", { name: /Choose an Appointment Time/i })).toBeVisible();

  await dialog.getByRole("button", { name: /Tomorrow/i }).click();
  await dialog.getByRole("button", { name: "10:00 AM - 12:00 PM" }).click();
  await expect(dialog.getByText(/This time is reserved for/)).toBeVisible();
  await dialog.getByRole("button", { name: "Continue" }).click();

  await expect(dialog.getByRole("heading", { name: /Enter your information/i })).toBeVisible();
  return dialog;
}

function requireCapturedPayload(payload: CapturedAbandonmentPayload | null): CapturedAbandonmentPayload {
  expect(payload).not.toBeNull();
  return payload as CapturedAbandonmentPayload;
}

test("booking wizard sends captured contact data when abandoned before submit", async ({ page }) => {
  const suffix = uniqueSuffix();
  const testEmail = `abandon-before-submit-${suffix}@example.com`;
  const testPhone = `(512) 555-${suffix.slice(-4)}`;
  let capturedPayload: CapturedAbandonmentPayload | null = null;

  await page.route("**/api/bookings/abandon", async (route) => {
    capturedPayload = route.request().postDataJSON() as CapturedAbandonmentPayload;
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
  const payload = requireCapturedPayload(capturedPayload);

  expect(payload.status).toBe("abandoned");
  expect(payload.booking.customerName).toBe("Abandon Tester");
  expect(payload.booking.phone).toBe(testPhone);
  expect(payload.booking.email).toBe(testEmail);
  expect(payload.booking.address).toBe("123 Test Street, Austin, TX 78701");
  expect(payload.booking.serviceCategory).toBe("Installations Replacements");
  expect(payload.booking.serviceDetail).toBe("Fixture");
  expect(payload.booking.serviceDisplay).toBe("Installations Replacements > Fixture");
  expect(payload.booking.preferredDate).not.toBe("NA");
  expect(payload.booking.preferredWindow).toBe("10:00 AM - 12:00 PM");
  expect(payload.booking.notes).toBe("NA");
  expect(payload.booking.gateCode).toBe("NA");
  expect(payload.booking.propertyType).toBe("NA");
  expect(payload.booking.ownershipStatus).toBe("NA");
  expect(payload.booking.petsOnPremise).toBe("NA");
  expect(payload.booking.contactPreference).toBe("NA");
  expect(payload.tracking.bookingApiSubmitted).toBe("No");
  expect(payload.tracking.abandonmentScreen).toBe("contact_info");
  expect(payload.tracking.screensVisited).toEqual(["select_issue", "schedule_time", "contact_info"]);
});

test("booking wizard keeps step-four answers when abandoned after submit", async ({ page }) => {
  const suffix = uniqueSuffix();
  const testEmail = `abandon-after-submit-${suffix}@example.com`;
  const testPhone = `(512) 555-${suffix.slice(-4)}`;
  let capturedPayload: CapturedAbandonmentPayload | null = null;

  await page.route("**/api/bookings/abandon", async (route) => {
    capturedPayload = route.request().postDataJSON() as CapturedAbandonmentPayload;
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
  const payload = requireCapturedPayload(capturedPayload);

  expect(payload.status).toBe("abandoned");
  expect(payload.booking.bookingId).toBe("booking-1");
  expect(payload.booking.customerName).toBe("Later Closer");
  expect(payload.booking.phone).toBe(testPhone);
  expect(payload.booking.email).toBe(testEmail);
  expect(payload.booking.address).toBe("456 Test Avenue, Austin, TX 78702");
  expect(payload.booking.notes).toBe("Use the alley gate.");
  expect(payload.booking.gateCode).toBe("4242");
  expect(payload.booking.propertyType).toBe("Commercial");
  expect(payload.booking.ownershipStatus).toBe("Someone Else");
  expect(payload.booking.petsOnPremise).toBe("Yes");
  expect(payload.booking.contactPreference).toBe("Text");
  expect(payload.tracking.bookingApiSubmitted).toBe("Yes");
  expect(payload.tracking.abandonmentScreen).toBe("confirm_details");
  expect(payload.tracking.screensVisited).toEqual([
    "select_issue",
    "schedule_time",
    "contact_info",
    "confirm_details",
  ]);
});
