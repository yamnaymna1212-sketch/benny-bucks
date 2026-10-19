---
name: doug-episode
description: Make a "Doug the Penguin" TikTok episode (the ACTIVE channel) — script, voice tightening, hook preview, full Remotion build, SFX, captions, render. Use for any new Doug video, topic ideas, scripts, or edits.
---
# Doug episode workflow (proven on EP1 Rent, EP2 Gas)

Talk to the user in Arabic; video text/voice in English. Follow the TOKEN GUARD in CLAUDE.md (warn before expensive steps, offer the cheaper option). Read PROJECT_LOG.md (bottom) + videos/penguin-series/script-formula.md first.

## 1. Topic + script
- Pick American money pain (rent, gas, tipping, credit score, BNPL, groceries, investing...). Check real numbers with WebSearch (cite source, e.g. AAA, BLS, Harvard JCHS).
- Script template = videos/doug-gas/script.md: spoken hook starts "Why..." (or "If Doug..."), split-screen contrast with real US prices; caveman-English explanation ("Gas come from oil."); concept named after the example; "Doug <state>." gag line alone (e.g. "Doug poor." / "Doug happy." / "Doug angry." — NEVER bare "Doug."); one "In real life, ..." line with the real number; twist/loop ending (e.g. Doug melts in Texas); last line = comment question. ~150–190 words.
- Give the user the clean script to paste in ElevenLabs (voice "A Top Narrator", same every episode).

## 2. Voice (user's ElevenLabs mp3)
- Save to videos/<slug>/vo/raw.mp3. Detect speech with `silencedetect=n=-38dB:d=0.12`, write segments.json (all gaps 0.07 s, ~0.35 s after the "Doug <state>." gag), run `python3 tools/tighten_vo.py raw.wav segments.json tight`.
- If still > 62 s, speed with `ffmpeg -af atempo=<x>` (EP2 used 1.2) and divide segment times by x -> voice.segments.json. Target 61–62 s.
- Map segments to script phrases IN ORDER by length (sentence fragments; "Doug <state>." ~0.7 s is the anchor) -> studio/src/data/<slug>.json [{start,end,text}].
- Copy voice.mp3 to studio/public/<slug>-voice.mp3.

## 3. Build (copy studio/src/videos/dougGas.tsx as the template)
- Hook set first (blue HookTitle "<Topic> Explained by Doug", real American object drawn: price signs, pump, map...; camera pushes toward the side named) -> render only frames 0–~180, compress, send, WAIT for approval.
- Then one set per idea, new shot every 2–4 s, `cutFX` transitions (swipe/zoom/iris/pop), DEEP zooms on the named subject (6–10), `beat()` punch per phrase, `Captions` (hand-written, one colour), Larry the walrus owns everything (running gag), only Doug (+family) are penguins.
- SFX: user library (tools/sfx_user_map.json; rebuild with tools/import_user_sfx.py): user-ting at 0 s, whoosh on every cut, money/cash-register on payments, boom on reveals, slap/wrong/aww/shock/fahh on pain, wow/yeah on good news, timer for "every month"; plus tools/sfx_animals.py voices. NO music.
- Render full, check a 20-frame contact sheet, fix overlaps (keep big words out of y 1500–1600 = caption zone), compress `-crf 22 -preset slow`, < 30 MB, commit + push, send.
- Give the TikTok description (keyword question + 5 specific hashtags) — see PROJECT_LOG.

## Never
- Re-render a finished episode unless asked. Use real photos/brand logos. Copy Monkey/Primate Economics wording ("explained with bananas", "monkey understand now").
