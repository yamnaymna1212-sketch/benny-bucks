"""Rebuild the user's sound library (studio/public/sfx/user-*.wav) from the 4 mp3 packs in references/sfx-packs/.
Same split as the original session (silence -40 dB / 0.25 s), numbering u01..u64, names from tools/sfx_user_map.json.
Usage (repo root): python3 tools/import_user_sfx.py
"""
import json, os, re, subprocess, wave
import numpy as np
SR = 44100; OUT = 'studio/public/sfx'; os.makedirs(OUT + '/user', exist_ok=True)
tmp = 'references/sfx-packs'
names = sorted(os.listdir(tmp))
order = [n for n in names if n.startswith('Best')] + [n for n in names if n.startswith('Top')] + [n for n in names if n.startswith('Fahh ')] + [n for n in names if n.startswith('Fahhh')]
n = 0
for src in order:
    f = f'{tmp}/{src}'
    wav = '/tmp/' + os.path.basename(f) + '.wav'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f, '-ac', '1', '-ar', str(SR), wav], check=True)
    w = wave.open(wav); x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768; dur = len(x) / SR
    r = subprocess.run(['ffmpeg', '-i', f, '-af', 'silencedetect=n=-40dB:d=0.25', '-f', 'null', '-'], capture_output=True, text=True).stderr
    v = [float(m) for m in re.findall(r'silence_(?:start|end): ([0-9.]+)', r)]
    segs, prev = [], 0.0
    for a, b in zip(v[0::2], v[1::2]):
        if a - prev > 0.12: segs.append((prev, a))
        prev = b
    if dur - prev > 0.12: segs.append((prev, dur))
    for a, b in segs:
        c = x[int(max(0, a - 0.02) * SR):int(min(dur, b + 0.05) * SR)]
        if len(c) < 0.1 * SR or np.max(np.abs(c)) < 0.02: continue
        n += 1; c = 0.9 * c / np.max(np.abs(c))
        with wave.open(f'{OUT}/user/u{n:02d}.wav', 'wb') as o:
            o.setnchannels(1); o.setsampwidth(2); o.setframerate(SR); o.writeframes((c * 32767).astype(np.int16).tobytes())
for k, v in json.load(open('tools/sfx_user_map.json')).items():
    os.replace(f'{OUT}/user/{k}.wav', f'{OUT}/user-{v}.wav') if os.path.exists(f'{OUT}/user/{k}.wav') else None
print(n, 'clips')
