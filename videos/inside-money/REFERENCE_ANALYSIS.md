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

## Zack D. Films: zack-02-missing-dollar-hotel.mp4 (hotel "missing dollar" riddle) — MAIN REFERENCE (user 2026-10-30) — sheet: references/inside-money/analysis/zack-02-sheet.jpg
Measured 2026-10-30 (ffmpeg + numpy, same metrics run on our EP2 v2 for comparison): 50.7 s, 720x1280, 29.97 fps.
- **No hard cuts**: scene detector at 0.3 finds 0. Shot changes are FAST CAMERA MOVES (whip/push with motion blur): 22 moves, avg 0.37 s long, one every ~2.1 s, dense in the story part (0-33 s), then calmer for the math explanation (33-50 s). Only 6 of 50 seconds have low visual change. -> "every second something changes" confirmed.
- **Story first, money as the subject**: 3 friends, manager, bellhop, real hotel lobby (sofa, desk bell, monitor, carpet, ceiling lights), REAL banknote textures held in hands (close-ups of $10/$5/$1 bills), a screen close-up "Amount Due $25.00".
- **Characters look real**: skin shading, faces with expressions, hair, clothes with logo (ZACK D FILMS shirts), hands holding money, eye contact to camera; shallow depth of field on close-ups.
- **Numbers as floating 3D/graphic red text** ($30 over the door, $9 over a head, $27 over the bellhop, "$1?" at the end) and pure number cards on a light-blue radial gradient for the math (9x3=27, $29) — the visual explains the maths.
- **Captions**: small white phrase (2-4 words, lower case), centred ~y 78%, soft shadow; not 1 word.
- **Audio** (user observation confirmed by numbers): loudness -11.3 LUFS (ours -14.4), LRA 2.0 = always loud, never drops. Time below -35 dB: 2.4 s in 50 s (ours 6.4 s in 62 s = 2.7x more quiet). High/low spectral ratio 1.39 (ours 0.75): a constant layer of crisp high-frequency SFX (whooshes, foley, cloth, paper, room) runs UNDER the voice the whole time, not only on transitions (energy during moves = same as rest, x0.99). Every pause in the voice is filled by an effect.
- Hook frame 1: hands + money on the hotel desk, caption "check into", story starts mid-action, no intro.

### Copy for Inside Money (priority order)
1. **Audio bed never silent**: fill every voice gap (> 0.05 s) with an SFX; add a continuous soft foley/room layer + a soft whoosh on EVERY camera move; master to about -11 LUFS. Cheapest, biggest gain.
2. **Shot rhythm**: a fast motion move (0.3-0.45 s, motion blur) every ~2 s in the story part; calmer, slower moves in the explanation part. (EP2 v2 already: 0.85 s moves after the hook — user wanted calmer; keep 0.5-0.85 s.)
3. **Money must be real-looking**: real banknote textures (US currency photos are allowed in media if clearly not printable; keep them non-full-size/angled), money in hands, receipts/screens with amounts.
4. **Numbers as floating red 3D text over the subject** + number cards for maths (we already do 3D text; add the card style).
5. **Characters**: biggest gap. Three.js MakeHuman has no expressions; options: (a) Mixamo/RPM characters with blend-shape faces + DOF in Three.js; (b) Blender EEVEE/Cycles render for Zack-level skin/light. Decide after 2-3 more episodes.
6. Real interior sets (room, furniture, lamps) instead of only the cutaway: one set per story beat.
