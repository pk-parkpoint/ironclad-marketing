"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  bookPublicBookingHold,
  holdPublicBookingWindow,
  releasePublicBookingHold,
  type PublicBookingHoldResponse,
  type PublicBookingWindow,
} from "@/lib/public-booking-facade";
import type { BookingConfirmation, WizardFormData } from "./booking-wizard";
import {
  buildBookPayload,
  buildIssueSummary,
  DURATION_ESTIMATE_MINUTES,
  friendlyError,
  schedulerOfferId,
  schedulerServiceType,
  secondsUntil,
} from "./booking-facade-helpers";
import { useBookingAvailabilitySearch } from "./use-booking-availability-search";

type ActiveHold = PublicBookingHoldResponse & { startTime: string; endTime: string };

export function usePublicBookingFacade() {
  const [holdError, setHoldError] = useState<string | null>(null);
  const [bookError, setBookError] = useState<string | null>(null);
  const [activeHold, setActiveHold] = useState<ActiveHold | null>(null);
  const [holdingOfferId, setHoldingOfferId] = useState<string | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const activeHoldRef = useRef<ActiveHold | null>(null);
  const holdRequestRef = useRef(0);
  const availabilitySearch = useBookingAvailabilitySearch();
  const { candidatesFor, resetSearch } = availabilitySearch;

  useEffect(() => {
    activeHoldRef.current = activeHold;
  }, [activeHold]);

  const clearHold = useCallback(() => {
    activeHoldRef.current = null;
    setActiveHold(null);
    setRemainingSeconds(0);
  }, []);

  const releaseHold = useCallback(async () => {
    holdRequestRef.current += 1;
    setHoldingOfferId(null);
    const hold = activeHoldRef.current;
    clearHold();
    if (hold?.holdId) await releasePublicBookingHold(hold.holdId).catch(() => undefined);
  }, [clearHold]);

  const reset = useCallback(() => {
    holdRequestRef.current += 1;
    setHoldingOfferId(null);
    setHoldError(null);
    setBookError(null);
    resetSearch();
    clearHold();
  }, [clearHold, resetSearch]);

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

  const holdWindow = useCallback(
    async (window: PublicBookingWindow, formData: WizardFormData) => {
      void releaseHold();
      const requestId = ++holdRequestRef.current;
      setHoldingOfferId(window.offerId);
      setHoldError(null);
      setBookError(null);
      const fallback = { ...window, offerId: schedulerOfferId(window.offerId) };
      const candidates = candidatesFor(window) || [fallback];
      let lastError: unknown;
      try {
        for (const candidate of candidates) {
          if (requestId !== holdRequestRef.current) return null;
          try {
            const hold = await holdPublicBookingWindow({
              durationEstimateMinutes: DURATION_ESTIMATE_MINUTES,
              idempotencyKey: `${candidate.offerId}-${Date.now()}`,
              issueSummary: buildIssueSummary(formData),
              offerId: candidate.offerId,
              serviceType: schedulerServiceType(formData),
              windowId: candidate.windowId,
            });
            if (requestId !== holdRequestRef.current) {
              await releasePublicBookingHold(hold.holdId).catch(() => undefined);
              return null;
            }
            const active = { ...hold, startTime: window.startTime, endTime: window.endTime };
            activeHoldRef.current = active;
            setActiveHold(active);
            return active;
          } catch (error) {
            lastError = error;
            if (!(error instanceof Error) || !/no longer available/i.test(error.message)) break;
          }
        }
        setHoldError(friendlyError("Unable to reserve that appointment time.", lastError));
        return null;
      } finally {
        if (requestId === holdRequestRef.current) setHoldingOfferId(null);
      }
    },
    [candidatesFor, releaseHold],
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
    holdingOfferId,
    loadingDate: availabilitySearch.loadingDate,
    prefetchDates: availabilitySearch.prefetchDates,
    releaseHold,
    remainingSeconds,
    reset,
    searchDate: availabilitySearch.searchDate,
    searchError: availabilitySearch.searchError,
    windowsByDate: availabilitySearch.windowsByDate,
  };
}
