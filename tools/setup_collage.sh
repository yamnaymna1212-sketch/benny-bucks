#!/usr/bin/env bash
# Collage pipeline is now fully local and free (studio/src/collage.tsx + Remotion). No Gemini, no API key.
# Checks the tools it needs and prepares cutouts once per session.
set -e
for c in node ffmpeg convert; do command -v $c >/dev/null && echo "$c: ok" || echo "$c: MISSING"; done
[ -f studio/public/gen/benny-front.png ] || bash tools/prep_assets.sh
echo "collage: ready (render stills: cd studio && npx remotion still src/index.ts <comp> out.png --frame=N)"
