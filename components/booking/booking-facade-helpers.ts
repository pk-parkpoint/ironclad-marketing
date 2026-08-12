import type { PublicBookingWindow } from "@/lib/public-booking-facade";
import type { WizardFormData } from "./booking-wizard";

export const DURATION_ESTIMATE_MINUTES = 90;
export const SEARCH_MAX_RESULTS = 24;

const ARRIVAL_WINDOWS = [
  { endHour: 12, key: "morning", label: "9:00 AM - 12:00 PM", startHour: 9 },
  { endHour: 15, key: "midday", label: "12:00 PM - 3:00 PM", startHour: 12 },
  { endHour: 18, key: "afternoon", label: "3:00 PM - 6:00 PM", startHour: 15 },
] as const;

const SCHEDULER_SERVICE_TYPE_BY_SELECTION: Record<string, string> = {
  "clear-a-blockage": "drain_cleaning",
  "fix-a-leak": "leak_detection_repair",
  "leaks-blockages-sewer": "drain_cleaning",
  "other-issue": "leak_detection_repair",
  "sewer-main-line": "drain_cleaning",
};

export type CustomerArrivalWindowResult = {
  candidatesByOfferId: Record<string, PublicBookingWindow[]>;
  windows: PublicBookingWindow[];
};

export function secondsUntil(expiresAt?: string | null, ttlSeconds?: number): number {
  if (expiresAt) {
    return Math.max(0, Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 1000));
  }
  return Math.max(0, ttlSeconds || 0);
}

export function friendlyError(fallback: string, error: unknown): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

function formatServiceLabel(value: string | null): string {
  return (value || "plumbing-service")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function buildIssueSummary(formData: WizardFormData): string {
  const service = [formData.serviceCategory, formData.serviceDetail]
    .filter(Boolean)
    .map((entry) => formatServiceLabel(entry))
    .join(" > ");
  const notes = formData.additionalNotes.trim();
  return [service || "Plumbing Service", notes].filter(Boolean).join(". ");
}

export function schedulerServiceType(formData: WizardFormData): string | undefined {
  const selected = formData.serviceDetail || formData.serviceCategory;
  return selected ? SCHEDULER_SERVICE_TYPE_BY_SELECTION[selected] || selected : undefined;
}

function windowHour(value: string): number | null {
  const match = value.match(/T(\d{2}):/);
  return match ? Number(match[1]) : null;
}

function withHour(value: string, hour: number): string {
  return value.replace(/T\d{2}:\d{2}:\d{2}/, `T${String(hour).padStart(2, "0")}:00:00`);
}

export function customerArrivalWindows(windows: PublicBookingWindow[]): CustomerArrivalWindowResult {
  const result: CustomerArrivalWindowResult = { candidatesByOfferId: {}, windows: [] };
  for (const slot of ARRIVAL_WINDOWS) {
    const candidates = windows.filter((candidate) => {
      const hour = windowHour(candidate.startTime);
      return candidate.isAvailable && hour !== null && hour >= slot.startHour && hour < slot.endHour;
    });
    const firstCandidate = candidates[0];
    if (!firstCandidate) continue;
    const daypartStart = new Date(withHour(firstCandidate.startTime, slot.startHour));
    if (daypartStart.getTime() < Date.now()) continue;
    const displayOfferId = `${slot.key}:${firstCandidate.offerId}`;
    result.candidatesByOfferId[displayOfferId] = candidates;
    result.windows.push({
      ...firstCandidate,
      arrivalWindowLabel: slot.label,
      displayLabel: slot.label,
      endTime: withHour(firstCandidate.endTime, slot.endHour),
      offerId: displayOfferId,
      startTime: withHour(firstCandidate.startTime, slot.startHour),
    });
  }
  return result;
}

export function schedulerOfferId(offerId: string): string {
  return offerId.replace(/^(morning|midday|afternoon):/, "");
}

export function buildBookPayload(formData: WizardFormData) {
  return {
    name: `${formData.firstName} ${formData.lastName}`.trim(),
    phone: formData.phone,
    email: formData.email || undefined,
    address: {
      fullAddress: formData.addressFormatted,
      street: formData.street || formData.addressFormatted,
      city: formData.city || undefined,
      state: formData.state || undefined,
      postalCode: formData.zip || undefined,
      lat: formData.latitude,
      lng: formData.longitude,
      gateCode: formData.gateCode || undefined,
      hasDogs: formData.petsOnPremise,
    },
    issueSummary: buildIssueSummary(formData),
    notificationPreferences: { sms: true, email: Boolean(formData.email) },
  };
}
