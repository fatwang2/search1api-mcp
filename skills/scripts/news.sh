#!/usr/bin/env bash
# News search via Search1API.
# Usage: bash scripts/news.sh "<query>" [max_results] [search_service] [language] [time_range]
source "$(dirname "$0")/common.sh"

query="${1:-}"
max_results="${2:-5}"
search_service="${3:-google}"
language="${4:-en}"
time_range="${5:-day}"

if [[ -z "$query" ]]; then
  echo "Usage: $0 \"<query>\" [max_results] [search_service] [language] [time_range]" >&2
  exit 1
fi

payload=$(jq -n \
  --arg q "$query" \
  --argjson mr "$max_results" \
  --arg ss "$search_service" \
  --arg lang "$language" \
  --arg tr "$time_range" \
  '{
    query: $q,
    max_results: $mr,
    search_service: $ss,
    crawl_results: 0,
    image: false,
    include_sites: [],
    exclude_sites: [],
    language: $lang,
    time_range: $tr
  }')

api_post "/news" "$payload"
