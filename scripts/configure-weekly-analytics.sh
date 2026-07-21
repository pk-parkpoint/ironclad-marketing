#!/usr/bin/env bash
set -euo pipefail

PROJECT_ID="${IRONCLAD_PROJECT_ID:-conduit-external-dev}"
REGION="${IRONCLAD_REGION:-us-central1}"
SERVICE_NAME="${IRONCLAD_SERVICE_NAME:-ironclad-marketing}"
JOB_NAME="${WEEKLY_ANALYTICS_JOB_NAME:-ironclad-weekly-visitor-journeys}"
REPORT_URL="${WEEKLY_ANALYTICS_REPORT_URL:-https://ironcladtexas.com/api/analytics/weekly-report}"
SCHEDULE="${WEEKLY_ANALYTICS_SCHEDULE:-0 8 * * 2}"
TIME_ZONE="${WEEKLY_ANALYTICS_TIME_ZONE:-America/Chicago}"
SECRET="${WEEKLY_ANALYTICS_CRON_SECRET:-}"
CONFIRMATION="${1:-}"

if [[ "$CONFIRMATION" != "--confirm-project=$PROJECT_ID" ]]; then
  printf 'Usage: WEEKLY_ANALYTICS_CRON_SECRET=<secret> %s --confirm-project=%s\n' "$0" "$PROJECT_ID" >&2
  exit 1
fi

if [[ ${#SECRET} -lt 32 ]]; then
  printf 'WEEKLY_ANALYTICS_CRON_SECRET must contain at least 32 characters.\n' >&2
  exit 1
fi

gcloud run services update "$SERVICE_NAME" \
  --project="$PROJECT_ID" \
  --region="$REGION" \
  --update-env-vars="BIGQUERY_GA4_PROJECT_ID=$PROJECT_ID,BIGQUERY_GA4_DATASET_ID=analytics_534263775,WEEKLY_ANALYTICS_CRON_SECRET=$SECRET" \
  --quiet

if gcloud scheduler jobs describe "$JOB_NAME" \
  --project="$PROJECT_ID" \
  --location="$REGION" >/dev/null 2>&1; then
  gcloud scheduler jobs update http "$JOB_NAME" \
    --project="$PROJECT_ID" \
    --location="$REGION" \
    --schedule="$SCHEDULE" \
    --time-zone="$TIME_ZONE" \
    --uri="$REPORT_URL" \
    --http-method=POST \
    --update-headers="X-Ironclad-Cron-Secret=$SECRET" \
    --attempt-deadline=600s \
    --quiet
else
  gcloud scheduler jobs create http "$JOB_NAME" \
    --project="$PROJECT_ID" \
    --location="$REGION" \
    --schedule="$SCHEDULE" \
    --time-zone="$TIME_ZONE" \
    --uri="$REPORT_URL" \
    --http-method=POST \
    --headers="X-Ironclad-Cron-Secret=$SECRET" \
    --attempt-deadline=600s \
    --quiet
fi

printf 'Weekly analytics scheduled: %s (%s, %s) -> %s\n' "$SCHEDULE" "$TIME_ZONE" "$JOB_NAME" "$REPORT_URL"
