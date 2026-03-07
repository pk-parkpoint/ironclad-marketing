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

test("IC-077 booking flow completes and notifications are delivered", async ({ page, request }) => {
  const uniqueSuffix = Math.floor(Math.random() * 9000) + 1000;
  const testPhone = `512555${uniqueSuffix}`;
  const testEmail = `booking-e2e-${Date.now()}@example.com`;

  await page.goto("/book");

  await expect(page.getByRole("heading", { name: "Request an Appointment" })).toBeVisible();

  await page.getByRole("button", { name: /Plumbing Repairs/i }).first().click();
  await expect(page.getByRole("heading", { name: "Choose a day and time window" })).toBeVisible();

  await page.getByRole("button", { name: "Tomorrow" }).click();
  await page.getByRole("button", { name: /10:00 AM - 12:00 PM/i }).click();
  await page.getByRole("button", { name: "Continue" }).click();

  await expect(page.getByRole("heading", { name: "Contact information" })).toBeVisible();
  await page.getByLabel(/Name/i).fill("E2E Booker");
  await page.getByLabel(/Phone/i).fill(testPhone);
  await page.getByLabel(/Email/i).fill(testEmail);
  await page.getByLabel(/Address \*/i).fill("123 Test Street, Austin, TX 78701");
  await page.getByRole("button", { name: /^text$/i }).click();
  await page.getByRole("button", { name: "Continue" }).click();

  await expect(page.getByRole("heading", { name: "Review and confirm" })).toBeVisible();
  await page.getByRole("button", { name: /Confirm Booking/i }).click();

  await expect(page.getByRole("heading", { name: "Booking received" })).toBeVisible();
  await expect(page.getByText(/Booking ID:/)).toBeVisible();

  const eventsResponse = await request.get(`${MOCK_SERVER_URL}/events`);
  expect(eventsResponse.ok()).toBeTruthy();

  const eventsData = (await eventsResponse.json()) as MockEventsResponse;
  const matchingEvents = eventsData.events.filter((event) => {
    const body = event.body as
      | {
          to?: string;
          booking?: {
            email?: string;
            phone?: string;
          };
        }
      | undefined;

    if (!body) {
      return false;
    }

    return (
      body.to === testEmail ||
      body.to === testPhone ||
      body.booking?.email === testEmail ||
      body.booking?.phone === testPhone
    );
  });

  const eventTypes = matchingEvents
    .map((event) => event.body?.eventType)
    .filter((value): value is string => typeof value === "string");

  expect(eventTypes).toContain("booking_submitted");
  expect(eventTypes).toContain("booking_confirmation_sms");
  expect(eventTypes).toContain("booking_confirmation_email");
});
