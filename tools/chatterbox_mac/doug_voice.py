"""Chatterbox TTS (free, MIT) on the Mac GPU (MPS) -> Doug narrator voiceover, one clip per script line.
Usage: ~/chatterbox-venv/bin/python tools/chatterbox_mac/doug_voice.py <lines.txt> <out_dir> [ref.wav] [exaggeration] [cfg]
lines.txt: one script line per row (blank rows ignored), "text|gap_after_seconds" to override the gap.
ref.wav: 10-20 s of the narrator voice to clone (default videos/voice-ref/narrator-ref.wav).
Writes <out_dir>/raw.wav, raw.mp3 and segments.json (tools/tighten_vo.py format) -> commit + push, Claude does the rest.
"""
import json, os, subprocess, sys, time, wave
os.environ.setdefault("PYTORCH_ENABLE_MPS_FALLBACK", "1")
import numpy as np, torch

src, out = sys.argv[1], sys.argv[2]
ref = sys.argv[3] if len(sys.argv) > 3 else "videos/voice-ref/narrator-ref.wav"
exag = float(sys.argv[4]) if len(sys.argv) > 4 else 0.5
cfg = float(sys.argv[5]) if len(sys.argv) > 5 else 0.5
GAP, GAG_GAP = 0.07, 0.35  # same gaps as the skill; longer after the "Doug <state>." gag

device = "mps" if torch.backends.mps.is_available() else "cpu"
print("device:", device)
_load = torch.load  # checkpoints were saved on CUDA -> map them to the Mac device
torch.load = lambda *a, **k: _load(*a, **{"map_location": torch.device(device), **k})
from chatterbox.tts import ChatterboxTTS
model = ChatterboxTTS.from_pretrained(device=device)
sr = model.sr

def trim(a, thr=0.01, pad=0.03):
    idx = np.where(np.abs(a) > thr)[0]
    if not len(idx): return a
    p = int(pad * sr)
    return a[max(idx[0] - p, 0): idx[-1] + p]

rows = [r.strip() for r in open(src, encoding="utf-8") if r.strip()]
parts, segs, t = [], [], 0.0
for i, row in enumerate(rows):
    text, _, g = row.partition("|")
    text = text.strip()
    gap = float(g) if g else (GAG_GAP if text.lower().startswith("doug ") and len(text.split()) <= 3 else GAP)
    t0 = time.time()
    wav = model.generate(text, audio_prompt_path=ref, exaggeration=exag, cfg_weight=cfg)
    a = trim(wav.squeeze(0).cpu().numpy().astype(np.float32))
    segs.append({"a": round(t, 3), "b": round(t + len(a) / sr, 3), "line": i, "text": text, "gap_after": gap})
    parts += [a, np.zeros(int(0.3 * sr), dtype=np.float32)]
    t += len(a) / sr + 0.3
    print(f"[{i + 1}/{len(rows)}] {len(a) / sr:.2f}s ({time.time() - t0:.1f}s)  {text}")

os.makedirs(out, exist_ok=True)
y = np.clip(np.concatenate(parts) * 32767, -32768, 32767).astype(np.int16)
with wave.open(os.path.join(out, "raw.wav"), "wb") as o:
    o.setnchannels(1); o.setsampwidth(2); o.setframerate(sr); o.writeframes(y.tobytes())
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", os.path.join(out, "raw.wav"), "-b:a", "192k", os.path.join(out, "raw.mp3")], check=True)
json.dump(segs, open(os.path.join(out, "segments.json"), "w"), indent=1)
print(f"raw voice {t:.1f}s -> {out}/raw.wav, raw.mp3, segments.json")
