import { defineConfig, devices } from "@playwright/test";

const APP_PORT = Number(process.env.PLAYWRIGHT_APP_PORT ?? 4010);
const MOCK_PORT = Number(process.env.PLAYWRIGHT_MOCK_PORT ?? 4011);
const BASE_URL = `http://127.0.0.1:${APP_PORT}`;
const MOCK_URL = `http://127.0.0.1:${MOCK_PORT}`;
const SYSTEM_CHROME = process.env.PLAYWRIGHT_USE_SYSTEM_CHROME === "1" ? { channel: "chrome" as const } : {};
const projects = [
  {
    name: "chromium",
    use: { ...devices["Desktop Chrome"], ...SYSTEM_CHROME },
  },
  {
    name: "firefox",
    use: { ...devices["Desktop Firefox"] },
  },
  {
    name: "webkit",
    use: { ...devices["Desktop Safari"] },
  },
  {
    name: "mobile-chrome",
    use: { ...devices["Pixel 5"], ...SYSTEM_CHROME },
  },
  {
    name: "ios-safari",
    use: { ...devices["iPhone 13"] },
  },
  {
    name: "ipad-safari",
    use: { ...devices["iPad Pro 11"] },
  },
];

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 120_000,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: false,
  reporter: [["list"]],
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
  },
  projects,
  webServer: [
    {
      command: "node tests/e2e/mock-notification-server.mjs",
      port: MOCK_PORT,
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
      cwd: ".",
    },
    {
      command: `npm run dev -- -p ${APP_PORT}`,
      cwd: ".",
      env: {
        ...process.env,
        BOOKING_WEBHOOK_URL: `${MOCK_URL}/webhooks/bookings`,
        BOOKING_CONFIRMATION_SMS_WEBHOOK_URL: `${MOCK_URL}/webhooks/booking-confirmation-sms`,
        BOOKING_CONFIRMATION_EMAIL_WEBHOOK_URL: `${MOCK_URL}/webhooks/booking-confirmation-email`,
        IRONCLAD_CONDUIT_API_BASE_URL: "http://127.0.0.1:4011",
        IRONCLAD_PUBLIC_BOOKING_TOKEN: "ironclad-test-token",
        NEXT_PUBLIC_GA4_MEASUREMENT_ID: "G-PAGEENGAGEMENT",
        NEXT_PUBLIC_GOOGLE_ADS_ID: "AW-18207846861",
        NEXT_PUBLIC_GOOGLE_ADS_PHONE_CONVERSION_LABEL: "2WRhCLCe388cEM3jlupD",
        NEXT_PUBLIC_GOOGLE_ADS_BOOKING_CONVERSION_LABEL: "booking-test-label",
        NEXT_PUBLIC_GOOGLE_ADS_WEBSITE_CALL_CONVERSION_LABEL: "website-call-test-label",
        NEXT_PUBLIC_GOOGLE_ADS_TRACKING_PHONE: "(737) 204-9967",
        NEXT_PUBLIC_PHONE: "(512) 506-2470",
      },
      port: APP_PORT,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
});
