"""Kokoro TTS (free, Apache-2.0) -> tight voiceover with controlled pauses.
Usage: /opt/tts/venv/bin/python tools/tts.py <lines.txt> <out_prefix> [voice] [speed] [max_gap]
max_gap: silences inside a clip longer than this (s) are shortened to it (default 0.12) — removes dead air.
lines.txt: one line per clip, "text|pause_after_seconds" or "voice|text|pause" to override the voice,
or "voice|text|pause|speed" to also override the speed (use a slower speed for the hook: names + prices must be clear).
Writes <out_prefix>.wav, .mp3 (-14 LUFS) and .timings.json.
"""
import json, subprocess, sys
import numpy as np, soundfile as sf
from kokoro_onnx import Kokoro

MODEL = "/opt/tts/kokoro-v1.0.onnx"; VOICES = "/opt/tts/voices-v1.0.bin"
src, out = sys.argv[1], sys.argv[2]
voice = sys.argv[3] if len(sys.argv) > 3 else "am_puck"
speed = float(sys.argv[4]) if len(sys.argv) > 4 else 1.1
max_gap = float(sys.argv[5]) if len(sys.argv) > 5 else 0.12

def trim(a, sr, thr=0.01, pad=0.03):
    idx = np.where(np.abs(a) > thr)[0]
    if not len(idx): return a
    p = int(pad * sr)
    return a[max(idx[0] - p, 0): idx[-1] + p]

def squeeze(a, sr, thr=0.012, win=0.02):
    """Shorten internal pauses longer than max_gap to max_gap."""
    n = int(win * sr); m = len(a) // n
    loud = np.abs(a[:m * n]).reshape(m, n).max(1) > thr
    keep, run = [], 0
    for i, l in enumerate(loud):
        run = 0 if l else run + 1
        if l or run * win <= max_gap: keep.append(a[i * n:(i + 1) * n])
    keep.append(a[m * n:])
    return np.concatenate(keep)

k = Kokoro(MODEL, VOICES)
parts, timings, t = [], [], 0.0
for line in open(src):
    if not line.strip(): continue
    f = line.rstrip("\n").split("|")
    v, text, pause = (f[0], f[1], f[2]) if len(f) >= 3 else (voice, f[0], f[1])
    sp = float(f[3]) if len(f) == 4 else speed
    a, sr = k.create(text, voice=v, speed=sp, lang="en-us")
    a = squeeze(trim(a, sr), sr)
    timings.append({"voice": v, "text": text, "start": round(t, 2), "end": round(t + len(a) / sr, 2)})
    parts += [a, np.zeros(int(float(pause) * sr), dtype=a.dtype)]
    t += len(a) / sr + float(pause)
sf.write(out + ".raw.wav", np.concatenate(parts), sr)
af = "loudnorm=I=-14:TP=-1.5:LRA=11"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", out + ".raw.wav", "-af", af, "-ar", "48000", out + ".wav"], check=True)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", out + ".wav", "-b:a", "192k", out + ".mp3"], check=True)
subprocess.run(["rm", out + ".raw.wav"])
json.dump(timings, open(out + ".timings.json", "w"), indent=1)
print(f"{voice}: {t:.1f}s")
