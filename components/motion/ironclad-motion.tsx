"use client";

import { useEffect, useRef, type ReactNode } from "react";

type IroncladMotionRootProps = {
  as?: "div" | "main";
  children: ReactNode;
  className?: string;
};

declare global {
  interface Window {
    icMotionScan?: () => void;
  }
}

function hasBinding(node: HTMLElement, binding: string): boolean {
  return (node.dataset.icm ?? "").split(" ").includes(binding);
}

function markBinding(node: HTMLElement, binding: string) {
  const bindings = new Set((node.dataset.icm ?? "").split(" ").filter(Boolean));
  bindings.add(binding);
  node.dataset.icm = Array.from(bindings).join(" ");
}

export function IroncladMotionRoot({ as: Element = "main", children, className }: IroncladMotionRootProps) {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

    root.classList.add("ic-anim");

    const frameIds = new Set<number>();
    const timeoutIds = new Set<number>();
    const revealNodes = new Set<HTMLElement>();
    const rotationIntervals = new Map<HTMLElement, number>();
    const glassCleanups = new Map<HTMLElement, () => void>();

    const revealNode = (node: HTMLElement) => {
      if (node.hasAttribute("data-icr")) return;
      const siblings = node.parentElement ? Array.from(node.parentElement.children) : [];
      const siblingIndex = Math.max(0, siblings.indexOf(node));
      node.style.setProperty("--ic-reveal-delay", `${(siblingIndex % 3) * 90}ms`);
      node.setAttribute("data-icr", "");
      node.classList.add("ic-revealed");
      revealObserver?.unobserve(node);
    };

    const revealObserver = "IntersectionObserver" in window
      ? new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) revealNode(entry.target as HTMLElement);
            });
          },
          { threshold: 0.15 },
        )
      : null;

    const animateCount = (node: HTMLElement) => {
      const rawTarget = node.dataset.count ?? "";
      const target = Number.parseFloat(rawTarget);
      if (!Number.isFinite(target)) return;
      const decimals = rawTarget.split(".")[1]?.length ?? 0;
      const start = performance.now();

      const tick = (now: number) => {
        if (!node.isConnected) return;
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

    const countObserver = "IntersectionObserver" in window
      ? new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              countObserver?.unobserve(entry.target);
              animateCount(entry.target as HTMLElement);
            });
          },
          { threshold: 0.4 },
        )
      : null;

    const bindRotate = (node: HTMLElement) => {
      let words: unknown;
      try {
        words = JSON.parse(node.dataset.rotate ?? "[]");
      } catch {
        return;
      }
      if (!Array.isArray(words) || words.length < 2 || !words.every((word) => typeof word === "string")) return;

      const wrapper = node.parentElement;
      if (!wrapper) return;
      const rotateWords = words as string[];
      let wordIndex = Math.max(0, rotateWords.indexOf(node.textContent?.trim() ?? ""));
      const settleTimeoutId = window.setTimeout(() => {
        timeoutIds.delete(settleTimeoutId);
        if (node.isConnected) wrapper.style.width = `${node.offsetWidth}px`;
      }, 600);
      timeoutIds.add(settleTimeoutId);

      const intervalId = window.setInterval(() => {
        if (!node.isConnected) {
          window.clearInterval(intervalId);
          rotationIntervals.delete(node);
          return;
        }
        wordIndex = (wordIndex + 1) % rotateWords.length;
        node.style.transform = "translateY(-115%)";
        node.style.opacity = "0";

        const timeoutId = window.setTimeout(() => {
          timeoutIds.delete(timeoutId);
          if (!node.isConnected) return;
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
      rotationIntervals.set(node, intervalId);
    };

    const bindGlass = (card: HTMLElement) => {
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
      glassCleanups.set(card, () => {
        card.removeEventListener("pointermove", trackPointer);
        shine.remove();
      });
    };

    const scan = () => {
      root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((node) => {
        if (hasBinding(node, "reveal")) return;
        markBinding(node, "reveal");
        revealNodes.add(node);
        if (node.hasAttribute("data-icr") || node.getBoundingClientRect().bottom < 0 || !revealObserver) {
          revealNode(node);
        } else {
          revealObserver.observe(node);
        }
      });

      root.querySelectorAll<HTMLElement>("[data-count]").forEach((node) => {
        if (hasBinding(node, "count")) return;
        markBinding(node, "count");
        if (countObserver) countObserver.observe(node);
      });

      root.querySelectorAll<HTMLElement>("[data-rotate]").forEach((node) => {
        if (hasBinding(node, "rotate")) return;
        markBinding(node, "rotate");
        bindRotate(node);
      });

      if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        root.querySelectorAll<HTMLElement>(".ic-glass").forEach((node) => {
          if (hasBinding(node, "glass")) return;
          markBinding(node, "glass");
          bindGlass(node);
        });
      }

      revealNodes.forEach((node) => {
        if (!node.isConnected) revealNodes.delete(node);
      });
      glassCleanups.forEach((cleanup, node) => {
        if (!node.isConnected) {
          cleanup();
          glassCleanups.delete(node);
        }
      });
    };

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

    let rescanTimeoutId: number | undefined;
    const mutationObserver = new MutationObserver((mutations) => {
      if (!mutations.some((mutation) => mutation.addedNodes.length > 0)) return;
      if (rescanTimeoutId !== undefined) window.clearTimeout(rescanTimeoutId);
      rescanTimeoutId = window.setTimeout(() => {
        rescanTimeoutId = undefined;
        scan();
      }, 100);
    });
    mutationObserver.observe(root, { childList: true, subtree: true });

    window.icMotionScan = scan;
    scan();

    return () => {
      mutationObserver.disconnect();
      revealObserver?.disconnect();
      countObserver?.disconnect();
      window.removeEventListener("scroll", checkPassedNodes);
      rotationIntervals.forEach((intervalId) => window.clearInterval(intervalId));
      glassCleanups.forEach((cleanup) => cleanup());
      frameIds.forEach((frameId) => window.cancelAnimationFrame(frameId));
      timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
      if (rescanTimeoutId !== undefined) window.clearTimeout(rescanTimeoutId);
      if (window.icMotionScan === scan) delete window.icMotionScan;
      root.classList.remove("ic-anim");
    };
  }, []);

  return (
    <Element
      className={["ic-motion-root", className].filter(Boolean).join(" ")}
      data-motion-root
      ref={(node) => {
        rootRef.current = node;
      }}
    >
      {children}
    </Element>
  );
}
