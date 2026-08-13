"use client";

import { useEffect, useState } from "react";

type NavigatorWithConnection = Navigator & {
  connection?: { saveData?: boolean };
};

export function HomeHeroVideo() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as NavigatorWithConnection).connection?.saveData === true;

    if (reducedMotion || saveData) {
      return;
    }

    const events: Array<keyof WindowEventMap> = ["pointerdown", "touchstart", "keydown", "scroll"];
    let idleCallbackId: number | undefined;
    let fallbackTimerId: ReturnType<typeof globalThis.setTimeout> | undefined;

    function scheduleDeferredVideo() {
      if ("requestIdleCallback" in window) {
        idleCallbackId = window.requestIdleCallback(enableVideo, { timeout: 900 });
      } else {
        fallbackTimerId = globalThis.setTimeout(enableVideo, 700);
      }
    }

    function cancelDeferredVideo() {
      window.removeEventListener("load", scheduleDeferredVideo);
      if (idleCallbackId !== undefined && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleCallbackId);
        idleCallbackId = undefined;
      }
      if (fallbackTimerId !== undefined) {
        globalThis.clearTimeout(fallbackTimerId);
        fallbackTimerId = undefined;
      }
    }

    function removeListeners() {
      events.forEach((event) => window.removeEventListener(event, enableVideo));
    }
    function enableVideo() {
      cancelDeferredVideo();
      removeListeners();
      setShouldLoad(true);
    }

    events.forEach((event) => window.addEventListener(event, enableVideo, { once: true, passive: true }));
    if (document.readyState === "complete") {
      scheduleDeferredVideo();
    } else {
      window.addEventListener("load", scheduleDeferredVideo, { once: true });
    }

    return () => {
      removeListeners();
      cancelDeferredVideo();
    };
  }, []);

  if (!shouldLoad) {
    return null;
  }

  return (
    <video
      aria-hidden="true"
      autoPlay
      className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
      loop
      muted
      playsInline
      poster="/hero/ironclad-hero-poster.jpg"
      preload="none"
    >
      <source
        media="(min-width: 768px) and (prefers-reduced-motion: no-preference)"
        src="/media/hero-video-desktop.mp4"
        type="video/mp4"
      />
      <source
        media="(max-width: 767px) and (prefers-reduced-motion: no-preference)"
        src="/media/hero-video-mobile-fast.mp4"
        type="video/mp4"
      />
    </video>
  );
}
