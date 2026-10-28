# Doug style v2: "3 Reasons" countdown (locked 2026-10-28, first used on EP America vs Kuwait)

This is the DEFAULT style for new Price Gap episodes. Reference build: `studio/src/videos/dougKuwait.tsx`
(comp `doug-kuwait`, hook-only comp `doug-kuwait-hook`). Copy it for the next episode. Do not go back to the
Iran/Venezuela/Libya style (caveman lines, Boss Bear) unless the user asks.

## 1. Hook (0–~4 s): every user edit, in order
- Top: yellow brush stroke + heavy black **WHY** (Montserrat 900) + 3 shock dashes on each side.
- Two columns: flag on top → big white price board "$X / PER GALLON" (expensive side RED `#D83A2E`, cheap side GREEN `#2E9E4F`) → small down arrow → gas pump.
- Gas pump = simple ⛽ icon look: ONE solid red body, white screen, white **fuel drop in the middle**, black hose + nozzle on the side, grey base. SAME pump on both sides. No GAS label, no buttons, no LCD digits, no extra colours (user: "not realistic / too many colours").
- Red **VS** circle in the middle between the two boards.
- NO "RECORD" / "TODAY" tags on screen. Put the date or source of a number in the TikTok caption.
- Doug alone in the middle. Never boxed in: pumps sit at the edges (x 215 / 865), Doug h 440, wings down when he is idle.
- Everything visible on frame 0, so the contrast reads before any word.
- Motion: slow zoom toward the side being spoken (×1.16, then a quick pan to the other side and keep pushing). A red hand-drawn arrow draws itself toward side A, then swings to side B when B is named. The price board punches when its price is spoken.
- Doug reactions: he turns to side A, puzzled, with a "?", and points at it with his wing. He whips to side B stunned (big eyes, small pupils, open mouth, sweat, little jolt) and points at it.
- Price-word timing scales with any voice: price A at 28% of line 1, price B at 42% of line 2 (`US_PRICE` / `KW_PRICE`).

## 2. Script structure (normal fast English, NO caveman lines)
1. Hook "Why is X $A in America… but just $B in <place>?"
2. "There are three reasons. And number one is crazy."
3. REASON 3, then REASON 2, then REASON 1. Each reason gets a navy card (`ReasonCard`: navy `#1F3A5F`, rotating rays, yellow numbered circle, white title), then 2–4 one-idea shots with real numbers.
4. "Sounds perfect, right? Here is the twist." → a surprising true fact (yellow screen, THE TWIST).
5. "Doug confused." (one gag line, close-up with ? marks)
6. Number that confirms the gap (e.g. one tank $75 vs $15 = $60 saved; 6 fish fly, 1 fish = $10).
7. CTA question: "Would you …? Comment below." 👇
- Length: 61–65 s (Kuwait: 31 lines, 64.7 s of voice). Every number checked with WebSearch, source in the caption.

## 3. Voice (user rule)
- Kokoro **am_fenrir**, speed **1.22**, pauses 0.05–0.25 s, max_gap 0.05: `/opt/tts/venv/bin/python tools/tts.py videos/<slug>/vo/lines.txt videos/<slug>/vo/voice-raw am_fenrir 1.22 0.05`
- Then: `ffmpeg -i voice-raw.wav -af "highpass=f=90,equalizer=f=3200:t=q:w=1:g=4,acompressor=threshold=-18dB:ratio=3:attack=5:release=60,loudnorm=I=-14:TP=-1" -b:a 192k voice.mp3`
- Copy it to `studio/public/<slug>-voice.mp3`. That folder is gitignored; the committed copy is `videos/<slug>/vo/voice.mp3`.
- Phrase map: `voice-raw.timings.json` → `studio/src/data/<slug>.json`. Write numbers as $ / ¢ in the caption text. Check compound words such as "seventy-five" → "$75".
- NEVER am_michael. If TTS is missing: venv + `pip install kokoro-onnx soundfile` + model-files-v1.0 (kokoro-v1.0.onnx, voices-v1.0.bin) into /opt/tts.

## 4. Sound design (user SFX library, NO music)
- Rebuild the library if `studio/public/sfx` is missing: `python3 tools/import_user_sfx.py`.
- ting at 0 s · cash-register on price A · boom on price B · whoosh (0.22) on every cut · boom on each REASON card · shock on "#1 is crazy" · slap when tax is taken · money / money-transfer on payments · wrong on bad news · wow on big numbers · yeah + horn on "twist" · aww on Doug's pain · fahh on "Doug confused" · pop on the CTA.

## 5. Edit
- Hook camera above. After the hook: `cutFX` transitions rotate swipe / swipeL / pop / zoom / iris, `beat()` punch on each phrase, deep zooms on 1–2 key subjects only. A zoom must never crop a BigWord.
- Ground at y 1300 (white/grey for USA, sand `#F2DCA0` for the other country). Captions: hand-written, one colour, at y 1700. Keep everything else above 1680.
- Cast: Doug = only penguin. Tax = Seagull, oil company = Larry the walrus, other-country driver = Puffin, government money = Vault of fish.
- Check: a 20-frame contact sheet before the full render. Then compress with `-crf 22 -preset slow`, keep it under 30 MB, commit and push.
