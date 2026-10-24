---
name: doug-episode
description: Make a "Doug the Penguin" TikTok episode (the ACTIVE channel) — script, voice tightening, hook preview, full Remotion build, SFX, captions, render. Use for any new Doug video, topic ideas, scripts, or edits.
---
# Doug episode workflow (proven on EP1 Rent, EP2 Gas)

Talk to the user in Arabic; video text/voice in English. Follow the TOKEN GUARD in CLAUDE.md (warn before expensive steps, offer the cheaper option). Read PROJECT_LOG.md (bottom) + videos/penguin-series/script-formula.md first.

## 1. Topic + script
- Pick American money pain (rent, gas, tipping, credit score, BNPL, groceries, investing...). Check real numbers with WebSearch (cite source, e.g. AAA, BLS, Harvard JCHS).
- Script template = videos/doug-gas/script.md: spoken hook starts "Why..." (or "If Doug..."), split-screen contrast with real US prices; caveman-English explanation ("Gas come from oil."); concept named after the example; "Doug <state>." gag line alone (e.g. "Doug poor." / "Doug happy." / "Doug angry." — NEVER bare "Doug."); one "In real life, ..." line with the real number; twist/loop ending (e.g. Doug melts in Texas); last line = comment question. ~150–190 words.
- Voice = Kokoro via tools/tts.py (one line per phrase in videos/<slug>/vo/lines.txt), am_fenrir speed 1.2; timings -> studio/src/data/<slug>.json. Install if missing: /opt/tts venv + kokoro-onnx + model-files-v1.0.

## 2. Voice (user's ElevenLabs mp3)
- Save to videos/<slug>/vo/raw.mp3. Detect speech with `silencedetect=n=-38dB:d=0.12`, write segments.json (all gaps 0.07 s, ~0.35 s after the "Doug <state>." gag), run `python3 tools/tighten_vo.py raw.wav segments.json tight`.
- If still > 62 s, speed with `ffmpeg -af atempo=<x>` (EP2 used 1.2) and divide segment times by x -> voice.segments.json. Target 61–62 s.
- Map segments to script phrases IN ORDER by length (sentence fragments; "Doug <state>." ~0.7 s is the anchor) -> studio/src/data/<slug>.json [{start,end,text}].
- Copy voice.mp3 to studio/public/<slug>-voice.mp3.

## 3. Build (copy studio/src/videos/dougGas.tsx as the template)
- COUNTRY/PLACE vs COUNTRY HOOK (user-approved EP3, copy `Hook` + `FlagPump`/`Arrow`/`Vs`/`Label` from studio/src/videos/dougVenezuela.tsx): big hand-written "why" + red "?" on top; red arrow that DRAWS ITSELF on, points at side A, then SWINGS to side B when it is named; two pumps/objects with flags + big price "$x / GALLON" (expensive side RED, cheap side GREEN); jerry cans/containers FILL up while each side is spoken; red "VS" badge in the middle; side names in big caps above each flag (USA / VENEZUELA); ONE "?" by Doug's head (not "? ! ?"); strong zoom (x1.22) toward the side being spoken, zoom out to both on the "Same X" stamp.
- Hook set first (blue HookTitle "<Topic> Explained by Doug", real American object drawn: price signs, pump, map...; camera pushes toward the side named) -> render only frames 0–~180, compress, send, WAIT for approval.
- Then one set per idea, new shot every 2–4 s, `cutFX` transitions (swipe/zoom/iris/pop), DEEP zooms on the named subject (6–10), `beat()` punch per phrase, `<Captions place={CAP} bare />` (hand-written, one colour, no box; positions from `CH=<chrome> python3 tools/place_captions.py <slug> <compId>`; list every on-screen big word/title in studio/src/data/<slug>.onscreen.json so repeated captions are hidden), Larry the walrus owns everything (running gag), only Doug (+family) are penguins.
- SFX: user library (tools/sfx_user_map.json; rebuild with tools/import_user_sfx.py): user-ting at 0 s, whoosh on every cut, money/cash-register on payments, boom on reveals, slap/wrong/aww/shock/fahh on pain, wow/yeah on good news, timer for "every month"; plus tools/sfx_animals.py voices. NO music.
- Render full, check a 20-frame contact sheet, re-run place_captions.py after any scene change, check captions never cover anything, compress `-crf 22 -preset slow`, < 30 MB, commit + push, send.
- Give the TikTok description (keyword question + 5 specific hashtags) — see PROJECT_LOG.

## Hooks the user liked (EP7–EP8)
- A user image can be the hook: slice it into layers (studio/src/videos/dougLibya.tsx `Slice`, white removed with mix-blend multiply), wave flags (feTurbulence filter), people lean in when their side is named, prices shake/pulse, cut to a second scene on "Same X".
- Side labels coloured (USA blue, other side its flag colour) with a white outline, never touching the flags.
- Real photos / logos / politicians only when the user explicitly asks — always warn: TikTok may limit reach.

## Never
- Re-render a finished episode unless asked. Use real photos/brand logos. Copy Monkey/Primate Economics wording ("explained with bananas", "monkey understand now").
