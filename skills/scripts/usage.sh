#!/usr/bin/env bash
# Check current API usage / quota via Search1API.
# Usage: bash scripts/usage.sh
source "$(dirname "$0")/common.sh"

api_get "/usage"
