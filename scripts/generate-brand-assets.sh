#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BRAND="$ROOT/brand"
PUBLIC="$ROOT/public"
CACHE="$ROOT/.brand-cache"
INKSCAPE="${INKSCAPE:-inkscape}"

mkdir -p "$PUBLIC/brand" "$CACHE/fonts" "$CACHE/fontconfig"

if ! command -v "$INKSCAPE" >/dev/null 2>&1; then
  echo "Inkscape is required to generate the brand assets." >&2
  exit 1
fi

render() {
  local source="$1"
  local output="$2"
  local width="$3"
  local height="$4"
  "$INKSCAPE" "$source" \
    --export-type=png \
    --export-filename="$output" \
    --export-width="$width" \
    --export-height="$height" \
    --export-background-opacity=0 >/dev/null 2>&1
}

download_font() {
  local url="$1"
  local output="$2"
  if [ ! -f "$output" ]; then
    curl -L --fail --silent --show-error -o "$output" "$url"
  fi
}

FONT_SPACE_400="$CACHE/fonts/SpaceGrotesk-400.ttf"
FONT_SPACE_600="$CACHE/fonts/SpaceGrotesk-600.ttf"
FONT_MONO_500="$CACHE/fonts/JetBrainsMono-500.ttf"

download_font "https://fonts.gstatic.com/s/spacegrotesk/v22/V8mQoQDjQSkFtoMM3T6r8E7mF71Q-gOoraIAEj7oUUsj.ttf" "$FONT_SPACE_400"
download_font "https://fonts.gstatic.com/s/spacegrotesk/v22/V8mQoQDjQSkFtoMM3T6r8E7mF71Q-gOoraIAEj42Vksj.ttf" "$FONT_SPACE_600"
download_font "https://fonts.gstatic.com/s/jetbrainsmono/v24/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8-qxjPQ.ttf" "$FONT_MONO_500"

cat > "$CACHE/fontconfig/fonts.conf" <<EOF
<?xml version="1.0"?>
<!DOCTYPE fontconfig SYSTEM "fonts.dtd">
<fontconfig>
  <dir>$CACHE/fonts</dir>
  <cachedir>$CACHE/fontconfig/cache</cachedir>
  <config></config>
</fontconfig>
EOF

cd "$ROOT"

render "$BRAND/aurora-icon-small.svg" "$PUBLIC/favicon-16x16.png" 16 16
render "$BRAND/aurora-icon-small.svg" "$PUBLIC/favicon-32x32.png" 32 32
render "$BRAND/aurora-icon-small.svg" "$PUBLIC/favicon-48x48.png" 48 48
render "$PUBLIC/favicon.svg" "$PUBLIC/favicon-96x96.png" 96 96
render "$BRAND/aurora-icon-fullbleed.svg" "$PUBLIC/apple-touch-icon.png" 180 180
render "$BRAND/aurora-icon-fullbleed.svg" "$PUBLIC/pwa-192x192.png" 192 192
render "$BRAND/aurora-icon-fullbleed.svg" "$PUBLIC/pwa-512x512.png" 512 512
render "$BRAND/aurora-icon-maskable.svg" "$PUBLIC/pwa-maskable-512x512.png" 512 512
render "$BRAND/aurora-mark.svg" "$PUBLIC/brand/aurora-mark.png" 512 512
render "$BRAND/aurora-mark.svg" "$PUBLIC/brand/aurora-mark@2x.png" 1024 1024

FONTCONFIG_FILE="$CACHE/fontconfig/fonts.conf" \
  render "$BRAND/aurora-og.svg" "$PUBLIC/og-image.png" 1200 630

if python3 -c "import PIL" >/dev/null 2>&1; then
  python3 - <<PY
from PIL import Image

frames = [
    Image.open("$PUBLIC/favicon-48x48.png").convert("RGBA"),
    Image.open("$PUBLIC/favicon-32x32.png").convert("RGBA"),
    Image.open("$PUBLIC/favicon-16x16.png").convert("RGBA"),
]
frames[0].save(
    "$PUBLIC/favicon.ico",
    format="ICO",
    sizes=[(48, 48), (32, 32), (16, 16)],
    append_images=frames[1:],
)
PY
else
  echo "Pillow not found: skipping favicon.ico generation." >&2
fi

echo "Brand assets generated in $PUBLIC"
