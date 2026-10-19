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
