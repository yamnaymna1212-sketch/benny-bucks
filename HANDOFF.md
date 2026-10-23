# HANDOFF — "Doug the Penguin" channel (updated 2026-10-23, after EP7)

Read: CLAUDE.md -> .claude/skills/doug-episode/SKILL.md -> last 20 lines of PROJECT_LOG.md -> videos/penguin-series/script-formula.md.
Talk to the user in Arabic. Video text/voice in English. One episode = one session.

## Setup in a fresh container
- `cd studio && npm ci`
- SFX (gitignored): `python3 tools/import_user_sfx.py && python3 tools/sfx_animals.py`
- Voice engine (Kokoro, free): see SKILL.md §2 (venv in /opt/tts + 2 model files from github.com/thewh1teagle/kokoro-onnx).
- Render with `--browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell --concurrency=4`.
- Episode voices in studio/public/*-voice.mp3 are gitignored: copy from videos/<slug>/vo/voice.mp3.

## Current rules that changed recently
- Voice: FAST Kokoro am_puck 1.15, no pauses; short script -> add lines (user, 2026-10-23).
- Hook from the user's own picture: both sides from frame 0, animated layers, sides interact (tug-of-war), Doug in the middle, cut to Doug's scene on "This is Doug." (EP7).
- Talk in Arabic, blunt feedback; warn before expensive renders; batch fixes.

## Episodes
EP1 rent, EP2 gas, EP3 USA vs Venezuela gas, EP6 money laundering, EP7 Chicken Tax (studio/src/videos/dougTariff.tsx -> videos/doug-tariff/doug-tariff.mp4).
Template for the next versus episode with a user picture: copy dougTariff.tsx (Hook + Layer/POLY + Cut/PARTS).
