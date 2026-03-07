import { NextResponse } from "next/server";

type ContactPreference = "call" | "text" | "either";

type BookingSubmission = {
  serviceCategory: string;
  preferredDate: string;
  preferredWindow: string;
  customerName: string;
  phone: string;
  email?: string;
  address: {
    formatted: string;
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    latitude?: number;
    longitude?: number;
  };
  unitOrGateCode?: string;
  contactPreference: ContactPreference;
  notes?: string;
  photos?: string[];
};

type BookingRecord = BookingSubmission & {
  bookingId: string;
  createdAt: string;
  normalizedPhone: string;
};

type BookingState = {
  bookings: BookingRecord[];
  recentByPhoneDate: Map<string, number>;
};

const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000;
const NOTIFICATION_REQUEST_TIMEOUT_MS = 10 * 1000;
const CONFIRMATION_SLA_MINUTES = 15;

type DeliveryStatus = "sent" | "skipped" | "failed";
type CustomerNotificationResult = {
  sms: DeliveryStatus;
  email: DeliveryStatus;
  sentWithinMinutes: number;
};

function getBookingState(): BookingState {
  const globalState = globalThis as typeof globalThis & {
    __ironcladBookingState?: BookingState;
  };

  if (!globalState.__ironcladBookingState) {
    globalState.__ironcladBookingState = {
      bookings: [],
      recentByPhoneDate: new Map(),
    };
  }

  return globalState.__ironcladBookingState;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === "string");
}

function isContactPreference(value: unknown): value is ContactPreference {
  return value === "call" || value === "text" || value === "either";
}

function normalizePhone(phone: string): string {
  return phone.replace(/[^\d]/g, "").slice(-10);
}

function validatePayload(payload: unknown): { valid: true; data: BookingSubmission } | { valid: false; errors: string[] } {
  if (!isObject(payload)) {
    return { valid: false, errors: ["payload must be an object"] };
  }

  const errors: string[] = [];
  const serviceCategory = payload.serviceCategory;
  const preferredDate = payload.preferredDate;
  const preferredWindow = payload.preferredWindow;
  const customerName = payload.customerName;
  const phone = payload.phone;
  const contactPreference = payload.contactPreference;
  const address = payload.address;

  if (!isNonEmptyString(serviceCategory)) errors.push("serviceCategory is required");
  if (!isNonEmptyString(preferredDate) || !/^\d{4}-\d{2}-\d{2}$/.test(preferredDate)) {
    errors.push("preferredDate must be ISO date format YYYY-MM-DD");
  }
  if (!isNonEmptyString(preferredWindow)) errors.push("preferredWindow is required");
  if (!isNonEmptyString(customerName)) errors.push("customerName is required");
  if (!isNonEmptyString(phone) || normalizePhone(phone).length < 10) errors.push("phone is required");

  if (!isObject(address) || !isNonEmptyString(address.formatted)) {
    errors.push("address.formatted is required");
  }

  if (!isContactPreference(contactPreference)) {
    errors.push("contactPreference must be one of: call, text, either");
  }

  if (payload.email !== undefined && payload.email !== null && typeof payload.email !== "string") {
    errors.push("email must be a string");
  }

  if (payload.photos !== undefined) {
    if (!isStringArray(payload.photos)) {
      errors.push("photos must be an array of strings");
    } else if (payload.photos.length > 5) {
      errors.push("photos cannot exceed 5 items");
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  const parsedAddress = address as BookingSubmission["address"];
  const data: BookingSubmission = {
    serviceCategory: String(serviceCategory).trim(),
    preferredDate: String(preferredDate).trim(),
    preferredWindow: String(preferredWindow).trim(),
    customerName: String(customerName).trim(),
    phone: String(phone).trim(),
    email: isNonEmptyString(payload.email) ? payload.email.trim() : undefined,
    address: {
      formatted: parsedAddress.formatted.trim(),
      street: isNonEmptyString(parsedAddress.street) ? parsedAddress.street.trim() : undefined,
      city: isNonEmptyString(parsedAddress.city) ? parsedAddress.city.trim() : undefined,
      state: isNonEmptyString(parsedAddress.state) ? parsedAddress.state.trim() : undefined,
      zip: isNonEmptyString(parsedAddress.zip) ? parsedAddress.zip.trim() : undefined,
      latitude: typeof parsedAddress.latitude === "number" ? parsedAddress.latitude : undefined,
      longitude: typeof parsedAddress.longitude === "number" ? parsedAddress.longitude : undefined,
    },
    unitOrGateCode: isNonEmptyString(payload.unitOrGateCode) ? payload.unitOrGateCode.trim() : undefined,
    contactPreference: contactPreference as ContactPreference,
    notes: isNonEmptyString(payload.notes) ? payload.notes.trim() : undefined,
    photos: isStringArray(payload.photos) ? payload.photos : undefined,
  };

  return { valid: true, data };
}

function buildBookingId(): string {
  const suffix = Math.random().toString(36).slice(2, 8);
  return `book_${Date.now()}_${suffix}`;
}

async function postWebhook(webhookUrl: string, payload: unknown): Promise<void> {
  const abortController = new AbortController();
  const timeout = setTimeout(() => abortController.abort(), NOTIFICATION_REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(webhookUrl, {
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      signal: abortController.signal,
    });

    if (!response.ok) {
      throw new Error(`webhook_failed:${response.status}`);
    }
  } finally {
    clearTimeout(timeout);
  }
}

async function notifyConduit(record: BookingRecord): Promise<"sent" | "skipped"> {
  const webhookUrl = process.env.BOOKING_WEBHOOK_URL;
  if (!webhookUrl || webhookUrl.includes("example.com")) {
    return "skipped";
  }

  try {
    await postWebhook(webhookUrl, {
      booking: record,
      eventType: "booking_submitted",
      target: "conduit_inbox",
    });
  } catch (error) {
    throw new Error(`notification_failed:${String(error)}`);
  }

  return "sent";
}

function formatDateForMessage(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return isoDate;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    weekday: "short",
  }).format(date);
}

function buildSmsBody(record: BookingRecord): string {
  const summaryDate = formatDateForMessage(record.preferredDate);
  return `Thanks for booking with Ironclad. Booking ${record.bookingId} for ${record.serviceCategory} on ${summaryDate} (${record.preferredWindow}). We'll contact you soon.`;
}

function buildEmailBody(record: BookingRecord): string {
  return [
    `Hi ${record.customerName},`,
    "",
    "Your booking request was received.",
    `Booking ID: ${record.bookingId}`,
    `Service: ${record.serviceCategory}`,
    `Preferred date: ${record.preferredDate}`,
    `Preferred time window: ${record.preferredWindow}`,
    "",
    "We'll follow up shortly with confirmation details.",
    "",
    "Ironclad Plumbing",
  ].join("\n");
}

async function sendCustomerNotifications(record: BookingRecord): Promise<CustomerNotificationResult> {
  const smsWebhookUrl = process.env.BOOKING_CONFIRMATION_SMS_WEBHOOK_URL;
  const emailWebhookUrl = process.env.BOOKING_CONFIRMATION_EMAIL_WEBHOOK_URL;
  const result: CustomerNotificationResult = {
    sms: "skipped",
    email: "skipped",
    sentWithinMinutes: CONFIRMATION_SLA_MINUTES,
  };

  if (smsWebhookUrl && !smsWebhookUrl.includes("example.com")) {
    try {
      await postWebhook(smsWebhookUrl, {
        booking: {
          bookingId: record.bookingId,
          preferredDate: record.preferredDate,
          preferredWindow: record.preferredWindow,
          serviceCategory: record.serviceCategory,
        },
        eventType: "booking_confirmation_sms",
        message: buildSmsBody(record),
        to: record.phone,
      });
      result.sms = "sent";
    } catch {
      result.sms = "failed";
    }
  }

  if (isNonEmptyString(record.email) && emailWebhookUrl && !emailWebhookUrl.includes("example.com")) {
    try {
      await postWebhook(emailWebhookUrl, {
        booking: {
          bookingId: record.bookingId,
          preferredDate: record.preferredDate,
          preferredWindow: record.preferredWindow,
          serviceCategory: record.serviceCategory,
        },
        eventType: "booking_confirmation_email",
        subject: `Booking confirmation: ${record.bookingId}`,
        text: buildEmailBody(record),
        to: record.email,
      });
      result.email = "sent";
    } catch {
      result.email = "failed";
    }
  }

  return result;
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);

  const validation = validatePayload(payload);
  if (!validation.valid) {
    return NextResponse.json(
      { error: "validation_failed", details: validation.errors },
      { status: 400 },
    );
  }

  const submission = validation.data;
  const normalizedPhone = normalizePhone(submission.phone);
  const rateLimitKey = `${normalizedPhone}:${submission.preferredDate}`;
  const bookingState = getBookingState();
  const now = Date.now();

  for (const [key, timestamp] of bookingState.recentByPhoneDate.entries()) {
    if (now - timestamp > RATE_LIMIT_WINDOW_MS) {
      bookingState.recentByPhoneDate.delete(key);
    }
  }

  const previousSubmissionTime = bookingState.recentByPhoneDate.get(rateLimitKey);
  if (previousSubmissionTime && now - previousSubmissionTime < RATE_LIMIT_WINDOW_MS) {
    return NextResponse.json(
      { error: "duplicate_submission", message: "A similar booking was submitted recently." },
      { status: 429 },
    );
  }

  const bookingRecord: BookingRecord = {
    ...submission,
    bookingId: buildBookingId(),
    createdAt: new Date(now).toISOString(),
    normalizedPhone,
  };

  bookingState.recentByPhoneDate.set(rateLimitKey, now);
  bookingState.bookings.push(bookingRecord);

  let notification: "sent" | "skipped";
  try {
    notification = await notifyConduit(bookingRecord);
  } catch {
    bookingState.recentByPhoneDate.delete(rateLimitKey);
    const recordIndex = bookingState.bookings.findIndex((entry) => entry.bookingId === bookingRecord.bookingId);
    if (recordIndex >= 0) {
      bookingState.bookings.splice(recordIndex, 1);
    }
    return NextResponse.json(
      { error: "notification_failed", message: "Unable to notify booking inbox." },
      { status: 502 },
    );
  }

  const customerNotifications = await sendCustomerNotifications(bookingRecord);

  return NextResponse.json(
    {
      bookingId: bookingRecord.bookingId,
      customerNotifications,
      notification,
      status: "accepted",
    },
    { status: 201 },
  );
}
