---
name: doug-episode
description: Make a "Doug the Penguin" TikTok episode (the ACTIVE channel) — script, voice tightening, hook preview, full Remotion build, SFX, captions, render. Use for any new Doug video, topic ideas, scripts, or edits.
disable-model-invocation: true
---
# Doug episode workflow (proven on EP1 Rent, EP2 Gas, EP4 Gas USA vs Iran)

MASTER STYLE = 'Edit rules v4' in videos/penguin-series/script-formula.md (EP4 = studio/src/videos/dougGasIran.tsx). Copy dougGasIran.tsx as the template for every new episode.

Talk to the user in Arabic; video text/voice in English. Follow the TOKEN GUARD in CLAUDE.md (warn before expensive steps, offer the cheaper option). Read PROJECT_LOG.md (bottom) + videos/penguin-series/script-formula.md first.

## 1. Topic + script
- Pick American money pain (rent, gas, tipping, credit score, BNPL, groceries, investing...). Check real numbers with WebSearch (cite source, e.g. AAA, BLS, Harvard JCHS).
- Script template = videos/doug-gas/script.md: spoken hook starts "Why..." (or "If Doug..."), split-screen contrast with real US prices; caveman-English explanation ("Gas come from oil."); concept named after the example; "Doug." gag line alone; one "In real life, ..." line with the real number; twist/loop ending (e.g. Doug melts in Texas); last line = comment question. ~150–190 words.
- Give the user the clean script to paste in ElevenLabs (voice "A Top Narrator", same every episode).

## 2. Voice (user's ElevenLabs mp3)
- Voice comes from the ElevenLabs connector (voice_id u4HtmbcjVZVpiJLQ2GZn, eleven_multilingual_v2, generations_count 1, never retry). Save to videos/<slug>/vo/raw.mp3. Detect speech with `silencedetect=n=-38dB:d=0.12`, write segments.json (all gaps 0.08 s, 0.3 s after the hook, 0.4 s after "Doug."), run `python3 tools/tighten_vo.py raw.wav segments.json tight`.
- NEVER stretch pauses to reach 61 s (user: 'slow and boring'). Too short -> write extra content lines, get approval, generate only them, splice in (see EP4 vo/segments2.json).
- If still > 62 s, speed with `ffmpeg -af atempo=<x>` (EP2 used 1.2) and divide segment times by x -> voice.segments.json. Target 61–62 s.
- Map segments to script phrases IN ORDER by length (sentence fragments; "Doug." ~0.4 s is the anchor) -> studio/src/data/<slug>.json [{start,end,text}].
- Copy voice.mp3 to studio/public/<slug>-voice.mp3.

## 3. Build (copy studio/src/videos/dougGasIran.tsx as the template)
- Hook set first = the MAIN TEMPLATE `WhyHook` (studio/src/penguin/whyHook.tsx, user-approved 2026-10-18, still: videos/penguin-series/why-hook-v1.png): yellow-brush "WHY" on top, two sides each = flag (or label) + giant price card + unit + object (pump etc.), plain Doug (no outfit) in the middle confused with "?" marks. Everything on screen from frame 0 (it is the cover). Only change the props: left/right {flag|label, price, unit, obj, color}. NEVER open with a "<Topic> Explained by Doug" title again (killed retention on EP2/EP3). Render ONE still first, then only frames 0–~180, send, WAIT for approval.
- Then one set per idea, new shot every 2–4 s, `cutFX` transitions (swipe/zoom/iris/pop), DEEP zooms on the named subject (6–10), `beat()` punch per phrase, `Captions` (hand-written, one colour), Larry the walrus owns everything (running gag), only Doug (+family) are penguins.
- SFX: user library (tools/sfx_user_map.json; rebuild with tools/import_user_sfx.py): user-ting at 0 s, whoosh on every cut, money/cash-register on payments, boom on reveals, slap/wrong/aww/shock/fahh on pain, wow/yeah on good news, timer for "every month"; plus tools/sfx_animals.py voices. NO music.
- Render full, check a 20-frame contact sheet, fix overlaps (keep big words out of y 1500–1600 = caption zone), compress `-crf 22 -preset slow`, < 30 MB, commit + push, send.
- Give the TikTok description (keyword question + 5 specific hashtags) — see PROJECT_LOG.

## Never
- Re-render a finished episode unless asked. Use real photos/brand logos. Copy Monkey/Primate Economics wording ("explained with bananas", "monkey understand now").
