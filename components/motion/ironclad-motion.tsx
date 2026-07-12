"use client";

import { useEffect, useRef, type ReactNode } from "react";

type IroncladMotionRootProps = {
  as?: "div" | "main";
  children: ReactNode;
  className?: string;
};

function revealImmediately(nodes: HTMLElement[]) {
  nodes.forEach((node) => node.classList.add("ic-revealed"));
}

export function IroncladMotionRoot({ as: Element = "main", children, className }: IroncladMotionRootProps) {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

    root.classList.add("ic-anim");

    const cleanupTasks: Array<() => void> = [];
    const frameIds = new Set<number>();
    const timeoutIds = new Set<number>();

    const revealNodes = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    let revealObserver: IntersectionObserver | null = null;
    const revealNode = (node: HTMLElement) => {
      if (node.classList.contains("ic-revealed")) return;
      const siblings = node.parentElement ? Array.from(node.parentElement.children) : [];
      const siblingIndex = Math.max(0, siblings.indexOf(node));
      node.style.setProperty("--ic-reveal-delay", `${(siblingIndex % 3) * 90}ms`);
      node.classList.add("ic-revealed");
      revealObserver?.unobserve(node);
    };

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            revealNode(entry.target as HTMLElement);
          });
        },
        { threshold: 0.15 },
      );
      revealObserver = observer;
      revealNodes.forEach((node) => observer.observe(node));
      cleanupTasks.push(() => observer.disconnect());

      let revealCheckPending = false;
      const revealPassedNodes = () => {
        revealCheckPending = false;
        const viewportFloor = window.innerHeight * 1.15;
        revealNodes.forEach((node) => {
          if (node.getBoundingClientRect().top <= viewportFloor) revealNode(node);
        });
      };
      const checkPassedNodes = () => {
        if (revealCheckPending) return;
        revealCheckPending = true;
        const frameId = window.requestAnimationFrame(revealPassedNodes);
        frameIds.add(frameId);
      };
      window.addEventListener("scroll", checkPassedNodes, { passive: true });
      cleanupTasks.push(() => window.removeEventListener("scroll", checkPassedNodes));
    } else {
      revealImmediately(revealNodes);
    }

    const countNodes = Array.from(root.querySelectorAll<HTMLElement>("[data-count]"));
    const animateCount = (node: HTMLElement) => {
      const rawTarget = node.dataset.count ?? "";
      const target = Number.parseFloat(rawTarget);
      if (!Number.isFinite(target)) return;
      const decimals = rawTarget.split(".")[1]?.length ?? 0;
      const start = performance.now();

      const tick = (now: number) => {
        const progress = Math.min(1, (now - start) / 1100);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = target * eased;
        node.textContent = decimals > 0 ? value.toFixed(decimals) : String(Math.round(value));
        if (progress < 1) {
          const frameId = window.requestAnimationFrame(tick);
          frameIds.add(frameId);
        }
      };

      node.textContent = decimals > 0 ? (0).toFixed(decimals) : "0";
      const frameId = window.requestAnimationFrame(tick);
      frameIds.add(frameId);
    };

    if ("IntersectionObserver" in window) {
      const countObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            countObserver.unobserve(entry.target);
            animateCount(entry.target as HTMLElement);
          });
        },
        { threshold: 0.4 },
      );
      countNodes.forEach((node) => countObserver.observe(node));
      cleanupTasks.push(() => countObserver.disconnect());
    }

    root.querySelectorAll<HTMLElement>("[data-rotate]").forEach((node) => {
      let words: unknown;
      try {
        words = JSON.parse(node.dataset.rotate ?? "[]");
      } catch {
        return;
      }
      if (!Array.isArray(words) || words.length < 2 || !words.every((word) => typeof word === "string")) {
        return;
      }

      const wrapper = node.parentElement;
      if (!wrapper) return;
      const rotateWords = words as string[];
      let wordIndex = Math.max(0, rotateWords.indexOf(node.textContent?.trim() ?? ""));
      const settleTimeoutId = window.setTimeout(() => {
        wrapper.style.width = `${node.offsetWidth}px`;
      }, 600);
      timeoutIds.add(settleTimeoutId);

      const intervalId = window.setInterval(() => {
        wordIndex = (wordIndex + 1) % rotateWords.length;
        node.style.transform = "translateY(-115%)";
        node.style.opacity = "0";

        const timeoutId = window.setTimeout(() => {
          node.textContent = rotateWords[wordIndex];
          node.style.transition = "none";
          node.style.transform = "translateY(115%)";
          void node.offsetHeight;
          wrapper.style.width = `${node.offsetWidth}px`;

          const frameId = window.requestAnimationFrame(() => {
            node.style.removeProperty("transition");
            node.style.transform = "translateY(0)";
            node.style.opacity = "1";
          });
          frameIds.add(frameId);
        }, 360);
        timeoutIds.add(timeoutId);
      }, 2600);

      cleanupTasks.push(() => window.clearInterval(intervalId));
    });

    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      root.querySelectorAll<HTMLElement>(".ic-glass").forEach((card) => {
        const shine = document.createElement("span");
        shine.className = "ic-shine";
        shine.setAttribute("aria-hidden", "true");
        card.appendChild(shine);

        const trackPointer = (event: PointerEvent) => {
          const bounds = card.getBoundingClientRect();
          card.style.setProperty("--ic-pointer-x", `${((event.clientX - bounds.left) / bounds.width) * 100}%`);
          card.style.setProperty("--ic-pointer-y", `${((event.clientY - bounds.top) / bounds.height) * 100}%`);
        };

        card.addEventListener("pointermove", trackPointer, { passive: true });
        cleanupTasks.push(() => {
          card.removeEventListener("pointermove", trackPointer);
          shine.remove();
        });
      });
    }

    return () => {
      cleanupTasks.forEach((cleanup) => cleanup());
      frameIds.forEach((frameId) => window.cancelAnimationFrame(frameId));
      timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
      root.classList.remove("ic-anim");
    };
  }, []);

  return (
    <Element className={["ic-motion-root", className].filter(Boolean).join(" ")} data-motion-root ref={(node) => { rootRef.current = node; }}>
      {children}
    </Element>
  );
}
