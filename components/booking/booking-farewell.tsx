"use client";

import { useEffect } from "react";
import type { WizardFormData } from "./booking-wizard";

type Props = {
  formData: WizardFormData;
  onClose: () => void;
};

function formatDateLabel(iso: string | null): string {
  if (!iso) return "your selected date";
  const [y, m, d] = iso.split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${d}-${months[parseInt(m, 10) - 1]}-${y}`;
}

const TIME_LABELS: Record<string, string> = {
  morning: "Morning",
  afternoon: "Afternoon",
  flexible: "Flexible",
};

export function FarewellScreen({ formData, onClose }: Props) {
  useEffect(() => {
    const stableClose = onClose;
    const timer = window.setTimeout(() => stableClose(), 5000);
    return () => window.clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const timeLabel = TIME_LABELS[formData.timeOfDay || ""] || formData.timeOfDay || "Flexible";
  const dateLabel = formatDateLabel(formData.selectedDate);

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-8 py-10 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
        <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
        </svg>
      </div>
      <h3 className="mt-5 text-xl font-semibold text-gray-900">
        Thank you for trusting Ironclad Plumbing
      </h3>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-gray-500">
        Your <span className="font-medium text-gray-700">{timeLabel}</span> appointment on{" "}
        <span className="font-medium text-gray-700">{dateLabel}</span> is confirmed.
        Please feel free to contact us at any time with further questions. Our team will be in touch.
      </p>
      <p className="mt-6 text-xs text-gray-400">This window will close automatically.</p>
    </div>
  );
}
