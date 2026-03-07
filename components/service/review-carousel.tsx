"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { ReviewEntry } from "@/content/reviews";
import { REVIEWS } from "@/content/reviews";

/* ------------------------------------------------------------------ */
/*  Stats Counter Row                                                  */
/* ------------------------------------------------------------------ */

const STATS = [
  { target: 26, suffix: "", label: "5-STAR REVIEWS" },
  { target: 131, suffix: "", label: "COMPLETED JOBS" },
  { target: 97, suffix: "", label: "HAPPY CUSTOMERS" },
] as const;

function useCountUp(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);
  const hasAnimated = useRef(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const start = performance.now();

          function animate(now: number) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setDone(true);
            }
          }

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, done, ref };
}

function StatItem({ target, suffix, label }: (typeof STATS)[number]) {
  const { count, done, ref } = useCountUp(target);
  return (
    <div ref={ref} className="flex flex-col items-center px-4 py-6 md:py-0">
      <span className="text-4xl font-bold text-[#2563EB] md:text-[48px]">
        {count.toLocaleString()}
        {done ? suffix : ""}
      </span>
      <span className="mt-2 text-[13px] font-semibold uppercase tracking-[0.1em] text-[#6B7280]">
        {label}
      </span>
    </div>
  );
}

function StatsCounterRow() {
  return (
    <div className="mx-auto max-w-[960px] py-12">
      {/* Desktop: flex row with vertical dividers */}
      <div className="hidden md:flex md:items-center">
        {STATS.map((stat, i) => (
          <div key={stat.label} className="flex flex-1 items-center">
            <div className="flex-1">
              <StatItem {...stat} />
            </div>
            {i < STATS.length - 1 && (
              <div className="h-16 w-px bg-[#E5E7EB]" />
            )}
          </div>
        ))}
      </div>
      {/* Mobile: stacked with horizontal dividers */}
      <div className="flex flex-col md:hidden">
        {STATS.map((stat, i) => (
          <div key={stat.label}>
            <StatItem {...stat} />
            {i < STATS.length - 1 && (
              <div className="mx-auto h-px w-3/4 bg-[#E5E7EB]" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Google G Icon SVG                                                  */
/* ------------------------------------------------------------------ */

function GoogleGIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84Z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z"
        fill="#EA4335"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Star Rating Row                                                    */
/* ------------------------------------------------------------------ */

function StarRow({ count = 5, size = 16 }: { count?: number; size?: number }) {
  return (
    <div
      className="flex items-center gap-0.5"
      role="img"
      aria-label={`${count} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={i < count ? "#FBBC04" : "none"}
          stroke="#FBBC04"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path d="m12 2.5 2.9 6 6.6 1-4.8 4.7 1.2 6.6L12 17.8 6.1 20.8l1.2-6.6L2.5 9.5l6.6-1L12 2.5Z" />
        </svg>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Google Review Card                                                 */
/* ------------------------------------------------------------------ */

function GoogleReviewCard({ review }: { review: ReviewEntry }) {
  const [expanded, setExpanded] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);
  const [isClamped, setIsClamped] = useState(false);

  useEffect(() => {
    const el = textRef.current;
    if (el) {
      setIsClamped(el.scrollHeight > el.clientHeight + 1);
    }
  }, []);

  return (
    <article className="flex h-full w-[280px] flex-shrink-0 flex-col rounded-lg border border-[#E5E7EB] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] md:w-[300px]">
      {/* Header: avatar + name/time + Google G */}
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-base font-semibold text-white"
          style={{ backgroundColor: review.avatarColor }}
        >
          {review.initial}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold text-[#111827]">
            {review.name}
          </p>
          <p className="text-[13px] text-[#9CA3AF]">{review.timeAgo}</p>
        </div>
        <div className="flex-shrink-0">
          <GoogleGIcon size={24} />
        </div>
      </div>

      {/* Stars */}
      <div className="mt-4 mb-3">
        <StarRow count={review.rating} />
      </div>

      {/* Review text */}
      <p
        ref={textRef}
        className={`text-sm leading-relaxed text-[#374151] ${expanded ? "" : "line-clamp-4"}`}
      >
        {review.text}
      </p>
      {isClamped && !expanded && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="mt-1 self-start text-sm font-medium text-[#374151] hover:underline"
        >
          Read more
        </button>
      )}
    </article>
  );
}

/* ------------------------------------------------------------------ */
/*  Carousel with Navigation                                           */
/* ------------------------------------------------------------------ */

function ReviewCarouselInner({ reviews }: { reviews: ReviewEntry[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isPaused = useRef(false);
  const manualPauseTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  const scrollByCard = useCallback(
    (direction: "left" | "right") => {
      const container = scrollRef.current;
      if (!container) return;
      const cardWidth = 324; // 300px card + 24px gap
      const delta = direction === "left" ? -cardWidth : cardWidth;
      const nextScroll = container.scrollLeft + delta;
      const maxScroll = container.scrollWidth - container.clientWidth;

      if (direction === "right" && nextScroll > maxScroll) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ left: delta, behavior: "smooth" });
      }
    },
    [],
  );

  const handleManualNav = useCallback(
    (direction: "left" | "right") => {
      isPaused.current = true;
      clearTimeout(manualPauseTimeout.current);
      manualPauseTimeout.current = setTimeout(() => {
        isPaused.current = false;
      }, 10000);
      scrollByCard(direction);
    },
    [scrollByCard],
  );

  // Auto-rotate
  useEffect(() => {
    const interval = setInterval(() => {
      if (isPaused.current) return;
      scrollByCard("right");
    }, 4000);

    return () => {
      clearInterval(interval);
      clearTimeout(manualPauseTimeout.current);
    };
  }, [scrollByCard]);

  return (
    <div className="relative">
      {/* Left arrow */}
      <button
        type="button"
        onClick={() => handleManualNav("left")}
        className="absolute -left-5 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#E5E7EB] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-shadow hover:shadow-[0_2px_6px_rgba(0,0,0,0.1)] md:flex"
        aria-label="Previous reviews"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#9CA3AF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="hover:stroke-[#111827]"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>

      {/* Right arrow */}
      <button
        type="button"
        onClick={() => handleManualNav("right")}
        className="absolute -right-5 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#E5E7EB] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-shadow hover:shadow-[0_2px_6px_rgba(0,0,0,0.1)] md:flex"
        aria-label="Next reviews"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#9CA3AF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="hover:stroke-[#111827]"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>

      {/* Scrollable track */}
      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onMouseEnter={() => {
          isPaused.current = true;
        }}
        onMouseLeave={() => {
          if (!manualPauseTimeout.current) {
            isPaused.current = false;
          }
        }}
      >
        {reviews.map((review) => (
          <div key={review.id} className="snap-start">
            <GoogleReviewCard review={review} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Bottom CTA + Google Rating Badge                                   */
/* ------------------------------------------------------------------ */

function BottomCTA() {
  return (
    <div className="flex flex-col items-center">
      <Link
        href="/reviews"
        className="mt-10 inline-flex items-center rounded-md bg-[#2563EB] px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#1D4ED8] hover:no-underline"
      >
        Read All Reviews &rarr;
      </Link>
      <div className="mt-4 mb-12 inline-flex items-center gap-1.5">
        <GoogleGIcon size={20} />
        <StarRow count={5} size={14} />
        <span className="text-xs font-semibold uppercase tracking-[0.05em] text-[#6B7280]">
          4.9/5 RATING
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Export: ReviewsSection                                        */
/* ------------------------------------------------------------------ */

export function ReviewsSection() {
  return (
    <section className="bg-white" aria-label="Customer reviews and stats">
      <div className="mx-auto w-full max-w-[1280px] px-4 pt-16 md:px-6">
        {/* Stats row */}
        <StatsCounterRow />

        {/* Header */}
        <h2 className="mt-12 mb-2 text-center text-[32px] font-bold leading-[1.2] text-[#2563EB]">
          What Austin Homeowners Are Saying
        </h2>
        <div className="mx-auto mb-10 h-[3px] w-12 rounded-sm bg-[#2563EB]" />

        {/* Carousel */}
        <ReviewCarouselInner reviews={REVIEWS} />

        {/* CTA + Badge */}
        <BottomCTA />
      </div>
    </section>
  );
}

// Keep backward-compatible default export
export default ReviewsSection;
