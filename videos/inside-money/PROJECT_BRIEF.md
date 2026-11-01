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
- Kokoro am_liam (user's choice), speed ~1.10, max_gap 0.04, one take, 61-65 s. Target >= 3.2 words/s, pauses <= 0.25 s (Zack's weak point = slow with 0.8 s pauses). Fix whisper caption typos (math/way/meet). In the TTS text write every amount in words ("one million dollars", never "$1 million": Kokoro misreads symbols - EP3 hook bug 2026-10-31).
**Publish kit (RULE, user 2026-11-01): every episode ships ep<N>/PUBLISH.md with the same 6 items**
- Caption/title: the hook as a claim or question + 1-2 emoji + the vote question (<= 100 chars of text), written for Americans.
- 3 alt titles (A/B tests): number-first, 'why' question, character/story angle.
- 7-9 hashtags in this order: topic tags (3) + #moneyexplained #personalfinance #howmoneyworks (always) + #usa. Never banned/misleading tags (no #fyp spam, no #investing/#getrich promises).
- Poll (2 options with emoji) + pinned comment = the same binary question (SOFA/PLAN style: one word to type).
- Description footer: 'Education only, not tax advice' (money topics), AI-generated label ON (synthetic voice), illustrative-money note.
- Before posting: list every number to re-check + its source site. Template = ep4-print-million/PUBLISH.md and ep5-tax-sofa/PUBLISH.md.
**EP5/EP6 feedback rules (user 2026-11-01) - apply to every new episode**
- Voice: ONE continuous Kokoro take (join all lines into one string, 'text|0'), no pauses (max_gap 0.1, longest pause <= 0.15 s); measure 61-65 s. Per-line takes sound choppy: user rejected them.
- Camera: NEVER hard cuts. One continuous move that flies from the end of a scene into the next (exit a cutaway house through its open front first); no static shot > 2 s; something moves/pops every ~2 s.
- Characters must always move: idle breathing/sway/head turns + gesture with the words; no frozen poses.
- Hook = ONE short, instantly understood, contradictory sentence (user's own wording, only fix grammar). Payoff for any hook promise must appear at the end.
- Money must look real (straps with coloured bands, real size ratio, $100 vs $20 chosen so the amount physically fills the scene). Floating numbers never cropped; light/colour grade strong (contrast 1.12, sat 1.28, MSAA x4).
- World = a whole American neighbourhood (Maple Street), never a lone house on grass. Template: render-kit/ep5.html (day) and ep6.html (night + pit).
- Run render commands FROM render-kit (cd first); `npm run` fails elsewhere. Stills sheet helper: render-kit/sheet.sh / sheet6.sh.
- Idea format that works: two characters (or two friends) with opposite outcomes from the same money (EP5), or a naive honest hero finds money and the law/tax twist (EP6). Idea list verified 2026-11-01 (see ep6 chat): FDIC $250k split banks; Social Security 62 vs 70 (70% vs 124%); tax refund = free loan to IRS ($3,571 avg 2026 to Mar 20); 401(k) match free money; credit-card minimum payment ($1,000 -> ~$1,775 in 71 months at 22.15% APR, min = max($25, interest+1%)).
**EP6 feedback rules (user 2026-11-01) - ALWAYS apply, the user must never have to repeat them**
- Hero: the channel hero is ALWAYS Mike (cast mike.glb, blue tee + jeans), whatever the story calls him (EP6: Danny). Never reuse another cast model as the hero. Friends/staff = other cast members.
- Hook timing: the video starts right after the 'ting': first word at t=0 (no silent pre-roll), the action already moving in frame 1. Scene time = video time + T0 (.45 s) so the first SFX can sit before the voice.
- Hook content: show the ACTUAL action the sentence promises (EP6: digging in a deep shaft, dirt flying, the clink, trunk opens on 'ten million'); the treasure must be readable (heaped $100 straps, glow only on the key money + floating number); a lit, readable room even at night (never a dark murky image); no hazy/bloomed whites.
- Smoothness: no lag / jerks / flicker. Camera = monotone Hermite through keys (never Catmull-Rom overshoot); soil/wall boxes inset so they never z-fight; hide any position jump (teleport) by looking away or leaving frame, never on screen.
- Phone in hand = flat on the ear with the right-arm solver (solveEar), never at the shoulder.
- Voice must be clear and human: Kokoro am_liam speed 1.0, max_gap .26 (natural pauses at sentence ends, ~0.5 s max), every word audible, never rushed/merged; then fill pauses with SFX; keep 61-65 s by CUTTING sentences, not by speeding up.
- Sync visuals to words: every noun the voice says appears ON that word (SWAT team appears on 'SWAT', helicopter on 'helicopter'); camera moves never feel like cuts (fly, don't jump).
- SFX: every event has a sound; long SFX are trimmed (cut()) so they never bleed into the next word; joy SFX ONLY inside the joy words; regret = boom + fahh; story beats get whoosh/pop/ting/cash.
- Imagination bubbles (dream/fear): the objects (house, car, plane) are centred, stacked in order, side-on, big and clear, no spinning, with the speaker in frame.
- No dead moments: nobody stands frozen, something appears/moves every ~2 s; filler beats get SFX or pops.
- CTA: ask a choice between two ACTIONS in plain words ('take the legal path and give it to the bank, or enjoy it and live your dreams?') and 'Comment A or B' with two floating one-word signs (BANK/DREAMS), not character names.
- Time honesty: say how long a build really takes; a new set of scenes (not a copy of a template) is a big job: offer to do it in stages.
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

## 8. EP3 status (2026-10-31) — read ep3-1m-cash/PLAN.md
EP3 "$1M in cash" v2 RENDERED: render-kit/ep3-1m-cash.mp4 (62.41 s, GPU Apple M3, ~3.5 min; not in git) + phone copy ep3-1m-cash/ep3-1m-cash-phone.mp4 (in git).
v2 = first half (4.6-33 s) rebuilt after user feedback "first half boring, same place, camera not matched to the words": now one event + one camera move per line (see PLAN.md beat table).
Scene ep3.html (?tl=timeline_ep3_full.json), mix ep3-1m-cash/mix_ep3_full.py, render `npm run render -- ep3full`. Awaiting user review of v2. Weak spots: printer shot (gray box), plain government building, sparse Fed vault, toy-like truck, shared face model; camera may pass close to Mike's shoulder in transitions (not watched in motion).
Pinned comment: "Would you carry $1 million in cash? Comment YES or NO".

## 9. EP5 status (2026-11-01) - read ep5-tax-sofa/PLAN.md
EP5 "The sofa vs the plan" (tax evasion vs legal avoidance, US version) FULL v1 rendered: render-kit/ep5-tax-sofa.mp4 (61.6 s) + ep5-tax-sofa/ep5-tax-sofa-phone.mp4. New look: a whole American suburb (Maple Street) with cutaway houses, clear blue sky, colour grade + MSAA. Awaiting user review.

## 10. EP6 status (2026-11-01) - read ep6-found-10m/PLAN.md
EP6 'He finds $10 million under his house' (Danny = Mike): hook v3 approved; full story built in ep6.html (Rick's bedroom + helicopter/SWAT nightmare, Tara's dream bubble, pickup drive at sunrise, hollow FIRST NATIONAL BANK lobby, IRS letter, 1964 piano, tax stairs + ten $1M bricks, vote line-up). Voice 62.7 s (speed 1.0, natural pauses). Full render + phone copy + PUBLISH.md: see ep6-found-10m/PLAN.md.
Lessons: Danny/hero is ALWAYS mike.glb; camera uses monotone Hermite (no overshoot); hide position jumps by panning away (bank exit); labels above heads, never behind people; joy SFX only inside joy words (cut()).
