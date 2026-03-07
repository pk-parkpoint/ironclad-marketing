const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000;
const DUPLICATE_WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 8;

export type LeadRouteBucket = "booking_followup" | "emergency" | "general";

export type LeadSubmission = {
  name: string;
  phone: string;
  email?: string;
  business_name?: string;
  site_address?: string;
  address?: string;
  service: string;
  message?: string;
  page_url: string;
  page_type: string;
  service_interest?: string;
  service_area?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  gclid?: string;
  fbclid?: string;
  msclkid?: string;
  entry_timestamp: string;
  honeypot?: string;
  urgent?: boolean;
};

type LeadState = {
  submissionsByFingerprint: Map<string, number>;
  requestTimesByIp: Map<string, number[]>;
};

function getLeadState(): LeadState {
  const globalState = globalThis as typeof globalThis & { __ironcladLeadState?: LeadState };
  if (!globalState.__ironcladLeadState) {
    globalState.__ironcladLeadState = {
      submissionsByFingerprint: new Map(),
      requestTimesByIp: new Map(),
    };
  }
  return globalState.__ironcladLeadState;
}

function clean(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function cleanOptional(value: unknown): string | undefined {
  const sanitized = clean(value);
  return sanitized ? sanitized : undefined;
}

function normalizePhone(value: string): string {
  return value.replace(/[^\d]/g, "").slice(-10);
}

function isEmail(value?: string): boolean {
  if (!value) {
    return true;
  }
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function hasTooManyLinks(text: string): boolean {
  const links = text.match(/https?:\/\//gi);
  return Boolean(links && links.length > 1);
}

export function validateLeadPayload(payload: unknown): { valid: true; data: LeadSubmission } | { valid: false; errors: string[] } {
  if (!payload || typeof payload !== "object") {
    return { valid: false, errors: ["payload must be an object"] };
  }

  const body = payload as Record<string, unknown>;
  const data: LeadSubmission = {
    name: clean(body.name),
    phone: clean(body.phone),
    email: cleanOptional(body.email),
    business_name: cleanOptional(body.business_name),
    site_address: cleanOptional(body.site_address),
    address: cleanOptional(body.address),
    service: clean(body.service),
    message: cleanOptional(body.message),
    page_url: clean(body.page_url),
    page_type: clean(body.page_type) || "contact",
    service_interest: cleanOptional(body.service_interest),
    service_area: cleanOptional(body.service_area),
    utm_source: cleanOptional(body.utm_source),
    utm_medium: cleanOptional(body.utm_medium),
    utm_campaign: cleanOptional(body.utm_campaign),
    gclid: cleanOptional(body.gclid),
    fbclid: cleanOptional(body.fbclid),
    msclkid: cleanOptional(body.msclkid),
    entry_timestamp: clean(body.entry_timestamp),
    honeypot: cleanOptional(body.honeypot),
    urgent: Boolean(body.urgent),
  };

  const errors: string[] = [];
  if (!data.name) errors.push("name is required");
  if (!data.service) errors.push("service is required");
  if (!data.page_url) errors.push("page_url is required");
  if (!data.entry_timestamp) errors.push("entry_timestamp is required");
  if (normalizePhone(data.phone).length < 10) errors.push("valid phone is required");
  if (!isEmail(data.email)) errors.push("email is invalid");
  if (data.page_type === "commercial" && !data.business_name) errors.push("business_name is required");
  if (data.page_type === "commercial" && !data.site_address) errors.push("site_address is required");

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return { valid: true, data };
}

export function evaluateSpamScore(submission: LeadSubmission): number {
  let score = 0;
  if (submission.honeypot) score += 100;
  if ((submission.message ?? "").length > 1200) score += 15;
  if (hasTooManyLinks(submission.message ?? "")) score += 20;
  if (submission.name.length < 2) score += 10;
  return score;
}

export function classifyLeadRoute(submission: LeadSubmission): LeadRouteBucket {
  const serviceText = `${submission.service} ${submission.service_interest ?? ""}`.toLowerCase();
  if (submission.page_type === "book") {
    return "booking_followup";
  }
  if (submission.urgent || serviceText.includes("emergency")) {
    return "emergency";
  }
  return "general";
}

export function checkLeadRateLimit({ ip, now }: { ip: string; now: number }): boolean {
  const state = getLeadState();
  const recent = (state.requestTimesByIp.get(ip) ?? []).filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
    state.requestTimesByIp.set(ip, recent);
    return false;
  }
  recent.push(now);
  state.requestTimesByIp.set(ip, recent);
  return true;
}

export function checkDuplicateLead(submission: LeadSubmission, now: number): boolean {
  const state = getLeadState();
  for (const [key, timestamp] of state.submissionsByFingerprint.entries()) {
    if (now - timestamp > DUPLICATE_WINDOW_MS) {
      state.submissionsByFingerprint.delete(key);
    }
  }

  const normalizedPhone = normalizePhone(submission.phone);
  const fingerprint = `${normalizedPhone}:${submission.service}:${submission.page_url}`;
  const previous = state.submissionsByFingerprint.get(fingerprint);
  if (previous && now - previous < DUPLICATE_WINDOW_MS) {
    return false;
  }

  state.submissionsByFingerprint.set(fingerprint, now);
  return true;
}
