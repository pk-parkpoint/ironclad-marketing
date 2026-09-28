"use client";

import { useEffect, useRef, useState } from "react";
import type { WizardFormData } from "./booking-wizard";
import styles from "./booking-wizard.module.css";

import { loadGoogleMaps, type GoogleAutocompleteInstance, type GoogleSessionToken, type WindowWithGoogle } from "./google-maps-loader";
import { parsePlace, manualStreetAddress, updateAddressLocality } from "@/lib/booking-address";

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

type FormErrors = Partial<Record<"firstName" | "lastName" | "phone" | "email" | "addressFormatted" | "city" | "state" | "zip", string>>;

type Props = {
  formData: WizardFormData;
  onUpdate: (updates: Partial<WizardFormData>) => void;
  onBack: () => void;
  onNext: () => void;
};

const inputClass =
  styles.fieldControl;

function fieldGroupClass(hasError?: string) {
  return `${styles.fieldGroup} ${hasError ? styles.fieldError : ""}`;
}

export function BookingStepContact({ formData, onUpdate, onBack, onNext }: Props) {
  const [errors, setErrors] = useState<FormErrors>({});
  const addressRef = useRef<HTMLInputElement | null>(null);
  const autocompleteRef = useRef<GoogleAutocompleteInstance | null>(null);
  const sessionTokenRef = useRef<GoogleSessionToken | null>(null);
  const onUpdateRef = useRef(onUpdate);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  useEffect(() => { onUpdateRef.current = onUpdate; });

  // Load Google Maps script (matches pulse table pattern)
  useEffect(() => {
    loadGoogleMaps()
      .then(() => setMapsLoaded(true))
      .catch(() => console.warn("[BookingWizard] Google Maps unavailable — manual entry only"));
  }, []);

  // Initialize autocomplete once script is loaded
  useEffect(() => {
    if (!mapsLoaded || !addressRef.current || autocompleteRef.current) return;
    const places = (window as WindowWithGoogle).google?.maps?.places;
    if (!places) return;

    sessionTokenRef.current = new places.AutocompleteSessionToken();
    const instance = new places.Autocomplete(addressRef.current, {
      componentRestrictions: { country: "us" },
      fields: ["address_components", "formatted_address", "geometry"],
      types: ["address"],
      sessionToken: sessionTokenRef.current,
    });
    autocompleteRef.current = instance;

    instance.addListener("place_changed", () => {
      const place = instance.getPlace();
      if (place?.address_components) {
        onUpdateRef.current(parsePlace(place));
        setErrors((prev) => ({ ...prev, addressFormatted: undefined, city: undefined, state: undefined, zip: undefined }));
      }
      // Rotate session token after each selection (billing efficiency)
      sessionTokenRef.current = new places.AutocompleteSessionToken();
    });
  }, [mapsLoaded]);

  function clearError(name: keyof FormErrors) {
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function validate(): boolean {
    const errs: FormErrors = {};
    if (!formData.firstName.trim()) errs.firstName = "First name is required.";
    if (!formData.lastName.trim()) errs.lastName = "Last name is required.";
    const digits = formData.phone.replace(/\D/g, "");
    if (!digits || digits.length < 10) errs.phone = "Valid phone number is required.";
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errs.email = "Please enter a valid email address.";
    if (!formData.street.trim()) errs.addressFormatted = "Service address is required.";
    if (!formData.city.trim()) errs.city = "City is required.";
    if (!/^[A-Za-z]{2}$/.test(formData.state.trim())) errs.state = "Enter a two-letter state.";
    if (!/^\d{5}(-\d{4})?$/.test(formData.zip.trim())) errs.zip = "Enter a valid ZIP code.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleNext() {
    const valid = validate();
    if (!valid) return;
    onNext();
  }

  return (
    <div data-testid="booking-step-2">
      <h1 className={styles.heading}>Enter your information</h1>
      <p className={styles.subcopy}>To confirm your visit</p>

      <div className={styles.fieldGrid}>
        <div className={fieldGroupClass(errors.firstName)}>
          <label className={styles.fieldLabel} htmlFor="booking-first-name">
            First name
          </label>
          <input
            id="booking-first-name"
            className={inputClass}
            type="text"
            value={formData.firstName}
            onChange={(e) => { onUpdate({ firstName: e.target.value }); clearError("firstName"); }}
          />
          {errors.firstName && <span className={styles.errorMessage}>{errors.firstName}</span>}
        </div>

        <div className={fieldGroupClass(errors.lastName)}>
          <label className={styles.fieldLabel} htmlFor="booking-last-name">
            Last name
          </label>
          <input
            id="booking-last-name"
            className={inputClass}
            type="text"
            value={formData.lastName}
            onChange={(e) => { onUpdate({ lastName: e.target.value }); clearError("lastName"); }}
          />
          {errors.lastName && <span className={styles.errorMessage}>{errors.lastName}</span>}
        </div>

        <div className={fieldGroupClass(errors.phone)}>
          <label className={styles.fieldLabel} htmlFor="booking-phone">
            Phone number
          </label>
          <input
            id="booking-phone"
            className={inputClass}
            type="tel"
            inputMode="tel"
            value={formData.phone}
            onChange={(e) => { onUpdate({ phone: formatPhone(e.target.value) }); clearError("phone"); }}
            placeholder="(512) 506-2470"
          />
          {errors.phone && <span className={styles.errorMessage}>{errors.phone}</span>}
        </div>

        <div className={fieldGroupClass(errors.email)}>
          <label className={styles.fieldLabel} htmlFor="booking-email">
            Email (optional)
          </label>
          <input
            id="booking-email"
            className={inputClass}
            type="email"
            value={formData.email}
            onChange={(e) => { onUpdate({ email: e.target.value }); clearError("email"); }}
            placeholder="name@example.com"
          />
          {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
        </div>

        <div className={`${fieldGroupClass(errors.addressFormatted)} ${styles.fieldSpan}`}>
          <label className={styles.fieldLabel} htmlFor="booking-address">
            Service address
          </label>
          <input
            id="booking-address"
            ref={addressRef}
            autoComplete="off"
            className={inputClass}
            type="text"
            value={formData.street}
            onChange={(e) => { onUpdate(manualStreetAddress(e.target.value)); clearError("addressFormatted"); }}
            placeholder="Start typing your address"
          />
          {errors.addressFormatted && (
            <span className={styles.errorMessage}>{errors.addressFormatted}</span>
          )}
        </div>
        {([["city", "City"], ["state", "State"], ["zip", "ZIP code"]] as const).map(([key, label]) => (
          <div key={key} className={fieldGroupClass(errors[key])}>
            <label className={styles.fieldLabel} htmlFor={`booking-${key}`}>{label}</label>
            <input id={`booking-${key}`} className={inputClass} type="text"
              autoComplete={key === "city" ? "address-level2" : key === "state" ? "address-level1" : "postal-code"}
              value={formData[key]}
              onChange={(event) => { onUpdate(updateAddressLocality(formData, key, event.target.value)); clearError(key); }} />
            {errors[key] && <span className={styles.errorMessage}>{errors[key]}</span>}
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className={styles.buttonRow}>
        <button
          type="button"
          className={styles.secondaryButton}
          onClick={onBack}
        >
          Back
        </button>
        <button
          type="button"
          className={styles.primaryButton}
          onClick={handleNext}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
