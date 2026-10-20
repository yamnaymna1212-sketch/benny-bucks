# LATEST (2026-10-20) — read CLAUDE.md first: Truth rule, Safe-reach rules, Hook template 2, Hook camera rule, voice fallback.
Last episode: EP5 cash vs card, burger version (videos/doug-cash-card-burger/, comp doug-cash-burger). Work branch: claude/vigilant-ritchie-i04nqw.
Next idea drafted: EP6 Debit vs Credit (videos/doug-debit-credit/voice.txt) — on hold until EP5 reach is checked (Analytics -> Viewers).

# HANDOFF — continue the "Doug the Penguin" channel in a new session

Read this first, then PROJECT_LOG.md (decisions) and videos/penguin-series/script-formula.md (series rules).
Talk to the user in Arabic. Video text/voice in English.

## 1. Get the project
- Repo: github.com/yamnaymna1212-sketch/benny-bucks — branch `claude/benny-tiktok-factory-design-lex9ua` (also merged into `main`).
- `cd studio && npm install`

## 2. Rebuild the git-ignored assets (needed to render)
- Fonts are tracked (studio/public/fonts).
- SFX: `pip install numpy soundfile && python3 tools/sfx.py && python3 tools/sfx_animals.py`
  then `python3 tools/import_user_sfx.py` (user's labelled sounds -> studio/public/sfx/user-*.wav).
- Voices: `cp videos/doug-rent/../penguin-rent/vo/voice.mp3 studio/public/doug-rent-voice.mp3` and
  `cp videos/doug-gas/vo/voice.mp3 studio/public/doug-gas-voice.mp3`.

## 3. Where things are
- Cast/world code: studio/src/penguin/{rig,cast,world,acting,edit}.tsx (Doug, Larry walrus, Big Seal, Puffin, Tax Gull, seal; captions/beat/SFX in edit.tsx).
- EP1 (published): studio/src/videos/dougRent.tsx -> videos/doug-rent/.
- EP2 Gas: DONE (videos/doug-gas/doug-gas.mp4). Next episode: pick a topic with the user.
  User VO (ElevenLabs) tightened + sped x1.2 to 61.5 s: videos/doug-gas/vo/voice.mp3; speech segments (start/end in the final file,
  52 segments, seg 36 = "Doug.") in videos/doug-gas/vo/voice.segments.json. NEXT: map segments -> script lines (by order/length,
  like EP1), save as studio/src/data/doug-gas.json, build all shots after the hook, render, compress (<30 MB).
- Voice tightening tool: tools/tighten_vo.py (cut pauses to ~0.07 s; keep ~0.35–0.75 s after "Doug.").

## 4. Rules that matter (see PROJECT_LOG for all)
- No music. Captions = hand-written, one ink colour, small. Deep zooms on named subjects; fast rhythm; user SFX (ting at 0 s of every hook).
- Only Doug (+ family) are penguins; banker = Arctic fox (not built yet). Larry (walrus) owns everything (running gag).
- Hook: blue title "<Topic> Explained by Doug", spoken hook starts with "Why ..." / "If Doug ...", contrast + real US numbers.
- Videos 61–65 s. Show the hook before the full render. Never re-render a finished episode unless asked.
