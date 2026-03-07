import type { ReactNode } from "react";

type AustinNoteProps = {
  title?: string;
  children: ReactNode;
};

function MapPinIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export function AustinNote({ title = "Austin-Specific", children }: AustinNoteProps) {
  return (
    <aside
      className="flex items-start gap-3 rounded-r-[var(--radius-card)] border border-[#BFDBFE] bg-[#EFF6FF] px-6 py-5"
      style={{ borderLeft: "4px solid var(--color-cta-blue)" }}
    >
      <span className="mt-1 text-cta-blue" aria-hidden="true">
        <MapPinIcon />
      </span>
      <div>
        <div className="text-sm font-semibold text-ink">{title}</div>
        <div className="mt-1 text-sm leading-6 text-body">{children}</div>
      </div>
    </aside>
  );
}

