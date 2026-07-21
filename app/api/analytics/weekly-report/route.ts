import { timingSafeEqual } from "node:crypto";
import {
  loadWeeklyJourneyReport,
  previousCompleteWeek,
  sendWeeklyJourneyReport,
} from "@/lib/weekly-analytics-report";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function isAuthorized(request: Request): boolean {
  const configured = process.env.WEEKLY_ANALYTICS_CRON_SECRET?.trim();
  const presented = request.headers.get("x-ironclad-cron-secret")?.trim();
  if (!configured || !presented) return false;
  const expected = Buffer.from(configured);
  const actual = Buffer.from(presented);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export async function POST(request: Request) {
  if (!process.env.WEEKLY_ANALYTICS_CRON_SECRET?.trim()) {
    return Response.json({ error: "weekly_analytics_not_configured" }, { status: 503 });
  }
  if (!isAuthorized(request)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const window = previousCompleteWeek();
    const report = await loadWeeklyJourneyReport(window);
    const recipients = await sendWeeklyJourneyReport(report);
    return Response.json({
      deliveredTo: recipients.length,
      pageViews: report.totals.pageViews,
      period: `${window.startDate}/${window.endDate}`,
      sessions: report.totals.sessions,
      users: report.totals.users,
    });
  } catch (error) {
    console.error("[weekly-analytics] report failed", error);
    return Response.json({ error: "weekly_analytics_failed" }, { status: 500 });
  }
}
