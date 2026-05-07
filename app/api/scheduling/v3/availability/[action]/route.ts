import { NextResponse } from "next/server";

const TIMEOUT_MS = 10_000;
const ALLOWED_ACTIONS = new Set(["search", "hold", "release", "book"]);

type RouteContext = {
  params: Promise<{ action: string }>;
};

function apiBase(): string {
  return (process.env.IRONCLAD_CONDUIT_API_BASE_URL || "").replace(/\/+$/, "");
}

function bookingToken(): string {
  return process.env.IRONCLAD_PUBLIC_BOOKING_TOKEN?.trim() || "";
}

async function readPayload(request: Request): Promise<Record<string, unknown>> {
  const payload = await request.json().catch(() => ({}));
  return payload && typeof payload === "object" && !Array.isArray(payload)
    ? (payload as Record<string, unknown>)
    : {};
}

async function forwardToFacade(action: string, request: Request, body: Record<string, unknown>) {
  const base = apiBase();
  const token = bookingToken();
  if (!base || !token) {
    return NextResponse.json(
      { error: "public_booking_facade_not_configured" },
      { status: 503 },
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    const idempotencyKey = request.headers.get("x-idempotency-key");
    if (idempotencyKey) headers["X-Idempotency-Key"] = idempotencyKey;

    const response = await fetch(`${base}/api/scheduling/v3/availability/${action}`, {
      body: JSON.stringify({ ...body, token }),
      headers,
      method: "POST",
      signal: controller.signal,
    });
    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
  } finally {
    clearTimeout(timeout);
  }
}

export async function POST(request: Request, context: RouteContext) {
  const { action } = await context.params;
  if (!ALLOWED_ACTIONS.has(action)) {
    return NextResponse.json({ error: "unsupported_scheduling_action" }, { status: 404 });
  }

  try {
    return await forwardToFacade(action, request, await readPayload(request));
  } catch {
    return NextResponse.json({ error: "public_booking_facade_unavailable" }, { status: 502 });
  }
}
