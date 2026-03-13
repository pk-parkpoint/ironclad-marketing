"use client";

import { useEffect, useState } from "react";

export function GuideProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function updateProgress() {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable <= 0) {
        setProgress(0);
        return;
      }
      setProgress(Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100)));
    }

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  return (
    <div aria-hidden="true" className="guide-progress-bar">
      <span className="guide-progress-bar__fill" style={{ width: `${progress}%` }} />
    </div>
  );
}
