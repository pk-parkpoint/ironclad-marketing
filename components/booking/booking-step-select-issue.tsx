"use client";

import { useRef, useState } from "react";
import type { WizardFormData } from "./booking-wizard";
import styles from "./booking-wizard.module.css";

const CATEGORIES = [
  {
    id: "leaks-blockages-sewer",
    label: "Leaks, Blockages, or Sewer",
    description: "Fix a leak, clear a drain, or address sewer and main line issues.",
  },
  {
    id: "installations-replacements",
    label: "Installations or Replacements",
    description: "Water heaters, fixtures, and other new installations.",
  },
  {
    id: "emergency",
    label: "Emergency Service",
    description: "Urgent plumbing issues that need immediate attention.",
    emergency: true,
  },
] as const;

const DETAIL_OPTIONS: Record<string, Array<{ id: string; label: string; description: string }>> = {
  "leaks-blockages-sewer": [
    { id: "fix-a-leak", label: "Fix a Leak", description: "Dripping faucets, pipe leaks, or water damage." },
    { id: "clear-a-blockage", label: "Clear a Blockage", description: "Slow drains, clogged toilets, or backed-up lines." },
    { id: "sewer-main-line", label: "Sewer / Main Line Service", description: "Sewer camera inspections, repairs, or replacements." },
    { id: "other-issue", label: "Other Issue", description: "Something else related to leaks or blockages." },
  ],
  "installations-replacements": [
    { id: "water-heater", label: "Water Heater", description: "Tank or tankless water heater install or replacement." },
    { id: "fixture", label: "Fixture (sink, toilet, etc.)", description: "Faucets, sinks, toilets, showers, or tubs." },
    { id: "other-installation", label: "Other Installation", description: "Something else that needs installing." },
  ],
};

export function getServiceIssueLabel(serviceCategory: string | null, serviceDetail: string | null): string {
  if (serviceDetail && serviceCategory) {
    const selectedDetail = DETAIL_OPTIONS[serviceCategory]?.find((detail) => detail.id === serviceDetail);
    if (selectedDetail) return selectedDetail.label;
  }

  if (serviceCategory) {
    const selectedCategory = CATEGORIES.find((category) => category.id === serviceCategory);
    if (selectedCategory) return selectedCategory.label;
  }

  return "Selected service";
}

const BEAT = 400;

type Props = {
  formData: WizardFormData;
  onUpdate: (updates: Partial<WizardFormData>) => void;
  onNext: () => void;
};

function RadioCircle({ selected }: { selected: boolean }) {
  return (
    <span className={`${styles.radioDot} ${selected ? styles.radioDotSelected : ""}`} aria-hidden="true">
      <span className={styles.radioDotInner} />
    </span>
  );
}

function initialSection(formData: WizardFormData): "category" | "detail" {
  if (formData.serviceCategory && formData.serviceCategory !== "emergency" && formData.serviceDetail) {
    return "detail";
  }
  return "category";
}

export function BookingStepSelectIssue({ formData, onUpdate, onNext }: Props) {
  const [section, setSection] = useState<"category" | "detail">(() => initialSection(formData));
  const [pickedCategory, setPickedCategory] = useState<string | null>(formData.serviceCategory);
  const [pickedDetail, setPickedDetail] = useState<string | null>(formData.serviceDetail);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const details = pickedCategory ? DETAIL_OPTIONS[pickedCategory] : null;

  function handleCategoryPick(catId: string, isEmergency: boolean) {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPickedCategory(catId);
    // Note: we intentionally do NOT pass `additionalNotes: ""` here. That field
    // is collected on step 4 (confirm_details). Marking it touched at step 1
    // would prevent the abandoned-lead builder from reporting it as
    // "Not Presented" when the customer leaves before reaching step 4.
    onUpdate({ serviceCategory: catId, serviceDetail: null });

    timerRef.current = setTimeout(() => {
      if (isEmergency) {
        onNext();
      } else {
        setSection("detail");
      }
    }, BEAT);
  }

  function handleDetailPick(detailId: string) {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPickedDetail(detailId);
    onUpdate({ serviceDetail: detailId });

    timerRef.current = setTimeout(() => onNext(), BEAT);
  }

  function handleBack() {
    setPickedCategory(null);
    setPickedDetail(null);
    setSection("category");
    onUpdate({ serviceCategory: null, serviceDetail: null });
  }

  // Section A — Pick a category
  if (section === "category") {
    return (
      <div data-testid="booking-step-1">
        <h1 className={styles.heading}>What do you need help with?</h1>
        <p className={styles.subcopy}>Select the option that best describes your situation.</p>

        <div className={styles.optionList}>
          {CATEGORIES.map((cat) => {
            const selected = pickedCategory === cat.id;
            const isEmergency = "emergency" in cat && cat.emergency;
            return (
              <button
                key={cat.id}
                type="button"
                className={`${styles.optionCard} ${selected ? styles.optionCardSelected : ""}`}
                onClick={() => handleCategoryPick(cat.id, !!isEmergency)}
              >
                <RadioCircle selected={selected} />
                <span className={styles.optionText}>
                  <span className={styles.optionTitle}>{cat.label}</span>
                  <span className={styles.optionDescription}>{cat.description}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Section B — Pick a detail
  const heading =
    pickedCategory === "leaks-blockages-sewer"
      ? "Can you tell us a bit more?"
      : "What needs installing or replacing?";
  return (
    <div data-testid="booking-step-1-detail">
      <h1 className={styles.heading}>{heading}</h1>
      <p className={styles.subcopy}>This helps us send the right technician.</p>

      <div className={styles.optionList}>
        {(details || []).map((detail) => {
          const selected = pickedDetail === detail.id;
          return (
            <button
              key={detail.id}
              type="button"
              className={`${styles.optionCard} ${selected ? styles.optionCardSelected : ""}`}
              onClick={() => handleDetailPick(detail.id)}
            >
              <RadioCircle selected={selected} />
              <span className={styles.optionText}>
                <span className={styles.optionTitle}>{detail.label}</span>
                <span className={styles.optionDescription}>{detail.description}</span>
              </span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        className={styles.ghostButton}
        onClick={handleBack}
      >
        &larr; Back
      </button>
    </div>
  );
}
