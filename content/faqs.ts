export type FaqCategoryId =
  | "general"
  | "pricing"
  | "scheduling"
  | "water-heaters"
  | "drains-sewers"
  | "leaks"
  | "water-quality"
  | "emergency";

export type FaqEntry = {
  category: FaqCategoryId;
  question: string;
  answer: string;
};

export const FAQ_CATEGORIES: Array<{ id: FaqCategoryId; label: string }> = [
  { id: "general", label: "General" },
  { id: "pricing", label: "Pricing & Payment" },
  { id: "scheduling", label: "Scheduling" },
  { id: "water-heaters", label: "Water Heaters" },
  { id: "drains-sewers", label: "Drains & Sewers" },
  { id: "leaks", label: "Leaks" },
  { id: "water-quality", label: "Water Quality" },
  { id: "emergency", label: "Emergency" },
];

export const FAQ_ENTRIES: FaqEntry[] = [
  {
    category: "general",
    question: "What areas do you serve?",
    answer:
      "We serve Austin and 19+ surrounding communities across Travis, Williamson, and Hays counties. See our full service area list at /service-area.",
  },
  {
    category: "general",
    question: "Are you licensed and insured?",
    answer:
      "Yes. We're licensed by the Texas State Board of Plumbing Examiners (TX #XXXXX) and carry general liability and workers' compensation insurance. Details at /licenses.",
  },
  {
    category: "general",
    question: "Do you do commercial plumbing?",
    answer: "Yes. We serve both residential and commercial properties across Greater Austin.",
  },
  {
    category: "pricing",
    question: "How much does a plumber cost in Austin?",
    answer:
      "It depends on the job. We always provide a written estimate before starting, so you know the exact cost upfront. Simple repairs typically start around $150–$250; larger projects are quoted individually.",
  },
  {
    category: "pricing",
    question: "Do you charge a trip fee or diagnostic fee?",
    answer:
      "We charge a diagnostic fee that covers the visit, evaluation, and written estimate. If you approve the work, the fee is typically applied to the job cost.",
  },
  {
    category: "pricing",
    question: "What payment methods do you accept?",
    answer:
      "We accept credit cards, debit cards, checks, and financing for qualifying projects at /financing.",
  },
  {
    category: "pricing",
    question: "Do you offer financing?",
    answer:
      "Yes, for larger projects like water heater replacement, sewer repair, and repiping. Learn more at /financing.",
  },
  {
    category: "scheduling",
    question: "Can I book online?",
    answer: "Yes. You can book in under 60 seconds at /book. You can also call or text us.",
  },
  {
    category: "scheduling",
    question: "Do you offer same-day service?",
    answer:
      "In most cases, yes. Same-day availability depends on demand, but we prioritize getting to you quickly.",
  },
  {
    category: "scheduling",
    question: "What are your hours?",
    answer:
      "Emergency service is available 24/7 at /plumbing/emergency. Standard business hours are TBD.",
  },
  {
    category: "water-heaters",
    question: "How long does a water heater last?",
    answer:
      "Tank heaters typically last 8–12 years. In Austin, hard water can shorten this to the lower end. Tankless units last 20+ years with annual maintenance. More at /plumbing/water-heaters.",
  },
  {
    category: "water-heaters",
    question: "Should I go tankless?",
    answer:
      "It depends on your home, budget, and hot water demand. We'll give you an honest comparison. More at /plumbing/tankless-water-heaters.",
  },
  {
    category: "water-heaters",
    question: "How often should I flush my water heater?",
    answer:
      "Annually, especially in Austin. Hard water creates sediment buildup that reduces efficiency and shortens tank life.",
  },
  {
    category: "drains-sewers",
    question: "Why does my drain keep clogging?",
    answer:
      "Recurring clogs usually indicate a deeper issue: root intrusion, pipe damage, or buildup inside the line. A camera inspection can identify the cause. More at /plumbing/drain-cleaning.",
  },
  {
    category: "drains-sewers",
    question: "How do I know if I have a sewer line problem?",
    answer:
      "Multiple slow drains, sewage odor, wet spots in the yard, or gurgling toilets are common signs. More at /plumbing/sewer-services.",
  },
  {
    category: "leaks",
    question: "How do I know if I have a slab leak?",
    answer:
      "Water bill spikes, warm spots on floors, the sound of running water when nothing is on, and new cracks in walls are common indicators. More at /plumbing/leak-detection.",
  },
  {
    category: "leaks",
    question: "Does insurance cover slab leak repair?",
    answer:
      "Most policies cover sudden pipe breaks and resulting damage, but not gradual corrosion or the plumbing repair itself. We provide documentation for your claim.",
  },
  {
    category: "water-quality",
    question: "How hard is Austin's water?",
    answer:
      "Austin Water averages about 184 parts per million, which is classified as very hard. More at /plumbing/water-treatment.",
  },
  {
    category: "water-quality",
    question: "Do I need a water softener?",
    answer:
      "If you want to protect your pipes, water heater, and appliances from scale buildup, yes. A softener is the most cost-effective protection for your plumbing system in Austin.",
  },
  {
    category: "emergency",
    question: "What should I do in a plumbing emergency?",
    answer:
      "Shut off the water at the main valve, take photos for insurance, and call or text us immediately. For gas leaks, leave the house first and call 911. More at /plumbing/emergency.",
  },
  {
    category: "emergency",
    question: "Do you charge more for emergency calls?",
    answer:
      "Yes, emergency rates are higher than standard rates. We're transparent about the cost before we start any work.",
  },
];

