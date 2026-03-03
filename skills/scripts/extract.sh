#!/usr/bin/env bash
# Extract structured data from a URL via Search1API.
# Usage: bash scripts/extract.sh "<url>" "<prompt>" '<json_schema>'
source "$(dirname "$0")/_common.sh"

url="${1:-}"
prompt="${2:-}"
schema="${3:-}"

if [[ -z "$url" || -z "$prompt" || -z "$schema" ]]; then
  echo 'Usage: $0 "<url>" "<prompt>" '"'"'<json_schema>'"'"'' >&2
  echo 'Example: $0 "https://example.com" "Extract title and price" '"'"'{"type":"object","properties":{"title":{"type":"string"},"price":{"type":"string"}},"required":["title","price"]}'"'"'' >&2
  exit 1
fi

# schema is already a JSON string; merge it safely with jq
payload=$(jq -n \
  --arg u "$url" \
  --arg p "$prompt" \
  --argjson s "$schema" \
  '{url: $u, prompt: $p, schema: $s}')

api_post "/extract" "$payload"
