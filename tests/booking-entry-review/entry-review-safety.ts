import type { Page } from "@playwright/test";

export type EntryReviewEvents = {
  actions: Array<{ action: string; payload: Record<string, unknown> }>;
  notifications: Array<{ status: string; sessionId: string; tracking?: Record<string, unknown> }>;
  unexpectedWrites: string[];
  pageErrors: string[];
};

/** The same fixture can exercise deployed JS; no browser mutation reaches a server. */
export async function isolateBookingTraffic(page: Page): Promise<EntryReviewEvents> {
  const events: EntryReviewEvents = { actions: [], notifications: [], unexpectedWrites: [], pageErrors: [] };
  const now = new Date("2026-10-23T15:00:00Z");
  await page.clock.setFixedTime(now);
  page.on("pageerror", (error) => events.pageErrors.push(error.message));
  await page.route("**/*", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const method = request.method();
    if (url.pathname.startsWith("/api/scheduling/v3/availability/")) {
      const action = url.pathname.split("/").pop()!;
      const payload = request.postDataJSON() || {};
      events.actions.push({ action, payload });
      if (action === "search") {
        await route.fulfill({ json: { state: "available", windows: [{
          startTime: `${payload.date}T12:00:00-05:00`, endTime: `${payload.date}T15:00:00-05:00`,
          windowId: `entry-window-${payload.date}`, offerId: `entry-offer-${payload.date}`, isAvailable: true,
        }] } });
      } else if (action === "hold") {
        await route.fulfill({ status: 201, json: {
          state: "hold_active", holdId: "entry-review-hold", offerId: payload.offerId, windowId: payload.windowId,
          expiresAt: new Date(now.getTime() + 480_000).toISOString(), ttlSeconds: 480,
        } });
      } else if (action === "book") {
        await route.fulfill({ json: { state: "booked", bookingId: "entry-review-booking",
          appointmentId: "entry-review-appointment", confirmationNumber: "ENTRY-QA" } });
      } else if (action === "release") {
        await route.fulfill({ json: { released: true, state: "released" } });
      } else {
        events.unexpectedWrites.push(`${method} ${url.pathname}`);
        await route.fulfill({ status: 501, json: { error: "unrecognized_scheduling_action" } });
      }
      return;
    }
    if (/^\/api\/bookings\/(abandon|notify|partial)$/.test(url.pathname)) {
      const payload = request.postDataJSON();
      // WebKit can omit intercepted Blob bodies; the endpoint still proves an abandonment.
      events.notifications.push(payload || {
        status: url.pathname.endsWith("/abandon") ? "abandoned" : "completed", sessionId: "unavailable-beacon-body",
      });
      await route.fulfill({ json: { sent: false, suppressed: true, traffic: "test" } });
      return;
    }
    if (method !== "GET" && method !== "HEAD") {
      events.unexpectedWrites.push(`${method} ${url.origin}${url.pathname}`);
      await route.fulfill({ status: 501, json: { error: "review_blocked_unrecognized_write" } });
      return;
    }
    if (/google-analytics|googletagmanager|googleadservices|doubleclick|facebook\.net/.test(url.hostname)) {
      await route.fulfill({ contentType: "application/javascript", body: "/* disabled during booking review */" });
      return;
    }
    await route.continue();
  });
  return events;
}
