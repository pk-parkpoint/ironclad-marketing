"use client";

import { useEffect, useRef, useState } from "react";
import { trackLeadSubmitSuccess } from "@/lib/analytics";
import { derivePageContext } from "@/lib/analytics-page-context";
import type { BookingConfirmation, WizardFormData } from "./booking-wizard";
import { getServiceIssueLabel } from "./booking-step-select-issue";
import styles from "./booking-wizard.module.css";

type Props = {
  formData: WizardFormData;
  onUpdate: (updates: Partial<WizardFormData>) => void;
  bookingId?: string;
  confirmation?: BookingConfirmation | null;
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
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className={styles.chipRow}>
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          className={`${styles.chip} ${value === opt.id ? styles.chipSelected : ""}`}
          onClick={() => onChange(opt.id)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export function BookingStepConfirm({
  formData,
  onUpdate,
  bookingId,
  confirmation,
  onClose,
  onDismiss,
}: Props) {
  const [showFarewell, setShowFarewell] = useState(false);
  const hasTrackedSuccessRef = useRef(false);
  const displayBookingId = confirmation?.bookingId || bookingId;
  const confirmationNumber = confirmation?.confirmationNumber || "CNF-20260707-IRON";
  const issueLabel = getServiceIssueLabel(formData.serviceCategory, formData.serviceDetail);
  const dateLabel = formatDateLabel(formData.selectedDate);
  const windowLabel =
    formData.selectedWindowLabel || TIME_LABELS[formData.timeOfDay || ""] || formData.timeOfDay || "Flexible";

  useEffect(() => {
    if (!displayBookingId || hasTrackedSuccessRef.current || typeof window === "undefined") {
      return;
    }

    const pageContext = derivePageContext(window.location.pathname);
    hasTrackedSuccessRef.current = true;
    trackLeadSubmitSuccess({
      city: pageContext.city,
      formType: "booking_wizard",
      service: formData.serviceDetail || formData.serviceCategory || "",
    });
  }, [displayBookingId, formData.serviceCategory, formData.serviceDetail]);

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
    return (
      <div className={styles.farewell}>
        <div className={styles.checkBadge}>✓</div>
        <h1 className={styles.farewellTitle}>
          Thank you for trusting Ironclad Plumbing
        </h1>
        <p className={styles.farewellCopy}>
          Your <strong>{windowLabel}</strong> appointment on{" "}
          <strong>{dateLabel}</strong> is confirmed.
          Please feel free to contact us at any time with further questions. Our team will be in touch.
        </p>
        <p className={styles.farewellFootnote}>This window will close automatically.</p>
      </div>
    );
  }

  return (
    <div className={styles.confirmStack} data-testid="booking-step-4">
      {/* Confirmation banner */}
      <div className={styles.confirmationBanner}>
        <div className={styles.checkBadge}>✓</div>
        <h1 className={styles.confirmationTitle}>Your appointment is confirmed!</h1>
      </div>

      <div className={styles.summaryCard}>
        <dl>
          {[
            ["Confirmation", confirmationNumber],
            ["Issue", issueLabel],
            ["Date", dateLabel],
            ["Arrival window", windowLabel],
          ].map(([label, value], index, rows) => (
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

      {/* Optional extras */}
      <p className={styles.helperLine}>
        These fields are optional but help our technician prepare for your visit.
      </p>

      {/* Additional notes */}
      <div className={styles.optionalGroup}>
      <div>
        <label className={styles.optionalLabel} htmlFor="booking-notes">Anything we should know before arrival?</label>
        <textarea
          id="booking-notes"
          className={`${styles.fieldControl} ${styles.textarea}`}
          rows={3}
          onChange={(e) => onUpdate({ additionalNotes: e.target.value })}
          placeholder="Special access instructions, details about the issue, etc."
          value={formData.additionalNotes}
        />
      </div>

      {/* Property type */}
      <div>
        <p className={styles.groupLabel}>Property type</p>
        <div>
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
      <div>
        <p className={styles.groupLabel}>Ownership</p>
        <div>
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
      <div className={styles.fieldGroup}>
        <label className={styles.fieldLabel} htmlFor="booking-gate-code">Gate code(s)</label>
        <input
          id="booking-gate-code"
          className={styles.fieldControl}
          type="text"
          value={formData.gateCode}
          onChange={(e) => onUpdate({ gateCode: e.target.value })}
          placeholder="Enter gate code(s) if applicable"
        />
      </div>

      {/* Pets */}
      <label className={styles.checkboxRow}>
        <input
          type="checkbox"
          checked={formData.petsOnPremise}
          onChange={(e) => onUpdate({ petsOnPremise: e.target.checked })}
          className="h-4 w-4 rounded border-gray-300"
        />
        <span className={styles.checkboxCaption}>Pets on premise</span>
      </label>

      {/* Contact preference */}
      <div>
        <p className={styles.groupLabel}>Contact preference</p>
        <div className={styles.radioRow}>
          {["Call", "Text", "Either"].map((label) => {
            const value = label.toLowerCase();
            const selected = formData.contactPreference[0] === value;
            return (
              <label key={value} className={styles.radioChoice}>
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
        <button
          type="button"
          className={`${styles.primaryButton} ${styles.primaryButtonLarge}`}
          onClick={handleDone}
        >
          Submit Additional Details
        </button>
      </div>
    </div>
  );
}
