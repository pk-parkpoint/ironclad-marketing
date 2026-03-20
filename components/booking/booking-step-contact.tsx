"use client";

import { useEffect, useRef, useState } from "react";
import type { WizardFormData } from "./booking-wizard";

type GoogleAddressComponent = {
  long_name: string;
  short_name: string;
  types: string[];
};

type GooglePlaceResult = {
  address_components?: GoogleAddressComponent[];
  formatted_address?: string;
  geometry?: { location?: { lat: () => number; lng: () => number } };
};

type GoogleSessionToken = Record<string, unknown>;

type GoogleAutocompleteInstance = {
  addListener: (event: string, cb: () => void) => void;
  getPlace: () => GooglePlaceResult;
};

type GoogleMapsPlaces = {
  Autocomplete: new (
    input: HTMLInputElement,
    opts: {
      componentRestrictions?: { country: string };
      fields?: string[];
      types?: string[];
      sessionToken?: GoogleSessionToken;
    },
  ) => GoogleAutocompleteInstance;
  AutocompleteSessionToken: new () => GoogleSessionToken;
};

type WindowWithGoogle = Window & {
  google?: { maps?: { places?: GoogleMapsPlaces } };
};

let googleMapsPromise: Promise<void> | null = null;

function loadGoogleMaps(): Promise<void> {
  if (googleMapsPromise) return googleMapsPromise;
  if (typeof window !== "undefined" && (window as WindowWithGoogle).google?.maps?.places) {
    return Promise.resolve();
  }
  googleMapsPromise = new Promise((resolve, reject) => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
    if (!apiKey || apiKey === "replace-me") { reject(new Error("No API key")); return; }
    const cb = `gmapsCallback_${Date.now()}`;
    (window as unknown as Record<string, unknown>)[cb] = () => { delete (window as unknown as Record<string, unknown>)[cb]; resolve(); };
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=${cb}`;
    script.async = true;
    script.defer = true;
    script.onerror = () => { delete (window as unknown as Record<string, unknown>)[cb]; googleMapsPromise = null; reject(new Error("Script load failed")); };
    document.head.appendChild(script);
  });
  return googleMapsPromise;
}

function parsePlace(place: GooglePlaceResult) {
  const comps = place.address_components || [];
  let streetNumber = "", route = "", city = "", state = "", zip = "";
  for (const c of comps) {
    if (c.types.includes("street_number")) streetNumber = c.long_name;
    else if (c.types.includes("route")) route = c.long_name;
    else if (c.types.includes("locality")) city = c.long_name;
    else if (c.types.includes("sublocality_level_1") && !city) city = c.long_name;
    else if (c.types.includes("administrative_area_level_1")) state = c.short_name;
    else if (c.types.includes("postal_code")) zip = c.long_name;
  }
  return {
    addressFormatted: place.formatted_address || "",
    street: [streetNumber, route].filter(Boolean).join(" "),
    city, state, zip,
    latitude: place.geometry?.location?.lat(),
    longitude: place.geometry?.location?.lng(),
  };
}

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

type FormErrors = Partial<Record<"firstName" | "lastName" | "phone" | "email" | "addressFormatted", string>>;

type Props = {
  formData: WizardFormData;
  onUpdate: (updates: Partial<WizardFormData>) => void;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  submitError?: string;
};

const inputClass =
  "mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500";

export function BookingStepContact({ formData, onUpdate, onBack, onSubmit, isSubmitting, submitError }: Props) {
  const [errors, setErrors] = useState<FormErrors>({});
  const [consented, setConsented] = useState(false);
  const [consentError, setConsentError] = useState(false);
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
        setErrors((prev) => ({ ...prev, addressFormatted: undefined }));
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
    if (!formData.addressFormatted.trim()) errs.addressFormatted = "Service address is required.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit() {
    const valid = validate();
    if (!consented) {
      setConsentError(true);
      return;
    }
    if (!valid) return;
    onSubmit();
  }

  return (
    <div className="flex-1 overflow-y-auto px-8 py-6">
      <h3 className="text-2xl font-semibold text-gray-900">Enter your information</h3>
      <p className="mt-1 text-sm text-gray-500">So we can reach you about your appointment.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label className={`text-sm font-medium ${errors.firstName ? "text-red-600" : "text-gray-600"}`}>
            First name
          </label>
          <input
            className={inputClass}
            type="text"
            value={formData.firstName}
            onChange={(e) => { onUpdate({ firstName: e.target.value }); clearError("firstName"); }}
          />
          {errors.firstName && <span className="mt-1 block text-xs text-red-600">{errors.firstName}</span>}
        </div>

        <div>
          <label className={`text-sm font-medium ${errors.lastName ? "text-red-600" : "text-gray-600"}`}>
            Last name
          </label>
          <input
            className={inputClass}
            type="text"
            value={formData.lastName}
            onChange={(e) => { onUpdate({ lastName: e.target.value }); clearError("lastName"); }}
          />
          {errors.lastName && <span className="mt-1 block text-xs text-red-600">{errors.lastName}</span>}
        </div>

        <div>
          <label className={`text-sm font-medium ${errors.phone ? "text-red-600" : "text-gray-600"}`}>
            Phone number
          </label>
          <input
            className={inputClass}
            type="tel"
            inputMode="tel"
            value={formData.phone}
            onChange={(e) => { onUpdate({ phone: formatPhone(e.target.value) }); clearError("phone"); }}
            placeholder="(512) 555-0199"
          />
          {errors.phone && <span className="mt-1 block text-xs text-red-600">{errors.phone}</span>}
        </div>

        <div>
          <label className={`text-sm font-medium ${errors.email ? "text-red-600" : "text-gray-600"}`}>
            Email (optional)
          </label>
          <input
            className={inputClass}
            type="email"
            value={formData.email}
            onChange={(e) => { onUpdate({ email: e.target.value }); clearError("email"); }}
            placeholder="name@example.com"
          />
          {errors.email && <span className="mt-1 block text-xs text-red-600">{errors.email}</span>}
        </div>

        <div className="sm:col-span-2">
          <label className={`text-sm font-medium ${errors.addressFormatted ? "text-red-600" : "text-gray-600"}`}>
            Service address
          </label>
          <input
            ref={addressRef}
            autoComplete="off"
            className={inputClass}
            type="text"
            value={formData.addressFormatted}
            onChange={(e) => { onUpdate({ addressFormatted: e.target.value }); clearError("addressFormatted"); }}
            placeholder="Start typing your address"
          />
          {errors.addressFormatted && (
            <span className="mt-1 block text-xs text-red-600">{errors.addressFormatted}</span>
          )}
        </div>
      </div>

      {/* Consent */}
      <label className="mt-6 flex items-start gap-3 text-xs text-gray-500 leading-relaxed">
        <input
          type="checkbox"
          checked={consented}
          onChange={(e) => { setConsented(e.target.checked); if (e.target.checked) setConsentError(false); }}
          className="mt-0.5 h-4 w-4 rounded border-gray-300"
        />
        <span>
          By continuing, I consent to receive communications regarding my service request via phone, text, or
          email and agree to the terms of service and privacy policy.
        </span>
      </label>
      {consentError && <p className="mt-1 text-xs text-red-600">Please accept to continue.</p>}

      {submitError && <p className="mt-4 text-sm text-red-600">{submitError}</p>}

      {/* Navigation */}
      <div className="mt-6 flex items-center gap-3">
        <button
          type="button"
          className="focus-ring rounded-full border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          onClick={onBack}
        >
          Back
        </button>
        <button
          type="button"
          className="focus-ring rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          disabled={isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
}
