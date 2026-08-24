"use client";

import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import Image from "next/image";
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
  markBookingAbandoned,
  markBookingApiSubmitted,
  markBookingCompleted,
  markBookingScreenVisited,
  recordBookingSiteVisit,
  startBookingAttempt,
  updateBookingAttemptDraft,
} from "@/lib/booking-session";
import { getBookingServiceIssuePrefill } from "@/lib/booking-service-prefill";
import { BookingStepSelectIssue } from "./booking-step-select-issue";
import { BookingStepSchedule } from "./booking-step-schedule";
import { BookingStepContact } from "./booking-step-contact";
import { BookingStepConfirm } from "./booking-step-confirm";
import { usePublicBookingFacade } from "./use-public-booking-facade";
import type { PublicBookingWindow } from "@/lib/public-booking-facade";
import { bookingPrefetchDateIds } from "./booking-date-policy";
import styles from "./booking-wizard.module.css";

export type WizardFormData = {
  serviceCategory: string | null;
  serviceDetail: string | null;
  additionalNotes: string;
  selectedDate: string | null;
  timeOfDay: string | null;
  selectedWindowId: string | null;
  selectedOfferId: string | null;
  selectedStartTime: string | null;
  selectedEndTime: string | null;
  selectedWindowLabel: string | null;
  holdId: string | null;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  addressFormatted: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  latitude?: number;
  longitude?: number;
  propertyType: "residential" | "commercial" | null;
  ownershipStatus: "own" | "other" | null;
  gateCode: string;
  petsOnPremise: boolean;
  contactPreference: string[];
};

export type BookingConfirmation = {
  bookingId: string;
  appointmentId: string;
  confirmationNumber?: string;
  manageUrl?: string;
};

const INITIAL_FORM_DATA: WizardFormData = {
  serviceCategory: null, serviceDetail: null, additionalNotes: "",
  selectedDate: null, timeOfDay: "flexible",
  selectedWindowId: null, selectedOfferId: null,
  selectedStartTime: null, selectedEndTime: null,
  selectedWindowLabel: null, holdId: null,
  firstName: "", lastName: "", phone: "", email: "",
  addressFormatted: "", street: "", city: "", state: "", zip: "",
  propertyType: null, ownershipStatus: null,
  gateCode: "", petsOnPremise: false, contactPreference: [],
};

const STEPS = [
  { number: 1, label: "Select Issue" },
  { number: 2, label: "Contact Info" },
  { number: 3, label: "Schedule Time" },
  { number: 4, label: "Confirm Details" },
];

export type BookingWizardProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialServiceSlug?: string;
};

function getInitialWizardState(serviceSlug: string | null | undefined) {
  const serviceIssue = getBookingServiceIssuePrefill(serviceSlug);
  return {
    currentStep: serviceIssue ? 2 : 1,
    formData: serviceIssue ? { ...INITIAL_FORM_DATA, ...serviceIssue } : INITIAL_FORM_DATA,
    serviceIssue,
  };
}

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selectors =
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
  return Array.from(container.querySelectorAll<HTMLElement>(selectors)).filter((el) => {
    const style = window.getComputedStyle(el);
    return style.display !== "none" && style.visibility !== "hidden";
  });
}

function joinClasses(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

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
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const bookingFacade = usePublicBookingFacade();
  const { book, bookError, holdWindow, prefetchDates, releaseHold, reset, searchDate } = bookingFacade;
  const modalRef = useRef<HTMLDivElement | null>(null);
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const finalizedRef = useRef(false);
  const formDataRef = useRef(firstWizardState.formData);
  const currentStepRef = useRef(firstWizardState.currentStep);
  const bookingIdRef = useRef<string | undefined>(undefined);
  const pathnameRef = useRef(pathname);
  const searchParamsRef = useRef(searchParams);
  const sendAbandonmentRef = useRef<(args: { useBeacon: boolean }) => void>(() => {});

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

  function sendAbandonment({ useBeacon }: { useBeacon: boolean }) {
    if (finalizedRef.current) return;
    const payload = buildLeadPayload("abandoned");
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

    clearBookingAttempt();
  }

  sendAbandonmentRef.current = sendAbandonment;

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
    if (!open) return;
    function onPageHide() {
      sendAbandonmentRef.current({ useBeacon: true });
    }

    window.addEventListener("pagehide", onPageHide);
    return () => {
      window.removeEventListener("pagehide", onPageHide);
      if (!finalizedRef.current) {
        sendAbandonmentRef.current({ useBeacon: true });
      }
    };
  }, [open]);

  useEffect(() => {
    if (open) return;
    void releaseHold();
  }, [open, releaseHold]);

  useEffect(() => {
    if (!open) return;
    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const rafId = requestAnimationFrame(() => closeButtonRef.current?.focus({ preventScroll: true }));

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        const prev = previousFocusRef.current;
        sendAbandonmentRef.current({ useBeacon: false });
        onOpenChange(false);
        if (prev?.isConnected) setTimeout(() => prev.isConnected && prev.focus(), 0);
        return;
      }
      if (e.key !== "Tab" || !modalRef.current) return;
      const focusable = getFocusableElements(modalRef.current);
      if (!focusable.length) {
        e.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (!modalRef.current.contains(active)) {
        e.preventDefault();
        first.focus();
        return;
      }
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(rafId);
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKeyDown);
      const prev = previousFocusRef.current;
      if (prev?.isConnected) requestAnimationFrame(() => prev.isConnected && prev.focus());
    };
  }, [onOpenChange, open]);

  useEffect(() => {
    if (!open) return;
    bodyRef.current?.scrollTo({ top: 0, left: 0, behavior: "auto" });
    modalRef.current?.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [currentStep, open]);

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

  if (!open) return null;

  return (
    <div
      ref={modalRef}
      autoFocus
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-wizard-title"
      aria-describedby="booking-modal-description"
      className={styles.page}
      data-theme={theme}
      onKeyDown={handleDialogKeyDown}
      tabIndex={-1}
    >
      <div className={styles.blobA} aria-hidden="true" />
      <div className={styles.blobB} aria-hidden="true" />
      <div className={styles.stack}>
        <div className={styles.brandHeader}>
          <div className={styles.brandMarkRow}>
            <Image
              className={styles.brandMark}
              src="/ironclad-booking/ironclad-mark.png"
              alt=""
              width={66}
              height={66}
              priority
            />
            <div className={styles.wordmark} aria-label="Ironclad Plumbing">
              <span>IRONCLAD</span>
              <span>PLUMBING</span>
            </div>
          </div>
          <div className={styles.trustBar} aria-label="Ironclad Plumbing trust signals">
            <span className={styles.trustTrack}>
              <span className={styles.trustGroup}>
                <span>
                  <span className={styles.trustStars}>★★★★★</span>{" "}
                  <span className={styles.trustStrong}>4.9/5</span> · 142 Google, Yelp, and Nextdoor reviews
                </span>
                <span className={styles.trustBullet}>•</span>
                <span className={styles.trustItem}>Locally Owned</span>
                <span className={styles.trustBullet}>•</span>
                <span className={styles.trustItem}>Licensed &amp; Insured</span>
              </span>
              <span className={`${styles.trustGroup} ${styles.trustGroupDuplicate}`} aria-hidden="true">
                <span>
                  <span className={styles.trustStars}>★★★★★</span>{" "}
                  <span className={styles.trustStrong}>4.9/5</span> · 142 Google, Yelp, and Nextdoor reviews
                </span>
                <span className={styles.trustBullet}>•</span>
                <span className={styles.trustItem}>Locally Owned</span>
                <span className={styles.trustBullet}>•</span>
                <span className={styles.trustItem}>Licensed &amp; Insured</span>
              </span>
            </span>
          </div>
        </div>
        <section className={styles.frame} aria-label="Booking wizard">
          <div className={styles.panel}>
            <header className={styles.header}>
              <button
                ref={closeButtonRef}
                aria-label="Close booking modal"
                className={styles.closeButton}
                onClick={handleDismiss}
                type="button"
              >
                ×
              </button>
              <h2 className="sr-only" id="booking-wizard-title">
                Request an Appointment
              </h2>
              <StepProgress currentStep={currentStep} onGoToStep={moveToStep} />
            </header>
            <p className="sr-only" id="booking-modal-description">
              Booking request dialog. Press Escape to close.
            </p>
            <p aria-live="polite" className="sr-only">
              {`Step ${currentStep} of 4.`}
            </p>

            <div className={styles.body} ref={bodyRef}>
              <div
                key={currentStep}
                className={joinClasses(styles.stepContent, direction === "back" && styles.stepContentBack)}
              >
                {currentStep === 1 && (
                  <BookingStepSelectIssue formData={formData} onUpdate={updateFormData} onNext={() => moveToStep(2)} />
                )}
                {currentStep === 2 && (
                  <BookingStepContact
                    formData={formData}
                    onUpdate={updateFormData}
                    onBack={() => moveToStep(1)}
                    onNext={() => moveToStep(3)}
                  />
                )}
                {currentStep === 3 && (
                  <BookingStepSchedule
                    formData={formData}
                    windowsByDate={bookingFacade.windowsByDate}
                    loadingDate={bookingFacade.loadingDate}
                    searchError={bookingFacade.searchError}
                    holdError={bookingFacade.holdError}
                    holdingOfferId={bookingFacade.holdingOfferId}
                    remainingSeconds={bookingFacade.remainingSeconds}
                    isSubmitting={isSubmitting}
                    submitError={submitError || bookingFacade.bookError || undefined}
                    onUpdate={updateFormData}
                    onSelectDate={selectDate}
                    onSelectWindow={selectWindow}
                    onRefresh={refreshSelectedDate}
                    onBack={() => moveToStep(2)}
                    onNext={() => {
                      void handleSubmit().then((ok) => {
                        if (ok) moveToStep(4);
                      });
                    }}
                  />
                )}
                {currentStep === 4 && (
                  <BookingStepConfirm
                    formData={formData}
                    onUpdate={updateFormData}
                    bookingId={bookingId}
                    confirmation={confirmation}
                    onDismiss={() => onOpenChange(false)}
                    onClose={() => { void sendCompletedNotification(); }}
                  />
                )}
              </div>
            </div>
          </div>
        </section>
        <div className={styles.themeToggle} aria-label="Booking wizard theme">
          {(["light", "dark"] as const).map((mode) => (
            <button
              aria-pressed={theme === mode}
              className={joinClasses(styles.themeToggleButton, theme === mode && styles.themeToggleButtonActive)}
              key={mode}
              onClick={() => setTheme(mode)}
              type="button"
            >
              {mode === "light" ? "Light Mode" : "Dark Mode"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepProgress({
  currentStep,
  onGoToStep,
}: {
  currentStep: number;
  onGoToStep: (step: number) => void;
}) {
  const completedSegments = Math.max(0, Math.min(currentStep - 1, STEPS.length - 1));
  const segmentPositionClasses = [
    styles.progressSegmentOne,
    styles.progressSegmentTwo,
    styles.progressSegmentThree,
  ];

  return (
    <div className={styles.progress} aria-label={`Step ${currentStep} of 4`}>
      <div className={styles.progressTrack} aria-hidden="true">
        {segmentPositionClasses.map((segmentClass, index) => (
          <span
            className={joinClasses(
              styles.progressSegment,
              segmentClass,
              index < completedSegments && styles.progressSegmentComplete,
            )}
            key={segmentClass}
          >
            <span className={styles.progressSegmentFill} />
          </span>
        ))}
      </div>
      <div className={styles.progressNodes}>
        {STEPS.map((step) => {
          const isDone = step.number < currentStep;
          const isActive = step.number === currentStep;

          return (
            <div className={styles.progressNodeColumn} key={step.number}>
              <button
                type="button"
                className={joinClasses(styles.stepNode, isDone && styles.stepNodeDone, isActive && styles.stepNodeActive)}
                aria-label={isDone ? `Return to ${step.label}` : step.label}
                disabled={!isDone}
                onClick={() => isDone && onGoToStep(step.number)}
              >
                {isDone ? "✓" : step.number}
              </button>
              <span
                className={joinClasses(styles.stepLabel, isDone && styles.stepLabelDone, isActive && styles.stepLabelActive)}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
