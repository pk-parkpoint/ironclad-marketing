"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { SERVICES } from "@/content/services";
import { getPublicContactInfo } from "@/lib/contact";

type BookingModalProps = {
  open: boolean;
  initialServiceSlug?: string;
  onOpenChange: (open: boolean) => void;
};

type BookingServiceOption = {
  slug: string;
  title: string;
};

type ContactPreference = "call" | "text" | "either";

type TimeWindowOption = {
  id: string;
  label: string;
  isEarliest?: boolean;
};

type BookingContactForm = {
  customerName: string;
  phone: string;
  email: string;
  addressFormatted: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  latitude?: number;
  longitude?: number;
  unitOrGateCode: string;
  contactPreference: ContactPreference;
};

type BookingFormErrors = Partial<Record<"customerName" | "phone" | "addressFormatted", string>>;

type GoogleAddressComponent = {
  long_name?: string;
  short_name?: string;
  types?: string[];
};

type GooglePlaceResult = {
  address_components?: GoogleAddressComponent[];
  formatted_address?: string;
  geometry?: {
    location?: {
      lat?: () => number;
      lng?: () => number;
    };
  };
};

type GoogleAutocompleteInstance = {
  addListener: (eventName: "place_changed", callback: () => void) => void;
  getPlace: () => GooglePlaceResult;
};

type GoogleAutocompleteConstructor = new (
  input: HTMLInputElement,
  options: { fields: string[] },
) => GoogleAutocompleteInstance;

type WindowWithGoogle = Window & {
  google?: {
    maps?: {
      places?: {
        Autocomplete?: GoogleAutocompleteConstructor;
      };
    };
  };
};

const SERVICE_OPTIONS: BookingServiceOption[] = [
  ...SERVICES.map((service) => ({ slug: service.slug, title: service.title })),
  { slug: "other", title: "Other" },
];

const TIME_WINDOW_OPTIONS: TimeWindowOption[] = [
  { id: "8-10", label: "8:00 AM - 10:00 AM", isEarliest: true },
  { id: "10-12", label: "10:00 AM - 12:00 PM" },
  { id: "12-2", label: "12:00 PM - 2:00 PM" },
  { id: "2-4", label: "2:00 PM - 4:00 PM" },
  { id: "4-6", label: "4:00 PM - 6:00 PM" },
];

function resolveInitialServiceSlug(value?: string): string | undefined {
  if (!value) return undefined;
  return SERVICE_OPTIONS.some((option) => option.slug === value) ? value : undefined;
}

function buildDayOptions(): Array<{ id: string; label: string }> {
  return Array.from({ length: 5 }).map((_, offset) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + offset);
    const id = date.toISOString().slice(0, 10);

    if (offset === 0) return { id, label: "Today" };
    if (offset === 1) return { id, label: "Tomorrow" };

    const label = new Intl.DateTimeFormat("en-US", {
      day: "numeric",
      month: "short",
      weekday: "short",
    }).format(date);

    return { id, label };
  });
}

function getAddressComponent(
  components: GoogleAddressComponent[] | undefined,
  type: string,
  shortName = false,
): string {
  const match = components?.find((component) => (component.types || []).includes(type));
  if (!match) return "";
  return shortName ? match.short_name || "" : match.long_name || "";
}

function parseGooglePlaceAddress(place?: GooglePlaceResult): Partial<BookingContactForm> {
  const components = place?.address_components;
  const streetNumber = getAddressComponent(components, "street_number");
  const route = getAddressComponent(components, "route");

  return {
    addressFormatted: place?.formatted_address || "",
    city: getAddressComponent(components, "locality") || getAddressComponent(components, "sublocality"),
    latitude: place?.geometry?.location?.lat?.(),
    longitude: place?.geometry?.location?.lng?.(),
    state: getAddressComponent(components, "administrative_area_level_1", true),
    street: [streetNumber, route].filter(Boolean).join(" ").trim(),
    zip: getAddressComponent(components, "postal_code"),
  };
}

const INITIAL_CONTACT_FORM: BookingContactForm = {
  customerName: "",
  phone: "",
  email: "",
  addressFormatted: "",
  street: "",
  city: "",
  state: "",
  zip: "",
  unitOrGateCode: "",
  contactPreference: "either",
};

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selectors =
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

  return Array.from(container.querySelectorAll<HTMLElement>(selectors)).filter((element) => {
    const style = window.getComputedStyle(element);
    return style.display !== "none" && style.visibility !== "hidden";
  });
}

export function BookingModal({ open, initialServiceSlug, onOpenChange }: BookingModalProps) {
  const { phoneDisplay, phoneHref, smsHref } = getPublicContactInfo();
  const dayOptions = useMemo(() => buildDayOptions(), []);
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [selectedServiceSlug, setSelectedServiceSlug] = useState<string | undefined>(undefined);
  const [selectedDayId, setSelectedDayId] = useState<string>(dayOptions[0]?.id ?? "");
  const [selectedTimeWindowId, setSelectedTimeWindowId] = useState<string>(TIME_WINDOW_OPTIONS[0]?.id ?? "");
  const [contactForm, setContactForm] = useState<BookingContactForm>(INITIAL_CONTACT_FORM);
  const [notes, setNotes] = useState("");
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoError, setPhotoError] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | undefined>(undefined);
  const [bookingId, setBookingId] = useState<string | undefined>(undefined);
  const [formErrors, setFormErrors] = useState<BookingFormErrors>({});
  const modalRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const previousFocusedRef = useRef<HTMLElement | null>(null);
  const addressInputRef = useRef<HTMLInputElement | null>(null);
  const autocompleteInstanceRef = useRef<GoogleAutocompleteInstance | null>(null);

  useEffect(() => {
    if (!open) return;
    setStep(1);
    setSelectedServiceSlug(resolveInitialServiceSlug(initialServiceSlug));
    setSelectedDayId(dayOptions[0]?.id ?? "");
    setSelectedTimeWindowId(TIME_WINDOW_OPTIONS[0]?.id ?? "");
    setContactForm(INITIAL_CONTACT_FORM);
    setNotes("");
    setPhotoFiles([]);
    setPhotoError(undefined);
    setIsSubmitting(false);
    setSubmitError(undefined);
    setBookingId(undefined);
    setFormErrors({});
  }, [dayOptions, initialServiceSlug, open]);

  useEffect(() => {
    if (!open) return;

    previousFocusedRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusRafId = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        const previousFocusedElement = previousFocusedRef.current;
        onOpenChange(false);
        if (previousFocusedElement && previousFocusedElement.isConnected) {
          window.setTimeout(() => {
            if (previousFocusedElement.isConnected) {
              previousFocusedElement.focus();
            }
          }, 0);
        }
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const modalElement = modalRef.current;
      if (!modalElement) {
        return;
      }

      const focusableElements = getFocusableElements(modalElement);
      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      if (!modalElement.contains(activeElement)) {
        event.preventDefault();
        firstElement.focus();
        return;
      }

      if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.cancelAnimationFrame(focusRafId);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      const previousFocusedElement = previousFocusedRef.current;
      if (previousFocusedElement && previousFocusedElement.isConnected) {
        window.requestAnimationFrame(() => {
          if (previousFocusedElement.isConnected) {
            previousFocusedElement.focus();
          }
        });
      }
    };
  }, [onOpenChange, open]);

  const selectedService = useMemo(
    () => SERVICE_OPTIONS.find((option) => option.slug === selectedServiceSlug),
    [selectedServiceSlug],
  );

  useEffect(() => {
    if (!open || step !== 3) return;
    if (autocompleteInstanceRef.current || !addressInputRef.current) return;

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
    if (!apiKey || apiKey === "replace-me") return;

    function initAutocomplete() {
      if (!addressInputRef.current) return;
      const globalWindow = window as WindowWithGoogle;
      const Autocomplete = globalWindow.google?.maps?.places?.Autocomplete;
      if (!Autocomplete) return;

      const autocomplete = new Autocomplete(addressInputRef.current, {
        fields: ["address_components", "formatted_address", "geometry"],
      });
      autocompleteInstanceRef.current = autocomplete;

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        const parsedAddress = parseGooglePlaceAddress(place);
        setContactForm((current) => ({ ...current, ...parsedAddress }));
        setFormErrors((current) => ({ ...current, addressFormatted: undefined }));
      });
    }

    const existingScript = document.querySelector('script[data-google-places="true"]') as HTMLScriptElement | null;
    if (existingScript) {
      if ((window as WindowWithGoogle).google?.maps?.places) {
        initAutocomplete();
      } else {
        existingScript.addEventListener("load", initAutocomplete, { once: true });
      }
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.dataset.googlePlaces = "true";
    script.addEventListener("load", initAutocomplete, { once: true });
    document.head.appendChild(script);
  }, [open, step]);

  useEffect(() => {
    if (!open || step !== 5) return;
    const timer = window.setTimeout(() => onOpenChange(false), 7000);
    return () => window.clearTimeout(timer);
  }, [onOpenChange, open, step]);

  function updateContactForm<K extends keyof BookingContactForm>(field: K, value: BookingContactForm[K]) {
    setContactForm((current) => ({ ...current, [field]: value }));
    setFormErrors((current) => ({ ...current, [field]: undefined }));
  }

  function validateStepThree(): boolean {
    const errors: BookingFormErrors = {};

    if (!contactForm.customerName.trim()) {
      errors.customerName = "Name is required.";
    }

    const digits = contactForm.phone.replace(/[^\d]/g, "");
    if (!digits || digits.length < 10) {
      errors.phone = "Phone is required.";
    }

    if (!contactForm.addressFormatted.trim()) {
      errors.addressFormatted = "Address is required.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handlePhotoSelection(event: React.ChangeEvent<HTMLInputElement>) {
    const nextFiles = Array.from(event.target.files || []);
    if (nextFiles.length > 5) {
      setPhotoError("Maximum 5 photos allowed.");
      setPhotoFiles(nextFiles.slice(0, 5));
      return;
    }
    setPhotoError(undefined);
    setPhotoFiles(nextFiles);
  }

  async function handleConfirmBooking() {
    setSubmitError(undefined);
    setIsSubmitting(true);

    const selectedWindowLabel =
      TIME_WINDOW_OPTIONS.find((option) => option.id === selectedTimeWindowId)?.label || selectedTimeWindowId;

    const submissionPayload = {
      serviceCategory: selectedServiceSlug || "other",
      preferredDate: selectedDayId,
      preferredWindow: selectedWindowLabel,
      customerName: contactForm.customerName,
      phone: contactForm.phone,
      email: contactForm.email || undefined,
      address: {
        formatted: contactForm.addressFormatted,
        street: contactForm.street,
        city: contactForm.city,
        state: contactForm.state,
        zip: contactForm.zip,
        latitude: contactForm.latitude,
        longitude: contactForm.longitude,
      },
      unitOrGateCode: contactForm.unitOrGateCode || undefined,
      contactPreference: contactForm.contactPreference,
      notes: notes.trim() || undefined,
      photos: photoFiles.map((file) => file.name),
    };

    try {
      const response = await fetch("/api/bookings", {
        body: JSON.stringify(submissionPayload),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Unable to submit booking.");
      }

      const data = (await response.json()) as { bookingId?: string };
      setBookingId(data.bookingId);
      setStep(5);
    } catch {
      setSubmitError("Booking submission failed. Please try again or call/text us.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!open) return null;
  const stepAnnouncement = step === 5 ? "Booking submitted." : `Step ${step} of 4.`;

  return (
    <div className="fixed inset-0 z-[1000] flex items-end justify-center bg-black/45 p-0 sm:items-center sm:p-4">
      <div
        aria-describedby="booking-modal-description"
        aria-labelledby="booking-modal-title"
        aria-modal="true"
        className="booking-modal-sheet flex h-[100dvh] w-full max-w-[560px] flex-col bg-background shadow-2xl sm:h-auto sm:max-h-[90vh] sm:rounded-[var(--radius-modal)]"
        ref={modalRef}
        role="dialog"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Book Service</p>
            <h2 className="text-lg font-semibold text-ink" id="booking-modal-title">
              Request an Appointment
            </h2>
          </div>
          <button
            aria-label="Close booking modal"
            className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border text-ink"
            onClick={() => onOpenChange(false)}
            ref={closeButtonRef}
            type="button"
          >
            ×
          </button>
        </div>
        <p className="sr-only" id="booking-modal-description">
          Booking request dialog. Press Escape to close. Tab cycles through interactive controls.
        </p>
        <p aria-live="polite" className="sr-only">
          {stepAnnouncement}
        </p>

        {step === 1 ? (
          <div className="flex-1 overflow-y-auto px-5 py-5">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">Step 1 of 4</p>
            <h3 className="mt-2 text-xl font-semibold text-ink">What do you need help with?</h3>
            <p className="mt-2 text-sm text-muted">Pick the service category that best matches your request.</p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              {SERVICE_OPTIONS.map((option) => {
                const selected = option.slug === selectedServiceSlug;
                return (
                  <button
                    className={`focus-ring min-h-14 rounded-xl border px-3 py-3 text-left text-sm font-medium transition-all ${
                      selected
                        ? "border-cta-blue bg-blue-50 text-cta-blue shadow-[var(--shadow-card)]"
                        : "border-border bg-background text-ink hover:-translate-y-0.5 hover:border-cta-blue hover:bg-soft-background"
                    }`}
                    key={option.slug}
                    onClick={() => {
                      setSelectedServiceSlug(option.slug);
                      setStep(2);
                    }}
                    type="button"
                  >
                    {option.title}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 rounded-xl border border-border bg-soft-background p-4">
              <p className="text-sm font-semibold text-ink">Need immediate help?</p>
              <p className="mt-1 text-sm text-muted">Call or text and our team will help you choose the right service.</p>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <a className="focus-ring secondary-button justify-center px-4 py-3 text-sm" href={phoneHref}>
                  Call {phoneDisplay}
                </a>
                <a className="focus-ring secondary-button justify-center px-4 py-3 text-sm" href={smsHref}>
                  Text Us
                </a>
              </div>
            </div>
          </div>
        ) : step === 2 ? (
          <div className="flex-1 overflow-y-auto px-5 py-5">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">Step 2 of 4</p>
            <h3 className="mt-2 text-xl font-semibold text-ink">Choose a day and time window</h3>
            <p className="mt-2 text-sm text-muted">
              Selected service: <span className="font-semibold text-ink">{selectedService?.title || "Not selected"}</span>
            </p>

            <div className="mt-5">
              <p className="text-sm font-semibold text-ink">Select day</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {dayOptions.map((day) => {
                  const selected = day.id === selectedDayId;
                  return (
                    <button
                      className={`focus-ring min-h-11 rounded-full border px-4 text-sm font-semibold transition-colors ${
                        selected ? "border-cta-blue bg-blue-50 text-cta-blue" : "border-border text-ink hover:bg-soft-background"
                      }`}
                      key={day.id}
                      onClick={() => setSelectedDayId(day.id)}
                      type="button"
                    >
                      {day.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-5">
              <p className="text-sm font-semibold text-ink">Select time window</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {TIME_WINDOW_OPTIONS.map((windowOption) => {
                  const selected = windowOption.id === selectedTimeWindowId;
                  return (
                    <button
                      className={`focus-ring rounded-xl border p-4 text-left transition-all ${
                        selected
                          ? "border-cta-blue bg-blue-50 text-cta-blue shadow-[var(--shadow-card)]"
                          : "border-border bg-background text-ink hover:border-cta-blue hover:bg-soft-background"
                      }`}
                      key={windowOption.id}
                      onClick={() => setSelectedTimeWindowId(windowOption.id)}
                      type="button"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold">{windowOption.label}</span>
                        {windowOption.isEarliest ? (
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                            Earliest
                          </span>
                        ) : null}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-border bg-soft-background p-4">
              <p className="text-sm font-semibold text-ink">Need it sooner?</p>
              <p className="mt-1 text-sm text-muted">Call or text for emergency and same-day availability.</p>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <a className="focus-ring secondary-button justify-center px-4 py-3 text-sm" href={phoneHref}>
                  Call {phoneDisplay}
                </a>
                <a className="focus-ring secondary-button justify-center px-4 py-3 text-sm" href={smsHref}>
                  Text Us
                </a>
              </div>
            </div>

            <div className="mt-5 hidden gap-3 sm:flex">
              <button className="focus-ring secondary-button justify-center px-4 py-3 text-sm" onClick={() => setStep(1)} type="button">
                Back
              </button>
              <button
                className="focus-ring primary-button justify-center px-4 py-3 text-sm"
                onClick={() => setStep(3)}
                type="button"
              >
                Continue
              </button>
            </div>
          </div>
        ) : step === 3 ? (
          <div className="flex-1 overflow-y-auto px-5 py-5">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">Step 3 of 4</p>
            <h3 className="mt-2 text-xl font-semibold text-ink">Contact information</h3>
            <p className="mt-2 text-sm text-muted">
              Service: <span className="font-semibold text-ink">{selectedService?.title || "Not selected"}</span>
            </p>
            <p className="mt-2 text-sm text-muted">
              Time:{" "}
              <span className="font-semibold text-ink">
                {dayOptions.find((day) => day.id === selectedDayId)?.label || selectedDayId}{" "}
                •{" "}
                {TIME_WINDOW_OPTIONS.find((windowOption) => windowOption.id === selectedTimeWindowId)?.label ||
                  selectedTimeWindowId}
              </span>
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <label className="text-sm font-medium text-ink sm:col-span-2">
                Name *
                <input
                  className="focus-ring mt-1 min-h-11 w-full rounded-xl border border-border px-3 py-2 text-sm"
                  onChange={(event) => updateContactForm("customerName", event.target.value)}
                  placeholder="Your full name"
                  type="text"
                  value={contactForm.customerName}
                />
                {formErrors.customerName ? <span className="mt-1 block text-xs text-error">{formErrors.customerName}</span> : null}
              </label>

              <label className="text-sm font-medium text-ink">
                Phone *
                <input
                  className="focus-ring mt-1 min-h-11 w-full rounded-xl border border-border px-3 py-2 text-sm"
                  inputMode="tel"
                  onChange={(event) => updateContactForm("phone", event.target.value)}
                  placeholder="(833) 597-1932"
                  type="tel"
                  value={contactForm.phone}
                />
                {formErrors.phone ? <span className="mt-1 block text-xs text-error">{formErrors.phone}</span> : null}
              </label>

              <label className="text-sm font-medium text-ink">
                Email
                <input
                  className="focus-ring mt-1 min-h-11 w-full rounded-xl border border-border px-3 py-2 text-sm"
                  onChange={(event) => updateContactForm("email", event.target.value)}
                  placeholder="name@example.com"
                  type="email"
                  value={contactForm.email}
                />
              </label>

              <label className="text-sm font-medium text-ink sm:col-span-2">
                Address *
                <input
                  autoComplete="street-address"
                  className="focus-ring mt-1 min-h-11 w-full rounded-xl border border-border px-3 py-2 text-sm"
                  onChange={(event) => updateContactForm("addressFormatted", event.target.value)}
                  placeholder="Start typing your address"
                  ref={addressInputRef}
                  type="text"
                  value={contactForm.addressFormatted}
                />
                {formErrors.addressFormatted ? (
                  <span className="mt-1 block text-xs text-error">{formErrors.addressFormatted}</span>
                ) : null}
              </label>

              <label className="text-sm font-medium text-ink sm:col-span-2">
                Unit or gate code
                <input
                  className="focus-ring mt-1 min-h-11 w-full rounded-xl border border-border px-3 py-2 text-sm"
                  onChange={(event) => updateContactForm("unitOrGateCode", event.target.value)}
                  placeholder="Apt, suite, gate, etc."
                  type="text"
                  value={contactForm.unitOrGateCode}
                />
              </label>
            </div>

            <div className="mt-5">
              <p className="text-sm font-semibold text-ink">Preferred contact method</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(["call", "text", "either"] as ContactPreference[]).map((option) => {
                  const selected = option === contactForm.contactPreference;
                  return (
                    <button
                      className={`focus-ring min-h-11 rounded-full border px-4 text-sm font-semibold capitalize ${
                        selected
                          ? "border-cta-blue bg-blue-50 text-cta-blue"
                          : "border-border text-ink hover:bg-soft-background"
                      }`}
                      key={option}
                      onClick={() => updateContactForm("contactPreference", option)}
                      type="button"
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-5 hidden gap-3 sm:flex">
              <button className="focus-ring secondary-button justify-center px-4 py-3 text-sm" onClick={() => setStep(2)} type="button">
                Back
              </button>
              <button
                className="focus-ring primary-button justify-center px-4 py-3 text-sm"
                onClick={() => {
                  if (!validateStepThree()) return;
                  setStep(4);
                }}
                type="button"
              >
                Continue
              </button>
            </div>
          </div>
        ) : step === 4 ? (
          <div className="flex-1 overflow-y-auto px-5 py-5">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">Step 4 of 4</p>
            <h3 className="mt-2 text-xl font-semibold text-ink">Review and confirm</h3>
            <p className="mt-2 text-sm text-muted">Confirm your details, add optional notes, and upload photos if helpful.</p>
            <div className="mt-4 rounded-xl border border-border bg-soft-background p-4 text-sm text-muted">
              <p>
                <span className="font-semibold text-ink">Service:</span> {selectedService?.title || "Not selected"}
              </p>
              <p className="mt-1">
                <span className="font-semibold text-ink">Date:</span>{" "}
                {dayOptions.find((day) => day.id === selectedDayId)?.label || selectedDayId}
              </p>
              <p className="mt-1">
                <span className="font-semibold text-ink">Window:</span>{" "}
                {TIME_WINDOW_OPTIONS.find((option) => option.id === selectedTimeWindowId)?.label || selectedTimeWindowId}
              </p>
              <p className="mt-1">
                <span className="font-semibold text-ink">Name:</span> {contactForm.customerName || "Not set"}
              </p>
              <p className="mt-1">
                <span className="font-semibold text-ink">Phone:</span> {contactForm.phone || "Not set"}
              </p>
              <p className="mt-1">
                <span className="font-semibold text-ink">Address:</span> {contactForm.addressFormatted || "Not set"}
              </p>
            </div>

            <label className="mt-4 block text-sm font-medium text-ink">
              Notes (optional)
              <textarea
                className="focus-ring mt-1 min-h-24 w-full rounded-xl border border-border px-3 py-2 text-sm"
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Anything we should know before arrival?"
                value={notes}
              />
            </label>

            <label className="mt-4 block text-sm font-medium text-ink">
              Photos (optional, max 5)
              <input
                accept="image/*"
                className="focus-ring mt-1 block w-full rounded-xl border border-border px-3 py-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-soft-background file:px-3 file:py-2 file:text-sm file:font-semibold"
                multiple
                onChange={handlePhotoSelection}
                type="file"
              />
            </label>
            {photoError ? <p className="mt-1 text-xs text-error">{photoError}</p> : null}
            {photoFiles.length > 0 ? (
              <ul className="mt-2 m-0 list-none space-y-1 p-0 text-xs text-muted">
                {photoFiles.map((file) => (
                  <li key={file.name}>{file.name}</li>
                ))}
              </ul>
            ) : null}
            {submitError ? <p className="mt-3 text-sm text-error">{submitError}</p> : null}

            <div className="mt-4 hidden gap-3 sm:flex">
              <button className="focus-ring secondary-button justify-center px-4 py-3 text-sm" onClick={() => setStep(3)} type="button">
                Back
              </button>
              <button
                className="focus-ring primary-button justify-center px-4 py-3 text-sm"
                disabled={isSubmitting}
                onClick={() => {
                  if (photoFiles.length > 5) {
                    setPhotoError("Maximum 5 photos allowed.");
                    return;
                  }
                  handleConfirmBooking();
                }}
                type="button"
              >
                {isSubmitting ? "Submitting..." : "Confirm Booking"}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-5 py-5">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">Submitted</p>
            <div className="mt-3 flex items-center gap-3">
              <div className="relative inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <span className="absolute inset-0 rounded-full border border-emerald-300 animate-ping motion-reduce:animate-none" />
                <svg
                  aria-hidden="true"
                  className="relative h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.2"
                  viewBox="0 0 24 24"
                >
                  <path d="m5 13 4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-ink">Booking received</h3>
                <p className="text-sm text-muted">We will confirm your appointment within 15 minutes.</p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-border bg-soft-background p-4 text-sm text-muted">
              {bookingId ? (
                <p>
                  <span className="font-semibold text-ink">Booking ID:</span> {bookingId}
                </p>
              ) : null}
              <p className={bookingId ? "mt-1" : undefined}>
                <span className="font-semibold text-ink">Service:</span> {selectedService?.title || "Not selected"}
              </p>
              <p className="mt-1">
                <span className="font-semibold text-ink">Date:</span>{" "}
                {dayOptions.find((day) => day.id === selectedDayId)?.label || selectedDayId}
              </p>
              <p className="mt-1">
                <span className="font-semibold text-ink">Window:</span>{" "}
                {TIME_WINDOW_OPTIONS.find((option) => option.id === selectedTimeWindowId)?.label || selectedTimeWindowId}
              </p>
            </div>

            <div className="mt-4 rounded-xl border border-border p-4 text-sm text-muted">
              <p className="font-semibold text-ink">Next steps</p>
              <ul className="mt-2 m-0 list-disc space-y-1 pl-5">
                <li>Our team reviews your request details and dispatch availability.</li>
                <li>We confirm by your preferred method: {contactForm.contactPreference}.</li>
                <li>If timing changes, we contact you before the scheduled window closes.</li>
              </ul>
            </div>

            <p className="mt-3 text-xs text-muted">This window auto-closes in a few seconds.</p>

            <div className="mt-4 flex gap-3">
              <button
                className="focus-ring primary-button justify-center px-4 py-3 text-sm"
                onClick={() => onOpenChange(false)}
                type="button"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {step >= 2 && step <= 4 ? (
          <div className="border-t border-border bg-background px-4 py-3 pb-[calc(env(safe-area-inset-bottom)+12px)] sm:hidden">
            {step === 2 ? (
              <div className="grid grid-cols-2 gap-3">
                <button className="focus-ring secondary-button justify-center px-4 py-3 text-sm" onClick={() => setStep(1)} type="button">
                  Back
                </button>
                <button className="focus-ring primary-button justify-center px-4 py-3 text-sm" onClick={() => setStep(3)} type="button">
                  Continue
                </button>
              </div>
            ) : null}

            {step === 3 ? (
              <div className="grid grid-cols-2 gap-3">
                <button className="focus-ring secondary-button justify-center px-4 py-3 text-sm" onClick={() => setStep(2)} type="button">
                  Back
                </button>
                <button
                  className="focus-ring primary-button justify-center px-4 py-3 text-sm"
                  onClick={() => {
                    if (!validateStepThree()) return;
                    setStep(4);
                  }}
                  type="button"
                >
                  Continue
                </button>
              </div>
            ) : null}

            {step === 4 ? (
              <div className="grid grid-cols-2 gap-3">
                <button className="focus-ring secondary-button justify-center px-4 py-3 text-sm" onClick={() => setStep(3)} type="button">
                  Back
                </button>
                <button
                  className="focus-ring primary-button justify-center px-4 py-3 text-sm"
                  disabled={isSubmitting}
                  onClick={() => {
                    if (photoFiles.length > 5) {
                      setPhotoError("Maximum 5 photos allowed.");
                      return;
                    }
                    handleConfirmBooking();
                  }}
                  type="button"
                >
                  {isSubmitting ? "Submitting..." : "Confirm Booking"}
                </button>
              </div>
            ) : null}
          </div>
        ) : null}
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
