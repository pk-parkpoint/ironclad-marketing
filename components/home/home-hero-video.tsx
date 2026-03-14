"use client";

import { useEffect, useState } from "react";

export function HomeHeroVideo() {
  const [shouldRender, setShouldRender] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    const win = window as Window &
      typeof globalThis & {
        requestIdleCallback?: (callback: IdleRequestCallback) => number;
        cancelIdleCallback?: (handle: number) => void;
      };
    const connection = nav.connection;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion || connection?.saveData) {
      return;
    }

    let cancelled = false;
    const schedule =
      typeof win.requestIdleCallback === "function"
        ? win.requestIdleCallback.bind(win)
        : (callback: IdleRequestCallback) => window.setTimeout(() => callback({} as IdleDeadline), 150);

    const cancelSchedule =
      typeof win.cancelIdleCallback === "function"
        ? win.cancelIdleCallback.bind(win)
        : window.clearTimeout.bind(window);

    const handle = schedule(() => {
      if (!cancelled) {
        setShouldRender(true);
      }
    });

    return () => {
      cancelled = true;
      cancelSchedule(handle);
    };
  }, []);

  if (!shouldRender) {
    return null;
  }

  return (
    <video
      aria-hidden="true"
      autoPlay
      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${isReady ? "opacity-100" : "opacity-0"}`}
      loop
      muted
      onCanPlay={() => setIsReady(true)}
      playsInline
      poster="/hero/ironclad-hero-poster.jpg"
      preload="metadata"
    >
      <source media="(max-width: 767px)" src="/hero/ironclad-hero-bg.webm" type="video/webm" />
      <source media="(max-width: 767px)" src="/media/hero-video.mp4" type="video/mp4" />
      <source src="/hero/ironclad-hero-bg.webm" type="video/webm" />
      <source src="/media/hero-video.mp4" type="video/mp4" />
    </video>
  );
}
