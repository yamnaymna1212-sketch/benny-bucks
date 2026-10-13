# Benny Bucks Reference Guide

Single source of truth for style and production. Characters: `assets/character/INDEX.md`. Reference videos: `references/videos/notes.md`.

## 1. Goal
Entertaining American TikTok/Shorts stories (18–30, ~60s, length follows the story) where viewers care about Benny and learn money lessons through what happens to him. Not lectures. Every second has a purpose.

## 2. Characters
- **Benny** (never a penguin): canonical look per `assets/character/` core references (crayon-texture style of benny-front/sad/surprised). Never redesign, change outfit, or invent features. Do not use `benny-happy-offmodel`.
- Benny must feel alive: expressions, head/body movement, gestures, reactions matched to events (losing money, bad news, opportunity, relief). Don't reuse the same expression/pose back-to-back without reason.
- New poses/expressions: generate in the same style, white bg, full body, same scale; add to `INDEX.md`.
- Supporting cast (banker, advisors, Fed Guy, oil barrel, police) only when the story needs them; keep their own designs.
- **Fed Guy**: satirical cartoon character only; never attribute real quotes or statements.

## 3. World and props
- Bucksville (proposed name): American financial life — banks, tellers, credit cards, statements, payment terminals, notices; government buildings, taxes, official forms; houses, rent, cars, workplaces, shops; bills, coins, receipts, debt notices.
- Objects act on Benny and the story (a giant bill lands on his head, a terminal declines his card, expenses pile up). Invent fresh metaphors per story; examples are not templates.
- Prefer expressive characters, miniature scenes, and clear actions over generic icons. No glossy/corporate graphics.
- Color meaning: green = money/growth/good; red = debt/loss/danger. Limited palette; shading only when it adds depth or meaning.
- Comparisons side by side with consistent screen direction.

## 4. Story, hook, retention
Structure (adapt): Hook (0–3s) → Setup → Story/consequences → Twist/contrast → Payoff with real numbers → Natural ending (+ optional comment question / follow).
- Hook: surprising number, problem, unusual event, or question, shown visually at once. No intros/logos. Visual must match the claim.
- Show, don't tell: a rejected payment = attempted purchase → decline → Benny's reaction.
- Reveal information gradually; small questions lead to bigger ones; surprises at real reveals; no fake suspense or repeated questions.
- Cut dead air, repeated shots, filler, and lines the picture already says. Never pad to hit a duration.
- Ending follows logically; callbacks to the opening work well.

## 5. Scene format
- 1080×1920, 9:16, 30 fps. Safe zone: keep key text/faces out of top ~250px, bottom ~400px, right ~150px.
- One focal point at a time; no clutter. On-screen text 1–5 words, bold, readable on a phone, synced to narration; key numbers big (count up/down).
- Scene card:
```
SCENE <n>  (<start>-<end>s)
Place / Characters (expression, pose) / Props
Action: what changes on screen, synced to which words
Camera / Transition (+ reason)
Voiceover / On-screen text / SFX
Number check: source or calculation
```

## 6. Animation and camera
- Method: pose-library + cutout. Cut characters/props from white backgrounds; animate with pose/expression swaps, blink (every 3–5s) and mouth-flap variants synced to speech, squash/bounce, shake, tilt, slide/pop in-out, grow/shrink, fly-away, count-up.
- Simple but expressive; meaningful change whenever the scene continues (character, object, focus, action, or camera). A slow zoom alone is not enough. No change without a story reason, no excessive animation.
- Camera: subtle push-in (tension), pull-out (reveal), pan/track to follow action; short deliberate hold on a key number, then resume. No random zooms or shakes.
- Transitions: default cut; whip/slide for time or place; flash for surprise; match cut / zoom-through an object when it fits.
- Continuity: causal chain between scenes; consistent characters, held objects, positions, screen direction, colors, and numbers. Plan the full sequence before making assets.
- If a tool can't do a move, use a clear alternative and say so; never claim it was done.

## 7. Sound
- Narration always clearly louder than SFX (engine `SFX_GAIN`, SFX peaks ≈ 10 dB under voice); clear, natural American English; ~150–170 wpm; 0.2–0.4s beat after the hook and key numbers. Captions match the spoken words.
- SFX first, chosen by event and emotion: money (coins, register, card tap/decline), comedic/meme-style, suspense, impacts, record scratch, reactions, UI/notifications, whooshes. Each sound serves the story; no filler or repetition.
- Background music only when it genuinely improves a scene; low under narration.
- Only legally usable audio; log in `assets/audio/sfx/LICENSES.md`.
- Mix with ffmpeg: trim pauses, sync SFX to motion/text, avoid clipping and abrupt cuts, consistent loudness (~-14 LUFS), intentional silence for suspense/punchlines.

## 8. Script and accuracy
- Short, natural American English; realistic dollar amounts; culturally familiar situations and humor.
- Never invent facts, sources, or numbers. Show calculations, state assumptions (e.g. "7% average annual return"). Explain, don't give advice or promise returns.
- Original script and composition every video; learn techniques from references, never copy scenes, scripts, or characters.

## 9. Workflow
1. Topic + verified numbers. 2. Script. 3. Scene cards with word timings. 4. User approval. 5. Assets (reuse first). 6. Voice. 7. Animate/render. 8. Sound mix. 9. QA. 10. Deliver + note what worked.
- Batches: test one full video before producing several. Reuse rules/assets, not scenes.
- No paid tools/APIs without approval; state costs and limits first. Verify tools exist before relying on them.

## 10. QA before delivery
- [ ] Benny matches core references; expressions fit events
- [ ] Hook works in 1–3s; no dead air or repeated moments
- [ ] Visuals explain the concept and sync with narration
- [ ] SFX relevant, timed, mixed; narration clear; no clipping/abrupt cuts
- [ ] Text readable on phone, inside safe zone
- [ ] Facts and math verified
- [ ] Export: 1080×1920, 30 fps, MP4 (H.264/AAC), intended duration
- [ ] Report anything not verified

## 11. Pipeline (tested on gas-iran)
- Voice: `tools/tts.py` (Kokoro, free; models in /opt/tts — re-download from GitHub kokoro-onnx releases if missing).
- SFX: `tools/sfx.py` synthesizes original sounds; external sounds must be logged in LICENSES.md.
- Assets: `tools/prep_assets.sh` → `studio/public/gen` (whitened JPGs; white bg hidden with multiply blend).
- Animation: Remotion in `studio/`. `engine.tsx`: split-screen zones (top illustration band, middle `Words`, bottom `Benny` rig with blink/tilt/pose-punch), `Camera` punches/shakes, absolute-time `Scene`, `wordTimer` for word sync. `props.tsx`: hand-drawn SVG props (Pump, JerryCan, Tag, Plane, Coin, Bill, Stack, Scale, Card, Gauge, Globe, Land, FlipCard, BarStack, Sparkles, Crack, Arrow). Font: Montserrat 800–900. One file per video in `src/videos/`; Benny eye coords in `RIG`. Render: `cd studio && npx remotion render src/index.ts <id> out/<id>.mp4`, then ffmpeg loudnorm -14 LUFS into `videos/<slug>/`.
