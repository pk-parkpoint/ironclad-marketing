import { NextResponse } from "next/server";
import {
  checkDuplicateLead,
  checkLeadRateLimit,
  classifyLeadRoute,
  evaluateSpamScore,
  validateLeadPayload,
} from "@/lib/leads";

const WEBHOOK_TIMEOUT_MS = 8 * 1000;
const SPAM_BLOCK_THRESHOLD = 25;

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

async function postLeadWebhook(payload: unknown) {
  const webhookUrl = process.env.LEAD_WEBHOOK_URL?.trim();
  if (!webhookUrl || webhookUrl.includes("example.com")) {
    return "skipped";
  }

  const abortController = new AbortController();
  const timeout = setTimeout(() => abortController.abort(), WEBHOOK_TIMEOUT_MS);
  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: abortController.signal,
    });
    if (!response.ok) {
      throw new Error(`lead_webhook_failed:${response.status}`);
    }
    return "sent";
  } finally {
    clearTimeout(timeout);
  }
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const validation = validateLeadPayload(payload);
  if (!validation.valid) {
    return NextResponse.json({ error: "validation_failed", details: validation.errors }, { status: 400 });
  }

  const ip = getClientIp(request);
  const now = Date.now();
  if (!checkLeadRateLimit({ ip, now })) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const submission = validation.data;
  const spamScore = evaluateSpamScore(submission);
  if (spamScore >= SPAM_BLOCK_THRESHOLD) {
    return NextResponse.json({ error: "spam_rejected", spamScore }, { status: 400 });
  }

  if (!checkDuplicateLead(submission, now)) {
    return NextResponse.json({ error: "duplicate_submission" }, { status: 429 });
  }

  const routeBucket = classifyLeadRoute(submission);
  const leadRecord = {
    ...submission,
    received_at: new Date(now).toISOString(),
    route_bucket: routeBucket,
    spam_score: spamScore,
    ip,
  };

  let webhookStatus: "sent" | "skipped";
  try {
    webhookStatus = await postLeadWebhook({
      eventType: "lead_submitted",
      lead: leadRecord,
    });
  } catch {
    return NextResponse.json({ error: "lead_delivery_failed" }, { status: 502 });
  }

  return NextResponse.json(
    {
      status: "accepted",
      routeBucket,
      spamScore,
      webhookStatus,
    },
    { status: 201 },
  );
}
