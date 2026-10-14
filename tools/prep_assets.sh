#!/usr/bin/env bash
# Copy assets into studio/public/gen, whitened (so mix-blend-mode:multiply hides backgrounds) and resized.
set -e
cd "$(dirname "$0")/.."
out=studio/public/gen; mkdir -p "$out"
for f in assets/character/benny-*.* assets/character/cast-*.* assets/character/rich-*.* assets/props/*.jpg assets/props/*.png; do
  [ -f "$f" ] || continue
  n=$(basename "${f%.*}")
  [ -f "$out/$n.jpg" ] && [ "$out/$n.jpg" -nt "$f" ] && continue
  lvl="0%,93%"; [ "$n" = dino-skeleton ] && lvl="0%,80%"
  if [[ "$n" == rich-* ]] && [ "$(identify -format %w "$f")" -lt 600 ]; then
    # low-res sliced poses: Lanczos 4x + close + unsharp → crisper line art
    convert "$f" -background white -flatten -filter Lanczos -resize 400% -morphology Close Disk:1 -unsharp 0x2+1.5+0.02 -level 4%,96% -quality 92 "$out/$n.jpg"
  else
    convert "$f" -resize '1080x1920>' -level "$lvl" -quality 90 "$out/$n.jpg"
  fi
done
mkdir -p studio/public/fonts
[ -f studio/public/fonts/PermanentMarker.ttf ] || curl -sSLo studio/public/fonts/PermanentMarker.ttf https://raw.githubusercontent.com/google/fonts/main/apache/permanentmarker/PermanentMarker-Regular.ttf
[ -f studio/public/fonts/Montserrat.ttf ] || curl -sSLo studio/public/fonts/Montserrat.ttf "https://raw.githubusercontent.com/google/fonts/main/ofl/montserrat/Montserrat%5Bwght%5D.ttf"
[ -f studio/public/fonts/ArchitectsDaughter.ttf ] || curl -sSLo studio/public/fonts/ArchitectsDaughter.ttf "https://raw.githubusercontent.com/google/fonts/main/ofl/architectsdaughter/ArchitectsDaughter-Regular.ttf"
echo done
tools/cutout.sh
python3 tools/rig_auto.py
