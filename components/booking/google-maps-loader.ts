import type { GooglePlaceResult } from "@/lib/booking-address";

export type GoogleSessionToken = Record<string, unknown>;

export type GoogleAutocompleteInstance = {
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

export type WindowWithGoogle = Window & {
  google?: { maps?: { places?: GoogleMapsPlaces } };
};

let googleMapsPromise: Promise<void> | null = null;

export function loadGoogleMaps(): Promise<void> {
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

