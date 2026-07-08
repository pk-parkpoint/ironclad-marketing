import { expect, test } from "@playwright/test";

const MOCK_SERVER_URL = "http://127.0.0.1:4011";

type MockEvent = {
  path: string;
  body?: {
    eventType?: string;
  };
};

type MockEventsResponse = {
  events: MockEvent[];
};

function nextDateId(offsetDays: number): string {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().slice(0, 10);
}

test("booking flow uses public scheduling facade and confirms from facade identifiers", async ({ page, request }) => {
  const uniqueSuffix = Math.floor(Math.random() * 9000) + 1000;
  const testPhone = `512555${uniqueSuffix}`;
  const testEmail = `booking-e2e-${Date.now()}@example.com`;
  const appointmentDate = nextDateId(1);
  const startTime = `${appointmentDate}T10:00:00-05:00`;
  const endTime = `${appointmentDate}T12:00:00-05:00`;
  const facadeCalls: string[] = [];
  const retiredBookingCalls: string[] = [];

  await request.delete(`${MOCK_SERVER_URL}/events`);

  await page.route("**/api/bookings", async (route) => {
    retiredBookingCalls.push(route.request().method());
    await route.fulfill({
      contentType: "application/json",
      json: { error: "retired_booking_route_called" },
      status: 500,
    });
  });

  await page.route("**/api/scheduling/v3/availability/*", async (route) => {
    const action = route.request().url().split("/").pop() || "";
    facadeCalls.push(action);
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
          manageUrl: "https://app.mainconduit.com/s/manage-token",
          state: "booked",
        },
      });
      return;
    }
    await route.fulfill({ contentType: "application/json", json: { released: true, state: "released" } });
  });

  await page.goto("/book");

  await expect(page.getByRole("heading", { name: "Request an Appointment" })).toBeVisible();

  await page.getByRole("button", { name: /Leaks, Blockages, or Sewer/i }).click();
  await expect(page.getByRole("heading", { name: "Can you tell us a bit more?" })).toBeVisible();
  await page.getByRole("button", { name: /^Fix a Leak/i }).click();
  await expect(page.getByRole("heading", { name: "Choose an Appointment Time" })).toBeVisible();

  await page.getByRole("button", { name: /Tomorrow/i }).click();
  await page.getByRole("button", { name: "9:00 AM - 12:00 PM" }).click();
  await expect(page.getByText(/This time is reserved for/)).toBeVisible();
  await page.getByRole("button", { name: "Continue" }).click();

  await expect(page.getByRole("heading", { name: "Enter your information" })).toBeVisible();
  const dialog = page.getByRole("dialog");
  await dialog.locator('input[type="text"]').nth(0).fill("E2E");
  await dialog.locator('input[type="text"]').nth(1).fill("Booker");
  await dialog.locator('input[type="tel"]').fill(testPhone);
  await dialog.locator('input[type="email"]').fill(testEmail);
  await dialog.locator('input[type="text"]').nth(2).fill("123 Test Street, Austin, TX 78701");
  await dialog.getByRole("checkbox").check();
  await dialog.getByRole("button", { name: "Submit" }).click();

  await expect(page.getByRole("heading", { name: "Your appointment is confirmed!" })).toBeVisible();
  await expect(page.getByText("IC-1234")).toBeVisible();
  await expect(page.getByText("appointment-1")).toBeVisible();
  await expect(page.getByText("9:00 AM - 12:00 PM")).toBeVisible();
  await expect(page.getByRole("link", { name: "Manage appointment" })).toHaveAttribute(
    "href",
    "https://app.mainconduit.com/s/manage-token",
  );

  expect(facadeCalls).toEqual(expect.arrayContaining(["search", "hold", "book"]));
  expect(retiredBookingCalls).toEqual([]);

  const eventsResponse = await request.get(`${MOCK_SERVER_URL}/events`);
  expect(eventsResponse.ok()).toBeTruthy();
  const eventsData = (await eventsResponse.json()) as MockEventsResponse;
  const eventTypes = eventsData.events
    .map((event) => event.body?.eventType)
    .filter((value): value is string => typeof value === "string");
  expect(eventTypes).not.toContain("booking_submitted");
  expect(eventTypes).not.toContain("booking_confirmation_sms");
  expect(eventTypes).not.toContain("booking_confirmation_email");
});
