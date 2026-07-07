"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  bookPublicBookingHold,
  holdPublicBookingWindow,
  releasePublicBookingHold,
  searchPublicBookingAvailability,
  type PublicBookingHoldResponse,
  type PublicBookingWindow,
} from "@/lib/public-booking-facade";
import type { BookingConfirmation, WizardFormData } from "./booking-wizard";

type ActiveHold = PublicBookingHoldResponse & { startTime: string; endTime: string };

const DURATION_ESTIMATE_MINUTES = 90;

const SCHEDULER_SERVICE_TYPE_BY_SELECTION: Record<string, string> = {
  "clear-a-blockage": "drain_cleaning",
  "fix-a-leak": "leak_detection_repair",
  "leaks-blockages-sewer": "drain_cleaning",
  "other-issue": "leak_detection_repair",
  "sewer-main-line": "drain_cleaning",
};

function secondsUntil(expiresAt?: string | null, ttlSeconds?: number): number {
  if (expiresAt) {
    return Math.max(0, Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 1000));
  }
  return Math.max(0, ttlSeconds || 0);
}

function friendlyError(fallback: string, error: unknown): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

function formatServiceLabel(value: string | null): string {
  return (value || "plumbing-service")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function buildIssueSummary(formData: WizardFormData): string {
  const service = [formData.serviceCategory, formData.serviceDetail]
    .filter(Boolean)
    .map((entry) => formatServiceLabel(entry))
    .join(" > ");
  const notes = formData.additionalNotes.trim();
  return [service || "Plumbing Service", notes].filter(Boolean).join(". ");
}

function schedulerServiceType(formData: WizardFormData): string | undefined {
  const selected = formData.serviceDetail || formData.serviceCategory;
  return selected ? SCHEDULER_SERVICE_TYPE_BY_SELECTION[selected] || selected : undefined;
}

function buildBookPayload(formData: WizardFormData) {
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

export function usePublicBookingFacade() {
  const [windowsByDate, setWindowsByDate] = useState<Record<string, PublicBookingWindow[]>>({});
  const [loadingDate, setLoadingDate] = useState<string | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [holdError, setHoldError] = useState<string | null>(null);
  const [bookError, setBookError] = useState<string | null>(null);
  const [activeHold, setActiveHold] = useState<ActiveHold | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const activeHoldRef = useRef<ActiveHold | null>(null);

  useEffect(() => {
    activeHoldRef.current = activeHold;
  }, [activeHold]);

  const clearHold = useCallback(() => {
    activeHoldRef.current = null;
    setActiveHold(null);
    setRemainingSeconds(0);
  }, []);

  const releaseHold = useCallback(async () => {
    const hold = activeHoldRef.current;
    clearHold();
    if (hold?.holdId) await releasePublicBookingHold(hold.holdId).catch(() => undefined);
  }, [clearHold]);

  const reset = useCallback(() => {
    setWindowsByDate({});
    setLoadingDate(null);
    setSearchError(null);
    setHoldError(null);
    setBookError(null);
    clearHold();
  }, [clearHold]);

  useEffect(() => {
    return () => {
      const hold = activeHoldRef.current;
      if (hold?.holdId) releasePublicBookingHold(hold.holdId).catch(() => undefined);
    };
  }, []);

  useEffect(() => {
    if (!activeHold) return undefined;
    const tick = () => {
      const seconds = secondsUntil(activeHold.expiresAt, activeHold.ttlSeconds);
      setRemainingSeconds(seconds);
      if (seconds === 0) {
        setHoldError("That reserved time expired. Refresh available times and choose another slot.");
        clearHold();
      }
    };
    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, [activeHold, clearHold]);

  const searchDate = useCallback(async (date: string, formData: WizardFormData) => {
    setLoadingDate(date);
    setSearchError(null);
    try {
      const response = await searchPublicBookingAvailability({
        date,
        durationEstimateMinutes: DURATION_ESTIMATE_MINUTES,
        issueSummary: buildIssueSummary(formData),
        maxResults: 8,
        serviceType: schedulerServiceType(formData),
      });
      setWindowsByDate((current) => ({
        ...current,
        [date]: response.windows.filter((window) => window.isAvailable),
      }));
    } catch (error) {
      setSearchError(friendlyError("Unable to load available appointment times.", error));
    } finally {
      setLoadingDate(null);
    }
  }, []);

  const holdWindow = useCallback(
    async (window: PublicBookingWindow, formData: WizardFormData) => {
      await releaseHold();
      setHoldError(null);
      setBookError(null);
      try {
        const hold = await holdPublicBookingWindow({
          durationEstimateMinutes: DURATION_ESTIMATE_MINUTES,
          idempotencyKey: `${window.offerId}-${Date.now()}`,
          issueSummary: buildIssueSummary(formData),
          offerId: window.offerId,
          serviceType: schedulerServiceType(formData),
          windowId: window.windowId,
        });
        const active = { ...hold, startTime: window.startTime, endTime: window.endTime };
        activeHoldRef.current = active;
        setActiveHold(active);
        return active;
      } catch (error) {
        setHoldError(friendlyError("Unable to reserve that appointment time.", error));
        return null;
      }
    },
    [releaseHold],
  );

  const book = useCallback(
    async (formData: WizardFormData): Promise<BookingConfirmation | null> => {
      const hold = activeHoldRef.current;
      if (!hold?.holdId) {
        setBookError("Please choose an available appointment time.");
        return null;
      }
      setBookError(null);
      const idempotencyKey = `${hold.holdId}-${Date.now()}`;
      try {
        const response = await bookPublicBookingHold(hold.holdId, buildBookPayload(formData), idempotencyKey);
        if (response.state !== "booked" || !response.bookingId || !response.appointmentId) {
          setBookError(response.message || "Online confirmation is not available for that time yet.");
          return null;
        }
        clearHold();
        return {
          appointmentId: response.appointmentId,
          bookingId: response.bookingId,
          confirmationNumber: response.confirmationNumber,
          manageUrl: response.manageUrl,
        };
      } catch (error) {
        setBookError(friendlyError("Unable to confirm that appointment online.", error));
        return null;
      }
    },
    [clearHold],
  );

  return {
    activeHold,
    book,
    bookError,
    holdError,
    holdWindow,
    loadingDate,
    releaseHold,
    remainingSeconds,
    reset,
    searchDate,
    searchError,
    windowsByDate,
  };
}
