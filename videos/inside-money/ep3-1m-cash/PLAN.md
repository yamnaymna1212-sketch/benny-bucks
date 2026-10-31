# EP3 build plan (scene = render-kit/ep3.html, one continuous camera, Mike always in frame)
## STATUS 2026-10-31 (end of session 1): v2 RENDERED, awaiting user review
- Output: render-kit/ep3-1m-cash.mp4 (62.41 s, M3) + ep3-1m-cash-phone.mp4 (12 MB, sent to the user). Stills of the new first half: ep3-first-half-v2.jpg.
- Branch: claude/beautiful-bartik-464776 (worktree .claude/worktrees/beautiful-bartik-464776). Not merged into the main branch.
- Render: cd videos/inside-money/render-kit && npm run render -- ep3full   (mix first: ~/kokoro-tts/venv/bin/python ep3-1m-cash/mix_ep3_full.py from videos/inside-money)
- Quick check before any render: node stills.mjs ep3.html 6.3 13.6 22.4 --q "tl=timeline_ep3_full.json&mb=1"
- Code map in ep3.html: hookState (0-4.6 s, approved, do not touch) / mikeState, tellerState, managerState, guardState / propsState (drawer, vault, digits, sheet, routine forms, Fed, truck, case, tower, backpack, lights) / KF camera knots [t, pos, look] with Hermite spline + FOVK (fov per time).
- User feedback v1 -> v2: "first half boring, same place, no event, camera not matched to the words, not too close / not too far". Rule now: every line = a new event + a camera move that matches the word (close for objects/numbers, far for "building"/"government").

## v2 beat table (first half)
| s | line | event | camera |
|---|---|---|---|
| 5.4-7.3 | teller opens drawer / not even close | drawer slides out, few bundles; teller shrugs | crane over counter, top-down into the drawer -> two-shot |
| 7.6-9.9 | checks the vault | teller walks to vault, door swings (hinge right), takes the ONE bundle, holds it up | follows him, pushes in on empty shelves |
| 10.3-12 | account says one million | monitor turns to Mike | over Mike's shoulder, screen fills frame |
| 12.2-14.6 | isn't in this building | ceiling + lights hidden | crane up high, fov 56: whole bank |
| 14-17.3 | not paper... number on a screen | drawer bundles shrink into green digits flying into the screen | down + dive into the screen |
| 17.6-21.4 | branch keeps... calls the manager | teller phone, manager answers in glass office, walks out | lateral travel to the office |
| 21.9-23.4 | Mike gets angry | fists up, slams counter | LOW angle on Mike's face (first time) |
| 24-25.8 | manager nods / not today | nod, palm up | over Mike's shoulder |
| 26.5-28.4 | opens a form / over $10,000 | printer (x=-1.9) prints CTR, sheet rises | form fills the frame |
| 28.4-31.4 | reports to the government | sheet flies out the window to the building | chase cam behind the sheet |
| 30.3-33 | routine, not an accusation | 12 more forms stream into the building | wide |

Status 2026-10-31 (later): FULL SCENE BUILT in render-kit/ep3.html (query ?tl=timeline_ep3_full.json; hook 0-4.6 s unchanged, story 4.6-62.4 s), mix = ep3-1m-cash/mix_ep3_full.py -> render-kit/mix_ep3_full.wav, render: `npm run render -- ep3full` -> ep3-1m-cash.mp4. Camera = Hermite spline through KF knots (fov 32 indoors, 48-52 outdoors). Known weak spots: government building is a plain box (no texture), Fed vault is sparse, truck is a toy-like box, guard/teller/manager share the face model.
HOOK DONE (hook-preview-5s-v3.mp4, approved direction). Full voice done (vo_full.wav 62.4 s, timeline render-kit/timeline_ep3_full.json with words + lines).
Hook preview uses timeline_ep3.json + mix_ep3.wav (5 s). For the full video switch ep3.html to timeline_ep3_full.json, and write mix for the full voice.

Shot list (line # from SCRIPT.md):
1 hook (done): wide BANK + flag -> slip close-up -> over-shoulder teller.
2-3 teller opens drawer: a few cash stacks (no number); camera dips behind counter; then glance to vault door (opens, small shelves).
4-5 balance screen $1,000,000 green on the teller monitor (turn monitor to camera) -> "number on a screen": digits float, no paper.
6-7 manager (3rd person, suit, dark jacket) walks out of a glass office; Mike gestures angry; manager nods.
8-9 the form: "CURRENCY TRANSACTION REPORT" sheet (generic, no logo) slides out of a printer -> flies to a government building icon in 3D (no seals). RED "OVER $10,000".
10 camera drops through the floor (cutaway like EP2) -> Federal Reserve cash vault -> armored truck loading.
11-12 Mike on the sidewalk, empty hands; HUD DAY 0 -> 1 -> 2; phone rings (notif SFX).
13-14 truck arrives; case opens; 10,000 bills stack grows to 43 in beside Mike (scale); 22 lb; backpack.
15-17 Mike walks out with the backpack; form icon flashes "the government already knew".
18 end: question card text, freeze.
SFX: ting 0 s, slap on slip, drawer slide, vault clank, phone ring, truck whoosh, cash on stack, boom on "government already knew".
Weak spots known: Mike and the teller share the same free face model (clothes/hair differ).
