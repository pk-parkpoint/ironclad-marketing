"use client";

import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { parseAttribution } from "@/lib/analytics";
import {
  BOOKING_SCREEN_IDS,
  buildBookingLeadPayload,
  type BookingLeadPayload,
  type BookingScreenId,
} from "@/lib/booking-lead";
import {
  clearBookingAttempt,
  getBookingSiteSession,
  getActiveBookingAttempt,
  markBookingAbandoned,
  markBookingApiSubmitted,
  markBookingCompleted,
  markBookingScreenVisited,
  recordBookingSiteVisit,
  startBookingAttempt,
  updateBookingAttemptDraft,
} from "@/lib/booking-session";
import { usePublicBookingFacade } from "./use-public-booking-facade";
import type { PublicBookingWindow } from "@/lib/public-booking-facade";
import { bookingPrefetchDateIds } from "./booking-date-policy";

import { getInitialWizardState, type WizardFormData, type BookingConfirmation, type BookingWizardProps } from "./booking-wizard-state";
import { BookingWizardView } from "./booking-wizard-view";
import { useBookingAbandonmentLifecycle } from "./use-booking-abandonment-lifecycle";
import { useBookingDialogFocus } from "./use-booking-dialog-focus";
export type { WizardFormData, BookingConfirmation, BookingWizardProps } from "./booking-wizard-state";

export function BookingWizard({ initialServiceSlug, open, onOpenChange }: BookingWizardProps) {
  const pathname = usePathname() ?? "/";
  const searchParams = useSearchParams();
  const firstWizardState = getInitialWizardState(initialServiceSlug ?? searchParams.get("service"));
  const [currentStep, setCurrentStep] = useState(firstWizardState.currentStep);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [formData, setFormData] = useState<WizardFormData>(firstWizardState.formData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | undefined>();
  const [bookingId, setBookingId] = useState<string | undefined>();
  const [confirmation, setConfirmation] = useState<BookingConfirmation | null>(null);
  const bookingFacade = usePublicBookingFacade();
  const { book, bookError, holdWindow, prefetchDates, releaseHold, reset, searchDate } = bookingFacade;
  const finalizedRef = useRef(false);
  const formDataRef = useRef(firstWizardState.formData);
  const currentStepRef = useRef(firstWizardState.currentStep);
  const bookingIdRef = useRef<string | undefined>(undefined);
  const pathnameRef = useRef(pathname);
  const searchParamsRef = useRef(searchParams);

  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  useEffect(() => {
    currentStepRef.current = currentStep;
  }, [currentStep]);

  useEffect(() => {
    bookingIdRef.current = bookingId;
  }, [bookingId]);

  useEffect(() => {
    pathnameRef.current = pathname;
    searchParamsRef.current = searchParams;
  }, [pathname, searchParams]);

  function currentScreenId(stepNumber: number): BookingScreenId {
    return BOOKING_SCREEN_IDS[Math.max(0, Math.min(stepNumber - 1, BOOKING_SCREEN_IDS.length - 1))]!;
  }

  function buildLeadPayload(status: "completed" | "abandoned"): BookingLeadPayload | null {
    const attempt =
      status === "completed"
        ? markBookingCompleted(bookingIdRef.current)
        : markBookingAbandoned(currentScreenId(currentStepRef.current));
    const siteSession = getBookingSiteSession();
    if (!attempt || !siteSession) {
      return null;
    }
    return buildBookingLeadPayload({
      attempt,
      bookingId: bookingIdRef.current,
      formData: formDataRef.current,
      siteSession,
      status,
    });
  }

  async function sendCompletedNotification() {
    if (finalizedRef.current) return;
    const payload = buildLeadPayload("completed");
    if (!payload) return;
    finalizedRef.current = true;
    await fetch("/api/bookings/notify", {
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    }).catch(() => {});
    clearBookingAttempt();
  }

  function sendAbandonment({ useBeacon, payload: captured }: { useBeacon: boolean; payload?: BookingLeadPayload }) {
    if (finalizedRef.current) return;
    const payload = captured || buildLeadPayload("abandoned");
    if (!payload) return;
    finalizedRef.current = true;
    const body = JSON.stringify(payload);

    if (useBeacon && typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      navigator.sendBeacon("/api/bookings/abandon", new Blob([body], { type: "application/json" }));
    } else {
      fetch("/api/bookings/abandon", {
        body,
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        method: "POST",
      }).catch(() => {});
    }

    if (getActiveBookingAttempt()?.sessionId === payload.sessionId) clearBookingAttempt();
  }

  useBookingAbandonmentLifecycle(open, sendAbandonment, () =>
    finalizedRef.current ? null : buildLeadPayload("abandoned"),
  );

  function handleDismiss() {
    sendAbandonment({ useBeacon: false });
    onOpenChange(false);
  }

  function handleDialogKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Escape") return;
    event.preventDefault();
    event.stopPropagation();
    handleDismiss();
  }

  useEffect(() => {
    if (!open) return;
    const currentSearchParams = searchParamsRef.current;
    const initialState = getInitialWizardState(
      initialServiceSlug ?? currentSearchParams.get("service"),
    );
    finalizedRef.current = false;
    formDataRef.current = initialState.formData;
    currentStepRef.current = initialState.currentStep;
    bookingIdRef.current = undefined;
    setDirection("forward");
    setCurrentStep(initialState.currentStep);
    setFormData(initialState.formData);
    setIsSubmitting(false);
    setSubmitError(undefined);
    setBookingId(undefined);
    setConfirmation(null);
    reset();
    clearBookingAttempt();
    const currentPathname = pathnameRef.current ?? "/";
    recordBookingSiteVisit({
      attribution: parseAttribution(new URLSearchParams(currentSearchParams.toString())),
      pathname: currentPathname,
      search: currentSearchParams.toString(),
    });
    startBookingAttempt(initialState.formData);
    if (initialState.serviceIssue) {
      updateBookingAttemptDraft(initialState.formData, ["serviceCategory", "serviceDetail"]);
    }
  }, [initialServiceSlug, open, reset]);

  useEffect(() => {
    if (!open) return;
    markBookingScreenVisited(currentScreenId(currentStep));
  }, [currentStep, open]);

  useEffect(() => {
    if (!open || currentStep !== 2) return;
    void prefetchDates(bookingPrefetchDateIds(), formDataRef.current);
  }, [currentStep, open, prefetchDates]);

  useEffect(() => {
    if (open) return;
    void releaseHold();
  }, [open, releaseHold]);

  function updateFormData(updates: Partial<WizardFormData>) {
    setFormData((prev) => {
      const next = { ...prev, ...updates };
      formDataRef.current = next;
      updateBookingAttemptDraft(next, Object.keys(updates) as Array<keyof WizardFormData>);
      return next;
    });
  }

  function selectDate(date: string) {
    const updates: Partial<WizardFormData> = {
      holdId: null,
      selectedDate: date,
      selectedEndTime: null,
      selectedOfferId: null,
      selectedStartTime: null,
      selectedWindowId: null,
      selectedWindowLabel: null,
    };
    const nextFormData = { ...formDataRef.current, ...updates };
    updateFormData(updates);
    void releaseHold();
    void searchDate(date, nextFormData);
  }

  async function selectWindow(window: PublicBookingWindow): Promise<boolean> {
    const hold = await holdWindow(window, formDataRef.current);
    if (!hold) return false;
    const label = window.arrivalWindowLabel || window.displayLabel || null;
    updateFormData({
      holdId: hold.holdId,
      selectedDate: window.startTime.slice(0, 10),
      selectedEndTime: window.endTime,
      selectedOfferId: window.offerId,
      selectedStartTime: window.startTime,
      selectedWindowId: window.windowId,
      selectedWindowLabel: label,
    });
    return true;
  }

  function refreshSelectedDate() {
    const selectedDate = formDataRef.current.selectedDate;
    if (selectedDate) void searchDate(selectedDate, formDataRef.current, { force: true });
  }

  async function handleSubmit(): Promise<boolean> {
    setSubmitError(undefined);
    setIsSubmitting(true);
    try {
      const booked = await book(formData);
      if (!booked) throw new Error(bookError || "Unable to confirm appointment.");
      setConfirmation(booked);
      setBookingId(booked.bookingId);
      markBookingApiSubmitted(booked.bookingId);
      setIsSubmitting(false);
      return true;
    } catch {
      setSubmitError("Appointment confirmation failed. Please try another time or call/text us.");
      setIsSubmitting(false);
      return false;
    }
  }

  function moveToStep(step: number) {
    setDirection(step < currentStepRef.current ? "back" : "forward");
    setCurrentStep(step);
  }

  const { modalRef, bodyRef, closeButtonRef } = useBookingDialogFocus(open, currentStep, handleDismiss);
  if (!open) return null;
  return <BookingWizardView modalRef={modalRef} bodyRef={bodyRef} closeButtonRef={closeButtonRef} model={{
    currentStep, direction, formData, isSubmitting, submitError, bookingId, confirmation,
    bookingFacade, updateFormData, moveToStep, selectDate, selectWindow, refreshSelectedDate,
    handleSubmit, handleDismiss, sendCompletedNotification, handleDialogKeyDown, onOpenChange,
  }} />;
}
