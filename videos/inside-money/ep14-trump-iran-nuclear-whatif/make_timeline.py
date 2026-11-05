"""words_raw.json (faster-whisper on the user's ElevenLabs 'Zack' take, pauses trimmed + atempo 1.098 -> 63.4 s) -> render-kit/timeline_ep14.json.
ONE-word captions; whisper typos fixed (sales->sails, rammed->ran, split '-fifth' '.82' '%' '-gallon' joined); number/price words left blank in captions (shown in 3D instead).
Run from videos/inside-money: python3 ep14-trump-iran-nuclear-whatif/make_timeline.py"""
import json, re
raw = json.load(open('ep14-trump-iran-nuclear-whatif/words_raw.json')); W = []
FIX = {'sales': 'sails', 'rammed': 'ran'}
for w in raw:
    t = w['w']
    if W and re.match(r'^[-.%]', t):
        W[-1]['w'] += t; W[-1]['e'] = w['e']; continue
    t = FIX.get(t.lower(), t)
    W.append({'w': t, 's': w['s'], 'e': w['e']})
W[0]['s'] = 0.0
cap = lambda w: '' if re.search(r'\d', w) else re.sub(r'[.?!,]$', '', w).upper()
ch = [{'t': cap(w['w']), 's': w['s'], 'e': (W[i + 1]['s'] if i + 1 < len(W) else w['e'] + .3)} for i, w in enumerate(W)]
dur = round(W[-1]['e'] + .4, 2)
json.dump({'dur': dur, 'words': W, 'chunks': ch}, open('render-kit/timeline_ep14.json', 'w'), indent=0)
print(len(W), dur); print(' '.join(f"{w['w']}@{w['s']:.2f}" for w in W[:22]))
