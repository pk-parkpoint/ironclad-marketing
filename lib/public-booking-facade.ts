export type PublicBookingWindow = {
  offerId: string;
  windowId: string;
  startTime: string;
  endTime: string;
  arrivalWindowLabel?: string;
  displayLabel?: string;
  isAvailable: boolean;
};

export type PublicBookingSearchResponse = {
  requestId: string;
  state: string;
  businessTimeZone?: string;
  windows: PublicBookingWindow[];
};

export type PublicBookingHoldResponse = {
  state: string;
  holdId: string;
  windowId: string;
  offerId: string;
  expiresAt: string | null;
  ttlSeconds?: number;
};

export type PublicBookingBookResponse = {
  state: string;
  bookingId?: string;
  appointmentId?: string;
  confirmationNumber?: string;
  manageUrl?: string;
  message?: string;
};

export type PublicBookingCommitPayload = {
  name: string;
  phone: string;
  email?: string;
  address: {
    fullAddress: string;
    street: string;
    city?: string;
    state?: string;
    postalCode?: string;
    lat?: number;
    lng?: number;
    gateCode?: string;
    hasDogs?: boolean;
  };
  issueSummary: string;
  notificationPreferences?: {
    sms: boolean;
    email: boolean;
  };
};

async function postFacade<T>(action: string, body: unknown, headers?: HeadersInit): Promise<T> {
  const response = await fetch(`/api/scheduling/v3/availability/${action}`, {
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json", ...(headers || {}) },
    method: "POST",
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || data.error || `Scheduling request failed: ${response.status}`);
  }
  return data as T;
}

export function searchPublicBookingAvailability(request: {
  date: string;
  durationEstimateMinutes: number;
  maxResults?: number;
  serviceType?: string;
  issueSummary?: string;
}): Promise<PublicBookingSearchResponse> {
  return postFacade("search", request);
}

export function holdPublicBookingWindow(request: {
  windowId: string;
  offerId: string;
  idempotencyKey: string;
}): Promise<PublicBookingHoldResponse> {
  return postFacade("hold", request);
}

export function releasePublicBookingHold(holdId: string): Promise<{ state: string; released: boolean }> {
  return postFacade("release", { holdId });
}

export function bookPublicBookingHold(
  holdId: string,
  booking: PublicBookingCommitPayload,
  idempotencyKey: string,
): Promise<PublicBookingBookResponse> {
  return postFacade("book", { booking, holdId, idempotencyKey }, { "X-Idempotency-Key": idempotencyKey });
}
