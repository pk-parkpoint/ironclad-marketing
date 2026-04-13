#!/usr/bin/env bash
set -euo pipefail

PROJECT_ID="${IRONCLAD_PROJECT_ID:-conduit-external-dev}"
SERVICE_NAME="${IRONCLAD_SERVICE_NAME:-ironclad-marketing}"
REGION="${IRONCLAD_REGION:-us-central1}"
URL_MAP="${IRONCLAD_URL_MAP:-ironclad-url-map}"
HTTP_PROXY="${IRONCLAD_HTTP_PROXY:-ironclad-http-proxy}"
ENV_FILE="${IRONCLAD_ENV_FILE:-.env.production}"
EXPECTED_REMOTE_FRAGMENT="${IRONCLAD_EXPECTED_REMOTE_FRAGMENT:-pk-parkpoint/ironclad-marketing}"
TMP_ENV_FILE="$(mktemp /tmp/ironclad-production-env.XXXXXX.yaml)"
GENERATED_DOTENV_PATH=""
KEEP_GENERATED_DOTENV="${IRONCLAD_KEEP_GENERATED_DOTENV:-${IRONCLAD_PREPARE_ONLY:-0}}"

log() {
  printf '[ironclad deploy] %s\n' "$1"
}

fail() {
  printf '[ironclad deploy] ERROR: %s\n' "$1" >&2
  exit 1
}

cleanup() {
  rm -f "$TMP_ENV_FILE"
  if [[ -n "$GENERATED_DOTENV_PATH" && "$KEEP_GENERATED_DOTENV" != "1" ]]; then
    rm -f "$GENERATED_DOTENV_PATH"
  fi
}

trap cleanup EXIT

if [[ "${IRONCLAD_SKIP_GIT_CHECK:-0}" != "1" ]] && git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  remote_url="$(git remote get-url origin 2>/dev/null || true)"
  [[ "$remote_url" == *"$EXPECTED_REMOTE_FRAGMENT"* ]] || fail "origin remote must contain $EXPECTED_REMOTE_FRAGMENT (got: ${remote_url:-none})"

  if [[ "${IRONCLAD_REQUIRE_CLEAN_GIT:-1}" == "1" ]]; then
    git update-index -q --refresh || true
    git diff --quiet --ignore-submodules -- || fail "working tree has tracked changes; commit or stash them before deploying"
    git diff --cached --quiet --ignore-submodules -- || fail "index has staged changes; commit them before deploying"
  fi

  if [[ "${IRONCLAD_REQUIRE_SYNCED_MAIN:-1}" == "1" ]]; then
    branch="$(git branch --show-current 2>/dev/null || true)"
    [[ "$branch" == "main" ]] || fail "local deploys must run from main; current branch is ${branch:-detached}"

    if git rev-parse origin/main >/dev/null 2>&1; then
      current_head="$(git rev-parse HEAD)"
      origin_main="$(git rev-parse origin/main)"
      [[ "$current_head" == "$origin_main" ]] || fail "HEAD must match origin/main before deploying"
    fi
  fi
fi

if [[ -n "${IRONCLAD_EXPORT_DOTENV_PATH:-}" ]]; then
  GENERATED_DOTENV_PATH="$IRONCLAD_EXPORT_DOTENV_PATH"
elif [[ ! -f "$ENV_FILE" ]]; then
  GENERATED_DOTENV_PATH="$ENV_FILE"
fi

log "Preparing production env file"
python3 - "$TMP_ENV_FILE" "$PROJECT_ID" "$SERVICE_NAME" "$REGION" "$ENV_FILE" "$GENERATED_DOTENV_PATH" <<'PY'
import json
import os
import subprocess
import sys
from pathlib import Path

tmp_path, project_id, service_name, region, env_file, dotenv_path = sys.argv[1:]

required_keys = [
    "BOOKING_NOTIFY_EMAILS",
    "BOOKING_WEBHOOK_URL",
    "CONDUIT_FORM_SECRET",
    "LEAD_WEBHOOK_URL",
    "NEXT_PUBLIC_CONTACT_EMAIL",
    "NEXT_PUBLIC_FIREBASE_API_KEY",
    "NEXT_PUBLIC_FIREBASE_APP_ID",
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
    "NEXT_PUBLIC_GOOGLE_MAPS_KEY",
    "NEXT_PUBLIC_PHONE",
    "NEXT_PUBLIC_SITE_URL",
    "NEXT_PUBLIC_TEXT_NUMBER",
]
analytics_keys = ["NEXT_PUBLIC_GTM_ID", "NEXT_PUBLIC_GA4_MEASUREMENT_ID"]

describe = subprocess.run(
    [
        "gcloud",
        "run",
        "services",
        "describe",
        service_name,
        f"--project={project_id}",
        f"--region={region}",
        "--format=json(spec.template.spec.containers[0].env)",
    ],
    capture_output=True,
    text=True,
    check=True,
)
payload = json.loads(describe.stdout or "{}")
env_vars = {}
for item in payload.get("spec", {}).get("template", {}).get("spec", {}).get("containers", [{}])[0].get("env", []):
    name = item.get("name")
    value = item.get("value")
    if name and value is not None:
        env_vars[name] = value

source_env = Path(env_file)
if source_env.exists():
    for raw_line in source_env.read_text().splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#"):
            continue
        if line.startswith("export "):
            line = line[len("export "):]
        if "=" not in line:
            raise SystemExit(f"Invalid line in {env_file}: {raw_line}")
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip()
        if value[:1] == value[-1:] and value[:1] in {"'", '"'}:
            value = value[1:-1]
        env_vars[key] = value

for key, value in os.environ.items():
    if key.startswith(("BOOKING_", "CONDUIT_", "LEAD_", "NEXT_PUBLIC_")):
        env_vars[key] = value

missing = [key for key in required_keys if not env_vars.get(key)]
if missing:
    raise SystemExit(f"Missing required production env vars: {', '.join(sorted(missing))}")

if not any(env_vars.get(key) for key in analytics_keys):
    print(
        "warning: NEXT_PUBLIC_GTM_ID / NEXT_PUBLIC_GA4_MEASUREMENT_ID not configured; launch audit will warn instead of fail",
        file=sys.stderr,
    )

with open(tmp_path, "w", encoding="utf-8") as handle:
    for key in sorted(env_vars):
        escaped = env_vars[key].replace("\\", "\\\\").replace('"', '\\"')
        handle.write(f'{key}: "{escaped}"\n')

if dotenv_path:
    with open(dotenv_path, "w", encoding="utf-8") as handle:
        for key in sorted(env_vars):
            escaped = env_vars[key].replace("\\", "\\\\").replace('"', '\\"')
            handle.write(f'{key}="{escaped}"\n')

print(f"prepared {len(env_vars)} env vars", file=sys.stderr)
PY

if [[ "${IRONCLAD_DEPLOY_DRY_RUN:-0}" == "1" ]]; then
  log "Dry run complete"
  cut -d: -f1 "$TMP_ENV_FILE"
  exit 0
fi

if [[ "${IRONCLAD_PREPARE_ONLY:-0}" == "1" ]]; then
  log "Prepared production env artifacts only"
  exit 0
fi

log "Deploying ${SERVICE_NAME}"
gcloud run deploy "$SERVICE_NAME" \
  --source=. \
  --project="$PROJECT_ID" \
  --region="$REGION" \
  --port=3000 \
  --allow-unauthenticated \
  --max-instances=20 \
  --cpu-boost \
  --quiet \
  --env-vars-file="$TMP_ENV_FILE"

log "Repairing HTTP proxy target"
gcloud compute target-http-proxies update "$HTTP_PROXY" \
  --url-map="$URL_MAP" \
  --project="$PROJECT_ID" \
  --global

log "Invalidating CDN cache"
gcloud compute url-maps invalidate-cdn-cache "$URL_MAP" \
  --path='/*' \
  --global \
  --quiet \
  --project="$PROJECT_ID"

log "Production deploy completed"
