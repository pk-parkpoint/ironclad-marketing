"use client";

import { useEffect, useRef, useState } from "react";
import { firstOfferableDateId, ironcladTodayDateId } from "@/lib/booking-date-policy";

/** Sleeping tabs can outlive their selected day and the hold that belonged to it. */
export function useBookingDateRollover(open: boolean, selectedDate: string | null, refresh: (date: string) => void) {
  const refreshRef = useRef(refresh);
  refreshRef.current = refresh;
  const [dateNotice, setDateNotice] = useState<string | null>(null);
  useEffect(() => {
    if (!open) {
      setDateNotice(null);
      return;
    }
    function checkDate() {
      if (document.visibilityState !== "visible" || !selectedDate || selectedDate >= ironcladTodayDateId()) return;
      refreshRef.current(firstOfferableDateId());
      setDateNotice("The date from your earlier visit has passed. Please choose a new appointment time.");
    }
    checkDate();
    window.addEventListener("focus", checkDate);
    window.addEventListener("pageshow", checkDate);
    document.addEventListener("visibilitychange", checkDate);
    const timer = window.setInterval(checkDate, 60_000);
    return () => {
      window.removeEventListener("focus", checkDate);
      window.removeEventListener("pageshow", checkDate);
      document.removeEventListener("visibilitychange", checkDate);
      window.clearInterval(timer);
    };
  }, [open, selectedDate]);
  return { dateNotice, clearDateNotice: () => setDateNotice(null) };
}
