const DEFAULT_PHONE_DISPLAY = "(512) 506-2470";
const DEFAULT_PHONE_E164 = "+15125062470";
const DEFAULT_CONTACT_EMAIL = "info@ironcladtexas.com";

export const HEADQUARTERS_ADDRESS = "1510 Newning Ave, Unit B, Austin, TX 78704";
export const HEADQUARTERS_STREET = "1510 Newning Ave, Unit B";
export const HEADQUARTERS_CITY = "Austin";
export const HEADQUARTERS_REGION = "TX";
export const HEADQUARTERS_POSTAL_CODE = "78704";
export const HEADQUARTERS_MAPS_URL =
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(HEADQUARTERS_ADDRESS)}`;
export const HEADQUARTERS_MAPS_EMBED_URL =
  `https://www.google.com/maps?q=${encodeURIComponent(HEADQUARTERS_ADDRESS)}&output=embed`;

function normalizeEmail(value: string | undefined): string | null {
  if (!value) {
    return null;
  }

  const normalized = value.trim().toLowerCase();
  if (!normalized) {
    return null;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    return null;
  }

  return normalized;
}

export type PublicContactInfo = {
  phoneDisplay: string;
  textDisplay: string;
  phoneHref: string;
  smsHref: string;
  contactEmail: string;
};

export function getPublicContactInfo(): PublicContactInfo {
  const contactEmail =
    normalizeEmail(process.env.NEXT_PUBLIC_CONTACT_EMAIL) ?? DEFAULT_CONTACT_EMAIL;
  const phoneDisplay = process.env.NEXT_PUBLIC_PHONE?.trim() || DEFAULT_PHONE_DISPLAY;
  const textDisplay = process.env.NEXT_PUBLIC_TEXT_NUMBER?.trim() || phoneDisplay;
  const phoneDigits = phoneDisplay.replace(/\D/g, "").slice(-10);
  const textDigits = textDisplay.replace(/\D/g, "").slice(-10);

  return {
    phoneDisplay,
    textDisplay,
    phoneHref: `tel:${phoneDigits.length === 10 ? `+1${phoneDigits}` : DEFAULT_PHONE_E164}`,
    smsHref: `sms:${textDigits.length === 10 ? `+1${textDigits}` : DEFAULT_PHONE_E164}`,
    contactEmail,
  };
}

export function getPhoneDisplay(): string {
  return getPublicContactInfo().phoneDisplay;
}

export function getTextDisplay(): string {
  return getPublicContactInfo().textDisplay;
}

export function getPhoneHref(): string {
  return getPublicContactInfo().phoneHref;
}

export function getTextHref(): string {
  return getPublicContactInfo().smsHref;
}

export function getContactEmail(): string {
  return getPublicContactInfo().contactEmail;
}
