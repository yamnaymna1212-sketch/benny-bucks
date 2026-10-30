# INSIDE MONEY — master brief (everything decided so far, 2026-10-29). Read this first in any new session.

## 1. Why we changed (TikTok Studio data, last 28 days)
- 415K views (+35%), 90% For You, 83.6% US, age 25-34 biggest; BUT net followers -424 and most penguin videos stop at 500-1,000 views.
- Same topic (gas USA vs Iran): stick-figure/"Benny" detective script = 65K views, 27% full-watch, 29 s avg; penguin caveman "3 reasons" script = 29K, 8%. Kuwait/India penguin: 4.6K / 9.5K, 5-7% full-watch, avg 14-16 s of 65 s.
- Diagnosis: script structure + delivery + scattered channel identity (penguin, stick man, price gaps, explainers). Decision: ONE clear niche = "how money / banks / finance really work", 3D cutaway style (references: You Built It pool video, Zack D. Films).

## 2. Format (locked)
- 3D cutaway, ONE continuous camera move, no cuts; one clear main subject always in frame (never cropped); something moves every 2-3 s; never a static shot.
- Captions: 1 word at a time, Montserrat ExtraBold, white; RED for prices/danger/loss words, GREEN for money-positive words (green = assumption, user never confirmed). Not cartoonish, no cards/signs/icons over the picture.
- Real, not cartoon: real city HDRI (Poly Haven sunset_jhbcentral), real PBR textures, real glTF models. One bank only: no McDonald's/clutter (real brands ARE allowed by user, but only when relevant).
- Voice: Kokoro am_fenrir (free, tools/tts.py), no gaps (max_gap 0.06). Word timing from faster-whisper (align.py). Audio never silent: air bed + whoosh per camera move + riser before twist + boom/sub on twist + ting on key number + money SFX (user library studio/public/sfx).
- MIN 60 s: every video must be >= 60 s (aim 61-65 s); anything shorter is rejected (user rule 2026-10-29). Start 1 video/day, scale to 3/day only after the template is stable.

## 3. Script rules
- See SCRIPT_STRUCTURE.md (7 beats + psychology) and ../penguin-series/script-formula-v2.md.
- SAFETY (TikTok is strict on money): nothing illegal/encouraging, no misleading claims, no made-up/huge numbers, no "do this/buy this", no promises, nothing sensitive. Every number sourced in facts.md.
- No main character for now (Mint placeholder in CHANNEL_BIBLE.md, parked). Revisit after 3-5 videos if completion is good but follows are low.

## 4. Files
- ep0-v2/: current 16 s test (v2.html scene, timeline2.json, mix2.py, render2.cjs, words.json, lines.txt, facts.md). Output: bank-v2-16s.mp4 (rendering in cloud) / hook-preview-5s.mp4.
- render-kit/: run on the user's Mac GPU (README inside).
- prototype/, ep0-bank-test/: older stills/tests (cartoon-ish, superseded).
- REFERENCE_ANALYSIS.md: measured pool reference (no cuts; calm 0-15 s, active 18-45 s with dive/pull-out every 6-9 s, calm end).

## 5. Idea backlog (verify numbers with sources BEFORE building; use doug-ideas style research)
Money-mechanism series: 1 where your money goes after you tap a card (chip -> terminal -> bank ledger) / 2 what is really in a bank vault (0% reserve, loans loop = current ep0) / 3 how a wire transfer moves money in seconds / 4 how to spot a fake bill (detection only) / 5 how a stock exchange matches buyer and seller / 6 what happens in a bank run / 7 compound interest visualised / 8 how cash reaches an ATM / 9 how a coin is minted / 10 how a credit score is built (no advice).
Price-gap ideas (older, optional): US ambulance vs UK/Germany; insulin vs Canada; Ozempic vs France (list prices); childbirth vs UK; childcare. All need fresh sourcing; avoid unfair comparisons.

## 6. Open items
- Ask user: caption green = positive words only? ep0 story = money circulation (done) or "deep under the bank" (Fed gold vault ~80 ft under NYC, verify)?
- Render on user's Mac GPU (needs Remote Control link or render-kit); cloud render ~25 min.
- Credit in description: car "Car Concept" by Eric Chadwick / Darmstadt Graphics Group CC BY 4.0; Poly Haven CC0.
- TikTok: turn on AI-generated label (synthetic voice); pin a binary question comment.
- Doug penguin channel + CLAUDE.md Doug rules are LEGACY (kept for reference).

## 7. EP2 status (2026-10-30) — read ep2-dig-200m/PLAN.md + SCRIPT.md
Script v1 re-verified (see bottom of SCRIPT.md; gold $3,993.60/oz -> ~$813 B). Voice: Kokoro am_fenrir 1.18, one take, 64.2 s (vo.wav, vo.timings.json). User wants BETTER quality: animated rigged character, realistic rocks/strata, particles, voice = energetic young American with no pauses (compare am_liam / am_puck / am_michael on the hook line first). Next: hook 5-s preview only; do NOT render full before approval.
EP2 RENDERED 2026-10-30: render-kit/ep2-dig-200m.mp4 (62.74 s, am_liam 1.15, GPU M3 ~4 min with 4x motion blur). Scene: ep2.html (bank, vault, subway 191 St, heat grade, water jets, Water Tunnel No. 3 reveal at 43.7 s = 70%). Known weak spots: 8-22 s vault/door shots without the digger; hands in front of face on the raised swing. Pinned comment: "Gold or water — which one is worth more under New York? Comment GOLD or WATER".

## 8. EP2 v2 — FINAL STATE (2026-10-30, user said "good")
**Output:** render-kit/ep2-dig-200m-v2.mp4 (62.3 s, GPU Apple M3, ~10 min) + ep2-dig-200m-v2-phone.mp4 (20 MB). v1 (ep2.html) was rejected: camera had no event to follow, digging repeated > 2 s.
**Story:** "What if you dug under the bank that stores $800B in gold?" -> digging, rock, water, pump, concrete wall, 6,000 t gold, 90-ton door -> alarm, Fed police, helicopter, FBI, up to 20 years (18 U.S.C. 2113) -> twist: that gold doesn't back your money (1971) -> wallet, ATM, armored truck, balance drops while gold doesn't move -> digger stuck/pulled out -> muddy shovel -> vote ("gold or a bank balance"). 24 lines = 24 shots. Script + sources: ep2-dig-200m/SCRIPT.md ("EP2 v2").
**Files:** ep2-dig-200m/v2/ (lines.txt, vo.wav = Kokoro am_liam 1.15 ONE take + atempo 0.98 = 61.9 s, vo.timings.json, words_raw.json, build_timeline.py, mix_ep2v2.py); render-kit/ep2v2.html (scene), timeline_ep2v2.json, mix_ep2v2.wav, render.mjs entry `ep2v2`.
**Commands (from render-kit):** `npm run render -- ep2v2 5` = 5-s hook preview; `npm run render -- ep2v2` = full; `node stills.mjs ep2v2.html <t...>` = stills (cheap check); rebuild timeline: `python3 ep2-dig-200m/v2/build_timeline.py`; mix: `~/kokoro-tts/venv/bin/python ep2-dig-200m/v2/mix_ep2v2.py` (from videos/inside-money). New machine: render-kit/dl + node_modules are NOT in git (npm install && npm run setup).
**User feedback that is now a rule (also in skill inside-3d-quality):** (1) first zoom of the hook within 1 s, fast; (2) gold must look real (tapered rounded bars, criss-cross layers, studio env, no glow, nothing in front); (3) camera always centred on the subject, near-frontal; (4) video must feel ONE continuous story even with many shots: no hard cuts, fly-moves; (5) after the hook NOT too fast, NOT jerky: moves >= 0.85 s, pan-then-zoom (zoom in) / pull-back-then-pan (zoom out); (6) one take of voice; hook preview first, full render only after approval.
**Known weak spots / todo before posting:** digger holds a pickaxe all video (shovel appears only at the end); arms cross over the helmet when hauled up; frame centring on 'below sea level' shot (~12 s) settles late; re-check gold spot price on publish day (needs >= ~$3,930/oz for '$800 billion'); armored-truck/pump claims are generic, helicopter/FBI are dramatised hypotheticals; turn on TikTok AI-generated label; pinned comment: "Gold or bank balance — which would you rather have? Comment GOLD or BALANCE". Credits: Poly Haven CC0, MakeHuman CC0.
**Git:** branch claude/infallible-swartz-ae1ea5 (NOT merged to main yet).
