export const BOOKING_PREBOOT_SCRIPT = `
(function () {
  if (window.__ironcladBookingPrebootInstalled) return;
  window.__ironcladBookingPrebootInstalled = true;

  var eventName = "ironclad:open-booking-modal";

  function normalizedPathname(pathname) {
    return pathname.replace(/\\/+$/, "") || "/";
  }

  function bookingDetail(anchor) {
    var href = anchor.getAttribute("href");
    if (!href) return null;

    var url;
    try {
      url = new URL(href, window.location.href);
    } catch (_error) {
      return null;
    }

    if (url.origin !== window.location.origin) return null;
    if (normalizedPathname(url.pathname) !== "/book") return null;

    return {
      serviceSlug: url.searchParams.get("service") || undefined
    };
  }

  function isCurrentWindowClick(event, anchor) {
    if (event.defaultPrevented || event.button !== 0) return false;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
    if (anchor.hasAttribute("download")) return false;
    return !anchor.target || anchor.target === "_self";
  }

  document.addEventListener("click", function (event) {
    var target = event.target;
    if (!target || !target.closest) return;

    var anchor = target.closest("a[href]");
    if (!anchor || !isCurrentWindowClick(event, anchor)) return;

    var detail = bookingDetail(anchor);
    if (!detail) return;

    var bookingEvent = new CustomEvent(eventName, {
      cancelable: true,
      detail: detail
    });

    window.dispatchEvent(bookingEvent);
    if (!bookingEvent.defaultPrevented) {
      window.__ironcladPendingBookingOpen = detail;
    }

    event.preventDefault();
  }, true);
}());
`;
