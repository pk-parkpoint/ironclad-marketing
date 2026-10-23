import { expect, test } from "@playwright/test";
import { createServer } from "node:http";
import type { AddressInfo } from "node:net";
import { isolateBookingTraffic } from "./entry-review-safety";

test("review fixture prevents a real write from reaching a server", async ({ page }) => {
  let writes = 0;
  const server = createServer((request, response) => {
    if (request.method !== "GET") writes++;
    response.writeHead(200, { "Content-Type": "text/html" });
    response.end("<!doctype html><title>Review safety sentinel</title>");
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  try {
    const events = await isolateBookingTraffic(page);
    await page.goto(`http://127.0.0.1:${(server.address() as AddressInfo).port}`);
    const status = await page.evaluate(async () => (await fetch("/write-sentinel", { method: "POST" })).status);
    expect(status).toBe(501);
    expect(writes).toBe(0);
    expect(events.unexpectedWrites).toHaveLength(1);
  } finally {
    await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
});
