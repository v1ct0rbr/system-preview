#!/bin/sh
set -eu

escape_json() {
  printf '%s' "$1" | tr -d '\r\n' | sed -e 's/\\/\\\\/g' -e 's/"/\\"/g'
}

SYSTEM_NAME="${SYSTEM_NAME:-Aurora}"
SYSTEM_DESCRIPTION="${SYSTEM_DESCRIPTION:-Uma nova experiência para gerenciar, acompanhar e evoluir suas operações — em um só lugar.}"
SYSTEM_START_DATE="${SYSTEM_START_DATE:-2026-12-20T09:00:00-03:00}"
SYSTEM_URL="${SYSTEM_URL:-}"

TARGET="/usr/share/nginx/html/env-config.js"

cat > "$TARGET" <<CONFIG
window.__SYSTEM_CONFIG__ = {
  name: "$(escape_json "$SYSTEM_NAME")",
  description: "$(escape_json "$SYSTEM_DESCRIPTION")",
  startDate: "$(escape_json "$SYSTEM_START_DATE")",
  url: "$(escape_json "$SYSTEM_URL")"
};
CONFIG

echo "env-config.js generated: ${SYSTEM_NAME} (${SYSTEM_START_DATE})"
