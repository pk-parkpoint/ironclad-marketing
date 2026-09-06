"use client";
import { useEffect, useRef } from "react";
import type { BookingLeadPayload } from "@/lib/booking-lead";

type Send = (options: { useBeacon: boolean; payload?: BookingLeadPayload }) => void;

export function useBookingAbandonmentLifecycle(
  open: boolean,
  send: Send,
  snapshot: () => BookingLeadPayload | null,
) {
  const callbacks = useRef({ send, snapshot });
  const pendingCleanup = useRef<AbortController | null>(null);
  callbacks.current = { send, snapshot };
  useEffect(() => {
    if (!open) return;
    pendingCleanup.current?.abort();
    const replay = new AbortController();
    pendingCleanup.current = replay;
    function onPageHide() { callbacks.current.send({ useBeacon: true }); }
    window.addEventListener("pagehide", onPageHide);
    return () => {
      window.removeEventListener("pagehide", onPageHide);
      // Capture this attempt before a destination wizard can replace shared
      // session state. An immediate effect re-setup cancels Strict Mode cleanup.
      const payload = callbacks.current.snapshot();
      const sendCaptured = callbacks.current.send;
      queueMicrotask(() => {
        if (!replay.signal.aborted && payload) sendCaptured({ useBeacon: true, payload });
      });
    };
  }, [open]);
}
