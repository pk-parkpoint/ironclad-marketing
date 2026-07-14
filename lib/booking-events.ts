export const OPEN_BOOKING_MODAL_EVENT = "ironclad:open-booking-modal";

export type OpenBookingModalDetail = {
  bookingPath?: string;
  serviceSlug?: string;
};

declare global {
  interface Window {
    __ironcladPendingBookingOpen?: OpenBookingModalDetail | null;
    __ironcladHideBookingPreboot?: () => void;
  }
}

let pendingOpenDetail: OpenBookingModalDetail | null = null;

export function takePendingOpenBookingModal(): OpenBookingModalDetail | null {
  const detail = pendingOpenDetail ?? window.__ironcladPendingBookingOpen ?? null;
  pendingOpenDetail = null;
  window.__ironcladPendingBookingOpen = null;
  return detail;
}

export function dispatchOpenBookingModal(
  detail: OpenBookingModalDetail = {},
  options: { queueIfUnhandled?: boolean } = {},
): boolean {
  const bookingEvent = new CustomEvent<OpenBookingModalDetail>(OPEN_BOOKING_MODAL_EVENT, {
    cancelable: true,
    detail,
  });

  window.dispatchEvent(bookingEvent);
  if (bookingEvent.defaultPrevented) return true;

  if (options.queueIfUnhandled) {
    pendingOpenDetail = detail;
    window.__ironcladPendingBookingOpen = detail;
    return true;
  }

  return false;
}

function isCurrentWindowClick(event: MouseEvent, anchor: HTMLAnchorElement): boolean {
  if (event.defaultPrevented || event.button !== 0) return false;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
  if (anchor.hasAttribute("download")) return false;
  return !anchor.target || anchor.target === "_self";
}

function normalizedPathname(pathname: string): string {
  return pathname.replace(/\/+$/, "") || "/";
}

function bookingPath(url: URL): string {
  return `${url.pathname}${url.search}${url.hash}`;
}

export function getBookingLinkDetail(anchor: HTMLAnchorElement): OpenBookingModalDetail | null {
  const href = anchor.getAttribute("href");
  if (!href) return null;

  let url: URL;
  try {
    url = new URL(href, window.location.href);
  } catch {
    return null;
  }

  if (url.origin !== window.location.origin) return null;
  if (normalizedPathname(url.pathname) !== "/book") return null;

  return {
    bookingPath: bookingPath(url),
    serviceSlug: url.searchParams.get("service") || undefined,
  };
}

export function maybeOpenBookingLink(event: MouseEvent, anchor: HTMLAnchorElement): OpenBookingModalDetail | null {
  const detail = getBookingLinkDetail(anchor);
  if (!detail) return null;

  if (isCurrentWindowClick(event, anchor)) return detail;

  return detail;
}
