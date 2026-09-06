import styles from "./booking-wizard.module.css";

const STEPS = [
  { number: 1, label: "Select Issue" },
  { number: 2, label: "Contact Info" },
  { number: 3, label: "Schedule Time" },
  { number: 4, label: "Confirm Details" },
];

function joinClasses(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function StepProgress({
  currentStep,
  onGoToStep,
}: {
  currentStep: number;
  onGoToStep: (step: number) => void;
}) {
  const completedSegments = Math.max(0, Math.min(currentStep - 1, STEPS.length - 1));
  const segmentPositionClasses = [
    styles.progressSegmentOne,
    styles.progressSegmentTwo,
    styles.progressSegmentThree,
  ];

  return (
    <div className={styles.progress} aria-label={`Step ${currentStep} of 4`}>
      <div className={styles.progressTrack} aria-hidden="true">
        {segmentPositionClasses.map((segmentClass, index) => (
          <span
            className={joinClasses(
              styles.progressSegment,
              segmentClass,
              index < completedSegments && styles.progressSegmentComplete,
            )}
            key={segmentClass}
          >
            <span className={styles.progressSegmentFill} />
          </span>
        ))}
      </div>
      <div className={styles.progressNodes}>
        {STEPS.map((step) => {
          const isDone = step.number < currentStep;
          const isActive = step.number === currentStep;

          return (
            <div className={styles.progressNodeColumn} key={step.number}>
              <button
                type="button"
                className={joinClasses(styles.stepNode, isDone && styles.stepNodeDone, isActive && styles.stepNodeActive)}
                aria-label={isDone ? `Return to ${step.label}` : step.label}
                disabled={!isDone}
                onClick={() => isDone && onGoToStep(step.number)}
              >
                {isDone ? "✓" : step.number}
              </button>
              <span
                className={joinClasses(styles.stepLabel, isDone && styles.stepLabelDone, isActive && styles.stepLabelActive)}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
