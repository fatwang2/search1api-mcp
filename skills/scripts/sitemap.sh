#!/usr/bin/env bash
# Discover all links on a URL / domain via Search1API.
# Usage: bash scripts/sitemap.sh "<url>"
source "$(dirname "$0")/_common.sh"

url="${1:-}"

if [[ -z "$url" ]]; then
  echo "Usage: $0 \"<url>\"" >&2
  exit 1
fi

payload=$(jq -n --arg u "$url" '{url: $u}')

api_post "/sitemap" "$payload"
