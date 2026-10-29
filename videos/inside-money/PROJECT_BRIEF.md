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
- 15 s test first, then 30-45 s (rewards need >60 s but are tiny; reach matters more). Start 1 video/day, scale to 3/day only after the template is stable.

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
