# EP4 "Why can't the government print everyone a million?" — build plan
## STATUS 2026-10-31 (end of session 1)
- Branch: claude/angry-vaughan-c2e6c1 (worktree .claude/worktrees/angry-vaughan-c2e6c1), pushed.
- Hook line = the user's own idea (approved). Script DRAFT v1 in SCRIPT.md (~175 spoken words -> too short: add 25-35 words before voice, target 61-65 s). Facts + sources in facts.md (re-check census.gov/popclock + FRED M2 on render day).
- Cast DONE: 7 MakeHuman CC0 characters (characters/cast.json, build: see characters/README.md). GLBs are git-ignored -> rebuild (~10 s each) on a new machine.
- Look test DONE and approved direction: render-kit/ep4-look.html (stills: look-over.jpg / look-wide.jpg). Zack glow style: only money + prices glow (bloom threshold 1.3, strength .45, radius .18); scene lights kept low so walls never haze.
- render-kit/node_modules and dl/tex + HDR are SYMLINKS to the EP3 worktree (beautiful-bartik-464776). If that worktree is removed: npm install + npm run setup.

## NEXT (in order)
1. Lengthen SCRIPT.md to ~205-214 words (keep 1 line = 1 shot, reveal at ~75%, no made-up numbers).
2. Voice: Kokoro one take (see SETUP.md), measure 61-65 s; word timings with faster-whisper.
3. Build ep4.html from ep4-look.html (timeline + camera knots like EP3), 5-s HOOK PREVIEW ONLY -> wait for user approval.
4. Full render after approval.

## Visual rules for this episode
- Every key number = floating 3D price in meaning colour: GREEN money ($1,000,000), RED problem ($342 TRILLION, price tags rising), YELLOW key fact (x15, 4-5 billion bills).
- Bills glow green in hands; each character keeps its own look (Mike casual blue tee, teller striped blouse, manager suit+tie+glasses, guard navy polo, press operator, seller, landlord).
- Real props: US flag (50 stars), marble, walnut wainscot, vault door, TELLER signs, services board, ATM, stanchions.

## UPDATE (voice done, 2026-10-31)
- Voice: Kokoro am_liam, speed 1.10, max_gap 0.04, ONE take -> vo.wav/vo.mp3, **62.10 s**, 198 words = 3.2 words/s. Real silence 3.3 s total (17 pauses, longest 0.25 s) = 5 % vs Zack #2's 14 %. Whisper word times: words_raw.json (it overstates gaps; use silencedetect). lines.txt = the 18 spoken lines.
- Chatterbox tried and cancelled by the user (nothing left installed). Keep Kokoro. ElevenLabs connector is not enabled in this session.
- NEXT: the user approves the voice -> build ep4.html (timeline from vo.timings.json + words_raw.json) -> 5-s hook preview -> approval -> full render.
