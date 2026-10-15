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

## Style B: "grid" (user's reference video — preferred for new videos)
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
