const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID?.trim() || "AW-18207846861";
const PHONE_CLICK_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_PHONE_CONVERSION_LABEL?.trim();
const BOOKING_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_BOOKING_CONVERSION_LABEL?.trim();
const INVALID_LABEL_PREFIX = "replace-with-";

function destination(label: string | undefined): string | null {
  if (!label || label.startsWith(INVALID_LABEL_PREFIX)) return null;
  return `${GOOGLE_ADS_ID}/${label}`;
}

function sendConversion(params: Record<string, unknown>) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", "conversion", params);
}

export function trackGoogleAdsPhoneClickConversion() {
  const sendTo = destination(PHONE_CLICK_LABEL);
  if (sendTo) sendConversion({ send_to: sendTo });
}

export function trackGoogleAdsBookingConversion(bookingId: string) {
  const sendTo = destination(BOOKING_LABEL);
  if (!sendTo || !bookingId.trim()) return;
  sendConversion({
    currency: "USD",
    send_to: sendTo,
    transaction_id: bookingId,
    value: 1,
  });
}
