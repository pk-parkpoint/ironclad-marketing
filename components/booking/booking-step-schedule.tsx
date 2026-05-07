"use client";

import { useState } from "react";
import type { PublicBookingWindow } from "@/lib/public-booking-facade";
import type { WizardFormData } from "./booking-wizard";

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

type Props = {
  formData: WizardFormData;
  windowsByDate: Record<string, PublicBookingWindow[]>;
  loadingDate: string | null;
  searchError?: string | null;
  holdError?: string | null;
  remainingSeconds: number;
  onUpdate: (updates: Partial<WizardFormData>) => void;
  onSelectDate: (date: string) => void;
  onSelectWindow: (window: PublicBookingWindow) => Promise<boolean>;
  onRefresh: () => void;
  onBack: () => void;
  onNext: () => void;
};

function formatDateId(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function dateLabel(dateId: string): string {
  const date = new Date(`${dateId}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const label = new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    weekday: "long",
  }).format(date);
  if (date.getTime() === today.getTime()) return `Today, ${label}`;
  if (date.getTime() === tomorrow.getTime()) return `Tomorrow, ${label}`;
  return label;
}

function timeLabel(window: PublicBookingWindow): string {
  if (window.arrivalWindowLabel) return window.arrivalWindowLabel;
  const format = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" });
  return `${format.format(new Date(window.startTime))} - ${format.format(new Date(window.endTime))}`;
}

function formatCountdown(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainder = String(seconds % 60).padStart(2, "0");
  return `${minutes}:${remainder}`;
}

export function BookingStepSchedule({
  formData,
  windowsByDate,
  loadingDate,
  searchError,
  holdError,
  remainingSeconds,
  onSelectDate,
  onSelectWindow,
  onRefresh,
  onBack,
  onNext,
}: Props) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [dateError, setDateError] = useState<string | null>(null);

  const firstDay = new Date(viewYear, viewMonth, 1);
  const startDow = firstDay.getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const monthLabel = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(firstDay);
  const selectedDate = formData.selectedDate;
  const selectedWindows = selectedDate ? windowsByDate[selectedDate] || [] : [];
  const isLoadingSelectedDate = Boolean(selectedDate && loadingDate === selectedDate);
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

  function isDayPast(day: number): boolean {
    return new Date(viewYear, viewMonth, day) < today;
  }

  const cells: (number | null)[] = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day += 1) cells.push(day);

  return (
    <div className="flex-1 overflow-y-auto px-5 py-5">
      <h3 className="text-xl font-semibold text-ink">Choose an Appointment Time</h3>

      <div className="mt-4 rounded-xl border border-border p-4">
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

        <div className="mt-3 grid grid-cols-7 text-center text-xs font-semibold text-muted">
          {DAY_LABELS.map((day, index) => (
            <div key={`${day}-${index}`} className="py-1">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 text-center text-sm">
          {cells.map((day, index) => {
            if (day === null) return <div key={`empty-${index}`} />;
            const dateId = formatDateId(viewYear, viewMonth, day);
            const past = isDayPast(day);
            const selected = selectedDate === dateId;
            return (
              <button
                key={dateId}
                type="button"
                aria-label={dateLabel(dateId)}
                disabled={past}
                className={`mx-auto my-0.5 flex h-9 w-9 items-center justify-center rounded-full text-sm transition-colors ${
                  selected
                    ? "bg-cta-blue font-bold text-white"
                    : past
                      ? "cursor-not-allowed text-gray-300"
                      : "font-medium text-ink hover:bg-blue-50"
                }`}
                onClick={() => {
                  setDateError(null);
                  onSelectDate(dateId);
                }}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-ink">
            {selectedDate ? `Available times for ${dateLabel(selectedDate)}` : "Select a date to see times"}
          </p>
          {selectedDate && (
            <button type="button" className="text-sm font-semibold text-blue-600 hover:underline" onClick={onRefresh}>
              Refresh
            </button>
          )}
        </div>

        {isLoadingSelectedDate && <p className="mt-3 text-sm text-muted">Loading available appointment times...</p>}
        {searchError && (
          <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            {searchError}
          </p>
        )}
        {holdError && (
          <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            {holdError}
          </p>
        )}

        {!isLoadingSelectedDate && selectedDate && selectedWindows.length === 0 && !searchError && (
          <p className="mt-3 rounded-lg border border-border bg-soft-background px-3 py-3 text-sm text-muted">
            No online appointment times are available for this day. Try another day.
          </p>
        )}

        {selectedWindows.length > 0 && (
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {selectedWindows.map((window) => {
              const selected = formData.selectedOfferId === window.offerId;
              return (
                <button
                  key={window.offerId}
                  type="button"
                  className={`focus-ring rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-colors ${
                    selected
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-border text-ink hover:bg-soft-background"
                  }`}
                  onClick={async () => {
                    const reserved = await onSelectWindow(window);
                    if (reserved) setDateError(null);
                  }}
                >
                  {timeLabel(window)}
                </button>
              );
            })}
          </div>
        )}

        {formData.holdId && remainingSeconds > 0 && (
          <p className="mt-3 text-sm font-medium text-blue-700">
            This time is reserved for {formatCountdown(remainingSeconds)}.
          </p>
        )}
      </div>

      {dateError && (
        <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
          {dateError}
        </p>
      )}

      <div className="mt-5 flex items-center justify-between">
        <button
          type="button"
          className="focus-ring flex items-center gap-2 rounded-full border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          onClick={onBack}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Back
        </button>
        <button
          type="button"
          className="focus-ring rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          onClick={() => {
            if (!formData.holdId || !formData.selectedStartTime) {
              setDateError("Please choose an available appointment time.");
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
