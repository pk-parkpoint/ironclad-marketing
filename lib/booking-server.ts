import type { BookingLeadPayload } from "@/lib/booking-lead";

function firstForwardedIp(value: string | null): string {
  if (!value) return "NA";
  const first = value.split(",")[0]?.trim();
  return first || "NA";
}

export async function parseJsonRequest<T>(request: Request): Promise<T | null> {
  const text = await request.text().catch(() => "");
  if (!text) return null;

  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

export function withServerContext(payload: BookingLeadPayload, request: Request): BookingLeadPayload {
  const forwardedIp = firstForwardedIp(request.headers.get("x-forwarded-for"));
  const realIp = request.headers.get("x-real-ip")?.trim() || "NA";
  const ipAddress = forwardedIp !== "NA" ? forwardedIp : realIp;

  return {
    ...payload,
    serverContext: {
      ...payload.serverContext,
      ipAddress: ipAddress || "NA",
    },
  };
}
