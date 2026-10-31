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
