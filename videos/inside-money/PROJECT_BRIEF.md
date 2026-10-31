# INSIDE MONEY — master brief (everything decided so far, 2026-10-29). Read this first in any new session.

## 0. LATEST USER RULES (2026-10-31, from EP4 feedback) — these OVERRIDE older lines below (sections 2-3)
Template episode = EP4 (ep4-print-million/PLAN.md + render-kit/ep4.html). Start every new video from it.
**Hook (0-5 s)**
- Understood with NO sound in the first 1-2 s: one clear story, few elements, ordered and symmetric, nothing scattered.
- The main character (Mike) is in the hook, watching the event (over-the-shoulder / foreground), and reacts (head turn, surprised arms).
- Show the real actors of the topic (e.g. government = building + "U.S. GOVERNMENT" + US flags + official at a podium + money printer; people walk up, take, leave). Do NOT open on a flag alone.
- Every title/sign fully in frame and centred; never crop a key element or its text.
**Shots and story**
- Every spoken line = a NEW scene, angle or action (cut on the word). Never keep the same scene for long. Cuts every 2-3 s; inside an explainer the camera may move continuously, but always centred on what is being explained, slow professional moves, nothing important cropped.
- Characters must move: walk cycles, gestures, taking/giving, celebrating, shrugging. Every character looks different (MakeHuman cast, videos/inside-money/characters/).
**Look**
- NEVER a black/empty studio background. Real sets only: outdoor square with city HDRI sky, bank lobby, street with shops, government building.
- Explanations use REAL objects, never primitives: real US map from Census GeoJSON with people popping out of it, $10,000 cash bundles stacked on wooden pallets, real flags (50 stars, 10:19, waving), real signs (price boards, FOR RENT, gas pump screen), balance scale with real props.
- Zack glow rule: every key number floats as 3D text with a meaning colour (GREEN money, RED problem/price up, YELLOW key fact, WHITE neutral); bills glow in hands. Glow ONLY on those (bloom threshold 1.3, strength .45, radius .18, low scene lights) so the image never looks hazy.
- Captions: 2-3 words, white, bold, centred on screen (left 60 px, width 600 px), ~74 % height.
**Voice / pace**
- Kokoro am_liam (user's choice), speed ~1.10, max_gap 0.04, one take, 61-65 s. Target >= 3.2 words/s, pauses <= 0.25 s (Zack's weak point = slow with 0.8 s pauses). Fix whisper caption typos (math/way/meet).
**Process**
- Check stills (node stills.mjs ep4.html t1 t2 ...) for every beat BEFORE a render; 5-s hook preview first; full render only after the hook is approved (~2 min on M3); send a phone copy (crf 26).
- The user gives blunt feedback in batches; fix ALL points of a batch, then render once.

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
