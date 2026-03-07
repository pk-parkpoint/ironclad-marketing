"use client";

import { useEffect } from "react";

const SCROLL_THRESHOLDS = [25, 50, 75, 100];

type UseScrollDepthTrackingArgs = {
  resetKey: string;
  onThreshold: (threshold: number) => void;
};

export function useScrollDepthTracking({ resetKey, onThreshold }: UseScrollDepthTrackingArgs) {
  useEffect(() => {
    const fired = new Set<number>();

    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const percent = scrollable <= 0 ? 100 : Math.min(100, Math.round((window.scrollY / scrollable) * 100));
      for (const threshold of SCROLL_THRESHOLDS) {
        if (percent >= threshold && !fired.has(threshold)) {
          fired.add(threshold);
          onThreshold(threshold);
        }
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [onThreshold, resetKey]);
}
