import {
  loadWeeklyJourneyReport,
  previousCompleteWeek,
  sendWeeklyJourneyReport,
} from "../lib/weekly-analytics-report";

async function main() {
  const report = await loadWeeklyJourneyReport(previousCompleteWeek());
  console.log(JSON.stringify({
    pageViews: report.totals.pageViews,
    period: report.window,
    sessions: report.totals.sessions,
    users: report.totals.users,
  }, null, 2));

  if (process.argv.includes("--send")) {
    const recipients = await sendWeeklyJourneyReport(report);
    console.log(`Weekly report queued for ${recipients.length} recipient(s).`);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
