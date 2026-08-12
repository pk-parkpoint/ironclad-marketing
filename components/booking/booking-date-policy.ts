const IRONCLAD_TIME_ZONE = "America/Chicago";
const LAST_SAME_DAY_WINDOW_START_HOUR = 15;

type BusinessDateTime = {
  day: number;
  hour: number;
  minute: number;
  month: number;
  second: number;
  year: number;
};

export function formatDateId(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function ironcladTodayDateId(now = new Date()): string {
  const parts = ironcladDateTime(now);
  return formatDateId(parts.year, parts.month - 1, parts.day);
}

export function firstOfferableDateId(now = new Date()): string {
  const parts = ironcladDateTime(now);
  const today = formatDateId(parts.year, parts.month - 1, parts.day);
  const afterLastWindowStart =
    parts.hour > LAST_SAME_DAY_WINDOW_START_HOUR ||
    (parts.hour === LAST_SAME_DAY_WINDOW_START_HOUR &&
      (parts.minute > 0 || parts.second > 0));
  return afterLastWindowStart ? addDays(today, 1) : today;
}

export function dateLabel(dateId: string, now = new Date()): string {
  const date = new Date(`${dateId}T12:00:00Z`);
  const today = ironcladTodayDateId(now);
  const label = new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
    weekday: "long",
  }).format(date);
  if (dateId === today) return `Today, ${label}`;
  if (dateId === addDays(today, 1)) return `Tomorrow, ${label}`;
  return label;
}

function addDays(dateId: string, days: number): string {
  const [year, month, day] = dateId.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days));
  return formatDateId(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

function ironcladDateTime(now: Date): BusinessDateTime {
  const values = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
      hour: "2-digit",
      hourCycle: "h23",
      minute: "2-digit",
      month: "2-digit",
      second: "2-digit",
      timeZone: IRONCLAD_TIME_ZONE,
      year: "numeric",
    })
      .formatToParts(now)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, Number(part.value)]),
  );
  return values as BusinessDateTime;
}
