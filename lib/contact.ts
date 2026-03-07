const DEFAULT_PHONE_DISPLAY = "(833) 597-1932";
const DEFAULT_CONTACT_EMAIL = "info@ironcladtexas.com";

function normalizeE164(value: string | undefined): string | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  if (!/^\+\d{8,15}$/.test(trimmed)) {
    return null;
  }

  return trimmed;
}

function toNorthAmericaDialHref(rawValue: string, scheme: "tel" | "sms"): string {
  const digits = rawValue.replace(/[^\d]/g, "");
  const normalized = digits.length === 10 ? digits : digits.slice(-10);
  const resolved = normalized || "5125550199";
  return `${scheme}:+1${resolved}`;
}

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
  const legacyPhoneDisplay = process.env.NEXT_PUBLIC_PHONE_DISPLAY;
  const legacyTextDisplay = process.env.NEXT_PUBLIC_TEXT_DISPLAY;
  const phoneDisplay = (process.env.NEXT_PUBLIC_PHONE || legacyPhoneDisplay || DEFAULT_PHONE_DISPLAY).trim();
  const textDisplay = (process.env.NEXT_PUBLIC_TEXT_NUMBER || legacyTextDisplay || phoneDisplay).trim();
  const legacyPhoneE164 = normalizeE164(process.env.NEXT_PUBLIC_PHONE_E164);
  const legacyTextE164 = normalizeE164(process.env.NEXT_PUBLIC_TEXT_E164);
  const contactEmail =
    normalizeEmail(process.env.NEXT_PUBLIC_CONTACT_EMAIL) ?? DEFAULT_CONTACT_EMAIL;

  return {
    phoneDisplay,
    textDisplay,
    phoneHref: legacyPhoneE164 ? `tel:${legacyPhoneE164}` : toNorthAmericaDialHref(phoneDisplay, "tel"),
    smsHref: legacyTextE164 ? `sms:${legacyTextE164}` : toNorthAmericaDialHref(textDisplay, "sms"),
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
