"""ElevenLabs text-to-speech (official REST API) -> MP3 voiceover.
Usage:
  python3 tools/elevenlabs_tts.py <script.txt> <out.mp3> [--voice "A Top Narrator" | --voice-id ID]
  python3 tools/elevenlabs_tts.py --text "Doug is penguin." <out.mp3>
  python3 tools/elevenlabs_tts.py --list-voices
  add --dry-run to check the key + request without calling the API.
script.txt: one spoken line per line; blank lines and lines starting with # are skipped.
Key: ELEVENLABS_API_KEY from the repo's .env (gitignored) or the environment. Never printed.
Optional .env: ELEVENLABS_VOICE_ID, ELEVENLABS_MODEL (default eleven_multilingual_v2).
"""
import argparse, os, sys
from pathlib import Path
import requests

API = "https://api.elevenlabs.io/v1"
ROOT = Path(__file__).resolve().parent.parent
DEFAULT_VOICE = "A Top Narrator"  # same voice every Doug episode

def load_env(path=ROOT / ".env"):
    """Minimal .env reader (KEY=VALUE); real environment variables win."""
    if not path.exists(): return
    for line in path.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line: continue
        k, v = line.split("=", 1)
        os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))

def api_key():
    # Empty key is fine in a cloud session with an ElevenLabs network secret: the proxy adds xi-api-key itself.
    return os.environ.get("ELEVENLABS_API_KEY", "").strip()

def auth(key):
    return {"xi-api-key": key} if key else {}

def fail(r):
    # Show the API's error message only; never the request headers (they hold the key).
    try: msg = r.json().get("detail", r.text)
    except ValueError: msg = r.text
    hint = " (no key: add ELEVENLABS_API_KEY to .env, or an api.elevenlabs.io network secret with header xi-api-key)" if r.status_code == 401 else ""
    sys.exit(f"ElevenLabs error {r.status_code}: {str(msg)[:300]}{hint}")

def voices(key):
    r = requests.get(f"{API}/voices", headers=auth(key), timeout=30)
    if not r.ok: fail(r)
    return r.json()["voices"]

def find_voice(key, name):
    vs = voices(key)
    for v in vs:
        if v["name"].lower() == name.lower(): return v["voice_id"]
    for v in vs:
        if name.lower() in v["name"].lower(): return v["voice_id"]
    sys.exit(f'Voice "{name}" not in your ElevenLabs voices. Add it from the Voice Library or run --list-voices.')

def read_script(path):
    lines = [l.strip() for l in Path(path).read_text().splitlines()]
    return "\n".join(l for l in lines if l and not l.startswith("#"))

def main():
    p = argparse.ArgumentParser(description="ElevenLabs TTS -> MP3")
    p.add_argument("script", nargs="?", help="text file with the English script")
    p.add_argument("out", nargs="?", help="output .mp3 path")
    p.add_argument("--text", help="speak this text instead of a file")
    p.add_argument("--voice", default=DEFAULT_VOICE, help="voice name (looked up in your account)")
    p.add_argument("--voice-id", help="voice id (skips the name lookup)")
    p.add_argument("--model", help="model id (default eleven_multilingual_v2)")
    p.add_argument("--format", default="mp3_44100_128", help="ElevenLabs output_format")
    p.add_argument("--list-voices", action="store_true")
    p.add_argument("--dry-run", action="store_true", help="validate key + request, no API call")
    a = p.parse_args()
    if a.text and a.script and not a.out: a.out, a.script = a.script, None

    load_env()
    key = api_key()
    if a.list_voices:
        for v in voices(key): print(f'{v["voice_id"]}  {v["name"]}')
        return
    text = a.text or (read_script(a.script) if a.script else None)
    if not text or not a.out: p.error("give a script file (or --text) and an output .mp3")
    model = a.model or os.environ.get("ELEVENLABS_MODEL", "eleven_multilingual_v2")
    voice_id = a.voice_id or os.environ.get("ELEVENLABS_VOICE_ID")
    if a.dry_run:
        print(f"key: {'from .env/env (' + str(len(key)) + ' chars, hidden)' if key else 'none (network secret expected)'} | voice: {voice_id or a.voice} | model: {model} "
              f"| {len(text.split())} words, {len(text)} chars -> {a.out}")
        return
    voice_id = voice_id or find_voice(key, a.voice)
    r = requests.post(f"{API}/text-to-speech/{voice_id}", params={"output_format": a.format},
                      headers={**auth(key), "Accept": "audio/mpeg"},
                      json={"text": text, "model_id": model}, timeout=300)
    if not r.ok: fail(r)
    out = Path(a.out); out.parent.mkdir(parents=True, exist_ok=True)
    out.write_bytes(r.content)
    print(f"saved {out} ({len(r.content) // 1024} KB, {len(text)} chars)")

if __name__ == "__main__":
    try: main()
    except requests.RequestException as e:
        sys.exit(f"Cannot reach api.elevenlabs.io ({type(e).__name__}). Check internet / network policy.")
