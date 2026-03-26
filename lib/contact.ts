const DEFAULT_PHONE_DISPLAY = "(833) 597-1932";
const DEFAULT_PHONE_E164 = "+18335971932";
const DEFAULT_CONTACT_EMAIL = "info@ironcladtexas.com";

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

  return {
    phoneDisplay: DEFAULT_PHONE_DISPLAY,
    textDisplay: DEFAULT_PHONE_DISPLAY,
    phoneHref: `tel:${DEFAULT_PHONE_E164}`,
    smsHref: `sms:${DEFAULT_PHONE_E164}`,
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
