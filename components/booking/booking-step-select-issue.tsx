"use client";

import { useRef, useState } from "react";
import type { WizardFormData } from "./booking-wizard";

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

const BEAT = 400;

type Props = {
  formData: WizardFormData;
  onUpdate: (updates: Partial<WizardFormData>) => void;
  onNext: () => void;
};

function RadioCircle({ selected }: { selected: boolean }) {
  return (
    <div
      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-150 ${
        selected ? "border-blue-600 bg-blue-600" : "border-gray-300"
      }`}
    >
      {selected && <div className="h-2 w-2 rounded-full bg-white" />}
    </div>
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
    onUpdate({ serviceCategory: catId, serviceDetail: null, additionalNotes: "" });

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
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <h3 className="text-2xl font-semibold text-gray-900">What do you need help with?</h3>
        <p className="mt-1 text-sm text-gray-500">Select the option that best describes your situation.</p>

        <div className="mt-6 space-y-3">
          {CATEGORIES.map((cat) => {
            const selected = pickedCategory === cat.id;
            const isEmergency = "emergency" in cat && cat.emergency;
            return (
              <button
                key={cat.id}
                type="button"
                className={`focus-ring flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-all duration-150 ${
                  selected
                    ? "border-blue-600 bg-blue-50/50"
                    : "border-gray-200 bg-white hover:border-gray-400"
                }`}
                onClick={() => handleCategoryPick(cat.id, !!isEmergency)}
              >
                <RadioCircle selected={selected} />
                <div>
                  <span className="text-sm font-semibold text-gray-900">{cat.label}</span>
                  <p className="mt-0.5 text-sm text-gray-500">{cat.description}</p>
                </div>
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
    <div className="flex-1 overflow-y-auto px-8 py-6">
      <h3 className="text-2xl font-semibold text-gray-900">{heading}</h3>
      <p className="mt-1 text-sm text-gray-500">This helps us send the right technician.</p>

      <div className="mt-6 space-y-3">
        {(details || []).map((detail) => {
          const selected = pickedDetail === detail.id;
          return (
            <button
              key={detail.id}
              type="button"
              className={`focus-ring flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-all duration-150 ${
                selected
                  ? "border-blue-600 bg-blue-50/50"
                  : "border-gray-200 bg-white hover:border-gray-400"
              }`}
              onClick={() => handleDetailPick(detail.id)}
            >
              <RadioCircle selected={selected} />
              <div>
                <span className="text-sm font-semibold text-gray-900">{detail.label}</span>
                <p className="mt-0.5 text-sm text-gray-500">{detail.description}</p>
              </div>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        className="mt-5 text-sm font-medium text-gray-500 hover:text-gray-700"
        onClick={handleBack}
      >
        &larr; Back
      </button>
    </div>
  );
}
