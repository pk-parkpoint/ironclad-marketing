import assert from "node:assert/strict";
import {
  assembleWeeklyJourneyReport,
  buildWeeklyJourneyEmail,
  previousCompleteWeek,
  type RawPageRow,
} from "../lib/weekly-analytics-report";

const window = previousCompleteWeek(new Date("2026-07-21T15:00:00Z"));
assert.deepEqual(window, {
  endDate: "2026-07-19",
  endSuffix: "20260719",
  startDate: "2026-07-13",
  startSuffix: "20260713",
});

const rows: RawPageRow[] = [
  {
    actions: "book_click, cta_click",
    activeTimeMs: 39_000,
    browser: "Chrome",
    campaign: "water-heater",
    deviceType: "mobile",
    elapsedTimeMs: 48_000,
    eventTimestampMicros: "1000000",
    exitReason: "route_change",
    gaSessionId: "456",
    medium: "cpc",
    nextPage: "/reviews",
    operatingSystem: "Android",
    pagePath: "/plumbing/water-heaters",
    pageSequence: 1,
    returningVisitor: 0,
    siteSessionId: "site-1",
    source: "Google",
    userPseudoId: "anonymous-user-1",
  },
  {
    actions: "book_click, cta_click",
    activeTimeMs: 27_000,
    browser: "Chrome",
    campaign: "water-heater",
    deviceType: "mobile",
    elapsedTimeMs: 31_000,
    eventTimestampMicros: "2000000",
    exitReason: "pagehide",
    gaSessionId: "456",
    medium: "cpc",
    nextPage: "",
    operatingSystem: "Android",
    pagePath: "/reviews",
    pageSequence: 2,
    returningVisitor: 0,
    siteSessionId: "site-1",
    source: "Google",
    userPseudoId: "anonymous-user-1",
  },
];

const report = assembleWeeklyJourneyReport(rows, window, "2026-07-21T15:00:00Z");
assert.equal(report.totals.users, 1);
assert.equal(report.totals.sessions, 1);
assert.equal(report.totals.pageViews, 2);
assert.equal(report.totals.activeTimeMs, 66_000);
assert.equal(report.journeys[0].exitPage, "/reviews");
assert.deepEqual(report.journeys[0].actions, ["book_click", "cta_click"]);
assert.match(report.journeys[0].visitorId, /^visitor-[a-f0-9]{10}$/);

const email = buildWeeklyJourneyEmail(report);
assert.match(email.subject, /2026-07-13 to 2026-07-19/);
assert.match(email.html, /\/plumbing\/water-heaters/);
assert.match(email.html, /\/reviews/);
assert.match(email.text, /1 visitors \| 1 sessions \| 2 page visits/);

console.log("weekly analytics audit passed: date window, anonymous journey assembly, durations, actions, exit page, and email");
