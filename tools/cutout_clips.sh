#!/usr/bin/env bash
# Remove the white background from Benny's animated clips (free, local): every frame gets a 1px white border,
# a flood fill from that border clears all background touching the edges (outlined white areas like skin stay),
# then frames are encoded as VP9 WebM with alpha (Remotion <OffthreadVideo transparent>). Audio is dropped.
# Usage: bash tools/cutout_clips.sh   (skips clips already converted)
set -e
cd "$(dirname "$0")/.."
src=assets/character/animated; out=$src/alpha; mkdir -p "$out"
tmp=$(mktemp -d); trap 'rm -rf "$tmp"' EXIT
for f in $src/*.mp4; do
  n=$(basename "$f" .mp4); o="$out/$n.webm"
  [ -f "$o" ] && [ "$o" -nt "$f" ] && continue
  rm -rf "$tmp/f"; mkdir -p "$tmp/f"
  ffmpeg -v error -i "$f" "$tmp/f/%03d.png"
  ls "$tmp"/f/*.png | xargs -P "$(nproc)" -I{} convert {} -bordercolor '#FDFDFA' -border 1 -alpha set -fuzz 10% -fill none \
    -draw "color 0,0 floodfill" -shave 1x1 -channel A -morphology Erode Diamond:1 +channel {}
  ffmpeg -v error -y -framerate 24 -i "$tmp/f/%03d.png" -c:v libvpx-vp9 -pix_fmt yuva420p -b:v 0 -crf 30 -an "$o"
  echo "$n"
done
