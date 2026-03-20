"use client";

import { useEffect, useRef, useState } from "react";
import { BookingStepSelectIssue } from "./booking-step-select-issue";
import { BookingStepSchedule } from "./booking-step-schedule";
import { BookingStepContact } from "./booking-step-contact";
import { BookingStepConfirm } from "./booking-step-confirm";

export type WizardFormData = {
  serviceCategory: string | null;
  serviceDetail: string | null;
  additionalNotes: string;
  selectedDate: string | null;
  timeOfDay: string | null;
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
  propertyType: "residential" | "commercial";
  ownershipStatus: "own" | "other";
  gateCode: string;
  petsOnPremise: boolean;
  contactPreference: string[];
};

const INITIAL_FORM_DATA: WizardFormData = {
  serviceCategory: null, serviceDetail: null, additionalNotes: "",
  selectedDate: null, timeOfDay: "flexible",
  firstName: "", lastName: "", phone: "", email: "",
  addressFormatted: "", street: "", city: "", state: "", zip: "",
  propertyType: "residential", ownershipStatus: "own",
  gateCode: "", petsOnPremise: false, contactPreference: ["either"],
};

const STEPS = [
  { number: 1, label: "Select Issue" },
  { number: 2, label: "Schedule Time" },
  { number: 3, label: "Contact Info" },
  { number: 4, label: "Confirm Details" },
];

type BookingWizardProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialServiceSlug?: string;
};

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selectors =
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
  return Array.from(container.querySelectorAll<HTMLElement>(selectors)).filter((el) => {
    const style = window.getComputedStyle(el);
    return style.display !== "none" && style.visibility !== "hidden";
  });
}

export function BookingWizard({ open, onOpenChange }: BookingWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<WizardFormData>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | undefined>();
  const [bookingId, setBookingId] = useState<string | undefined>();
  const modalRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const sessionIdRef = useRef<string>("");

  useEffect(() => {
    if (!open) return;
    sessionIdRef.current = `ws_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    setCurrentStep(1);
    setFormData(INITIAL_FORM_DATA);
    setIsSubmitting(false);
    setSubmitError(undefined);
    setBookingId(undefined);
    // Start tracking this session for abandoned booking detection
    fetch("/api/bookings/partial", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: sessionIdRef.current, data: {} }),
    }).catch(() => {});
  }, [open]);

  useEffect(() => {
    if (!open) return;
    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const rafId = requestAnimationFrame(() => closeButtonRef.current?.focus());

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        const prev = previousFocusRef.current;
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

  function updateFormData(updates: Partial<WizardFormData>) {
    setFormData((prev) => {
      const next = { ...prev, ...updates };
      // Send partial data for abandoned booking tracking
      if (sessionIdRef.current) {
        fetch("/api/bookings/partial", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId: sessionIdRef.current, data: next }),
        }).catch(() => {});
      }
      return next;
    });
  }

  async function handleSubmit(): Promise<boolean> {
    setSubmitError(undefined);
    setIsSubmitting(true);
    const timeLabels: Record<string, string> = {
      morning: "Morning (8 AM - 12 PM)",
      afternoon: "Afternoon (12 PM - 5 PM)",
      flexible: "Flexible / Any Time",
    };
    const notesParts = [
      formData.additionalNotes,
      formData.propertyType === "commercial" ? "Property type: Commercial" : "",
      formData.ownershipStatus === "other" ? "Ownership: Someone else owns this property" : "",
      formData.petsOnPremise ? "Pets on premise" : "",
    ].filter(Boolean);
    const payload = {
      serviceCategory: formData.serviceDetail || formData.serviceCategory || "other",
      preferredDate: formData.selectedDate || new Date().toISOString().slice(0, 10),
      preferredWindow: timeLabels[formData.timeOfDay || ""] || "Open Ended",
      customerName: `${formData.firstName} ${formData.lastName}`.trim(),
      phone: formData.phone,
      email: formData.email || undefined,
      address: {
        formatted: formData.addressFormatted,
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        latitude: formData.latitude,
        longitude: formData.longitude,
      },
      unitOrGateCode: formData.gateCode || undefined,
      contactPreference: formData.contactPreference.includes("either")
        ? ("either" as const)
        : ((formData.contactPreference[0] || "either") as "call" | "text" | "either"),
      notes: notesParts.join(". ") || undefined,
    };
    try {
      const res = await fetch("/api/bookings", {
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      if (!res.ok) throw new Error("Unable to submit booking.");
      const data = (await res.json()) as { bookingId?: string };
      setBookingId(data.bookingId);
      setIsSubmitting(false);
      // Clear the abandon timer — booking is complete
      if (sessionIdRef.current) {
        fetch("/api/bookings/partial", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId: sessionIdRef.current, completed: true }),
        }).catch(() => {});
      }
      return true;
    } catch {
      setSubmitError("Booking submission failed. Please try again or call/text us.");
      setIsSubmitting(false);
      return false;
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-end justify-center bg-black/45 p-0 sm:items-center sm:p-4">
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-wizard-title"
        aria-describedby="booking-wizard-desc"
        className="booking-modal-sheet flex h-[100dvh] w-full max-w-[600px] flex-col bg-background shadow-lg sm:h-auto sm:max-h-[96vh] sm:rounded-[var(--radius-modal)]"
      >
        <div className="flex items-center justify-end px-5 pt-4 pb-0">
          <button
            ref={closeButtonRef}
            aria-label="Close booking modal"
            className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            onClick={() => onOpenChange(false)}
            type="button"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="sr-only" id="booking-wizard-title">Request an Appointment</h2>
        </div>
        <p className="sr-only" id="booking-wizard-desc">
          Booking request dialog. Press Escape to close.
        </p>
        <p aria-live="polite" className="sr-only">
          {`Step ${currentStep} of 4.`}
        </p>

        {/* Progress Bar */}
        <div className="px-5 pb-4">
          <div className="relative flex justify-between">
            {/* Connecting lines — positioned through center of circles */}
            <div className="absolute left-0 right-0 top-3.5 flex px-[14px]">
              {STEPS.slice(1).map((s, i) => (
                <div key={s.number} className={`h-0.5 flex-1 ${currentStep > i + 1 ? "bg-blue-600" : "bg-gray-200"}`} />
              ))}
            </div>
            {/* Circles + labels */}
            {STEPS.map((s) => (
              <div key={s.number} className="relative z-10 flex flex-col items-center gap-1">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                    currentStep > s.number
                      ? "bg-blue-600 text-white"
                      : currentStep === s.number
                        ? "bg-blue-600 text-white"
                        : "border border-gray-300 bg-white text-gray-400"
                  }`}
                >
                  {currentStep > s.number ? (
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
                    </svg>
                  ) : (
                    s.number
                  )}
                </div>
                <span className={`text-[10px] font-medium ${currentStep >= s.number ? "text-blue-600" : "text-gray-400"}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div key={currentStep} className="animate-fade-in flex min-h-0 flex-1 flex-col overflow-y-auto">
          {currentStep === 1 && (
            <BookingStepSelectIssue formData={formData} onUpdate={updateFormData} onNext={() => setCurrentStep(2)} />
          )}
          {currentStep === 2 && (
            <BookingStepSchedule
              formData={formData}
              onUpdate={updateFormData}
              onBack={() => setCurrentStep(1)}
              onNext={() => setCurrentStep(3)}
            />
          )}
          {currentStep === 3 && (
            <BookingStepContact
              formData={formData}
              onUpdate={updateFormData}
              onBack={() => setCurrentStep(2)}
              onSubmit={async () => {
                const ok = await handleSubmit();
                if (ok) setCurrentStep(4);
              }}
              isSubmitting={isSubmitting}
              submitError={submitError}
            />
          )}
          {currentStep === 4 && (
            <BookingStepConfirm
              formData={formData}
              onUpdate={updateFormData}
              bookingId={bookingId}
              onDismiss={() => onOpenChange(false)}
              onClose={() => {
                // Send business notification with all data including step 4 optional fields
                const timeLabels: Record<string, string> = {
                  morning: "Morning", afternoon: "Afternoon", "all-day": "All Day", flexible: "Flexible",
                };
                fetch("/api/bookings/notify", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    customerName: `${formData.firstName} ${formData.lastName}`.trim(),
                    phone: formData.phone,
                    email: formData.email || undefined,
                    serviceCategory: [formData.serviceCategory, formData.serviceDetail]
                      .filter(Boolean)
                      .map((s) => (s || "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()))
                      .join(" > "),
                    preferredDate: formData.selectedDate,
                    preferredWindow: timeLabels[formData.timeOfDay || ""] || formData.timeOfDay,
                    address: formData.addressFormatted,
                    notes: formData.additionalNotes || undefined,
                    propertyType: formData.propertyType,
                    ownershipStatus: formData.ownershipStatus,
                    gateCode: formData.gateCode || undefined,
                    petsOnPremise: formData.petsOnPremise,
                    contactPreference: formData.contactPreference.join(", "),
                  }),
                }).catch(() => {});
              }}
            />
          )}
        </div>
      </div>
      <button
        aria-label="Close booking modal"
        className="absolute inset-0 -z-10"
        onClick={() => onOpenChange(false)}
        type="button"
      />
    </div>
  );
}
