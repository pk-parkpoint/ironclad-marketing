import { BOOKING_NA, BOOKING_NOT_PRESENTED, normalizeValue } from "@/lib/booking-lead";

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${d}-${months[parseInt(m, 10) - 1]}-${y}`;
}

export function formatValue(value: string | undefined | null): string {
  return normalizeValue(value);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function row(label: string, value: string | undefined | null): string {
  const display = formatValue(value);
  // Visually differentiate the three states: real value (ink), saw + skipped
  // ("NA", gray), and never reached ("Not Presented", gray italic).
  let color = "#1f2937";
  let fontStyle = "normal";
  if (display === BOOKING_NA) {
    color = "#9ca3af";
  } else if (display === BOOKING_NOT_PRESENTED) {
    color = "#9ca3af";
    fontStyle = "italic";
  }
  return `<tr><td style="padding:6px 12px;font-weight:600;color:#374151;white-space:nowrap">${escapeHtml(label)}</td><td style="padding:6px 12px;color:${color};font-style:${fontStyle}">${escapeHtml(display)}</td></tr>`;
}

export function textRow(label: string, value: string | undefined | null): string {
  return `${label}: ${formatValue(value)}`;
}

