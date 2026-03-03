#!/usr/bin/env bash
# Crawl a URL and return clean markdown content via Search1API.
# Usage: bash scripts/crawl.sh "<url>"
source "$(dirname "$0")/_common.sh"

url="${1:-}"

if [[ -z "$url" ]]; then
  echo "Usage: $0 \"<url>\"" >&2
  exit 1
fi

payload=$(jq -n --arg u "$url" '{url: $u}')

api_post "/crawl" "$payload"
