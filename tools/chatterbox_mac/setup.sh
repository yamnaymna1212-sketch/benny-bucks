#!/bin/bash
# One-time setup of Chatterbox TTS on a Mac (Apple Silicon, runs on the M-series GPU via MPS).
# Usage (from the repo root):  bash tools/chatterbox_mac/setup.sh
set -e
command -v brew >/dev/null || { echo "Install Homebrew first: https://brew.sh"; exit 1; }
brew install python@3.11 ffmpeg
python3.11 -m venv ~/chatterbox-venv
~/chatterbox-venv/bin/pip install --upgrade pip
~/chatterbox-venv/bin/pip install chatterbox-tts
~/chatterbox-venv/bin/python -c "import torch; print('MPS GPU available:', torch.backends.mps.is_available())"
echo "Done. Next: ~/chatterbox-venv/bin/python tools/chatterbox_mac/doug_voice.py videos/<slug>/vo/lines.txt videos/<slug>/vo"
