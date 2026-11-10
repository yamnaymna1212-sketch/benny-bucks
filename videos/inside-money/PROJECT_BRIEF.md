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
- Voice must be CONTINUOUS (user 2026-11-01, twice): ONE Kokoro take, no stop between sentences (am_liam speed 1.0, max_gap .08; verify with ffmpeg silencedetect -30dB d=.12: no silence except the pre-roll), every word audible, never rushed/merged. Keep 61-65 s by CUTTING sentences, not by speeding up. If the voice is re-recorded after the scene is built, keep the scene in sync with the time warp in make_timeline.py/mix_ep6.py/ep6.html (design time vs real time) instead of re-tuning camera keys.
- Sync visuals to words: every noun the voice says appears ON that word (SWAT team appears on 'SWAT', helicopter on 'helicopter'); camera moves never feel like cuts (fly, don't jump).
- SFX: every event has a sound; long SFX are trimmed (cut()) so they never bleed into the next word; joy SFX ONLY inside the joy words; regret = boom + fahh; story beats get whoosh/pop/ting/cash.
- Imagination bubbles (dream/fear): the objects (house, car, plane) are centred, stacked in order, side-on, big and clear, no spinning, with the speaker in frame.
- No dead moments: nobody stands frozen, something appears/moves every ~2 s; filler beats get SFX or pops.
- EP7 feedback (user 2026-11-01, for every next video): VOICE not fast - slower and clear, human (Kokoro am_liam speed ~0.95, never above 1.0), still ONE continuous take with dead pauses cut (max_gap .08), every word audible; if the text is too long, cut sentences, never speed up. CAMERA always on the principal subject of the line (Mike or the key object) - centred, close enough to read, never an empty/boring in-between frame (street, wall, sky) and never a transition that lingers on nothing; flights between places stay short and land on the subject. LIGHT: bright daylight by default (exposure ~1.45, hemisphere fill ~1.8, lifted shadows in the grade), check stills for dark frames before rendering. Phone copy must stay under 30 MB (crf ~31) so it reaches the phone.
- Story after the hook (user 2026-11-01, 'never say it again'): the moment the hero is introduced, CHANGE place + action + event (never stay in the hook's room). The hero lives the story through many places; places/events change only by the usual continuous camera move (same filming style, no classic cuts), so the viewer feels one shot while scenes, events and locations change.
- CTA: ask a choice between two ACTIONS in plain words ('take the legal path and give it to the bank, or enjoy it and live your dreams?') and 'Comment A or B' with two floating one-word signs (BANK/DREAMS), not character names.
- Time honesty: say how long a build really takes; a new set of scenes (not a copy of a template) is a big job: offer to do it in stages.
**EP13 feedback (user 2026-11-05, apply from the NEXT video; refs = Zack screenshots: white "6:10 AM" + white icons on a dark blue wall)**
- Camera steady: NO shake/jitter (drop the handheld `shake()` from ep10_anim.js, CK.boom tiny/off); NO haze/mist (no soft bloom wash, no DoF blur) -> crisp image.
- Never stay in one place/framing long: a change every ~2 s (camera move, subject moves or an icon pops). Characters move and react visibly, never stiff.
- The element the voice talks about is ALWAYS centred; if the line is long -> move camera / move the element / show icons.
- Icons and 3D words: solid, high contrast (white or flat saturated colour on a darker plain background), never faded.
**Process**
- Check stills (node stills.mjs ep4.html t1 t2 ...) for every beat BEFORE a render; 5-s hook preview first; full render only after the hook is approved (~2 min on M3); send a phone copy (crf 26).
- The user gives blunt feedback in batches; fix ALL points of a batch, then render once.

## 0b. CHANNEL MODE CHANGE (user, 2026-11-10): "Inside Money" = ENTERTAINMENT what-ifs MIXED with finance explainers
- Alternate: (A) finance/how-it-works episodes (as before) and (B) fun/absurd "what if" stories whose meaning is ordinary, with a real money/legal/tax lesson inside or at the end.
- Style reference for (B): references/inside-money/examples/trench-river-living-room.mp4 (analysis in REFERENCE_ANALYSIS.md): one continuous camera, one real set, a new object/step every ~3 s, payoff shot at the end.
- First (B) idea (user): "What if you buried $1,000,000 in a hole in your yard, lined it with steel, added a vault door + passcode to dodge tax -> IRS spots it by satellite -> planes, helicopters, tanks arrive -> arrested -> interrogated 'give us the code' -> you forgot the code." Needs: legal-safety review (no how-to for tax evasion; frame as consequences), verified facts in facts.md, and a lesson/comment question.
- All older rules in section 0 (61-65 s, hook preview first, one-take voice, safety) still apply.

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

## EP6-GAS status (2026-11-08, other branch numbering; files renamed ep6gas.*) — DONE: read ep6-gas-iran-usa/PLAN.md + PUBLISH.md
Gas USA vs Iran, 62.9 s, branch claude/nice-mendeleev-72189d. Scene render-kit/ep6gas.html (hook + story), mix ep6-gas-iran-usa/mix_ep6.py, render `npm run render -- ep6gas`.
New user rules from EP6: Trump = the American hero in place of Mike; price comparisons = SIDE-BY-SIDE split (left/right) inside the vertical video, never top/bottom; the first word of the hook ("Trump") louder + clearer in the mix.
EP5 ($10M IRS) also finished 2026-11-08 (branch of worktree xenodochial-darwin-466504); TikTok phone copy made at 28 MB (two-pass 3.3 Mbps, same 720x1280) because the 40 MB file is over the 30 MB phone-send limit.
## 9. EP5 status (2026-11-01) - read ep5-tax-sofa/PLAN.md
EP5 "The sofa vs the plan" (tax evasion vs legal avoidance, US version) FULL v1 rendered: render-kit/ep5-tax-sofa.mp4 (61.6 s) + ep5-tax-sofa/ep5-tax-sofa-phone.mp4. New look: a whole American suburb (Maple Street) with cutaway houses, clear blue sky, colour grade + MSAA. Awaiting user review.

## 10. EP6 status (2026-11-01) - read ep6-found-10m/PLAN.md
EP6 'He finds $10 million under his house' (Danny = Mike): hook v3 approved; full story built in ep6.html (Rick's bedroom + helicopter/SWAT nightmare, Tara's dream bubble, pickup drive at sunrise, hollow FIRST NATIONAL BANK lobby, IRS letter, 1964 piano, tax stairs + ten $1M bricks, vote line-up). Voice 62.7 s (speed 1.0, natural pauses). Full render + phone copy + PUBLISH.md: see ep6-found-10m/PLAN.md.
Lessons: Danny/hero is ALWAYS mike.glb; camera uses monotone Hermite (no overshoot); hide position jumps by panning away (bank exit); labels above heads, never behind people; joy SFX only inside joy words (cut()).

## 11. EP8 status (2026-11-03) - ep8-trump-income-tax/
EP8 'Trump promised to cancel your income tax. Forever.' (tariffs $200B vs income tax $2.7T, 13x). Scene render-kit/ep8.html (rally stage + U.S. GOVERNMENT backdrop/flag, Form 1040 rip, TARIFFS containers, $1M bricks; Maple St money towers; Trump 'when did I do that?'; government money halves; MAPLE ELECTRONICS price tags + receipt; TAX/PRICES CTA). Voice Kokoro am_liam .95 one take 64.4 s. Mix ep8-trump-income-tax/mix_ep8.py. PUBLISH.md + facts.md done.
New cast member 'trump' (cast.json + make_cast.py now supports extra shape targets): MakeHuman base + three.js styling in ep8.html (styleTrump: solid navy suit/white shirt/red tie by UV area, golden hair, orange-tan skin, blue eyes; head scale 1.3; golden cap + front swoop attached to the head bone). Reuse that block for any Trump episode.
Lessons (user 2026-11-03): camera ALWAYS centred on the subject of the spoken words and nothing important cropped (add a HOLD key before every move); signs readable and whole before any action on them; 3D words = flat saturated MeshBasicMaterial (no washed-out bloom); exposure ~1.12, contrast 1.12, saturation 1.28.

## 12. EP10 status (2026-11-04) - ep10-israel-aid-debt/
EP10 'Why does America send Israel $3.8 billion a year, with $40 trillion in debt?' (user wanted 'billions every month' - corrected: the 2016 MOU is $3.8B a YEAR = ~$317M a month). Neutral money facts only (facts.md: MOU, Treasury debt $40.50T 2026-11-02, FY2026 net interest $1.05T > defense $965B, aid = ~32 h of interest). Voice Kokoro am_liam .95 one take 64.6 s. Hook v2 (Trump loads the straps into an ISRAEL-emblem crate, Israel flag waving, orbit stays on Mike): ep10-israel-aid-debt/hook-preview-5s-v2.mp4 (approved 2026-11-04).
Story (2026-11-04) = render-kit/ep10_story.js (+ story keys in ep10_keys.js, SFX in mix_ep10.py): S1 Mike TAXES PAID + magnifier (x -22) / S2 2016 memorandum signed + 10 yearly stacks 2019-2028 (-14) / S3 $317M a month calendar (-4.6) / S4 jet ($3.3B) takes off + launcher intercepts a rocket (Iron Dome $500M) (5) / S5 the $3.8B tower drops at once 'one lump sum' (15) / S6 'most people miss' close-up / S7 MADE IN USA factory: money in, check to ISRAEL flies inside, workers in hard hats, planes + missiles (35) / S8 debt clock $40T + interest straps + $3B-a-day calendar (stage) / S9 Mike's math whiteboard 32 HOURS (stage) / S10 DEFENSE $965B vs INTEREST $1.05T balance scale (40.3) / S11 the debt as 10,000 squares, the aid fits in one (< 0.01%) / S12 CTA AID or DEBT. Full render: render-kit/ep10-israel-aid-debt.mp4. PUBLISH.md done.
Lesson: bold Mont 3D text is ~0.8 x size wide per character; in the 9:16 frame half-width = depth x tan(fov/2) x 0.5625 - compute it before placing text/props (first stills had cropped words).
Scene render-kit/ep10.html is GENERATED by render-kit/make_ep10.py from ep9.html + ep10_keys.js / ep10_props.js / ep10_grade.js / ep10_anim.js (edit those, then re-run). New zack-style kit (reuse in every episode): BokehPass DoF (focus = camera->look distance), camera motion blur on whip-pans (prev-frame camera delta, 12 taps + slight chromatic split), handheld micro-shake, split-tone grade + film grain, clearcoat wet eyes, skin sheen, alpha-to-coverage hair, camera eye-light. Mix target -11 LUFS (louder, like Zack).

## 13. EP11 status (2026-11-04) - ep11-bank-owns-cash/
EP11 'Bury $50,000 in your backyard, and it's yours. Put it in a bank, and legally, it's theirs.' (user's UK idea moved to the US: US case law deposit = loan, FDIC $250k, Nilson 2024 $187.2B card fees = $1.57 per $100, $100 x 10 card stops = $85.37 vs cash $100; Reg II debit cap NOT used, struck down 2026-10-26). Voice Kokoro am_liam .95 one take 64.8 s. Captions ONE word at a time, prices shown in 3D are blank in the captions (make_timeline.py).
Hook v2 (approved 2026-11-04, user rule: WIDE context -> ZOOM -> TIGHT glowing zoom, vignette up on the focus): back of Mike's house + the ground cut open (cross-section) + Mike digging with a shovel + 5 layers of $1 straps (= $50,000 real size) dropping in -> YOURS; whip to BANK: wide -> zoom (money flies in, doors slam) -> THEIRS.
Scene render-kit/ep11.html is GENERATED by make_ep11.py from ep9.html + ep11_keys.js / ep11_hook.js / ep11_story.js / ep11_anim.js (+ zack kit from ep10_props.js / ep10_grade.js). Story: S1 fine print / S2-S4 bank counter LOAN, BANK'S vault, IOU / S5 FDIC shield $250,000 / S6 vault slams NOT YOURS / S7-S10 taco truck -> butcher, NO FEES / S11 card tap, 3 booths in the sky / S12 $100 bill slice $1.57, $2-$3 / S13 fees inside the menu prices, cash customer / S14 $187 BILLION money wall + 1 DAY $500 MILLION / S15 $100 around 10 stops -> $85.37 / S16 cash $100 / S17 '?' / S18 CTA CASH or CARD. Mix ep11-bank-owns-cash/mix_ep11.py. PUBLISH.md done.
Lessons: Wd() strips '.', so '$1.57' is looked up as '$157'; camera keys > 3 m apart get an auto hold (use 2 m keys for a smooth pan); hollow vehicles (no solid body box) so people inside show.

## 14. EP12 status (2026-11-04) - ep12-dirty-money/ (PART 1)
EP12 'What if a criminal washed his dirty money, then deposited it at the bank? Would they... catch him?' Fictional detection story (never a how-to): CTR > $10,000 (name/address/cash), structuring = crime even with clean money, SAR filed quietly, IRS walks past the masked man straight to Mike -> 'Why Mike? Part two'. Voice Kokoro am_liam .95 one take 63.8 s. Full render render-kit/ep12-dirty-money.mp4 (copy in ep12 folder, not in git: 48 MB). PUBLISH.md + facts.md done.
Scene render-kit/ep12.html GENERATED by make_ep12.py from ep10.html + ep12_cast.js (masked cast + knit balaclava) + ep12_hook.js + ep12_story.js (one block). Shared props: render-kit/shop-kit.js (McDonald's burger shop, washer, blue Zack room, bank building WITH lobby inside + opening doors + CCTV, basket of straps, duffel, dirty-money tint). New cast 'masked' (make_cast.py add_balaclava).
User rules from EP12 (2026-11-04): hook = clear with no sound, every element serves the hook (no decor), main figure must contrast with the background (black clothes on a dark wall = rejected); ONE continuous camera, the camera NEVER passes through a wall/glass/car/person (no door-glass wipes) -> put interiors inside real buildings with open doorways; check hands never cross (a figure facing -z has its LEFT hand on -x).
Gotcha: FK.rig adds morphs to SHARED cast geometry -> other clones of that cast crash (morphTargetInfluences undefined, frames silently repeat). ep12_story.js calls updateMorphTargets() on every such mesh once and hides the EP10 cast.

## 15. EP15 status (2026-11-07) - ep15-el-sayed-gas-president/ (DONE, temp voice)
EP15 'What happens to gas prices if El-Sayed is president today?' Hypothetical, OPEN ENDING (never answer, vote UP / DOWN). Script v2 237 words = SCRIPT.md / vo.tts.txt; facts + sources in facts.md (AAA $4.10 on 11/5/26 = re-check on posting day); PUBLISH.md done.
Voice = TEMP Kokoro am_liam 1.0 max_gap .08 one take 62.7 s (vo.wav). If the user records his own take: replace vo.wav, re-run whisper (ep0-v2/align.py) -> fix words (Alsaid->El-Sayed, meat->Meet, mic->Mike, Common->Comment) -> timeline_ep15.json, then `~/kokoro-tts/venv/bin/python ep15-el-sayed-gas-president/mix_ep15.py` and `npm run render -- ep15` in render-kit.
Scene render-kit/ep15.html GENERATED by make_ep15.py from ep10.html + ep13_style.js (El-Sayed cast) + ep15_hook.js + ep15_story.js (one block, animateAll). Map = assets/americas-50m.json (Natural Earth 50m + US states) painted on two 8k canvases (red / blue USA) wiped by a clipping plane; transparent canvas sea over one gradient sea plane (no seam).
User rules from EP15 (2026-11-06): hook map style = CageNova election map (navy sea, beige land, flat USA colour red->blue, flag + black pill label, pulse rings, city lights); in the hook NO character bodies - only the main character as a HEAD in a circle badge (live render target); realistic sharp map; real icons ($100 bills, pump); a different clear camera angle per beat (top view for the map, 3/4 front for objects); FEW SFX (ting 0 s, whoosh on big changes, 1-2 pops, one cash) - see memory 'Few SFX'.
Gotcha: mix_ep15.py default voice must be vo.wav (the first full render shipped with only the 6-s hook voice). Delivered mp4 (30 MB) not in git.

## 16. EP16 status (2026-11-07) - ep16-congress-gas/ (FULL v1 delivered, temp voice, waiting for user fixes)
EP16 'Trump just lost Congress. So will gas get cheaper? Three things decide it.' Story: Mike pays ~$4.04 vs $3.08 a year ago (+$14/tank) -> 1 TAX (18.4c federal, since 1993, only Congress can pause; 15 gal x $0.184 = $2.76 < 5%) -> 2 OIL (EIA gallon: crude 50 / refining 24 / delivery 13 / taxes 13; Hormuz 1/5 of world oil, 20M bbl/day, disrupted, no vote) -> 3 PRESIDENT (law, May 2026 Trump floated pause, passes -> sign or veto, 2/3 override) -> pie (Congress ~5%, world 50%, president holds the pen) -> OPEN ending 'up or down? Comment one word'. Script = vo.tts.txt / SCRIPT.md; sources in facts.md (AAA $4.04 + House/Senate result = re-check on posting day). PUBLISH.md NOT written yet.
Voice = TEMP Kokoro am_liam 1.0 max_gap .08 one take 63.7 s (vo.wav); render 64.3 s Apple M3; delivered ep16-congress-gas.mp4 (24.8 MB, not in git). Re-voice: replace vo.wav -> ep0-v2/align.py vo16.wav -> fix words (see timeline_ep16.json fixes: $4->four, hormones->Hormuz, sales->sails ...) -> timeline_ep16.json -> `~/kokoro-tts/venv/bin/python ep16-congress-gas/mix_ep16.py` (run from videos/inside-money) -> `npm run render -- ep16` in render-kit.
Scene render-kit/ep16.html GENERATED by make_ep16.py from ep10.html + ep16_hook.js + ep16_story.js. ep16_hook.js is BUILT: `cat _ep16parts/base.js _ep16parts/tail2.js _ep16parts/end.js > ep16_hook.js` (edit the parts, then re-cat, then make_ep16.py - forgetting the cat = old hook in renders). Trump photo = assets/trump_portrait.jpg (official 2025 portrait, public domain) in the circle badge; map painted as the real US flag (paintMap 'FLAG').
User rules from EP16 (2026-11-07): no 'Meet Mike' in the hook -> '3 things'; real internet photo of the person (not 3D) animated in the circle badge; map = real US flag; remove every distraction; hook list cards show ONLY big numbers 1 2 3 (no words); room backgrounds must NOT be blue when Mike wears a blue tee -> charcoal rooms (0x2a2c31).
Known small issues for the next fix batch: 'EVERY TANK' touches Mike's head ~8 s; WORLD pie label partly behind the pie; 'DISRUPTED' close to the Hormuz card bottom.

## 17. EP17 status (2026-11-07) - ep17-el-sayed-tax-day-one/ (FULL v1 delivered, temp voice, waiting for user feedback)
EP17 'What happens to your tax if El-Sayed becomes president today?' (user's hook, grammar only). HYPOTHETICAL; answer HELD to ~46 s (retention): hook -> 'three things decide it' -> CLUE 1 Congress writes tax law (Art. I) / CLUE 2 wealth tax (campaign calculator 5%, 938 billionaires, Forbes; own vs earn; supporters vs critics) / CLUE 3 hopes no raise near $100k, experts disagree -> 'Stay with me' -> ANSWER: stub SAME, president asks/signs/vetoes, Congress bill, 2/3 -> vote UP/DOWN. Script = vo.tts.txt / SCRIPT.md v2; sources facts.md (NO revenue numbers: $4.4T is Sanders-Khanna, not his). PUBLISH.md done.
Voice = TEMP Kokoro am_liam 1.0 max_gap .08 one take 61.2 s (vo.wav) -> video 61.44 s (close to the 61 s floor: if re-voiced shorter, add a line). Re-voice: replace vo.wav -> ffmpeg 16k mono vo16.wav -> ep0-v2/align.py vo16.wav words_raw.json -> python3 ep17-el-sayed-tax-day-one/make_timeline.py (fixes Alsaid->El-Sayed) -> ~/kokoro-tts/venv/bin/python ep17-el-sayed-tax-day-one/mix_ep17.py -> `npm run render -- ep17` in render-kit.
Scene render-kit/ep17.html GENERATED by make_ep17.py from ep10.html + ep17_hook.js + ep17_story.js. ep17_hook.js is BUILT: `cat _ep17parts/base.js _ep17parts/tail.js _ep17parts/end.js > ep17_hook.js` (base = EP16 map base without its word times). Photo = assets/elsayed_portrait.jpg (U.S. Senate HELP committee 2024, public domain, Wikimedia). Hook title overlay (user 2026-11-07): 'PRESIDENT EL-SAYED? / YOUR TAX?' at the top, frame 1 -> hook end ('?' kept: hypothetical, not news).
Story camera: HOLD keys before every move (HOLD() in ep17_story.js) + FT17 margin .1 / slack 1 = nothing cropped mid-move. zsh gotcha for stills: pass times as an array (T=(1 2 3)) or ${=T}, else all times arrive as one NaN.
EP17 v2 (user feedback 2026-11-07, see memory 'EP17 hero/checks/icons'): Mike faces the camera (rooms ry=PI+.45), walks into every place, points/reacts per beat (GEST in ep17_story.js); clue HUD 1-2-3 at the top with a big green check + ting when each clue ends (hud17); real flat icons only where needed (flatIcon/icons17: FRI calendar, $ bill, calculator, house, car, paycheck, plane, family house, BILL doc). Rendered 61.44 s, Apple M3.
