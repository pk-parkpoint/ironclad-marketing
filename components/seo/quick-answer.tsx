import type { ReactNode } from "react";

type QuickAnswerProps = {
  children: ReactNode;
  className?: string;
  eyebrow?: string;
};

export function QuickAnswer({
  children,
  className,
  eyebrow = "Quick Answer",
}: QuickAnswerProps) {
  return (
    <section
      className={[
        "rounded-[var(--radius-card)] border border-[#BFDBFE] bg-[#EFF6FF] p-5 md:p-6",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      data-speakable="quick-answer"
    >
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#1D4ED8]">{eyebrow}</p>
      <p className="mt-3 max-w-[var(--max-readable-width)] text-sm leading-7 text-[#1E3A8A] md:text-base">
        {children}
      </p>
    </section>
  );
}
