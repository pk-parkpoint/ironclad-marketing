import { defineConfig, devices } from "@playwright/test";

const live = process.env.BOOKING_REVIEW_ORIGIN;
const local = "http://127.0.0.1:4020";

export default defineConfig({
  testDir: "./tests/booking-entry-review",
  testMatch: ["booking-site-entrypoints.spec.ts", "entry-review-safety.spec.ts", "entry-review-responsive.spec.ts", "entry-review-sticky.spec.ts", "booking-date-lifecycle.spec.ts"],
  fullyParallel: true,
  outputDir: process.env.BOOKING_REVIEW_OUTPUT || "test-results/entry-review",
  workers: 6,
  retries: 0,
  timeout: 240_000,
  expect: { timeout: 8_000 },
  reporter: [["list"], ["json", { outputFile: process.env.BOOKING_REVIEW_REPORT || "test-results/entry-review.json" }]],
  use: {
    baseURL: live || local,
    extraHTTPHeaders: { "X-Ironclad-Test-Traffic": "1" },
    serviceWorkers: "block",
    contextOptions: { reducedMotion: "reduce" },
    screenshot: "off",
    trace: "off",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "ios-safari", use: { ...devices["iPhone 13"] } },
  ],
  webServer: live ? undefined : {
    command: "npm run start -- -p 4020",
    port: 4020,
    reuseExistingServer: false,
    env: {
      BOOKING_NOTIFICATION_TRAFFIC: "test",
      BOOKING_WEBHOOK_URL: "http://127.0.0.1:4021/webhooks/bookings",
      IRONCLAD_CONDUIT_API_BASE_URL: "http://127.0.0.1:4021",
      IRONCLAD_PUBLIC_BOOKING_TOKEN: "entry-review-fixture",
    },
  },
});
