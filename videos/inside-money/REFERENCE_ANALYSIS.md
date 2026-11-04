# Reference analysis: "How a Hole in Your Yard Becomes a Swimming Pool" (You Built It) — file: ssstik.io_1793267516348.MP4 on origin/main (now at references/inside-money/examples/pool-example-you-built-it.mp4)
Measured with ffmpeg (2026-10-29): 66.6 s, 720x1280, 30 fps, h264 + aac.
- **No hard cuts** (scene-change detector finds none at 0.08) = ONE continuous 3D camera move through ONE scene whose state changes over time.
- **Composition**: house/sky on top ~1/3 (anchor, always visible when wide), earth cross-section ~2/3 (the stage). Camera alternates wide (house) <-> macro dive (drain, valve, pump, pebbles), a new framing about every 3 s.
- **Caption**: ONE word at a time, centred (~y 52%), white rounded font + dark outline, fixed on screen (not in the 3D scene), changes with each spoken word.
- **Audio**: continuous narration, no silent gaps; mean ~ -23..-27 dB, peaks -8..-13 dB (loudest 0-8 s), tail fades at 64 s. (Cannot tell voice vs music from numbers.)
- **Story arc** (frames every 3 s): dig hole (0-12) -> groundwater/problem with arrows (12-24) -> concrete shell + pressure valve macro (18-27) -> pump + filter (27-36) -> skimmer/drain macro, circulation arrows, leaves/sand (36-54) -> PAYOFF with people swimming, umbrella, floaties (54-66).
- **Visual rules**: white arrows show direction of flow/force; strong colour separation (blue water / brown strata / green striped grass / white pipes); PBR rock-strata soil; soft sun shadows; sky with clouds; props for life (hose, chairs, tree); people only appear in the payoff.
## Copy for Inside Money
One continuous camera path per video through a bank street cutaway; scene state advances with the narration; 1 word caption centred; payoff scene with people using the money; 60-66 s; narration with no pauses; 720x1280 @30 is enough.
Render budget: ~2000 frames; measure s/frame in the build session (swiftshader, no GPU).

## Camera motion (OpenCV Farneback optical flow, 2026-10-29) — install: `pip install opencv-python-headless` (container is ephemeral: reinstall each session)
speed = mean px/frame-step at 180x320 (avg 2.04, max 11.9); zoom>0 = dolly-in, <0 = pull-out.
- 0-15 s CALM (speed 0.5-1.9, slow drift while narrator sets up) -> 18-45 s ACTIVE (speed 3-5: alternating dive-in (+2.3 at 18 s, +1.4 at 36 s) and pull-out (-2.0 at 24 s and 33 s), fast pans up to 5 at 30 s and 42 s) -> 45-66 s CALM again (speed 1-2), nearly still at the end (0.18) for the payoff.
- Rule to copy: slow open, 25-30 s of dive/pull-out rhythm every ~6-9 s, slow settle for the payoff.

## Zack D. Films style: zack-01-boy-repaid-rescuer.mp4 (36.5 s, 480x854 copy, 2026-10-30) — sheet: references/inside-money/analysis/zack-01-sheet.jpg
- Cut every ~1.5-2.5 s (many shots, NOT one continuous move) — close-ups of faces, over-shoulder, wide establishing.
- Realistic rigged humans with FACIAL EXPRESSIONS (fear, crying, surprise "O" mouth), cloth, hair, skin shading; water/splash simulation; shallow depth of field (blurred background).
- Bright saturated daylight, cyan sky, soft GI lighting = offline renderer (Blender/Unreal level), not real-time WebGL.
- Caption: small white lowercase phrase (2-3 words), centred ~y 78%, thin dark shadow.
- Copy for Inside Money: emotion close-ups on the character's face at the key beats, depth of field, bright sky, cut on every line if we leave the one-shot format. Cannot be matched in Three.js: faces/expressions, cloth, water sim -> needs Blender (Cycles/Eevee on the M3) + rigged characters (Mixamo / Character Creator).

## Pool sheet re-check (references/inside-money/analysis/pool-sheet.jpg)
- Stylised-real (toon-ish clean geometry), cutaway earth 2/3 of frame, white arrows, rounded white 1-word caption centred ~y 52%. This level IS reachable in the Three.js render-kit.

## USER STYLE RULE 2026-10-31 (from Zack screenshots: references/inside-money/analysis/zack-glow-*.png)
- Every IMPORTANT thing the viewer must notice gets a SPECIAL GLOW: bloom + emissive rim in a meaning colour — GREEN = money/gain, RED = cost/problem/danger, YELLOW = key number/warning, WHITE = neutral highlight. Examples: red 3D "$9" over a head, green glowing "$5" next to the bills, bills themselves glowing in the hand.
- Prices float as BIG 3D extruded text (bevelled, slightly tilted, soft shadow) next to the object/person they belong to, whenever a price is spoken.
- Every character looks DIFFERENT: face, skin tone, hair, body, clothes. Bank staff dressed by role (research 2026-10-31): teller = business-professional shirt/blouse, often no jacket, name badge; manager/officer = suit or blazer + tie/pumps; security guard = uniform + cap/badge; back office = business casual.
- Extra real-world props for realism (counter glass, rope stanchions, pens on chains, deposit slips, ATM, wall clock, plants, flag, brand-free signage).
- Captions in this style: 2-3 words, white bold lowercase-ish, low-centre (~y 75%).

## Zack D. Films #2: zack-02-slow-pauses.mp4 (the "missing dollar" riddle, 50.7 s, 720x1280, 29.97 fps) — measured 2026-10-31
- Voice: calm, neutral storyteller, matter-of-fact. 112 words in 50 s = **2.24 words/s**; mean word length 0.38 s.
- **Weak point (user feedback): too many pauses, not fast.** 11 gaps > 0.25 s (8 > 0.5 s, typical 0.7-0.86 s between sentences), 7.0 s of silence = 14 % of the video.
- Cuts: ~10 scene cuts in 50 s (1.5, 4.2, 12.5, 16.7, 18.3, 18.8, 30.6, 32.5, 33.3, 42.1 s) = one cut every ~5 s, slower than Zack #1 (cut every 1.5-2.5 s).
- Visuals (user screenshots): floating 3D price per spoken amount (red $9, green glowing $5, glowing bills in hand), 2-3 word caption low-centre, DoF, over-shoulder + close-ups.
## Our targets for EP4 (copy the style, FIX the weak point)
- Keep: calm confident narrator tone, 2-3 word low caption, floating glowing 3D prices, shot types.
- Beat him: **3.2-3.4 words/s, pauses <= 0.12 s inside a sentence and <= 0.2 s between sentences (max_gap 0.05)**, a visual change/cut every 2-3 s, never a static shot.
- Never clone a real person's voice; use a Kokoro American male voice with the same calm tone.

## Zack D. Films #3: references/inside-money/zack/zack-03.mp4 ("She shot at the president", marine hero story) — measured 2026-11-03
Sheets: references/inside-money/analysis/zack-03-sheet.jpg (1 fps) and zack-03-hook-sheet.jpg (first 5 s, 3 fps). 33.2 s, 720x1280, 29.97 fps, -8.1 LUFS (loud, LRA 1.8), NO silence > 0.25 s at -35 dB.
- **Hook (0-5 s)**: first-person BULLET POV: gun in foreground, bullet flies through frame, president's face reacts (open-mouth shock), camera follows the bullet past his head (macro on hair), whip-pan with motion blur into the shooter. The caption starts at 0 s. The story is understood with no sound.
- **Camera**: handheld-feel, ALWAYS moving (optical-flow speed 2.2-6.0 px/step in every 3-s window, peaks 10-15 at whips). Mostly push-ins (zoom +5..+12) with 2 pull-outs at 21-27 s. Cuts disguised as whip pans / object wipes (bullet, hand, paper); only ~3 hard cuts, ~20+ shots in 33 s = a new shot every ~1.5 s. Macro inserts: bullet, shoe, thank-you letter signature, newspaper, whisky bottle, framed letter.
- **Characters**: offline-rendered (Unreal/Blender class) realistic humans, skin subsurface, individual hair strands, wet eyes, clear emotion close-ups (shock, shame, grief); crowd of background extras with phones/hands on mouth reacting; role by costume (suits+sunglasses guards, white shirt marine, military caps).
- **Light**: golden-hour / blue-hour colour split (orange practicals vs blue fill), shallow DoF, film grade, strong contrast between day street and dark interior.
- **Caption**: 2-3 words, white bold, centred ~y 70-74 %, thin shadow, synced to each phrase. ~2.3 words/s, no pauses.
- **Story**: hook event -> twist -> consequence -> sad payoff shown with objects (framed letter on wall). Every phrase = a new image.
- **Sound** (cannot separate from file alone): constant bed + hits on impact; loudness -8 LUFS means a mastered mix, louder than ours.
### Gaps vs our Three.js (EP9)
Faces/eyes/hair strands (biggest), skin shading, extras reacting, DoF + motion blur on whips, handheld camera energy, macro inserts every 1.5 s, object-wipe transitions, grade. Three.js can improve: whip-pan blur transitions, macro inserts, DoF (BokehPass), extras with reaction poses, grade, louder master. Cannot reach: face realism -> needs Blender/Unreal MetaHuman.
