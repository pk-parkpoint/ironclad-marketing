/** Server-only producer authentication; never expose the form secret to the browser. */
export function conduitWebhookHeaders(): Record<string, string> {
  const secret = process.env.CONDUIT_FORM_SECRET?.trim();
  if (!secret) console.error("[booking-conduit] form authentication is not configured");
  return {
    "Content-Type": "application/json",
    ...(secret ? { "X-Form-Secret": secret } : {}),
  };
}
