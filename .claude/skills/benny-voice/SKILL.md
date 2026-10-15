---
name: benny-voice
description: Make a fast, tight American-English voiceover for a Benny Bucks video (Kokoro, free) with dead air removed. Use when generating or re-generating narration.
---
# Fast voiceover
1. Write `videos/<slug>/lines.txt`: one clip per line, `voice|text|pause` (pause 0.1 default, 0.15 after the hook).
2. Run: `/opt/tts/venv/bin/python tools/tts.py videos/<slug>/lines.txt videos/<slug>/voice am_fenrir 1.25 0.1`
   - Narrator (user choice 2026-10-15): am_fenrir, young American male, speed 1.25 (fast but clear); `0.1` = max internal silence.
   - Other US voices: am_puck, am_michael, af_bella (old narrator), af_heart. Lines file prefix: `am_fenrir|text|pause`.
3. Check: `ffmpeg -i videos/<slug>/voice.mp3 -af silencedetect=n=-40dB:d=0.25 -f null - 2>&1 | grep -c silence_end` → should be 0.
4. Copy `voice.timings.json` to `studio/src/data/<slug>.json` and `voice.mp3` to `studio/public/`; compositions re-sync automatically via `wordTimer`.
If /opt/tts is missing: `python3 -m venv /opt/tts/venv && /opt/tts/venv/bin/pip install kokoro-onnx soundfile`, and download `kokoro-v1.0.onnx` + `voices-v1.0.bin` from github.com/thewh1teagle/kokoro-onnx releases (model-files-v1.0) into /opt/tts.
