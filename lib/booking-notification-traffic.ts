import { isIP } from "node:net";

/** Classify only explicit test signals; an IP address is never an identity. */
export function bookingNotificationTraffic(
  request: Request,
  env: NodeJS.ProcessEnv = process.env,
): { traffic: "live" | "test"; reason: string } {
  if (env.BOOKING_NOTIFICATION_TRAFFIC === "test") return { traffic: "test", reason: "configured_test" };
  if (env.NODE_ENV !== "production") return { traffic: "test", reason: "nonproduction_runtime" };
  if (request.headers.get("x-ironclad-test-traffic") === "1") return { traffic: "test", reason: "explicit_test" };

  // Origin/Referer describe the browser page; request.url can instead describe
  // an internal reverse proxy. Never classify from X-Forwarded-For alone.
  const source = request.headers.get("origin") || request.headers.get("referer");
  if (source) {
    try {
      const hostname = new URL(source).hostname.toLowerCase();
      if (hostname === "localhost" || hostname.endsWith(".localhost") || hostname === "[::1]" || (isIP(hostname) === 4 && hostname.startsWith("127."))) {
        return { traffic: "test", reason: "local_browser" };
      }
    } catch {
      // Opaque or missing origins occur on valid browser requests; retain them.
    }
  }
  return { traffic: "live", reason: "production_request" };
}
