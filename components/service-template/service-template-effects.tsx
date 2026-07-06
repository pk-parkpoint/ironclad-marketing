"use client";

import { useEffect } from "react";

function easeOutCubic(progress: number): number {
  return 1 - Math.pow(1 - progress, 3);
}

export function ServiceTemplateEffects() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".dc-root");
    if (!root) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const details = Array.from(root.querySelectorAll<HTMLDetailsElement>("details.dc-faq-item"));
    function handleToggle(event: Event) {
      const active = event.currentTarget as HTMLDetailsElement;
      if (!active.open) return;
      details.forEach((item) => {
        if (item !== active) item.open = false;
      });
    }
    details.forEach((item) => item.addEventListener("toggle", handleToggle));

    const revealNodes = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    const countNodes = Array.from(root.querySelectorAll<HTMLElement>("[data-count-to]"));

    if (reducedMotion) {
      revealNodes.forEach((node) => node.classList.add("is-visible"));
      countNodes.forEach((node) => {
        node.textContent = node.dataset.countTo ?? node.textContent;
      });
      return () => details.forEach((item) => item.removeEventListener("toggle", handleToggle));
    }

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.25 },
    );
    revealNodes.forEach((node, index) => {
      node.style.setProperty("--reveal-index", String(index));
      revealObserver.observe(node);
    });

    const countObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const node = entry.target as HTMLElement;
          const targetText = node.dataset.countTo ?? "";
          const suffix = targetText.endsWith("+") ? "+" : "";
          const target = Number.parseFloat(targetText.replace("+", ""));
          const decimals = targetText.includes(".") ? 1 : 0;
          const start = performance.now();

          function tick(now: number) {
            const progress = Math.min((now - start) / 1200, 1);
            const value = easeOutCubic(progress) * target;
            node.textContent = `${value.toFixed(decimals)}${suffix}`;
            if (progress < 1) {
              requestAnimationFrame(tick);
            } else {
              node.textContent = targetText;
            }
          }

          node.textContent = `${decimals ? "0.0" : "0"}${suffix}`;
          requestAnimationFrame(tick);
          countObserver.unobserve(node);
        });
      },
      { threshold: 0.4 },
    );
    countNodes.forEach((node) => countObserver.observe(node));

    return () => {
      details.forEach((item) => item.removeEventListener("toggle", handleToggle));
      revealObserver.disconnect();
      countObserver.disconnect();
    };
  }, []);

  return null;
}
