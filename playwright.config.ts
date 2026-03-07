import { defineConfig, devices } from "@playwright/test";

const APP_PORT = 4010;
const MOCK_PORT = 4011;
const BASE_URL = `http://127.0.0.1:${APP_PORT}`;
const MOCK_URL = `http://127.0.0.1:${MOCK_PORT}`;
const projects = [
  {
    name: "chromium",
    use: { ...devices["Desktop Chrome"] },
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
    use: { ...devices["Pixel 5"] },
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
      },
      port: APP_PORT,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
});
