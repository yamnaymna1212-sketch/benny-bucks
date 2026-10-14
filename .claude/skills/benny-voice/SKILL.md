---
name: benny-voice
description: Make a fast, tight American-English voiceover for a Benny Bucks video (Kokoro, free) with dead air removed. Use when generating or re-generating narration.
---
# Fast voiceover
1. Write `videos/<slug>/lines.txt`: one clip per line, `voice|text|pause` (pause 0.1 default, 0.15 after the hook).
2. Run: `/opt/tts/venv/bin/python tools/tts.py videos/<slug>/lines.txt videos/<slug>/voice af_bella 1.3 0.12`
   - speed 1.3 = fast but clear; `0.12` = max internal silence (longer gaps are cut).
   - US voices: af_bella (default), af_heart, am_puck, am_fenrir.
3. Check: `ffmpeg -i videos/<slug>/voice.mp3 -af silencedetect=n=-40dB:d=0.25 -f null - 2>&1 | grep -c silence_end` → should be 0.
4. Copy `voice.timings.json` to `studio/src/data/<slug>.json` and `voice.mp3` to `studio/public/`; compositions re-sync automatically via `wordTimer`.
If /opt/tts is missing: `python3 -m venv /opt/tts/venv && /opt/tts/venv/bin/pip install kokoro-onnx soundfile`, and download `kokoro-v1.0.onnx` + `voices-v1.0.bin` from github.com/thewh1teagle/kokoro-onnx releases (model-files-v1.0) into /opt/tts.
