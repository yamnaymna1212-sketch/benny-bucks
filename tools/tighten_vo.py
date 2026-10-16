"""Tighten a narrator voiceover: keep every speech segment, replace each pause with a chosen gap.
Usage: python3 tools/tighten_vo.py <in.wav> <segments.json> <out_prefix>
segments.json: [{"a":start,"b":end,"text":..., "line":i, "gap_after":sec}, ...] (times in the raw file).
Writes <out_prefix>.wav/.mp3 (loudnorm -14 LUFS) and <out_prefix>.timings.json (one entry per script line, new times).
"""
import json, subprocess, sys, wave
import numpy as np
src, segf, out = sys.argv[1], sys.argv[2], sys.argv[3]
w = wave.open(src); sr = w.getframerate(); x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32)
segs = json.load(open(segf)); PAD = 0.035
parts, t, lines, phr = [], 0.0, {}, []
for s in segs:
    a, b = max(0, s["a"] - PAD), s["b"] + PAD
    clip = x[int(a * sr): int(b * sr)].copy()
    f = int(0.008 * sr); clip[:f] *= np.linspace(0, 1, f); clip[-f:] *= np.linspace(1, 0, f)
    L = lines.setdefault(s["line"], {"text": [], "start": round(t, 2)})
    L["text"].append(s["text"]); p0 = t; parts.append(clip); t += len(clip) / sr; L["end"] = round(t, 2)
    phr.append({"line": s["line"], "text": s["text"], "start": round(p0 + PAD, 2), "end": round(t - PAD, 2)})
    g = s.get("gap_after", 0.15); parts.append(np.zeros(int(g * sr), dtype=np.float32)); t += g
y = np.concatenate(parts)
with wave.open(out + ".raw.wav", "wb") as o:
    o.setnchannels(1); o.setsampwidth(2); o.setframerate(sr); o.writeframes(np.clip(y, -32768, 32767).astype(np.int16).tobytes())
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", out + ".raw.wav", "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-ar", "48000", out + ".wav"], check=True)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", out + ".wav", "-b:a", "192k", out + ".mp3"], check=True)
subprocess.run(["rm", out + ".raw.wav"])
tim = [{"line": k, "text": " ".join(v["text"]), "start": v["start"], "end": v["end"]} for k, v in sorted(lines.items())]
json.dump(tim, open(out + ".timings.json", "w"), indent=1)
json.dump(phr, open(out + ".phrases.json", "w"), indent=1)
print(f"{len(y) / sr:.2f}s")
