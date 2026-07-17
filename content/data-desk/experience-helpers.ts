import type { DataDeskChoice, DataDeskResult, DataDeskStatus } from "./experience-types";

function keyFromLabel(label: string): string {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function result(
  title: string,
  tag: string,
  status: DataDeskStatus,
  values: string[],
  note?: string,
): DataDeskResult {
  return { title, tag, status, values, note };
}

export function choice(
  label: string,
  tag: string,
  status: DataDeskStatus,
  values: string[],
  note?: string,
): DataDeskChoice {
  return { key: keyFromLabel(label), label, result: result(label, tag, status, values, note) };
}
