"use client";

import { useEffect, useRef, useState } from "react";
import type { PublicBookingWindow } from "@/lib/public-booking-facade";
import type { WizardFormData } from "./booking-wizard";
import styles from "./booking-wizard.module.css";

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

function joinClasses(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

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
  const autoDateRef = useRef(false);
  const autoWindowRef = useRef<string | null>(null);
  const timesBlockRef = useRef<HTMLDivElement | null>(null);

  const firstDay = new Date(viewYear, viewMonth, 1);
  const startDow = firstDay.getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const monthLabel = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(firstDay);
  const selectedDate = formData.selectedDate;
  const selectedWindows = selectedDate ? windowsByDate[selectedDate] || [] : [];
  const isLoadingSelectedDate = Boolean(selectedDate && loadingDate === selectedDate);
  const firstWindow = selectedWindows[0];
  const todayId = formatDateId(today.getFullYear(), today.getMonth(), today.getDate());

  useEffect(() => {
    if (selectedDate || autoDateRef.current) return;
    autoDateRef.current = true;
    onSelectDate(todayId);
  }, [onSelectDate, selectedDate, todayId]);

  useEffect(() => {
    if (!firstWindow || isLoadingSelectedDate || formData.selectedOfferId) return;
    const selectionKey = `${selectedDate}:${firstWindow.offerId}`;
    if (autoWindowRef.current === selectionKey) return;
    autoWindowRef.current = selectionKey;
    void onSelectWindow(firstWindow).then((reserved) => reserved && setDateError(null));
  }, [firstWindow, formData.selectedOfferId, isLoadingSelectedDate, onSelectWindow, selectedDate]);

  useEffect(() => {
    if (!selectedDate) return;
    const frame = requestAnimationFrame(() => timesBlockRef.current?.scrollIntoView({ block: "nearest" }));
    return () => cancelAnimationFrame(frame);
  }, [selectedDate, selectedWindows.length]);

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
    <div data-testid="booking-step-2">
      <h1 className={`${styles.heading} ${styles.scheduleHeading}`}>Choose an Appointment Time</h1>

      <div className={styles.calendarCard}>
        <div className={styles.calendarHeader}>
          <button
            type="button"
            aria-label="Previous month"
            className={styles.navButton}
            disabled={!canGoPrev}
            onClick={prevMonth}
          >
            &lsaquo;
          </button>
          <span className={styles.calendarTitle}>{monthLabel}</span>
          <button
            type="button"
            aria-label="Next month"
            className={styles.navButton}
            onClick={nextMonth}
          >
            &rsaquo;
          </button>
        </div>

        <div className={styles.calendarWeekdays} aria-hidden="true">
          {DAY_LABELS.map((day, index) => (
            <span key={`${day}-${index}`} className={styles.calendarWeekday}>
              {day}
            </span>
          ))}
        </div>

        <div className={styles.calendarGrid}>
          {cells.map((day, index) => {
            if (day === null) return <span className={styles.calendarBlank} key={`empty-${index}`} />;
            const dateId = formatDateId(viewYear, viewMonth, day);
            const past = isDayPast(day);
            const selected = selectedDate === dateId;
            return (
              <button
                key={dateId}
                type="button"
                aria-label={dateLabel(dateId)}
                aria-pressed={selected}
                disabled={past}
                className={joinClasses(styles.calendarDay, selected && styles.calendarDaySelected)}
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

      <div className={styles.timesBlock} ref={timesBlockRef}>
        <div className={styles.timesHeader}>
          <span className={styles.timesTitle}>
            {selectedDate ? `Available times for ${dateLabel(selectedDate)}` : "Select a date to see times"}
          </span>
          {selectedDate && (
            <button type="button" className={styles.refreshButton} onClick={onRefresh}>
              Refresh
            </button>
          )}
        </div>

        {isLoadingSelectedDate && (
          <div className={styles.slotsGrid} aria-label="Loading available times">
            <div className={styles.skeleton} />
            <div className={styles.skeleton} />
            <div className={styles.skeleton} />
            <div className={styles.skeleton} />
          </div>
        )}
        {searchError && (
          <p className={styles.errorMessage}>
            {searchError}
          </p>
        )}
        {holdError && (
          <p className={styles.errorMessage}>
            {holdError}
          </p>
        )}

        {!isLoadingSelectedDate && selectedDate && selectedWindows.length === 0 && !searchError && (
          <p className={styles.noDateState}>
            No online appointment times are available for this day. Try another day.
          </p>
        )}

        {!isLoadingSelectedDate && selectedWindows.length > 0 && (
          <div className={styles.slotsGrid}>
            {selectedWindows.map((window) => {
              const selected = formData.selectedOfferId === window.offerId;
              return (
                <button
                  key={window.offerId}
                  type="button"
                  aria-pressed={selected}
                  className={joinClasses(styles.timeSlot, selected && styles.timeSlotSelected)}
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
          <p className={styles.holdTimer}>
            This time is reserved for {formatCountdown(remainingSeconds)}.
          </p>
        )}
      </div>

      {dateError && (
        <p className={styles.errorMessage}>
          {dateError}
        </p>
      )}

      <div className={`${styles.buttonRow} ${styles.buttonRowSplit}`}>
        <button
          type="button"
          className={styles.secondaryButton}
          onClick={onBack}
        >
          &larr; Back
        </button>
        <button
          type="button"
          className={styles.primaryButton}
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
