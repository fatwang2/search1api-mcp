#!/usr/bin/env bash
# Shared helpers for all Search1API scripts.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_PATH="${HOME}/.openclaw/openclaw.json"

# ---------------------------------------------------------------------------
# API key resolution: OpenClaw config → environment variable
# ---------------------------------------------------------------------------
_resolve_api_key() {
  local key=""
  # 1. Try OpenClaw config file
  if [[ -f "$CONFIG_PATH" ]]; then
    key=$(python3 -c "
import json, sys
try:
    with open('$CONFIG_PATH') as f:
        d = json.load(f)
    print(d.get('skills',{}).get('entries',{}).get('search1api',{}).get('apiKey',''))
except Exception:
    print('')
" 2>/dev/null || echo "")
  fi
  # 2. Fallback to environment variable
  if [[ -z "$key" ]]; then
    key="${SEARCH1API_KEY:-}"
  fi
  echo "$key"
}

SEARCH1API_KEY="$(_resolve_api_key)"

if [[ -z "$SEARCH1API_KEY" ]]; then
  echo "ERROR: Search1API key not found." >&2
  echo "Set it in ${CONFIG_PATH} (skills.entries.search1api.apiKey) or export SEARCH1API_KEY." >&2
  exit 1
fi

API_BASE="https://api.search1api.com"

# ---------------------------------------------------------------------------
# Safe HTTP POST with status-code checking
# Usage: api_post "/search" "$json_payload"
# ---------------------------------------------------------------------------
api_post() {
  local endpoint="$1"
  local payload="$2"
  local tmp
  tmp=$(mktemp)

  local http_code
  http_code=$(curl -sS -w "%{http_code}" -o "$tmp" \
    -X POST "${API_BASE}${endpoint}" \
    -H "Authorization: Bearer ${SEARCH1API_KEY}" \
    -H "Content-Type: application/json" \
    -d "$payload")

  if [[ "$http_code" -ge 400 ]]; then
    echo "ERROR: HTTP ${http_code} from ${endpoint}" >&2
    cat "$tmp" >&2
    rm -f "$tmp"
    exit 1
  fi

  cat "$tmp"
  rm -f "$tmp"
}

# ---------------------------------------------------------------------------
# Safe HTTP GET with status-code checking
# Usage: api_get "/usage"
# ---------------------------------------------------------------------------
api_get() {
  local endpoint="$1"
  local tmp
  tmp=$(mktemp)

  local http_code
  http_code=$(curl -sS -w "%{http_code}" -o "$tmp" \
    -X GET "${API_BASE}${endpoint}" \
    -H "Authorization: Bearer ${SEARCH1API_KEY}" \
    -H "Content-Type: application/json")

  if [[ "$http_code" -ge 400 ]]; then
    echo "ERROR: HTTP ${http_code} from ${endpoint}" >&2
    cat "$tmp" >&2
    rm -f "$tmp"
    exit 1
  fi

  cat "$tmp"
  rm -f "$tmp"
}
