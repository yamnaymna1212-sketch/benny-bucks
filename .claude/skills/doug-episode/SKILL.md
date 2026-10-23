---
name: doug-episode
description: Make a "Doug the Penguin" TikTok episode (the ACTIVE channel) — script, voice tightening, hook preview, full Remotion build, SFX, captions, render. Use for any new Doug video, topic ideas, scripts, or edits.
---
# Doug episode workflow (proven on EP1 Rent, EP2 Gas)

Talk to the user in Arabic; video text/voice in English. Follow the TOKEN GUARD in CLAUDE.md (warn before expensive steps, offer the cheaper option). Read PROJECT_LOG.md (bottom) + videos/penguin-series/script-formula.md first.

## 1. Topic + script
- Pick American money pain (rent, gas, tipping, credit score, BNPL, groceries, investing...). Check real numbers with WebSearch (cite source, e.g. AAA, BLS, Harvard JCHS).
- Script template = videos/doug-gas/script.md: spoken hook starts "Why..." (or "If Doug..."), split-screen contrast with real US prices; caveman-English explanation ("Gas come from oil."); concept named after the example; "Doug <state>." gag line alone (e.g. "Doug poor." / "Doug happy." / "Doug angry." — NEVER bare "Doug."); one "In real life, ..." line with the real number; twist/loop ending (e.g. Doug melts in Texas); last line = comment question. ~150–190 words.
- Fact-check every number (WebSearch, cite sources). Mark unverified numbers and say "Tesla says" for company claims.

## 2. Voice = FAST free Kokoro TTS made by Claude (user rule 2026-10-23, proven EP7)
- Voice `am_puck` (am_michael = "boring", never). Speed 1.15, max_gap 0.06, 0.04 s between lines — NO pauses.
  `/opt/tts/venv/bin/python tools/tts.py videos/<slug>/vo/lines.txt videos/<slug>/vo/voice am_puck 1.15 0.06`
  lines.txt = one phrase per line `text|0.04`. Numbers spelled out for the voice; the caption JSON replaces them with digits ("twenty-five percent" -> "25%").
- If the voice is < 61 s: ADD script lines (each with its own scene/BigWord), never slow the voice or add pauses. Target 61–64 s.
- Engine missing in a fresh container: `mkdir -p /opt/tts && python3 -m venv /opt/tts/venv && /opt/tts/venv/bin/pip install kokoro-onnx soundfile` + download
  kokoro-v1.0.onnx and voices-v1.0.bin from github.com/thewh1teagle/kokoro-onnx releases (model-files-v1.0) into /opt/tts. The auto-permission check may
  block the download: then tell the user (Arabic) it needs their OK — when they ask for the free voice explicitly, retry.
- voice.timings.json = phrase map -> studio/src/data/<slug>.json ({start,end,text}); copy voice.mp3 to studio/public/<slug>-voice.mp3 (gitignored).
- If the user uploads an ElevenLabs mp3 instead: old flow (silencedetect, tools/tighten_vo.py, atempo) — see PROJECT_LOG EP2/EP3.

## 3. Build
- USER-IMAGE HOOK (user-approved EP7, code: studio/src/videos/dougTariff.tsx): when the user sends a picture for the hook, use it AS IS
  (copy to studio/public/<slug>/hook.png). BOTH sides on screen from frame 0 — never reveal side A then side B. Cut it into polygon `Layer`s
  (POLY in source px, they tile back into the original; `mixBlendMode: multiply` hides the white paper) and animate: punch-in at 0 s, the side
  the arrow points at pulses, cars idle-shake + `Shine`, VS throbs, and the two sides DO something to each other (EP7: tug-of-war `Rope`).
  Doug stands in the middle reacting. Hand-written "why?" + red arrow on top. Cut to a NEW scene on "This is Doug." (no zoom-in on the hook).
  Reuse the picture's people/cars in later scenes with `Cut` (PARTS = source px boxes) so the same characters run through the whole video.
  Warn the user once about real people/logos/wrong facts in their picture, then do what they choose.
- Reusable props exported from dougTariff.tsx: Cut, Layer, Rope, Shine, Big, Chicken, EuFlag, UsFlagMini, CnFlag, TexasFlag, Factory, Tank, Gate (TAX barrier), Shield, Tears, Ground.
- Render: `--browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell --concurrency=4` (normal chromium fails: old headless removed).
  SFX are gitignored: `python3 tools/import_user_sfx.py && python3 tools/sfx_animals.py` before rendering. (copy studio/src/videos/dougGas.tsx as the template)
- COUNTRY/PLACE vs COUNTRY HOOK (user-approved EP3, copy `Hook` + `FlagPump`/`Arrow`/`Vs`/`Label` from studio/src/videos/dougVenezuela.tsx): big hand-written "why" + red "?" on top; red arrow that DRAWS ITSELF on, points at side A, then SWINGS to side B when it is named; two pumps/objects with flags + big price "$x / GALLON" (expensive side RED, cheap side GREEN); jerry cans/containers FILL up while each side is spoken; red "VS" badge in the middle; side names in big caps above each flag (USA / VENEZUELA); ONE "?" by Doug's head (not "? ! ?"); strong zoom (x1.22) toward the side being spoken, zoom out to both on the "Same X" stamp.
- Hook set first (blue HookTitle "<Topic> Explained by Doug", real American object drawn: price signs, pump, map...; camera pushes toward the side named) -> render only frames 0–~180, compress, send, WAIT for approval.
- Then one set per idea, new shot every 2–4 s, `cutFX` transitions (swipe/zoom/iris/pop), DEEP zooms on the named subject (6–10), `beat()` punch per phrase, `Captions` (hand-written, one colour), Larry the walrus owns everything (running gag), only Doug (+family) are penguins.
- SFX: user library (tools/sfx_user_map.json; rebuild with tools/import_user_sfx.py): user-ting at 0 s, whoosh on every cut, money/cash-register on payments, boom on reveals, slap/wrong/aww/shock/fahh on pain, wow/yeah on good news, timer for "every month"; plus tools/sfx_animals.py voices. NO music.
- Render full, check a 20-frame contact sheet, fix overlaps (keep big words out of y 1500–1600 = caption zone), compress `-crf 22 -preset slow`, < 30 MB, commit + push, send.
- Give the TikTok description (keyword question + 5 specific hashtags) — see PROJECT_LOG.

## Never
- Re-render a finished episode unless asked. Use real photos/brand logos. Copy Monkey/Primate Economics wording ("explained with bananas", "monkey understand now").
