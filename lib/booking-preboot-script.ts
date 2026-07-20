export const BOOKING_PREBOOT_SCRIPT = `
(function () {
  if (window.__ironcladBookingPrebootInstalled) return;
  window.__ironcladBookingPrebootInstalled = true;

  var eventName = "ironclad:open-booking-modal";
  var shellId = "ironclad-booking-preboot-shell";

  function normalizedPathname(pathname) {
    return pathname.replace(/\\/+$/, "") || "/";
  }

  function bookingPath(url) {
    return url.pathname + url.search + url.hash;
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
      bookingPath: bookingPath(url),
      serviceSlug: url.searchParams.get("service") || undefined
    };
  }

  function isCurrentWindowClick(event, anchor) {
    if (event.defaultPrevented || event.button !== 0) return false;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
    if (anchor.hasAttribute("download")) return false;
    return !anchor.target || anchor.target === "_self";
  }

  function hidePrebootShell() {
    var existing = document.getElementById(shellId);
    if (existing && existing.parentNode) {
      existing.parentNode.removeChild(existing);
    }
  }

  function showPrebootShell() {
    if (!document.body || document.getElementById(shellId)) return;

    var shell = document.createElement("div");
    shell.id = shellId;
    shell.setAttribute("role", "dialog");
    shell.setAttribute("aria-modal", "true");
    shell.setAttribute("aria-labelledby", "ironclad-booking-preboot-title");
    shell.style.position = "fixed";
    shell.style.inset = "0";
    shell.style.zIndex = "1001";
    shell.style.display = "grid";
    shell.style.minHeight = "100dvh";
    shell.style.placeItems = "center";
    shell.style.padding = "40px 16px";
    shell.style.overflow = "hidden";
    shell.style.background = "radial-gradient(circle at 18% 0%, #dbeafe, transparent 52%), linear-gradient(180deg, #eef5ff, #dbe7f7)";
    shell.innerHTML =
      '<div style="width:100%;max-width:640px;border-radius:27px;background:linear-gradient(150deg,#fffffff2,#bfdbfeb3 32%,#2563eb73 62%,#ffffffe6);padding:1.5px;box-shadow:0 34px 90px -22px rgba(22,35,58,.38),0 4px 18px rgba(22,35,58,.10)">' +
        '<div style="border:1px solid rgba(255,255,255,.55);border-radius:25.5px;background:rgba(255,255,255,.75);padding:32px 24px;text-align:center;box-shadow:0 1px 3px rgba(15,23,42,.08);backdrop-filter:blur(24px)">' +
          '<div aria-hidden="true" style="width:48px;height:48px;margin:0 auto;border-radius:999px;background:#dbeafe;animation:ironcladBookingPrebootPulse 1.2s ease-in-out infinite"></div>' +
          '<h2 id="ironclad-booking-preboot-title" style="margin:20px 0 0;color:#16233a;font:700 20px/1.2 system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif">Opening booking</h2>' +
          '<p style="margin:8px 0 0;color:#4b5f7a;font:600 14px/1.4 system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif">Loading available appointment steps...</p>' +
        '</div>' +
      '</div>';
    document.body.appendChild(shell);
  }

  if (!document.getElementById("ironclad-booking-preboot-style")) {
    var style = document.createElement("style");
    style.id = "ironclad-booking-preboot-style";
    style.textContent = "@keyframes ironcladBookingPrebootPulse{0%,100%{opacity:.55;transform:scale(.96)}50%{opacity:1;transform:scale(1)}}";
    document.head.appendChild(style);
  }

  window.__ironcladHideBookingPreboot = hidePrebootShell;

  document.addEventListener("click", function (event) {
    var target = event.target;
    if (!target || !target.closest) return;

    var anchor = target.closest("a[href]");
    if (!anchor || !isCurrentWindowClick(event, anchor)) return;

    var detail = bookingDetail(anchor);
    if (!detail) return;

    showPrebootShell();

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
