"""EP16 mix: voice + air bed + FEW SFX (user rule) -> render-kit/mix_ep16.wav.
Run from videos/inside-money: ~/kokoro-tts/venv/bin/python ep16-congress-gas/mix_ep16.py [voice.wav]"""
import json, re, subprocess, sys, wave, numpy as np, tempfile
SR = 48000; RK = 'render-kit'; SFX = '/Users/User/benny-bucks/studio/public/sfx'; TMP = tempfile.gettempdir()
def load(p):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', p, '-ac', '1', '-ar', str(SR), f'{TMP}/_l16.wav'], check=True)
    w = wave.open(f'{TMP}/_l16.wav'); return np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768
tl = json.load(open(f'{RK}/timeline_ep16.json')); WD = tl['words']; DUR = tl['dur']
W = lambda w, n=0: [x['s'] for x in WD if re.sub(r'[^a-z0-9]', '', x['w'].lower()) == w][n]
VO = sys.argv[1] if len(sys.argv) > 1 else tl['voice']
voice = load(VO); N = int(DUR * SR); out = np.zeros(N, np.float32); out[:min(N, len(voice))] += voice[:N]
rng = np.random.default_rng(16); b = np.cumsum(rng.standard_normal(N).astype(np.float32)); b -= np.convolve(b, np.ones(4800) / 4800, 'same'); b /= np.abs(b).max(); out += b * .05
def put(sig, t, g):
    i = int(max(0, t) * SR); j = min(N, i + len(sig))
    if i < N: out[i:j] += sig[:j - i] * g
def cut(sig, dur, fade=.12):
    n = int(dur * SR); x = sig[:n].copy(); f = int(min(fade, dur / 2) * SR); x[-f:] *= np.linspace(1, 0, f); return x
S = {k: load(f'{SFX}/user-{k}.wav') for k in ['ting', 'whoosh', 'pop', 'cash-register']}
put(cut(S['ting'], .3, .15), 0.0, .14)                 # ting at 0 s (channel rule)
put(cut(S['whoosh'], .7, .3), W('lost') + .05, .3)     # LOST + the map wipes red -> blue
put(cut(S['pop'], .22), W('cheaper'), .3)              # '?' + UP / DOWN
put(cut(S['whoosh'], .45), W('three') - .12, .26)      # camera to the 3 numbered cards
# ---- story (few SFX): a whoosh on every white flash + a few key cues ----
for w, n in [('meet',0), ('thing',0), ('thing',1), ('about',6), ('thing',2), ('so',1), ('will',1)]:
    put(cut(S['whoosh'], .45), W(w, n) - .12, .24)
put(cut(S['cash-register'], .5), W('fourteen') + .05, .24)   # +$14 every tank
put(cut(S['ting'], .35), W('two'), .26)                      # = $2.76
put(cut(S['pop'], .22), W('pause'), .26)                     # the padlock opens
put(cut(S['pop'], .22), W('vetoes'), .28)                    # VETO
put(cut(S['ting'], .35), W('thirds'), .24)                   # 2/3
put(cut(S['pop'], .22), W('up', 0), .3)                      # UP / DOWN signs
out /= max(1, np.abs(out).max() / .95)
w = wave.open(f'{RK}/mix_ep16.wav', 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((out * 32767).astype(np.int16).tobytes()); w.close()
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f'{RK}/mix_ep16.wav', '-af', 'loudnorm=I=-11:TP=-1', '-ar', str(SR), f'{TMP}/_m16.wav'], check=True)
subprocess.run(['mv', f'{TMP}/_m16.wav', f'{RK}/mix_ep16.wav'], check=True); print('mix_ep16.wav', DUR)
