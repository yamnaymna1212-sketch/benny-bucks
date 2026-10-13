#!/usr/bin/env bash
# Make transparent PNG cutouts: flood-fill near-white background from the 4 corners (keeps white areas enclosed by outlines, e.g. Benny's skin).
set -e
cd "$(dirname "$0")/.."
in=studio/public/gen
for f in $in/*.jpg; do
  o="${f%.jpg}.png"
  [ -f "$o" ] && [ "$o" -nt "$f" ] && continue
  W=$(identify -format "%w" "$f"); H=$(identify -format "%h" "$f")
  convert "$f" -alpha set -fuzz 9% -fill none \
    -draw "color 0,0 floodfill" -draw "color $((W-1)),0 floodfill" -draw "color 0,$((H-1)) floodfill" -draw "color $((W-1)),$((H-1)) floodfill" \
    -channel A -morphology Erode Diamond:1 +channel "$o"
done
echo done
