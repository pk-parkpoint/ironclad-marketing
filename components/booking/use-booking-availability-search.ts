"use client";

import { useCallback, useRef, useState } from "react";
import {
  searchPublicBookingAvailability,
  type PublicBookingWindow,
} from "@/lib/public-booking-facade";
import type { WizardFormData } from "./booking-wizard";
import {
  buildIssueSummary,
  customerArrivalWindows,
  DURATION_ESTIMATE_MINUTES,
  friendlyError,
  schedulerServiceType,
  SEARCH_MAX_RESULTS,
} from "./booking-facade-helpers";

const AVAILABILITY_CACHE_TTL_MS = 2 * 60 * 1000;
const PREFETCH_CONCURRENCY = 2;

type SearchOptions = {
  force?: boolean;
  foreground?: boolean;
};

type CacheEntry = {
  expiresAt: number;
  windows: PublicBookingWindow[];
  candidatesByOfferId: Record<string, PublicBookingWindow[]>;
};

function requestKey(date: string, formData: WizardFormData): string {
  return JSON.stringify([
    date,
    schedulerServiceType(formData) || "",
    buildIssueSummary(formData),
  ]);
}

export function useBookingAvailabilitySearch() {
  const [windowsByDate, setWindowsByDate] = useState<Record<string, PublicBookingWindow[]>>({});
  const [loadingDate, setLoadingDate] = useState<string | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const cacheRef = useRef(new Map<string, CacheEntry>());
  const inFlightRef = useRef(new Map<string, Promise<void>>());
  const offerCandidatesRef = useRef<Record<string, PublicBookingWindow[]>>({});
  const generationRef = useRef(0);

  const resetSearch = useCallback(() => {
    generationRef.current += 1;
    cacheRef.current.clear();
    inFlightRef.current.clear();
    offerCandidatesRef.current = {};
    setWindowsByDate({});
    setLoadingDate(null);
    setSearchError(null);
  }, []);

  const searchDate = useCallback(async (
    date: string,
    formData: WizardFormData,
    options: SearchOptions = {},
  ) => {
    const foreground = options.foreground !== false;
    const key = requestKey(date, formData);
    const cached = cacheRef.current.get(key);
    if (!options.force && cached && cached.expiresAt > Date.now()) {
      offerCandidatesRef.current = {
        ...offerCandidatesRef.current,
        ...cached.candidatesByOfferId,
      };
      setWindowsByDate((current) => ({ ...current, [date]: cached.windows }));
      if (foreground) setSearchError(null);
      return;
    }

    if (foreground) {
      setLoadingDate(date);
      setSearchError(null);
    }

    let request = inFlightRef.current.get(key);
    if (!request) {
      const generation = generationRef.current;
      request = (async () => {
        const response = await searchPublicBookingAvailability({
          date,
          durationEstimateMinutes: DURATION_ESTIMATE_MINUTES,
          issueSummary: buildIssueSummary(formData),
          maxResults: SEARCH_MAX_RESULTS,
          serviceType: schedulerServiceType(formData),
        });
        if (generation !== generationRef.current) return;
        const grouped = customerArrivalWindows(response.windows);
        offerCandidatesRef.current = {
          ...offerCandidatesRef.current,
          ...grouped.candidatesByOfferId,
        };
        cacheRef.current.set(key, {
          candidatesByOfferId: grouped.candidatesByOfferId,
          expiresAt: Date.now() + AVAILABILITY_CACHE_TTL_MS,
          windows: grouped.windows,
        });
        setWindowsByDate((current) => ({ ...current, [date]: grouped.windows }));
      })();
      inFlightRef.current.set(key, request);
    }

    try {
      await request;
    } catch (error) {
      if (foreground) {
        setSearchError(friendlyError("Unable to load available appointment times.", error));
      }
    } finally {
      if (inFlightRef.current.get(key) === request) inFlightRef.current.delete(key);
      if (foreground) setLoadingDate((current) => current === date ? null : current);
    }
  }, []);

  const prefetchDates = useCallback(async (dates: string[], formData: WizardFormData) => {
    const queue = [...new Set(dates)];
    async function worker() {
      while (queue.length > 0) {
        const date = queue.shift();
        if (date) await searchDate(date, formData, { foreground: false });
      }
    }
    const workerCount = Math.min(PREFETCH_CONCURRENCY, queue.length);
    await Promise.all(Array.from({ length: workerCount }, () => worker()));
  }, [searchDate]);

  const candidatesFor = useCallback((window: PublicBookingWindow) => {
    return offerCandidatesRef.current[window.offerId];
  }, []);

  return {
    candidatesFor,
    loadingDate,
    prefetchDates,
    resetSearch,
    searchDate,
    searchError,
    windowsByDate,
  };
}
