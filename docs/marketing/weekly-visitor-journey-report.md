# Weekly Visitor Journey Report

The site records an anonymous `page_engagement` event for every page visit. Each event includes elapsed time, foreground-active time, an anonymous page-view ID, the existing site-session ID, device context, attribution, the next internal page when known, and the exit reason. It never includes names, email addresses, phone numbers, addresses, or form contents.

GA4 property `534263775` exports daily data to BigQuery dataset `analytics_534263775` in `conduit-external-dev`. Streaming and Fresh Daily exports remain disabled.

The weekly report groups the prior Monday through Sunday into anonymous visitor sessions. Each emailed row contains:

- anonymous visitor alias;
- traffic source, medium, and campaign when available;
- device, browser, and operating system;
- ordered page journey;
- active and elapsed time on every page;
- CTA, phone, text, booking, and lead events;
- final exit page.

The production schedule is Tuesday at 8:00 AM `America/Chicago`, allowing Sunday’s daily export to complete. Delivery uses the existing Firestore mail queue and `WEEKLY_ANALYTICS_RECIPIENTS`, falling back to `BOOKING_NOTIFY_EMAILS`.

## Validation

```zsh
npm run analytics:audit
npm run analytics:weekly:audit
npx playwright test tests/e2e/page-engagement.spec.ts --project=chromium --workers=1
```

## Manual report

Print report totals without sending email:

```zsh
npm run analytics:weekly
```

Queue the email explicitly:

```zsh
npm run analytics:weekly -- --send
```

## Scheduler configuration

After deploying the report endpoint, configure or update the Cloud Scheduler job with a secret of at least 32 characters:

```zsh
WEEKLY_ANALYTICS_CRON_SECRET='<random secret>' \
  bash scripts/configure-weekly-analytics.sh --confirm-project=conduit-external-dev
```
