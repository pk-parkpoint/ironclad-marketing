"use client";
import { useState, type RefObject, type KeyboardEvent as ReactKeyboardEvent } from "react";
import Image from "next/image";
import type { WizardFormData, BookingConfirmation } from "./booking-wizard-state";
import type { usePublicBookingFacade } from "./use-public-booking-facade";
import type { PublicBookingWindow } from "@/lib/public-booking-facade";
import { BookingStepSelectIssue } from "./booking-step-select-issue";
import { BookingStepSchedule } from "./booking-step-schedule";
import { BookingStepContact } from "./booking-step-contact";
import { BookingStepConfirm } from "./booking-step-confirm";
import { StepProgress } from "./booking-step-progress";
import styles from "./booking-wizard.module.css";

function joinClasses(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

type Props = {
  model: {
    currentStep: number; direction: "forward" | "back"; formData: WizardFormData;
    isSubmitting: boolean; submitError?: string; bookingId?: string;
    confirmation: BookingConfirmation | null; bookingFacade: ReturnType<typeof usePublicBookingFacade>;
    updateFormData: (updates: Partial<WizardFormData>) => void;
    moveToStep: (step: number) => void; selectDate: (date: string) => void;
    selectWindow: (window: PublicBookingWindow) => Promise<boolean>;
    refreshSelectedDate: () => void; handleSubmit: () => Promise<boolean>;
    handleDismiss: () => void; sendCompletedNotification: () => Promise<void>;
    handleDialogKeyDown: (event: ReactKeyboardEvent<HTMLDivElement>) => void;
    onOpenChange: (open: boolean) => void;
  };
  modalRef: RefObject<HTMLDivElement | null>; bodyRef: RefObject<HTMLDivElement | null>;
  closeButtonRef: RefObject<HTMLButtonElement | null>;
};
export function BookingWizardView({ model, modalRef, bodyRef, closeButtonRef }: Props) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const { currentStep, direction, formData, isSubmitting, submitError, bookingId, confirmation,
    bookingFacade, updateFormData, moveToStep, selectDate, selectWindow, refreshSelectedDate,
    handleSubmit, handleDismiss, sendCompletedNotification, handleDialogKeyDown, onOpenChange } = model;
  return (
    <div
      ref={modalRef}
      autoFocus
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-wizard-title"
      aria-describedby="booking-modal-description"
      className={styles.page}
      data-theme={theme}
      onKeyDown={handleDialogKeyDown}
      tabIndex={-1}
    >
      <div className={styles.blobA} aria-hidden="true" />
      <div className={styles.blobB} aria-hidden="true" />
      <div className={styles.stack}>
        <div className={styles.brandHeader}>
          <div className={styles.brandMarkRow}>
            <Image
              className={styles.brandMark}
              src="/ironclad-booking/ironclad-mark.png"
              alt=""
              width={66}
              height={66}
              priority
            />
            <div className={styles.wordmark} aria-label="Ironclad Plumbing">
              <span>IRONCLAD</span>
              <span>PLUMBING</span>
            </div>
          </div>
          <div className={styles.trustBar} aria-label="Ironclad Plumbing trust signals">
            <span className={styles.trustTrack}>
              <span className={styles.trustGroup}>
                <span>
                  <span className={styles.trustStars}>★★★★★</span>{" "}
                  <span className={styles.trustStrong}>4.9/5</span> · 142 Google, Yelp, and Nextdoor reviews
                </span>
                <span className={styles.trustBullet}>•</span>
                <span className={styles.trustItem}>Locally Owned</span>
                <span className={styles.trustBullet}>•</span>
                <span className={styles.trustItem}>Licensed &amp; Insured</span>
              </span>
              <span className={`${styles.trustGroup} ${styles.trustGroupDuplicate}`} aria-hidden="true">
                <span>
                  <span className={styles.trustStars}>★★★★★</span>{" "}
                  <span className={styles.trustStrong}>4.9/5</span> · 142 Google, Yelp, and Nextdoor reviews
                </span>
                <span className={styles.trustBullet}>•</span>
                <span className={styles.trustItem}>Locally Owned</span>
                <span className={styles.trustBullet}>•</span>
                <span className={styles.trustItem}>Licensed &amp; Insured</span>
              </span>
            </span>
          </div>
        </div>
        <section className={styles.frame} aria-label="Booking wizard">
          <div className={styles.panel}>
            <header className={styles.header}>
              <button
                ref={closeButtonRef}
                aria-label="Close booking modal"
                className={styles.closeButton}
                onClick={handleDismiss}
                type="button"
              >
                ×
              </button>
              <h2 className="sr-only" id="booking-wizard-title">
                Request an Appointment
              </h2>
              <StepProgress currentStep={currentStep} onGoToStep={moveToStep} />
            </header>
            <p className="sr-only" id="booking-modal-description">
              Booking request dialog. Press Escape to close.
            </p>
            <p aria-live="polite" className="sr-only">
              {`Step ${currentStep} of 4.`}
            </p>

            <div className={styles.body} ref={bodyRef}>
              <div
                key={currentStep}
                className={joinClasses(styles.stepContent, direction === "back" && styles.stepContentBack)}
              >
                {currentStep === 1 && (
                  <BookingStepSelectIssue formData={formData} onUpdate={updateFormData} onNext={() => moveToStep(2)} />
                )}
                {currentStep === 2 && (
                  <BookingStepContact
                    formData={formData}
                    onUpdate={updateFormData}
                    onBack={() => moveToStep(1)}
                    onNext={() => moveToStep(3)}
                  />
                )}
                {currentStep === 3 && (
                  <BookingStepSchedule
                    formData={formData}
                    windowsByDate={bookingFacade.windowsByDate}
                    loadingDate={bookingFacade.loadingDate}
                    searchError={bookingFacade.searchError}
                    holdError={bookingFacade.holdError}
                    holdingOfferId={bookingFacade.holdingOfferId}
                    remainingSeconds={bookingFacade.remainingSeconds}
                    isSubmitting={isSubmitting}
                    submitError={submitError || bookingFacade.bookError || undefined}
                    onUpdate={updateFormData}
                    onSelectDate={selectDate}
                    onSelectWindow={selectWindow}
                    onRefresh={refreshSelectedDate}
                    onBack={() => moveToStep(2)}
                    onNext={() => {
                      void handleSubmit().then((ok) => {
                        if (ok) moveToStep(4);
                      });
                    }}
                  />
                )}
                {currentStep === 4 && (
                  <BookingStepConfirm
                    formData={formData}
                    onUpdate={updateFormData}
                    bookingId={bookingId}
                    confirmation={confirmation}
                    onDismiss={() => onOpenChange(false)}
                    onClose={() => { void sendCompletedNotification(); }}
                  />
                )}
              </div>
            </div>
          </div>
        </section>
        <div className={styles.themeToggle} aria-label="Booking wizard theme">
          {(["light", "dark"] as const).map((mode) => (
            <button
              aria-pressed={theme === mode}
              className={joinClasses(styles.themeToggleButton, theme === mode && styles.themeToggleButtonActive)}
              key={mode}
              onClick={() => setTheme(mode)}
              type="button"
            >
              {mode === "light" ? "Light Mode" : "Dark Mode"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
