"""words_raw.json (faster-whisper on the TEMP Kokoro am_liam 1.0 one-take vo.wav, 61.2 s) -> render-kit/timeline_ep17.json.
ONE-word captions; whisper typos fixed (Alsaid -> El-Sayed); split '%' ',000' joined; number words blank in captions (shown in 3D instead).
Run from videos/inside-money: python3 ep17-el-sayed-tax-day-one/make_timeline.py"""
import json, re
raw = json.load(open('ep17-el-sayed-tax-day-one/words_raw.json')); W = []
FIX = {'alsaid': 'El-Sayed', "alsaid's": "El-Sayed's"}
for w in raw:
    t = w['w']
    if W and re.match(r'^[-.%,]', t):
        W[-1]['w'] += t; W[-1]['e'] = w['e']; continue
    k = re.sub(r'[.?!,]$', '', t).lower()
    if k in FIX: t = FIX[k] + t[len(k):]
    W.append({'w': t, 's': w['s'], 'e': w['e']})
W[0]['s'] = 0.0
cap = lambda w: '' if re.search(r'\d', w) else re.sub(r'[.?!,]$', '', w).upper()
ch = [{'t': cap(w['w']), 's': w['s'], 'e': (W[i + 1]['s'] if i + 1 < len(W) else w['e'] + .3)} for i, w in enumerate(W)]
dur = round(W[-1]['e'] + .4, 2)
json.dump({'dur': dur, 'words': W, 'chunks': ch, 'voice': 'ep17-el-sayed-tax-day-one/vo.wav'}, open('render-kit/timeline_ep17.json', 'w'), indent=0)
print(len(W), dur); print(' '.join(f"{w['w']}@{w['s']:.2f}" for w in W[:22]))
