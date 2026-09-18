"use client";

import { useEffect, useRef } from "react";
import { trackLeadSubmitSuccess } from "@/lib/analytics";
import { derivePageContext } from "@/lib/analytics-page-context";
import { trackGoogleAdsBookingConversion } from "@/lib/google-ads-conversions";
import type { BookingConfirmation, WizardFormData } from "./booking-wizard";
import { getServiceIssueLabel } from "./booking-step-select-issue";
import styles from "./booking-wizard.module.css";

type Props = {
  formData: WizardFormData;
  onUpdate: (updates: Partial<WizardFormData>) => void;
  bookingId?: string;
  confirmation?: BookingConfirmation | null;
  isSubmitting: boolean;
  submitError?: string;
  onBack: () => void;
  onConfirm: () => void;
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
  const [year, month, day] = iso.split("-").map((part) => Number.parseInt(part, 10));
  if (!year || !month || !day) return iso;
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function PillToggle({
  options,
  value,
  onChange,
}: {
  options: Array<{ id: string; label: string }>;
  value: string | null;
  onChange: (id: string) => void;
}) {
  return (
    <div className={styles.chipRow}>
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          aria-pressed={value === option.id}
          className={`${styles.chip} ${value === option.id ? styles.chipSelected : ""}`}
          onClick={() => onChange(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function SummaryCard({ rows }: { rows: Array<[string, string]> }) {
  return (
    <div className={styles.summaryCard}>
      <dl>
        {rows.map(([label, value], index) => (
          <div
            className={`${styles.summaryRow} ${index === rows.length - 1 ? styles.summaryRowLast : ""}`}
            key={label}
          >
            <dt className={styles.summaryLabel}>{label}</dt>
            <dd className={styles.summaryValue}>{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function BookingStepConfirm({
  formData,
  onUpdate,
  bookingId,
  confirmation,
  isSubmitting,
  submitError,
  onBack,
  onConfirm,
  onClose,
  onDismiss,
}: Props) {
  const hasTrackedSuccessRef = useRef(false);
  const displayBookingId = confirmation?.bookingId || bookingId;
  const issueLabel = getServiceIssueLabel(formData.serviceCategory, formData.serviceDetail);
  const dateLabel = formatDateLabel(formData.selectedDate);
  const windowLabel =
    formData.selectedWindowLabel || TIME_LABELS[formData.timeOfDay || ""] || formData.timeOfDay || "Flexible";

  useEffect(() => {
    if (!displayBookingId || hasTrackedSuccessRef.current || typeof window === "undefined") return;
    const pageContext = derivePageContext(window.location.pathname);
    hasTrackedSuccessRef.current = true;
    trackGoogleAdsBookingConversion(displayBookingId);
    trackLeadSubmitSuccess({
      city: pageContext.city,
      formType: "booking_wizard",
      service: formData.serviceDetail || formData.serviceCategory || "",
    });
    onClose();
    // onClose is guarded by hasTrackedSuccessRef and intentionally fires with conversion tracking.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayBookingId, formData.serviceCategory, formData.serviceDetail]);

  if (displayBookingId) {
    const confirmationNumber = confirmation?.confirmationNumber || displayBookingId;
    return (
      <div className={styles.confirmStack} data-testid="booking-confirmation">
        <div className={styles.confirmationBanner}>
          <div className={styles.checkBadge}>✓</div>
          <h1 className={styles.confirmationTitle}>Your appointment is confirmed!</h1>
        </div>
        <SummaryCard rows={[
          ["Confirmation", confirmationNumber],
          ["Issue", issueLabel],
          ["Date", dateLabel],
          ["Arrival window", windowLabel],
        ]} />
        <button type="button" className={`${styles.primaryButton} ${styles.primaryButtonLarge}`} onClick={onDismiss}>
          Done
        </button>
      </div>
    );
  }

  const contactName = `${formData.firstName} ${formData.lastName}`.trim();
  const reviewRows: Array<[string, string]> = [
    ["Issue", issueLabel],
    ["Date", dateLabel],
    ["Arrival window", windowLabel],
    ["Name", contactName],
    ["Phone", formData.phone],
    ["Service address", formData.addressFormatted],
  ];
  if (formData.email) reviewRows.push(["Email", formData.email]);

  return (
    <div className={styles.confirmStack} data-testid="booking-step-4">
      <h1 className={styles.heading}>Confirm your appointment details</h1>
      <p className={styles.subcopy}>Review everything below before booking your appointment.</p>
      <SummaryCard rows={reviewRows} />
      <p className={styles.helperLine}>These fields are optional but help our technician prepare for your visit.</p>
      <div className={styles.optionalGroup}>
        <div>
          <label className={styles.optionalLabel} htmlFor="booking-notes">Anything else we should know before arrival?</label>
          <textarea
            id="booking-notes"
            className={`${styles.fieldControl} ${styles.textarea}`}
            rows={3}
            onChange={(event) => onUpdate({ additionalNotes: event.target.value })}
            placeholder="Special access instructions, details about the issue, etc."
            value={formData.additionalNotes}
          />
        </div>
        <div>
          <p className={styles.groupLabel}>Property type</p>
          <PillToggle
            options={[{ id: "residential", label: "Residential" }, { id: "commercial", label: "Commercial" }]}
            value={formData.propertyType}
            onChange={(id) => onUpdate({ propertyType: id as "residential" | "commercial" })}
          />
        </div>
        <div>
          <p className={styles.groupLabel}>Ownership</p>
          <PillToggle
            options={[{ id: "own", label: "I own this property" }, { id: "other", label: "Someone else owns" }]}
            value={formData.ownershipStatus}
            onChange={(id) => onUpdate({ ownershipStatus: id as "own" | "other" })}
          />
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel} htmlFor="booking-gate-code">Gate code(s)</label>
          <input
            id="booking-gate-code"
            className={styles.fieldControl}
            type="text"
            value={formData.gateCode}
            onChange={(event) => onUpdate({ gateCode: event.target.value })}
            placeholder="Enter gate code(s) if applicable"
          />
        </div>
        <label className={styles.checkboxRow}>
          <input
            type="checkbox"
            checked={formData.petsOnPremise}
            onChange={(event) => onUpdate({ petsOnPremise: event.target.checked })}
            className="h-4 w-4 rounded border-gray-300"
          />
          <span className={styles.checkboxCaption}>Pets on premise</span>
        </label>
        <div>
          <p className={styles.groupLabel}>Contact preference</p>
          <div className={styles.radioRow}>
            {["Call", "Text", "Either"].map((label) => {
              const value = label.toLowerCase();
              return (
                <label key={value} className={styles.radioChoice}>
                  <input
                    type="radio"
                    name="contactPreference"
                    checked={formData.contactPreference[0] === value}
                    onChange={() => onUpdate({ contactPreference: [value] })}
                    className="h-4 w-4 border-gray-300 text-blue-600"
                  />
                  {label}
                </label>
              );
            })}
          </div>
        </div>
        {submitError && <p className={styles.errorMessage}>{submitError}</p>}
        <div className={`${styles.buttonRow} ${styles.buttonRowSplit}`}>
          <button type="button" className={styles.secondaryButton} onClick={onBack} disabled={isSubmitting}>
            Back
          </button>
          <button type="button" className={styles.primaryButton} onClick={onConfirm} disabled={isSubmitting}>
            {isSubmitting ? "Confirming..." : "Confirm Appointment"}
          </button>
        </div>
      </div>
    </div>
  );
}
