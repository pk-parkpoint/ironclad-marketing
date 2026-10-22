/** Server-side grouping for incomplete visits; never a verified contact identity. */
import { createHash } from "node:crypto";
import { isIP } from "node:net";
import type { BookingLeadPayload } from "@/lib/booking-lead";

export function bookingVisitorId(payload: BookingLeadPayload): string | null {
  const raw = payload.serverContext.ipAddress.trim();
  if (!isIP(raw)) return null;
  const ip = isIP(raw) === 6 ? new URL(`http://[${raw.split("%")[0]}]/`).hostname : raw;
  return `ip_${createHash("sha256").update(JSON.stringify([payload.businessKey, ip])).digest("hex")}`;
}
