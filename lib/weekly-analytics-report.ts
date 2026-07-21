import { createHash } from "node:crypto";
import { BigQuery } from "@google-cloud/bigquery";
import { applicationDefault, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const DAY_MS = 24 * 60 * 60 * 1000;
const DEFAULT_DATASET_ID = "analytics_534263775";
const DEFAULT_PROJECT_ID = "conduit-external-dev";
const REPORT_TIME_ZONE = "America/Chicago";

const TRACKED_ACTIONS = [
  "book_click",
  "booking_funnel_event",
  "cta_click",
  "lead_submit_success",
  "phone_click",
  "text_click",
] as const;

export type WeeklyReportWindow = {
  endDate: string;
  endSuffix: string;
  startDate: string;
  startSuffix: string;
};

export type JourneyPage = {
  activeTimeMs: number;
  elapsedTimeMs: number;
  exitReason: string;
  nextPage: string;
  pagePath: string;
  pageSequence: number;
};

export type VisitorJourney = {
  actions: string[];
  browser: string;
  campaign: string;
  deviceType: string;
  exitPage: string;
  medium: string;
  operatingSystem: string;
  pages: JourneyPage[];
  returningVisitor: boolean;
  sessionKey: string;
  source: string;
  totalActiveTimeMs: number;
  totalElapsedTimeMs: number;
  visitorId: string;
};

export type WeeklyJourneyReport = {
  generatedAt: string;
  journeys: VisitorJourney[];
  totals: {
    actions: number;
    activeTimeMs: number;
    pageViews: number;
    sessions: number;
    users: number;
  };
  window: WeeklyReportWindow;
};

export type RawPageRow = {
  actions?: string | null;
  activeTimeMs?: number | string | null;
  browser?: string | null;
  campaign?: string | null;
  deviceType?: string | null;
  elapsedTimeMs?: number | string | null;
  eventTimestampMicros?: number | string | null;
  exitReason?: string | null;
  gaSessionId?: string | null;
  medium?: string | null;
  nextPage?: string | null;
  operatingSystem?: string | null;
  pagePath?: string | null;
  pageSequence?: number | string | null;
  returningVisitor?: number | string | null;
  siteSessionId?: string | null;
  source?: string | null;
  userPseudoId?: string | null;
};

function datePartsInChicago(now: Date): { day: number; month: number; weekday: number; year: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "2-digit",
    timeZone: REPORT_TIME_ZONE,
    weekday: "short",
    year: "numeric",
  }).formatToParts(now);
  const value = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value || "";
  const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(value("weekday"));
  return {
    day: Number(value("day")),
    month: Number(value("month")),
    weekday,
    year: Number(value("year")),
  };
}

function formatDateOnly(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function previousCompleteWeek(now = new Date()): WeeklyReportWindow {
  const local = datePartsInChicago(now);
  const localDate = Date.UTC(local.year, local.month - 1, local.day);
  const daysBackToPriorSunday = local.weekday === 0 ? 7 : local.weekday;
  const end = new Date(localDate - daysBackToPriorSunday * DAY_MS);
  const start = new Date(end.getTime() - 6 * DAY_MS);
  const startDate = formatDateOnly(start);
  const endDate = formatDateOnly(end);
  return {
    endDate,
    endSuffix: endDate.replaceAll("-", ""),
    startDate,
    startSuffix: startDate.replaceAll("-", ""),
  };
}

function safeNumber(value: number | string | null | undefined): number {
  const parsed = Number(value || 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function firstUseful(current: string, next: string | null | undefined, fallback = "Unknown"): string {
  if (current && current !== fallback) return current;
  return next?.trim() || current || fallback;
}

function visitorAlias(userPseudoId: string): string {
  return `visitor-${createHash("sha256").update(userPseudoId).digest("hex").slice(0, 10)}`;
}

function validateIdentifier(value: string, label: string, pattern: RegExp): string {
  if (!pattern.test(value)) throw new Error(`Invalid ${label}: ${value}`);
  return value;
}

function reportQuery(projectId: string, datasetId: string): string {
  const project = validateIdentifier(projectId, "BigQuery project ID", /^[a-z][a-z0-9-]{4,28}[a-z0-9]$/);
  const dataset = validateIdentifier(datasetId, "BigQuery dataset ID", /^[A-Za-z_][A-Za-z0-9_]*$/);
  const table = `\`${project}.${dataset}.events_*\``;
  const actionNames = TRACKED_ACTIONS.map((name) => `'${name}'`).join(", ");

  return `
    WITH weekly_events AS (
      SELECT *
      FROM ${table}
      WHERE _TABLE_SUFFIX BETWEEN @startSuffix AND @endSuffix
    ), raw_pages AS (
      SELECT
        user_pseudo_id AS userPseudoId,
        COALESCE(CAST((SELECT value.int_value FROM UNNEST(event_params) WHERE key = 'ga_session_id' LIMIT 1) AS STRING), '') AS gaSessionId,
        COALESCE((SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'site_session_id' LIMIT 1), '') AS siteSessionId,
        COALESCE((SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'page_view_id' LIMIT 1), CAST(event_timestamp AS STRING)) AS pageViewId,
        COALESCE((SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'page_path' LIMIT 1), '/') AS pagePath,
        COALESCE((SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'next_page' LIMIT 1), '') AS nextPage,
        COALESCE((SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'exit_reason' LIMIT 1), 'unknown') AS exitReason,
        COALESCE((SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'traffic_source' LIMIT 1), 'Unknown') AS source,
        COALESCE((SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'utm_medium' LIMIT 1), '') AS medium,
        COALESCE((SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'utm_campaign' LIMIT 1), '') AS campaign,
        COALESCE((SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'device_type' LIMIT 1), device.category, 'Unknown') AS deviceType,
        COALESCE((SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'browser' LIMIT 1), device.web_info.browser, 'Unknown') AS browser,
        COALESCE((SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'operating_system' LIMIT 1), device.operating_system, 'Unknown') AS operatingSystem,
        COALESCE((SELECT value.int_value FROM UNNEST(event_params) WHERE key = 'page_sequence' LIMIT 1), 0) AS pageSequence,
        COALESCE((SELECT value.int_value FROM UNNEST(event_params) WHERE key = 'elapsed_time_ms' LIMIT 1), 0) AS elapsedTimeMs,
        COALESCE((SELECT value.int_value FROM UNNEST(event_params) WHERE key = 'active_time_ms' LIMIT 1), 0) AS activeTimeMs,
        COALESCE((SELECT value.int_value FROM UNNEST(event_params) WHERE key = 'returning_visitor' LIMIT 1), 0) AS returningVisitor,
        COALESCE((SELECT value.int_value FROM UNNEST(event_params) WHERE key = 'is_final' LIMIT 1), 0) AS isFinal,
        event_timestamp AS eventTimestampMicros
      FROM weekly_events
      WHERE event_name = 'page_engagement'
    ), deduped_pages AS (
      SELECT * EXCEPT(pageRank, isFinal, pageViewId)
      FROM (
        SELECT
          *,
          ROW_NUMBER() OVER (
            PARTITION BY userPseudoId, gaSessionId, siteSessionId, pageViewId
            ORDER BY isFinal DESC, elapsedTimeMs DESC, eventTimestampMicros DESC
          ) AS pageRank
        FROM raw_pages
        WHERE userPseudoId IS NOT NULL
      )
      WHERE pageRank = 1
    ), session_actions AS (
      SELECT
        user_pseudo_id AS userPseudoId,
        COALESCE(CAST((SELECT value.int_value FROM UNNEST(event_params) WHERE key = 'ga_session_id' LIMIT 1) AS STRING), '') AS gaSessionId,
        STRING_AGG(DISTINCT event_name, ', ' ORDER BY event_name) AS actions
      FROM weekly_events
      WHERE event_name IN (${actionNames})
      GROUP BY userPseudoId, gaSessionId
    )
    SELECT pages.*, actions.actions
    FROM deduped_pages AS pages
    LEFT JOIN session_actions AS actions
      USING (userPseudoId, gaSessionId)
    ORDER BY userPseudoId, gaSessionId, eventTimestampMicros
  `;
}

export function assembleWeeklyJourneyReport(
  rows: RawPageRow[],
  window: WeeklyReportWindow,
  generatedAt = new Date().toISOString(),
): WeeklyJourneyReport {
  const journeys = new Map<string, VisitorJourney>();

  for (const row of rows) {
    const userPseudoId = row.userPseudoId?.trim();
    if (!userPseudoId) continue;
    const sessionKey = row.gaSessionId?.trim() || row.siteSessionId?.trim() || `event-${row.eventTimestampMicros || "unknown"}`;
    const mapKey = `${userPseudoId}:${sessionKey}`;
    let journey = journeys.get(mapKey);
    if (!journey) {
      journey = {
        actions: row.actions?.split(",").map((action) => action.trim()).filter(Boolean) || [],
        browser: row.browser?.trim() || "Unknown",
        campaign: row.campaign?.trim() || "",
        deviceType: row.deviceType?.trim() || "Unknown",
        exitPage: row.pagePath?.trim() || "/",
        medium: row.medium?.trim() || "",
        operatingSystem: row.operatingSystem?.trim() || "Unknown",
        pages: [],
        returningVisitor: safeNumber(row.returningVisitor) === 1,
        sessionKey,
        source: row.source?.trim() || "Unknown",
        totalActiveTimeMs: 0,
        totalElapsedTimeMs: 0,
        visitorId: visitorAlias(userPseudoId),
      };
      journeys.set(mapKey, journey);
    }

    journey.source = firstUseful(journey.source, row.source);
    journey.medium = firstUseful(journey.medium, row.medium, "");
    journey.campaign = firstUseful(journey.campaign, row.campaign, "");
    journey.actions = Array.from(new Set([
      ...journey.actions,
      ...(row.actions?.split(",").map((action) => action.trim()).filter(Boolean) || []),
    ])).sort();
    journey.pages.push({
      activeTimeMs: safeNumber(row.activeTimeMs),
      elapsedTimeMs: safeNumber(row.elapsedTimeMs),
      exitReason: row.exitReason?.trim() || "unknown",
      nextPage: row.nextPage?.trim() || "",
      pagePath: row.pagePath?.trim() || "/",
      pageSequence: safeNumber(row.pageSequence),
    });
  }

  const orderedJourneys = Array.from(journeys.values()).map((journey) => {
    journey.pages.sort((a, b) => a.pageSequence - b.pageSequence);
    for (let index = 0; index < journey.pages.length; index += 1) {
      const page = journey.pages[index];
      if (!page.nextPage && journey.pages[index + 1]) page.nextPage = journey.pages[index + 1].pagePath;
    }
    journey.exitPage = journey.pages.at(-1)?.pagePath || "/";
    journey.totalActiveTimeMs = journey.pages.reduce((total, page) => total + page.activeTimeMs, 0);
    journey.totalElapsedTimeMs = journey.pages.reduce((total, page) => total + page.elapsedTimeMs, 0);
    return journey;
  }).sort((a, b) => b.totalActiveTimeMs - a.totalActiveTimeMs);

  const users = new Set(orderedJourneys.map((journey) => journey.visitorId));
  return {
    generatedAt,
    journeys: orderedJourneys,
    totals: {
      actions: orderedJourneys.reduce((total, journey) => total + journey.actions.length, 0),
      activeTimeMs: orderedJourneys.reduce((total, journey) => total + journey.totalActiveTimeMs, 0),
      pageViews: orderedJourneys.reduce((total, journey) => total + journey.pages.length, 0),
      sessions: orderedJourneys.length,
      users: users.size,
    },
    window,
  };
}

export async function loadWeeklyJourneyReport(
  window = previousCompleteWeek(),
): Promise<WeeklyJourneyReport> {
  const projectId = process.env.BIGQUERY_GA4_PROJECT_ID?.trim() || DEFAULT_PROJECT_ID;
  const datasetId = process.env.BIGQUERY_GA4_DATASET_ID?.trim() || DEFAULT_DATASET_ID;
  const bigQuery = new BigQuery({ projectId });
  const [rows] = await bigQuery.query({
    labels: { report: "ironclad_weekly_visitor_journeys" },
    location: "US",
    maximumBytesBilled: "10737418240",
    params: { endSuffix: window.endSuffix, startSuffix: window.startSuffix },
    query: reportQuery(projectId, datasetId),
    types: { endSuffix: "STRING", startSuffix: "STRING" },
  });
  return assembleWeeklyJourneyReport(rows as RawPageRow[], window);
}

export function formatDuration(valueMs: number): string {
  const totalSeconds = Math.max(0, Math.round(valueMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function buildWeeklyJourneyEmail(report: WeeklyJourneyReport): { html: string; subject: string; text: string } {
  const subject = `Ironclad weekly visitor journeys: ${report.window.startDate} to ${report.window.endDate}`;
  const rows = report.journeys.map((journey) => {
    const source = [journey.source, journey.medium, journey.campaign].filter(Boolean).join(" / ");
    const journeyText = journey.pages
      .map((page) => `${page.pagePath} (${formatDuration(page.activeTimeMs)} active, ${formatDuration(page.elapsedTimeMs)} elapsed)`)
      .join(" → ");
    return `<tr>
      <td>${escapeHtml(journey.visitorId)}${journey.returningVisitor ? "<br><small>returning</small>" : ""}</td>
      <td>${escapeHtml(source || "Unknown")}</td>
      <td>${escapeHtml(`${journey.deviceType} / ${journey.browser} / ${journey.operatingSystem}`)}</td>
      <td>${escapeHtml(formatDuration(journey.totalActiveTimeMs))}</td>
      <td>${escapeHtml(journeyText)}</td>
      <td>${escapeHtml(journey.actions.join(", ") || "None")}</td>
      <td>${escapeHtml(journey.exitPage)}</td>
    </tr>`;
  }).join("");

  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:1200px;margin:0 auto;color:#1f2937">
      <h1 style="font-size:22px;margin-bottom:4px">Ironclad weekly visitor journeys</h1>
      <p style="margin-top:0;color:#6b7280">${escapeHtml(report.window.startDate)} through ${escapeHtml(report.window.endDate)} · anonymous browser IDs only</p>
      <p><strong>${report.totals.users}</strong> visitors · <strong>${report.totals.sessions}</strong> sessions · <strong>${report.totals.pageViews}</strong> page visits · <strong>${escapeHtml(formatDuration(report.totals.activeTimeMs))}</strong> active time</p>
      ${report.journeys.length === 0
        ? "<p>No page journeys were recorded for this period.</p>"
        : `<table style="width:100%;border-collapse:collapse;font-size:12px">
            <thead><tr style="background:#f3f4f6;text-align:left">
              <th style="padding:8px;border:1px solid #d1d5db">Visitor</th>
              <th style="padding:8px;border:1px solid #d1d5db">Source</th>
              <th style="padding:8px;border:1px solid #d1d5db">Device</th>
              <th style="padding:8px;border:1px solid #d1d5db">Active</th>
              <th style="padding:8px;border:1px solid #d1d5db">Journey</th>
              <th style="padding:8px;border:1px solid #d1d5db">Actions</th>
              <th style="padding:8px;border:1px solid #d1d5db">Exit</th>
            </tr></thead>
            <tbody>${rows}</tbody>
          </table>`}
      <p style="font-size:11px;color:#9ca3af">Active time counts foreground/focused time. Elapsed time includes background time. No names, phone numbers, emails, or form contents are included.</p>
    </div>`;

  const textJourneys = report.journeys.map((journey) => {
    const pages = journey.pages
      .map((page) => `${page.pagePath} (${formatDuration(page.activeTimeMs)} active/${formatDuration(page.elapsedTimeMs)} elapsed)`)
      .join(" -> ");
    return `${journey.visitorId} | ${journey.source}${journey.medium ? `/${journey.medium}` : ""} | ${formatDuration(journey.totalActiveTimeMs)} active | ${pages} | actions: ${journey.actions.join(", ") || "None"} | exit: ${journey.exitPage}`;
  }).join("\n");
  const text = [
    subject,
    `${report.totals.users} visitors | ${report.totals.sessions} sessions | ${report.totals.pageViews} page visits | ${formatDuration(report.totals.activeTimeMs)} active time`,
    "",
    textJourneys || "No page journeys were recorded for this period.",
    "",
    "Anonymous browser IDs only. No names, phone numbers, emails, or form contents are included.",
  ].join("\n");

  return { html, subject, text };
}

function analyticsRecipients(): string[] {
  return (
    process.env.WEEKLY_ANALYTICS_RECIPIENTS
      || process.env.BOOKING_NOTIFY_EMAILS
      || "peter@ironcladtexas.com"
  )
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);
}

function analyticsFirestore() {
  if (!getApps().length) {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || DEFAULT_PROJECT_ID;
    try {
      initializeApp({ credential: applicationDefault(), projectId });
    } catch {
      initializeApp({ projectId });
    }
  }
  return getFirestore();
}

export async function sendWeeklyJourneyReport(report: WeeklyJourneyReport): Promise<string[]> {
  const recipients = analyticsRecipients();
  const message = buildWeeklyJourneyEmail(report);
  const db = analyticsFirestore();
  for (const recipient of recipients) {
    await db.collection("mail").add({
      from: '"Ironclad Analytics" <noreply@mainconduit.com>',
      message,
      to: recipient,
    });
  }
  return recipients;
}
