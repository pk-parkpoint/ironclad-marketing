"use client";

import { useEffect, useRef, useState } from "react";
import { trackLeadSubmitSuccess } from "@/lib/analytics";
import { derivePageContext } from "@/lib/analytics-page-context";
import type { WizardFormData } from "./booking-wizard";

type Props = {
  formData: WizardFormData;
  onUpdate: (updates: Partial<WizardFormData>) => void;
  bookingId?: string;
  onClose: () => void;
  onDismiss: () => void;
};

const TIME_LABELS: Record<string, string> = {
  morning: "Morning",
  afternoon: "Afternoon",
  flexible: "Flexible",
};

function formatDateLabel(iso: string | null): string {
  if (!iso) return "your selected date";
  const [y, m, d] = iso.split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${d}-${months[parseInt(m, 10) - 1]}-${y}`;
}

function PillToggle({
  options,
  value,
  onChange,
}: {
  options: Array<{ id: string; label: string }>;
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex gap-2">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          className={`focus-ring rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
            value === opt.id
              ? "border-blue-600 bg-blue-50 text-blue-700"
              : "border-gray-200 text-gray-600 hover:border-gray-400"
          }`}
          onClick={() => onChange(opt.id)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export function BookingStepConfirm({ formData, onUpdate, bookingId, onClose, onDismiss }: Props) {
  const [showFarewell, setShowFarewell] = useState(false);
  const hasTrackedSuccessRef = useRef(false);

  useEffect(() => {
    if (!bookingId || hasTrackedSuccessRef.current || typeof window === "undefined") {
      return;
    }

    const pageContext = derivePageContext(window.location.pathname);
    hasTrackedSuccessRef.current = true;
    trackLeadSubmitSuccess({
      city: pageContext.city,
      formType: "booking_wizard",
      service: formData.serviceDetail || formData.serviceCategory || "",
    });
  }, [bookingId, formData.serviceCategory, formData.serviceDetail]);

  useEffect(() => {
    if (!showFarewell) return;
    const dismiss = onDismiss;
    const timer = window.setTimeout(() => dismiss(), 5000);
    return () => window.clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showFarewell]);

  function handleDone() {
    setShowFarewell(true); // show farewell, then auto-dismiss after 5s
    // notification is sent after farewell shows
    try { onClose(); } catch { /* ignore */ }
  }

  if (showFarewell) {
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

  return (
    <div className="flex-1 overflow-y-auto px-8 py-6">
      {/* Confirmation banner */}
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
          </svg>
        </div>
        <h3 className="mt-3 text-xl font-semibold text-gray-900">Your appointment is confirmed!</h3>
      </div>

      {/* Optional extras */}
      <p className="mt-6 text-sm text-gray-500">
        These fields are optional but help our technician prepare for your visit.
      </p>

      {/* Additional notes */}
      <div className="mt-4">
        <label className="text-sm font-medium text-gray-600">Anything we should know before arrival?</label>
        <textarea
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          rows={3}
          onChange={(e) => onUpdate({ additionalNotes: e.target.value })}
          placeholder="Special access instructions, details about the issue, etc."
          value={formData.additionalNotes}
        />
      </div>

      {/* Property type */}
      <div className="mt-5">
        <label className="text-sm font-medium text-gray-600">Property type</label>
        <div className="mt-2">
          <PillToggle
            options={[
              { id: "residential", label: "Residential" },
              { id: "commercial", label: "Commercial" },
            ]}
            value={formData.propertyType}
            onChange={(id) => onUpdate({ propertyType: id as "residential" | "commercial" })}
          />
        </div>
      </div>

      {/* Ownership */}
      <div className="mt-5">
        <label className="text-sm font-medium text-gray-600">Ownership</label>
        <div className="mt-2">
          <PillToggle
            options={[
              { id: "own", label: "I own this property" },
              { id: "other", label: "Someone else owns" },
            ]}
            value={formData.ownershipStatus}
            onChange={(id) => onUpdate({ ownershipStatus: id as "own" | "other" })}
          />
        </div>
      </div>

      {/* Gate code */}
      <div className="mt-5">
        <label className="text-sm font-medium text-gray-600">Gate code(s)</label>
        <input
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          type="text"
          value={formData.gateCode}
          onChange={(e) => onUpdate({ gateCode: e.target.value })}
          placeholder="Enter gate code(s) if applicable"
        />
      </div>

      {/* Pets */}
      <label className="mt-5 flex items-center gap-3 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={formData.petsOnPremise}
          onChange={(e) => onUpdate({ petsOnPremise: e.target.checked })}
          className="h-4 w-4 rounded border-gray-300"
        />
        Pets on premise
      </label>

      {/* Contact preference */}
      <div className="mt-5">
        <label className="text-sm font-medium text-gray-600">Contact preference</label>
        <div className="mt-2 flex flex-wrap gap-3">
          {["Call", "Text", "Either"].map((label) => {
            const value = label.toLowerCase();
            const selected = formData.contactPreference[0] === value;
            return (
              <label key={value} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="radio"
                  name="contactPreference"
                  checked={selected}
                  onChange={() => onUpdate({ contactPreference: [value] })}
                  className="h-4 w-4 border-gray-300 text-blue-600"
                />
                {label}
              </label>
            );
          })}
        </div>
      </div>

      {/* Done */}
      <div className="mt-6">
        <button
          type="button"
          className="focus-ring rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          onClick={handleDone}
        >
          Done
        </button>
      </div>
    </div>
  );
}
