---
name: benny-collage-edit
description: Fast, consistent Benny Bucks collage edit (free, local Remotion). Use when building, animating, timing or rendering any Benny video in the paper-collage style: scenes, camera, SFX, captions, pacing, QA.
---
# Benny collage edit system (free, no API)
Files: `studio/src/collage.tsx` (TornSplit, Field, Piece, Card, flags), `studio/src/collageVideo.tsx` (CollageVideo, zoomTo, punchIn),
per-video props in `studio/src/videos/<slug>Props.tsx`. Reference build: `studio/src/videos/collegeGermany.tsx`.

## Look (never change per video)
- Light "white caramel" paper backgrounds only (never dark/black, never plain white). Two sides = two light tints (peach #F6D3BC vs mint #D2E7D3); catches #F5E3B5, debt #F4CFC6, ending #E3D8EE.
- Strong color lives in objects and price text (US red #D2461F, other side green #1F6B4A).
- Cut-paper pieces with cream keylines + soft shadow. Benny = real cutout from `studio/public/gen/benny-*.png` (avoid poses holding unrelated props).
- Layout: objects y 180–1180 · prices (Card) y ≈ 1000–1150 · captions y 1305 · Benny y 1760, w 430.

## Pace (what makes it fast)
1. Hook: line 1 fully assembled at 0s, NO motion for the first 1.2s (HOOK_STILL). Split, both prices, Benny shocked.
2. One line = one scene = hard cut. Every cut gets an automatic camera kick.
3. Never more than ~1.5s without a new visual event: pieces enter ON the word they illustrate: `at={W(n, 'word')}` (not all at line start).
4. Entrances snap in ~0.25s (spring in `snap`); stagger ≤ 0.1s.
5. Every price: `<Card count hits={[W(n,'price word')]}>` — number rolls up + punches on the word.
6. Camera follows the narration: `zoomTo(W(n,'side A'), 1.15, xA, y)` then to side B; moves take 0.2s. Use `punchIn` for single-subject lines.
7. Landed pieces idle-float automatically (nothing is ever frozen after the hook).

## Sound (no music; voice louder than SFX)
Automatic: every object entrance = soft paper "flip", every price Card = "pop" (Piece `sound` prop; Benny silent; nothing inside the still hook).
cha-ching on prices · whoosh on every camera move · impact on the shock (auto camera shake) · ding on the key number · record-scratch on "catch/but" · pop on Benny reactions.

## Steps
1. Voice: benny-voice skill (af_bella; speed so the total ≈ 60s) → copy timings to `studio/src/data/<slug>.json`, mp3 to `studio/public/voice-<slug>.mp3`.
2. Write `lines: LineFn[]`, `cams`, `sfx` with `W = wordTimer(TIM)`; render with `<CollageVideo voice tim lines cams sfx />`; register in Root.tsx.
3. Gate 2 stills: a `-sheet` composition, 1 frame per line (at = k/30 - 10) → `npx remotion render src/index.ts <id>-sheet out/sheet --sequence --image-format=jpeg` → montage contact sheet.
4. Hook preview: `--frames=0-170`; get approval before the full render.
5. Full render: `npx remotion render src/index.ts <id> ../videos/<slug>/<slug>.mp4` (~10 min for 60s).

## QA before sending
- Frame 0 vs frame 29 identical except the caption (`compare -metric RMSE`).
- No white edge at max zoom; caption never over a price or Benny; duration ≈ 60s (ffprobe).
- Facts sourced in `videos/<slug>/script.md`.

## Style B: "grid" — THE SAVED DEFAULT FORMAT (user approved 2026-10-15; reference build: videos/foundation)
Files: `studio/src/grid.tsx` (GridField, AnimBenny, Word, Banner, PriceTag, Obj), example `studio/src/videos/gridTest.tsx`,
reference + analysis in `references/videos/style-ref-gas-iran-*`.
- White graph paper (GridField, bleeds for camera moves). Props get a thin black contour (Obj) — no keylines/shadows.
- Benny MOVES: `<AnimBenny clip="long-receipt-facepalm" ...>` from `assets/character/animated` (index there). Transparent
  WebMs come from `bash tools/cutout_clips.sh` (already in `assets/character/animated/alpha`, copied to `studio/public/anim` by prep_assets.sh).
  In the hook use `play={1.2}` so Benny is frozen for the still first second.
- 2–3 shots per line (≈ one new shot per second): switch Benny clip + keyword on spoken words with `at={w('word')} until={w('next')}`.
- Hook: `<Banner text="WHY">` + flags + `<PriceTag>` per side + Benny in the middle + red `DrawArrow`s on each side's word; camera pans side to side with the words.
- Keywords: `<Word>` big colored text (red italic for bad, green for good), orange/red DrawArrow.
- Captions: one yellow word with black outline next to Benny's head: `captionFill="#FFD43B" captionYs={[...per line]}`.
- No real people's likeness (use cast-fed-guy etc.).

## Speed: a visual change every 0.5–0.8s (automatic)
- CollageVideo `beats` (on by default): on word starts ≥0.55s apart the framing jumps between two tight crops (1.0 ↔ 1.06, nudged L/R);
  each new line enters with a 0.16s whip (slide + blur). Lives inside each Scene so bled backgrounds cover it (no edges). Hook still is skipped.
- On top of that: 2–3 authored shots per line (Benny clip/keyword change on spoken words).

## No dead air
- Voice: per-line pause 0.05 in lines.txt and `tools/tts.py ... am_fenrir 1.25 0.08` (internal gaps > 0.08s are cut). Video timing comes from
  the voice timings, so it stays in sync automatically.
- For any external/finished video: `auto-editor` (free, open source) cuts silences in picture + sound together:
  `/opt/autoed/bin/auto-editor in.mp4 --margin 0.04s --edit audio:threshold=4% -o out.mp4`
  (install per session: `python3 -m venv /opt/autoed && /opt/autoed/bin/pip install auto-editor`).

## Icons on every spoken noun (user rule, all videos) — hand-drawn, NEVER 3D emoji
- `<CollageVideo icons>` turns on AutoIcons (`studio/src/icons.tsx`): each mapped spoken word pops its icon on that exact word,
  alternating left/right gutters (x 165 / 915, y 1180) beside the character; the hook line is skipped.
- Sources, in priority: the user's own colored-pencil assets (`img:bank`, `img:rial-stack`, `img:government-office`…) → our hand-drawn props
  (`prop:House`, `prop:Bill`, `prop:Receipt`, `prop:Plane`…) → Doodle Icons CC0 on a pastel sticker (`doodle:Crown`, `doodle:PiggyBank`…, 400+ names in
  @doodle-icons/react) → real brand logos from simple-icons (`brand:siFacebook`, `brand:siUber`…).
- For each new script add every concrete noun to `ICON_WORDS`; check them all with the `icon-gallery` composition.
- Photo sites (Wikimedia, Unsplash, Pexels) are blocked here; new hand-drawn assets from the user go to `assets/props/` (+ prep_assets.sh).

## Camera language (user rule: ZOOM ONLY)
Beat moves cycle punch · deep push · hold · pull-out; line changes = zoom-through or zoom-settle (+ automatic soft whoosh).
No camera shake, no dutch tilt, no lateral drift/whip. Hook pans must follow the side Benny points at (point-then-shocked points RIGHT).
Icons: repeated concepts cycle variety pools (money: rial-stack → Cash → $100 bill → FinanceDollar → Saving → Wallet → Coin). Use `minSeconds={60}`.
