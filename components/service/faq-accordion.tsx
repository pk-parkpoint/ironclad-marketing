"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export type FaqAccordionItem = {
  question: string;
  answer: string;
};

export type FaqAccordionCta = {
  href: string;
  label: string;
  heading: string;
  description?: string;
};

type FaqAccordionProps = {
  items: FaqAccordionItem[];
  singleOpen?: boolean;
  ctaEvery?: number;
  cta?: FaqAccordionCta;
};

export function FaqAccordion({
  items,
  singleOpen = true,
  ctaEvery,
  cta,
}: FaqAccordionProps) {
  const [openIndexes, setOpenIndexes] = useState<Set<number>>(new Set());
  const [panelHeights, setPanelHeights] = useState<number[]>([]);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const panelRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    setPanelHeights(items.map((_, index) => panelRefs.current[index]?.scrollHeight ?? 0));
  }, [items, openIndexes]);

  function toggleIndex(index: number) {
    const nextOpen = !openIndexes.has(index);
    if (singleOpen && nextOpen && typeof window !== "undefined") {
      for (const openIndex of openIndexes.values()) {
        if (openIndex !== index) {
          window.dispatchEvent(
            new CustomEvent("ironclad:faq-toggle", {
              detail: { question: items[openIndex]?.question ?? "", open: false },
            }),
          );
        }
      }
    }
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("ironclad:faq-toggle", {
          detail: { question: items[index]?.question ?? "", open: nextOpen },
        }),
      );
    }

    setOpenIndexes((current) => {
      const next = new Set(current);

      if (singleOpen) {
        if (next.has(index)) {
          next.clear();
        } else {
          next.clear();
          next.add(index);
        }
        return next;
      }

      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    const count = items.length;
    if (count === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      buttonRefs.current[(index + 1) % count]?.focus();
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      buttonRefs.current[(index - 1 + count) % count]?.focus();
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      buttonRefs.current[0]?.focus();
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      buttonRefs.current[count - 1]?.focus();
    }
  }

  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] border border-border bg-background">
      {items.map((faq, index) => {
        const open = openIndexes.has(index);
        const buttonId = `faq-trigger-${index}`;
        const panelId = `faq-panel-${index}`;
        const showCta = Boolean(cta && ctaEvery && ctaEvery > 0 && (index + 1) % ctaEvery === 0 && index < items.length - 1);

        return (
          <div className="border-b border-border last:border-b-0" key={faq.question}>
            <button
              aria-controls={panelId}
              aria-expanded={open}
              className="focus-ring flex w-full items-center justify-between gap-4 px-6 py-4 text-left text-sm font-semibold text-ink md:text-base"
              id={buttonId}
              onClick={() => toggleIndex(index)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              ref={(element) => {
                buttonRefs.current[index] = element;
              }}
              type="button"
            >
              {faq.question}
              <span
                aria-hidden="true"
                className={`text-muted transition-transform duration-200 motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
              >
                ⌄
              </span>
            </button>

            <div
              aria-labelledby={buttonId}
              className="overflow-hidden transition-[max-height] duration-[250ms] ease-out motion-reduce:transition-none"
              id={panelId}
              role="region"
              style={{ maxHeight: open ? `${panelHeights[index] ?? 0}px` : "0px" }}
            >
              <div
                className="px-6 pb-5 text-sm text-muted md:text-base"
                data-speakable="faq-answer"
                ref={(element) => {
                  panelRefs.current[index] = element;
                }}
              >
                {faq.answer}
              </div>
            </div>

            {showCta && cta ? (
              <div className="mx-4 mb-4 rounded-xl border border-border bg-soft-background p-4">
                <p className="text-sm font-semibold text-ink">{cta.heading}</p>
                {cta.description ? <p className="mt-1 text-sm text-muted">{cta.description}</p> : null}
                <Link className="focus-ring mt-3 inline-flex text-sm font-semibold text-cta-blue hover:underline" href={cta.href}>
                  {cta.label}
                </Link>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
