# Penguin series — script formula (from the Monkey/Primate Economics shorts + our EP1/EP2)

## 12 beats, 61–64 s, ~150 spoken words, one sentence = one shot
| # | Beat | Time | Rule |
|---|---|---|---|
| 1 | HOOK contrast | 0–3 s | Split frame, two prices/numbers, understood with no words. Line = the shock + a deadpan joke ("Doug did nothing."). |
| 2 | "This is Doug." | 3–6 s | Name + ONE simple fact (what he has). |
| 3 | Want | 6–9 s | Doug wants one concrete, childish thing (snow cone, igloo, sled). |
| 4 | The world rule | 9–14 s | Show the mechanism with characters doing it (machine, bank, landlord). No jargon yet. |
| 5 | Silly sound / tiny line | ~15 s | Narrator makes the noise or a character says 1–3 broken words ("thank you penguin", "brrrr"). |
| 6 | Everyone reacts | 15–22 s | Crowd / escalation, bigger and funnier each shot. |
| 7 | The squeeze | 22–28 s | "More X. Same Y." visual equation. |
| 8 | "This is called ___." | 28–31 s | Concept name AFTER the viewer already saw it. Sparkle title card. |
| 9 | Recurring gag | 31–33 s | Doug stare: zoom to his face, 1 s silence, narrator: "Doug + state" ("Doug poor." / "Doug happy." / "Doug angry." — never a bare "Doug.", user rule 2026-10-19) |
| 10 | Real-life bridge | 33–42 s | ONE real US number, said simply ("prices went up about 23% since 2020"). |
| 11 | Payoff + deadpan line | 42–55 s | Callback to the want from beat 3, with a twist (tiny snow cone). Broken-English line on screen ("is same snow cone."). |
| 12 | Tease + question | 55–63 s | Name the next episode + one comment question. |

## Sentence rules
- Present tense. Subject + verb + object. Max ~12 words. Words a 7-year-old knows.
- Only small numbers a child can count (1, 2, 5, 10, 100) + ONE real-life number. Never explain the same thing twice.
- Narrator never says "basically", "in other words", "economists". Show, then name.
- Every 3–5 s: a new place, framing or transition. Every ~15 s: a gag.
- Ending must make sense from the story (no random disaster).

## Narration voice = caveman English (from the reference script, user-provided)
- Drop articles and helper verbs: "Fish rare. Fish valuable." "Price go up." "Doug is penguin."
- Repeat the key noun instead of pronouns (fish, fish, fish) — the repetition IS the teaching.
- Teach with "If ..., ... . Because ..." chains, then say the concept name alone as its own line.
- Several mini-lessons per video (2–3), each = If-chain -> name -> "Doug <state>." gag.
- Fake-happy ending: "Doug eat snow cone. Life is good." then the twist "Life is not good."
- Keep the terms economically correct (the reference swaps cost-push / supply-shock).

## Versus hook (user rule, 2026-10-19 — EP3 Venezuela, reuse for every A-vs-B video)
why? title + self-drawing red arrow that swings A -> B, expensive price RED / cheap GREEN, containers fill with the product, red VS badge, big side labels above the flags, one "?" only, strong zoom to the side being spoken. Code: studio/src/videos/dougVenezuela.tsx (Hook).

## Hook template (user rule, 2026-10-16)
- On-screen: blue title `<Topic> Explained by Doug` (HookTitle: #5EC4FA fill, #123B6B outline), Doug left vs other side right.
- Spoken: starts with "If Doug ..." — two short parallel If-sentences with a contrast: "If Doug pay rent, Doug own nothing. If Larry get rent, Larry own igloo."
- Description in caveman voice: "Doug understand now 🐧 #topic". TikTok auto-captions ON.

## Edit rules v2 (user, 2026-10-17)
- Captions ON: hand-written (Architects Daughter), small (~66px), ONE ink colour, lowercase, slight tilt, y=1530. No multi-colour, no fat font (user).
- Faster rhythm: camera punch on every phrase (`beat`), cut swoosh on every shot change, pop-high on every big word.
- SFX: animal voices (tools/sfx_animals.py: penguin-squawk/honk, walrus-grunt/laugh, gull-caw/mine, splat, swoosh-fast, pop-high) + the user's own money/transition/meme sounds when provided.
- Deep zooms: 6–10 per episode, camera dives (x1.5–1.9) onto the face/object named in that phrase, released on the next phrase. Not in the first 3 s.
- User SFX (labels from the user, tools/sfx_user_map.json -> studio/public/sfx/user-<name>.wav):
  ting = frame 0 of every hook; money / cash-register / money-transfer = fish payments; whoosh = cuts; pop = big words;
  wrong / aww / shock / fahh / fahh-long = bad news & the "Doug <state>." gag; boom = big reveal; slap = hits; wow / yeah = good news;
  notif / notif2 = bills & messages; timer = "every month" / deadlines; horn = silly fail.

## Edit rules v3 (user, 2026-10-17, EP3)
- Hook only = split screen (two coloured halves + blue title). Background layers oversized so no white edge at any zoom/pan; no decorative strips at the frame edge.
- After the hook: back to the normal Doug ice world (white bg, one idea per shot) like doug-gas / doug-rent.
- "Same X / Same Y" lists: the object itself pops in big, one per word, synced, with user-pop. No stacked stamps.
- Caption hides exactly while a big centre word (BigWord) is on screen; one text on screen at a time, no repeats.

## Edit rules v4 = MASTER STYLE (user, 2026-10-18, EP4 gas USA vs Iran — use on EVERY video)
Reference episode: studio/src/videos/dougGasIran.tsx + videos/doug-gas-iran/doug-gas-iran.mp4.
- HOOK = WhyHook (studio/src/penguin/whyHook.tsx), PURE WHITE background, everything on screen at frame 0.
  Doug ACTS the hook (pass dougPose/mark): looks at side A while it is said (camera pushes to A) -> snaps his head to side B with the
  camera on "but in ..." -> SHOCK on B's number (eyes big, mouth open, flippers out, small hop, tremble, sweat, "?" marks turn to red "!").
  SFX: ting 0 s, whoosh to A, cash-register on A's price, swoosh-fast to B, boom + penguin-squawk on B's number. Captions y=1640 in the hook.
- VOICE PACE: cut EVERY pause to ~0.08 s; only 0.3 s after the hook question and 0.4 s after each "Doug." gag. NEVER stretch pauses to
  reach 61 s. If the tight VO is short, write extra content lines (a second mini-lesson), get approval, generate ONLY those lines, splice them in.
- STORY ORDER: hook -> open loop ("Doug smell a trick.") -> side A (Doug pays, counter, fish fly) -> travel -> side B (cheap, Doug happy)
  -> why B (concept name card + "Doug.") -> why A ("everybody takes a cut": Larry / truck / Tax Gull, each "cut!") -> the trick reveal
  (dark spotlight + red "the trick") -> real consequence numbers -> Doug looks left/right -> back home -> "Doug is confused penguin" + ?
  -> CTA choice cards (A vs B) + comment question.
- RHYTHM: a new shot every ~2.5 s (20–25 shots in 61 s), cutFX on every cut, whoosh on every cut, beat() punch per phrase.
- DEEP ZOOMS only on a face/object that stays in frame; never zoom where it cuts a BigWord, price tag or stamp. Big words never overlap tags
  (put them above the headers). Always check a contact sheet of every shot before sending; fix empty shots (props must be on screen at once).
- Length 61–62 s, render, compress crf 22 slow (<15 MB), commit + push, send.

## Hook camera rule (user, 2026-10-20, EP5 v3 — use on every split hook)
- Frame 0 to the first side's word: NO zoom, the full split is the cover.
- On the spoken word of side A (e.g. "cash"): zoom ~1.5x into side A (0.3 s ease), whoosh.
- On the spoken word of side B (e.g. "card"): zoom straight across to side B, swoosh-fast.
- Next line ("Same ten dollars"): zoom back out to the full split.
- Each side's characters react when their word is said and keep that face: side A happy (Doug smile + small hop, cashier smiling);
  side B shows its own feeling (EP5: Doug smiling, cashier Puffin worried because he pays the fee).
- Reference code: hookCam + DiffSide in studio/src/videos/dougCashCard.tsx (word times from the VO: silencedetect inside the hook line).
