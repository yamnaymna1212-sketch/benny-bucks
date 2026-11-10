# EP18 "$1,000,000 in a pool" — first ENTERTAINMENT what-if episode (channel mode 0b, user idea 2026-11-10)
Style reference: references/inside-money/examples/trench-river-living-room.mp4 (one camera, one real set, a new object every ~3 s, build-up).
Idea (user): you dig a pool, fill it with $1,000,000, cover it with the strongest armor in the world -> will the IRS find it? Story later: the code, forgetting the code.
Honesty rules for the story: NO satellites/tanks attributed to the IRS (no evidence the IRS uses satellite photos; see facts.md). Real path = county property-tax assessors use aerial photos to find unreported pools/structures; the IRS works from records (information returns, audits, spending vs income). Frame as consequences, never a how-to.

## HOOK v1 (2026-11-10, cloud session)
- Line (user's words, grammar fixed): "You dug a pool, filled it with one million dollars, and put the strongest armor in the world on top. Will the IRS find it?"
- Voice: Kokoro am_liam 0.95, ONE take, max_gap .08 -> vo_hook.wav (6.32 s, no pause > 0.12 s). TTS text: hook.tts.txt (I.R.S. spelled with dots so Kokoro says the letters).
- Word times: make_timeline.py (faster-whisper base.en) -> words_raw.json -> render-kit/timeline_ep18.json (1-word captions; "$" words blank).
- Scene: render-kit/ep18.html (built from ep6.html's Maple Street, daylight like ep11). Front-yard pool at Mike's house (house-local PL), soil cross-section cut open in front (NOTCH clip box, closes under a white flash at "Will").
  Beats: dig in the raw hole (shovel + dirt) -> "pool": blue tiles grow up the walls, coping + chrome ladder pop, dirt pile goes -> "filled": Mike jumps out, $1 straps rain in, money level rises in 12 bricks (8 x 4 x 26 straps each = 9,984 straps of 100 x $1 ~ $1M, blue ABA bands, money-kit scale 1.51) -> "million": cash glows green + 3D "$1,000,000" + "$1 BILLS" -> "put": steel armor lid (bolts, hazard edge, vault wheel, keypad ****) falls from the sky, CLANG + dust ring on "armor" -> "top": wheel turns (locked), Mike proud -> white flash, pull back: black IRS SUV stops at the curb, red 3D "IRS?", Mike turns, shocked.
- Mix: mix_ep18.py -> render-kit/mix_ep18.wav (first word +gain, soft ting under it, shovel scrapes, pop, whoosh, money, cash on "million", boom+slap clang, ting, whoosh, shock).
- Render the hook preview FROM render-kit: `npm run render -- ep18 7` (Mac GPU). Cloud: `CLOUD=1 node render.mjs ep18 7` (SwiftShader, slow, uses /opt/pw-browsers/chromium).
- KNOWN: the cloud machine has no cast GLBs (Blender/MakeHuman build is Mac-only) -> the cloud preview uses the old guy.glb as a stand-in for Mike; on the Mac the page loads dl/models/cast/mike.glb automatically.
- WAIT for the user's hook approval before writing the full script (61-65 s) and re-recording ONE continuous take for the whole video.
