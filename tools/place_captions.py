"""Place every caption chunk in empty space so it never covers a drawing, a character or a number (user rule 2026-10-24).
Renders caption-free stills (scale 0.25) across each chunk's screen time, finds the free rectangle closest to the
previous caption (then to the centre), writes [{x, y, size}] per chunk for <Captions place={...} bare />.
Usage (repo root): CH=/path/to/chrome python3 tools/place_captions.py <slug> <compId>
  reads studio/src/data/<slug>.json, writes studio/src/data/<slug>.captions.json
No-repeat rule (user, 2026-10-24): if studio/src/data/<slug>.onscreen.json exists ([{"text", "from", "to"}] = big words /
titles / labels written on screen, times in s), a chunk is hidden when half or more of its content words are already
on screen at that moment — the viewer should not read the same words twice.
"""
import json, os, re, subprocess, sys
import numpy as np
from PIL import Image

slug, comp = sys.argv[1], sys.argv[2]
FPS, SC = 30, 4  # stills are rendered at 1/4 size
phrases = json.load(open(f'studio/src/data/{slug}.json'))

# --- same split as chunks() in studio/src/penguin/edit.tsx ---
cs = []
for p in phrases:
    words = re.sub(r'[()]', '', p['text']).split()
    groups = [words[i:i + 3] for i in range(0, len(words), 3)]
    if len(groups) > 1 and len(groups[-1]) == 1 and len(groups[-1][0]) <= 5:
        last = groups.pop(); groups[-1] += last
    total = sum(len(' '.join(g)) for g in groups); t = p['start']
    for g in groups:
        d = (p['end'] - p['start']) * len(' '.join(g)) / total
        cs.append({'start': t, 'end': t + d, 'text': ' '.join(g).lower()}); t += d
for k, c in enumerate(cs):  # on screen until the next chunk starts
    c['show'] = cs[k + 1]['start'] if k + 1 < len(cs) else c['end'] + 0.3

frames = {}
for k, c in enumerate(cs):
    a, b = c['start'] + 0.04, c['show'] - 0.04
    n = max(3, int((b - a) / 0.25) + 1)
    c['frames'] = sorted({int(round((a + (b - a) * i / (n - 1)) * FPS)) for i in range(n)})
    for f in c['frames']: frames[f] = 1
tmp = f'/tmp/capframes-{slug}'
os.makedirs(tmp, exist_ok=True)
json.dump(sorted(frames), open(f'{tmp}/frames.json', 'w'))
subprocess.run(['node', 'caption-frames.mjs', comp, tmp, f'{tmp}/frames.json'], cwd='studio', check=True)

def busy(f):
    a = np.asarray(Image.open(f'{tmp}/f{f:05d}.png').convert('RGB')).astype(int)
    return (a.min(axis=2) < 232) | (a.max(axis=2) - a.min(axis=2) > 18)

out, prev = [], None
H, W = 1920 // SC, 1080 // SC
# TikTok safe area: top bar, bottom caption/description, right-side buttons
Y0, Y1, X1 = 200 // SC, 1550 // SC, 960 // SC
for c in cs:
    m = np.zeros((H, W), bool)
    for f in c['frames']: m |= busy(f)
    ii = np.pad(m.cumsum(0).cumsum(1), ((1, 0), (1, 0)))  # integral image
    best = None
    for size in (70, 62, 54, 46):
        size = min(size, 1300 / max(8, len(c['text'])))
        tw, th = len(c['text']) * size * 0.5 + 40, size * 1.25 + 24  # text box + outline/padding (canvas px)
        w, h = int(tw / SC) + 1, int(th / SC) + 1
        if w >= X1 - 8: continue
        cands = []
        for y in range(Y0, Y1 - h, 2):
            for x in range(4, X1 - w, 3):
                s = ii[y + h, x + w] - ii[y, x + w] - ii[y + h, x] + ii[y, x]
                if s <= 2:  # free (a couple of stray pixels allowed)
                    cy, cx = (y + h / 2) * SC, (x + w / 2) * SC
                    near = abs(cy - prev[1]) + 0.5 * abs(cx - prev[0]) if prev else 0
                    cands.append((near * 0.6 + abs(cy - 960) * 0.4 + abs(cx - 540) * 0.3, cx, y * SC + 12, size))
        if cands: best = min(cands); break
    if not best:  # nothing free in the safe area: allow the lower band (above the TikTok description)
        size = min(62, 1300 / max(8, len(c['text']))); w, h = int((len(c['text']) * size * 0.5 + 40) / SC) + 1, int((size * 1.25 + 24) / SC) + 1
        lo = [(abs((y + h / 2) * SC - 1600) + abs((x + w / 2) * SC - 540) * 0.3, (x + w / 2) * SC, y * SC + 12, size) for y in range(Y1 - h, 1800 // SC - h, 2) for x in range(4, X1 - w, 3)
              if ii[y + h, x + w] - ii[y, x + w] - ii[y + h, x] + ii[y, x] <= 2]
        if lo: best = min(lo)
    if not best:  # nothing fully free: least-covered spot at the smallest size
        size = min(46, 1300 / max(8, len(c['text']))); w, h = int((len(c['text']) * size * 0.5 + 40) / SC) + 1, int((size * 1.25 + 24) / SC) + 1
        sc = [((ii[y + h, x + w] - ii[y, x + w] - ii[y + h, x] + ii[y, x]), (x + w / 2) * SC, y * SC + 12, size) for y in range(Y0, Y1 - h, 2) for x in range(4, X1 - w, 3)]
        best = min(sc); print('no free spot:', c['text'])
    out.append({'x': round(best[1]), 'y': round(best[2]), 'size': round(best[3], 1)})
    prev = (best[1], best[2])
STOP = {'the', 'a', 'an', 'and', 'in', 'on', 'of', 'to', 'is', 'it', 'for', 'at', 'this', 'that', 'but', 'so', 'not', 'doug'}
ons = json.load(open(f'studio/src/data/{slug}.onscreen.json')) if os.path.exists(f'studio/src/data/{slug}.onscreen.json') else []
norm = lambda w: re.sub(r'[^a-z0-9$%¢.]', '', w.lower()).strip('.')
for c, o in zip(cs, out):
    words = [norm(w) for w in c['text'].split()]; words = [w for w in words if w and w not in STOP]
    seen = {norm(w) for e in ons if e['from'] < c['show'] and e['to'] > c['start'] for w in e['text'].split()}
    if words and sum(w in seen for w in words) * 2 >= len(words): o['hide'] = True; print('hidden (on screen):', c['text'])
json.dump(out, open(f'studio/src/data/{slug}.captions.json', 'w'))
print(len(out), 'chunks placed')
