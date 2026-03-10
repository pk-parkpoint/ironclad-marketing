"use client";

import Link from "next/link";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-20 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#6B7280]">Error</p>
      <h1 className="mt-3 text-[32px] font-bold leading-[1.2] text-[#111827]">Something went wrong</h1>
      <p className="mt-3 max-w-[36ch] text-[16px] leading-[1.6] text-[#6B7280]">
        We hit an unexpected error. Try reloading the page, or contact us directly.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <button
          className="focus-ring inline-flex items-center justify-center rounded-full bg-[#2563EB] px-7 py-[14px] text-[16px] font-semibold text-white transition-colors hover:bg-[#1D4ED8]"
          onClick={() => reset()}
        >
          Try Again
        </button>
        <Link
          className="focus-ring inline-flex items-center justify-center rounded-full border-2 border-[#2563EB] bg-transparent px-7 py-[14px] text-[16px] font-semibold text-[#2563EB] transition-colors hover:bg-[#2563EB] hover:text-white hover:no-underline"
          href="/"
        >
          Go Home
        </Link>
        <a
          className="focus-ring inline-flex items-center justify-center rounded-full bg-[#D03E04] px-7 py-[14px] text-[16px] font-semibold text-white transition-colors hover:bg-[#B03503] hover:no-underline"
          href="tel:+18335971932"
        >
          Call (833) 597-1932
        </a>
      </div>
    </main>
  );
}
