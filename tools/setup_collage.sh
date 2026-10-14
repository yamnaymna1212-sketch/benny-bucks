#!/usr/bin/env bash
# One-time per session: shared venv for the gbro-collage-broll skill (Gemini Omni). Free; needs network to PyPI.
set -e
[ -x ~/hyperframes-projects/.omni-venv/bin/python ] || {
  python3 -m venv ~/hyperframes-projects/.omni-venv
  ~/hyperframes-projects/.omni-venv/bin/python -m pip install -q --upgrade "google-genai>=2.10.0" "httpx[socks]"
}
[ -n "$GEMINI_API_KEY" ] && echo "GEMINI_API_KEY: set" || echo "GEMINI_API_KEY: MISSING (add it in the environment settings, then start a new session)"
