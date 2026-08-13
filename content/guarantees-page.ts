export type GuaranteeSection = {
  title: string;
  items: Array<{
    label: string;
    body: string;
  }>;
};

export const GUARANTEES_PAGE_INTRO =
  "Four clear promises guide every Ironclad job: fix it right, price it upfront, communicate about timing, and put the warranty in writing.";

export const GUARANTEES_PAGE_SECTIONS: GuaranteeSection[] = [
  {
    title: "Fixed Right the First Time.",
    items: [
      {
        label: "What it means",
        body:
          "We diagnose the problem, explain the approved repair, complete the work, and test it before we leave.",
      },
      {
        label: "If you have a concern",
        body:
          "If a covered workmanship issue comes back within the written warranty term, contact us so we can review it and arrange the appropriate next step.",
      },
    ],
  },
  {
    title: "Upfront Pricing, No Surprises.",
    items: [
      {
        label: "What it means",
        body:
          "You see the scope and price before work begins, and nothing moves forward until you approve them.",
      },
      {
        label: "If the scope changes",
        body:
          "We stop, explain what changed, and present any additional scope and price for your approval before that work continues.",
      },
    ],
  },
  {
    title: "On Time or We Call Ahead.",
    items: [
      {
        label: "What it means",
        body:
          "We provide an arrival window and keep you informed so you know when to expect your plumber.",
      },
      {
        label: "If timing changes",
        body:
          "We call ahead with an update rather than leave you wondering when the technician will arrive.",
      },
    ],
  },
  {
    title: "Written Warranty on Every Job.",
    items: [
      {
        label: "What it means",
        body:
          "Your completed job includes written warranty terms explaining what is covered, how long coverage lasts, any exclusions, and how to contact us.",
      },
      {
        label: "Job-specific coverage",
        body:
          "Coverage varies by the work performed, the parts involved, and any manufacturer terms. The written document for your job is the source of truth.",
      },
    ],
  },
];
