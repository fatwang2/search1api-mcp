#!/usr/bin/env bash
# Get trending topics from a platform via Search1API.
# Usage: bash scripts/trending.sh [search_service] [max_results]
source "$(dirname "$0")/_common.sh"

search_service="${1:-google}"
max_results="${2:-10}"

payload=$(jq -n \
  --arg ss "$search_service" \
  --argjson mr "$max_results" \
  '{search_service: $ss, max_results: $mr}')

api_post "/trending" "$payload"
