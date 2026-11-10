#!/bin/sh
set -eu

WEB_ROOT="${WEB_ROOT:-/usr/share/nginx/html}"
DIRS="${SYSTEM_BACKGROUND_DIRS:-/backgrounds}"
MANIFEST_DIR="$WEB_ROOT/backgrounds"
MANIFEST="$MANIFEST_DIR/manifest.json"

mkdir -p "$MANIFEST_DIR"

URLS="$(mktemp)"
JSON="$(mktemp)"
trap 'rm -f "$URLS" "$JSON"' EXIT

OLD_IFS="$IFS"
IFS=','

for raw_dir in $DIRS; do
  dir="$(printf '%s' "$raw_dir" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')"
  [ -n "$dir" ] || continue

  case "$dir" in
    /*) ;;
    *) dir="/$dir" ;;
  esac

  dir="/$(printf '%s' "$dir" | sed -e 's#^/*##' -e 's#/*$##')"
  fs_dir="$WEB_ROOT$dir"

  if [ ! -d "$fs_dir" ]; then
    echo "backgrounds: directory not found: $dir" >&2
    continue
  fi

  find "$fs_dir" -maxdepth 1 -type f \
    \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' \
    -o -iname '*.webp' -o -iname '*.avif' \) \
    | sort \
    | while IFS= read -r file; do
        base="$(basename "$file")"
        encoded="$(printf '%s' "$base" | jq -Rr @uri)"
        printf '%s/%s\n' "$dir" "$encoded"
      done >> "$URLS"
done

IFS="$OLD_IFS"

jq -R -s 'split("\n") | map(select(length > 0))' < "$URLS" > "$JSON"
mv "$JSON" "$MANIFEST"

count="$(jq 'length' "$MANIFEST")"
echo "backgrounds manifest generated: $count image(s) from ${DIRS}"
