export type DataDeskStatus = "severe" | "high" | "moderate" | "low" | "info" | "unknown";

export type DataDeskResult = {
  title: string;
  tag: string;
  status: DataDeskStatus;
  values: string[];
  note?: string;
};

export type DataDeskChoice = {
  key: string;
  label: string;
  result: DataDeskResult;
};

export type DataDeskControl =
  | { type: "gauge" | "picker" | "select"; label: string; options: DataDeskChoice[] }
  | { type: "search"; label: string; placeholder: string; samples: DataDeskChoice[]; fallback: DataDeskResult }
  | { type: "leak-calculator"; label: string; defaultValue: number; presets: Array<{ label: string; value: number }> }
  | { type: "heater-calculator"; label: string; defaultYear: number; systemTypes: string[] };

export type DataDeskSignatureStat = {
  value: string;
  label: string;
  count?: number;
};

export type DataDeskExperience = {
  slug: string;
  accent: string;
  accent2: string;
  headline: string;
  highlight: string;
  signature: {
    value: string;
    unit?: string;
    label: string;
    stats: [DataDeskSignatureStat, DataDeskSignatureStat, DataDeskSignatureStat];
  };
  rowLabels: string[];
  control: DataDeskControl;
};
