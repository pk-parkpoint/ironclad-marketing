export type GuaranteeSection = {
  title: string;
  items: Array<{
    label: string;
    body: string;
  }>;
};

export const GUARANTEES_PAGE_INTRO =
  "Every plumbing company says they're trustworthy. We put ours in writing with consequences. These six guarantees apply to every residential plumbing job we do in the Austin metro area.";

export const GUARANTEES_PAGE_SECTIONS: GuaranteeSection[] = [
  {
    title: "No Service Visit Fees. Ever.",
    items: [
      {
        label: "What it means",
        body:
          "We do not charge a trip charge, dispatch fee, diagnostic fee, or service call fee. When our technician arrives, evaluates the problem, and presents a written estimate, that process costs you nothing. If you decide not to proceed, you owe us zero.",
      },
      {
        label: "Why we do this",
        body:
          "Service visit fees exist to recoup the cost of sending a truck to a home that does not convert into a paying job. We absorb that cost because the diagnostic should demonstrate competence, not create a sunk-cost pressure to say yes.",
      },
      {
        label: "The fine print",
        body:
          "This applies to standard residential service calls within our service area during normal business hours. After-hours emergency dispatch may carry a separate emergency response fee, which is disclosed before we dispatch.",
      },
    ],
  },
  {
    title: "One-Hour Callback or Your Project Is Free.",
    items: [
      {
        label: "What it means",
        body:
          "Contact Ironclad during business hours by phone, text, or online form and a real human will call you back within 60 minutes. Not an automated confirmation. Not a chatbot. A person from our team who can answer your question or schedule your service.",
      },
      {
        label: "The consequence",
        body:
          "If we fail to return your contact within 60 minutes during business hours, the labor on that project is free. We still charge for parts at cost because materials cannot be given away, but the labor is on us.",
      },
      {
        label: "Why we do this",
        body:
          "The number-one complaint homeowners have about plumbers is that they do not call back. We are putting money behind the promise that we will.",
      },
      {
        label: "The fine print",
        body:
          "The 60-minute clock starts when your call, text, or form submission is received during business hours. Messages received outside business hours start the clock at the next opening. It applies to first contact on a new service request and is limited to one free-project claim per household in a 12-month period.",
      },
    ],
  },
  {
    title: "Family-Member Advice.",
    items: [
      {
        label: "What it means",
        body:
          "We recommend what we would recommend to our own family. If a repair extends the useful life of a system by years at a fraction of replacement cost, we recommend the repair. If a unit is at end of life and repair only delays the inevitable, we say so. If the problem is minor and you can safely wait, we tell you that too.",
      },
      {
        label: "What this is not",
        body:
          "This is not a promise that we will always recommend the cheapest option. Sometimes the right answer for your home is the more expensive one. Family-member advice means honest advice, not cheap advice.",
      },
    ],
  },
  {
    title: "Quote-Locked Pricing.",
    items: [
      {
        label: "What it means",
        body:
          "The number on your written estimate is the number on your invoice. No add-ons. No surprise line items. No 'while I was in there' charges.",
      },
      {
        label: "If something changes",
        body:
          "If we discover a complication once work has started, we stop, explain what we found, and give you a revised written estimate with the new scope and price. You approve the revision or we button everything back up and charge only for the work completed at the original price.",
      },
      {
        label: "Why we do this",
        body:
          "One of the most common complaints in the industry is that the estimate was one number and the final bill was another. We do not treat estimates as opening negotiations.",
      },
    ],
  },
  {
    title: "Written Warranty on Every Job.",
    items: [
      {
        label: "What it means",
        body:
          "Every completed job includes a written warranty document specifying what is covered, how long coverage lasts, what is excluded, and how to make a claim. That document is part of your invoice package.",
      },
      {
        label: "Warranty terms by service type",
        body:
          "Warranty durations vary by service category and manufacturer terms. We spell out the exact coverage for repairs, fixture installs, water heaters, sewer work, and emergency repairs in writing at closeout.",
      },
      {
        label: "What warranty does not mean",
        body:
          "It does not mean vague language like 'we stand behind our work.' A warranty is a contractual commitment with specific terms. Ours is in writing because verbal warranties are worthless.",
      },
    ],
  },
  {
    title: "Lifetime Support.",
    items: [
      {
        label: "What it means",
        body:
          "If Ironclad performed work at your home, you can call us about that work in the future, even years after the warranty period, and we will advise you at no charge. If a system starts acting strangely, we will tell you whether it sounds urgent, what to watch for, and whether it needs attention.",
      },
      {
        label: "What this covers",
        body:
          "Phone, text, or email advice about work Ironclad previously performed at your address. It also covers help distinguishing whether a new symptom is related to prior work or a separate issue.",
      },
      {
        label: "What this does not cover",
        body:
          "It does not include free on-site service visits, work performed by other companies, or unrelated new diagnostic visits. Those are still new service calls, though still without a service visit fee.",
      },
    ],
  },
];
