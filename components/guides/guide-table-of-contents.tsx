"use client";

import { useEffect, useMemo, useState } from "react";
import type { GuideTocItem } from "@/content/guide-pages";

function ChevronIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="16">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export function GuideTableOfContents({ items }: { items: GuideTocItem[] }) {
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null);
  const topLevelItems = useMemo(() => items.filter((item) => item.depth === 2), [items]);

  useEffect(() => {
    if (items.length === 0) {
      return;
    }

    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (headings.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-120px 0px -70% 0px",
        threshold: [0, 1],
      },
    );

    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) {
    return null;
  }

  return (
    <>
      <details className="guide-toc-mobile lg:hidden">
        <summary>
          <span>On this page</span>
          <ChevronIcon />
        </summary>
        <ul>
          {items.map((item) => (
            <li className={item.depth === 3 ? "guide-toc__child" : undefined} key={item.id}>
              <a href={`#${item.id}`}>{item.title}</a>
            </li>
          ))}
        </ul>
      </details>

      <div className="guide-rail-card hidden lg:block">
        <p className="guide-rail-card__eyebrow">On this page</p>
        <ul className="guide-toc-list">
          {topLevelItems.map((item) => (
            <li key={item.id}>
              <a className={item.id === activeId ? "is-active" : undefined} href={`#${item.id}`}>
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
