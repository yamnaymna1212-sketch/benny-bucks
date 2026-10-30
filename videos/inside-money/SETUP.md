# Inside Money — new-machine setup (read in any new session)
Everything about the channel is in git: PROJECT_BRIEF.md (master), CHANNEL_BIBLE.md, SCRIPT_STRUCTURE.md, REFERENCE_ANALYSIS.md, ep*/ (plan, script, voice, timings), render-kit/ (code). Big files are NOT in git (rebuild below).

## Render on the Mac (Apple GPU)
```
cd videos/inside-money/render-kit && npm install && npm run setup   # Chromium + free CC0 assets (~120 MB)
npm run render -- ep1 5      # 5-s preview;  npm run render -- ep1  = full
```
render.mjs must launch Chrome with `--use-angle=metal --enable-gpu` (plain headless gives NO WEBGL2 on the M3). The log must print `GPU: ... Apple M3`; if it says SwiftShader, add `--show`.

## Voice (free, local, Mac)
```
python3.11 -m venv ~/kokoro-tts/venv && ~/kokoro-tts/venv/bin/pip install kokoro-onnx soundfile numpy faster-whisper
cd ~/kokoro-tts && curl -LO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx && curl -LO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin
sed "s#/opt/tts/#$HOME/kokoro-tts/#g" tools/tts.py > ~/kokoro-tts/tts.py
~/kokoro-tts/venv/bin/python ~/kokoro-tts/tts.py lines.txt vo am_fenrir 1.18 0.06     # then align.py needs 16 kHz mono: ffmpeg -ac 1 -ar 16000
```
ElevenLabs (when the connector is on): generations_count=1 only.

## SFX library
`python3 tools/import_user_sfx.py` rebuilds studio/public/sfx from references/sfx-packs.

## Phone / cloud sessions
They see only git (scripts, plans, code, rules). They have no Mac GPU, no ~/kokoro-tts, no reference videos unless committed. Plan and write there; render and voice on the Mac.
