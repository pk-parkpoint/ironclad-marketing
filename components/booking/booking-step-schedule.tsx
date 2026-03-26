"use client";

import { useState } from "react";
import type { WizardFormData } from "./booking-wizard";

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

const TIME_OPTIONS = [
  { id: "morning", label: "Morning" },
  { id: "afternoon", label: "Afternoon" },
  { id: "flexible", label: "Flexible" },
];

type Props = {
  formData: WizardFormData;
  onUpdate: (updates: Partial<WizardFormData>) => void;
  onBack: () => void;
  onNext: () => void;
};

export function BookingStepSchedule({ formData, onUpdate, onBack, onNext }: Props) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [dateError, setDateError] = useState<string | null>(null);

  const firstDay = new Date(viewYear, viewMonth, 1);
  const startDow = firstDay.getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const monthLabel = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(firstDay);

  const canGoPrev =
    viewYear > today.getFullYear() || (viewYear === today.getFullYear() && viewMonth > today.getMonth());

  function prevMonth() {
    if (!canGoPrev) return;
    if (viewMonth === 0) {
      setViewYear(viewYear - 1);
      setViewMonth(11);
    } else {
      setViewMonth(viewMonth - 1);
    }
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewYear(viewYear + 1);
      setViewMonth(0);
    } else {
      setViewMonth(viewMonth + 1);
    }
  }

  function formatDateId(day: number): string {
    return `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  function isDayPast(day: number): boolean {
    return new Date(viewYear, viewMonth, day) < today;
  }

  const cells: (number | null)[] = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="flex-1 overflow-y-auto px-5 py-5">
      <h3 className="text-xl font-semibold text-ink">Choose a Day for Your Appointment</h3>

      {/* Calendar */}
      <div className="mt-4 rounded-xl border border-border p-4">
        {/* Month header */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            aria-label="Previous month"
            className={`focus-ring inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-ink ${
              !canGoPrev ? "cursor-not-allowed opacity-30" : "hover:bg-soft-background"
            }`}
            disabled={!canGoPrev}
            onClick={prevMonth}
          >
            &lsaquo;
          </button>
          <span className="text-sm font-semibold text-ink">{monthLabel}</span>
          <button
            type="button"
            aria-label="Next month"
            className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-ink hover:bg-soft-background"
            onClick={nextMonth}
          >
            &rsaquo;
          </button>
        </div>

        {/* Day-of-week headers */}
        <div className="mt-3 grid grid-cols-7 text-center text-xs font-semibold text-muted">
          {DAY_LABELS.map((d, i) => (
            <div key={i} className="py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 text-center text-sm">
          {cells.map((day, i) => {
            if (day === null) return <div key={`empty-${i}`} />;
            const dateId = formatDateId(day);
            const past = isDayPast(day);
            const selected = formData.selectedDate === dateId;
            return (
              <button
                key={dateId}
                type="button"
                disabled={past}
                className={`mx-auto my-0.5 flex h-9 w-9 items-center justify-center rounded-full text-sm transition-colors ${
                  selected
                    ? "bg-cta-blue font-bold text-white"
                    : past
                      ? "cursor-not-allowed text-gray-300"
                      : "font-medium text-ink hover:bg-blue-50"
                }`}
                onClick={() => { onUpdate({ selectedDate: dateId }); setDateError(null); }}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {/* Time of day */}
      <div className="mt-6 flex flex-col items-center">
        <p className="text-center text-sm font-semibold text-ink">Preferred time of day</p>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {TIME_OPTIONS.map((opt) => {
            const selected = formData.timeOfDay === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                className={`focus-ring min-h-11 rounded-full border px-4 text-sm font-semibold transition-colors ${
                  selected
                    ? "border-cta-blue bg-blue-50 text-cta-blue"
                    : "border-border text-ink hover:bg-soft-background"
                }`}
                onClick={() => onUpdate({ timeOfDay: opt.id })}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Validation error */}
      {dateError && (
        <p className="mt-3 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-600">
          {dateError}
        </p>
      )}

      {/* Navigation */}
      <div className="mt-6 flex items-center justify-between gap-3">
        <button
          type="button"
          className="focus-ring rounded-full border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          onClick={onBack}
        >
          Back
        </button>
        <button
          type="button"
          className="focus-ring rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          onClick={() => {
            if (!formData.selectedDate) {
              setDateError("Please select a date for your appointment.");
              return;
            }
            setDateError(null);
            onNext();
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
