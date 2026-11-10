"""words_raw.json (faster-whisper on the user's own ElevenLabs 'Zack' voice, 1.15x) -> render-kit/timeline_ep13.json.
ONE-word caption chunks; whisper typos fixed (El Sayyad -> EL-SAYED, happened -> happens, $100 ,000, rent -setting).
Run from videos/inside-money: python3 ep13-el-sayed-president/make_timeline.py"""
import json, re
raw = json.load(open('ep13-el-sayed-president/words_raw.json')); W = []
for w in raw:
    t = w['w']
    if W and (t.startswith(',') or t.startswith('-')):
        W[-1]['w'] += t; W[-1]['e'] = w['e']; continue
    if W and t.lower().startswith('sayyad') and W[-1]['w'] == 'El':
        W[-1]['w'] = 'El-Sayed' + t[6:]; W[-1]['e'] = w['e']; continue
    if t.startswith('happened'):
        t = 'happens' + t[8:]
    W.append({'w': t, 's': w['s'], 'e': w['e']})
W[0]['s'] = 0.0
ch = [{'t': re.sub(r'[.?!]$|,$', '', w['w']).upper(), 's': w['s'], 'e': (W[i + 1]['s'] if i + 1 < len(W) else w['e'] + .3)} for i, w in enumerate(W)]
dur = round(W[-1]['e'] + .4, 2)
json.dump({'dur': dur, 'words': W, 'chunks': ch}, open('render-kit/timeline_ep13.json', 'w'), indent=0)
print(len(W), dur); print(' '.join(f"{w['w']}@{w['s']:.2f}" for w in W[:16]))
