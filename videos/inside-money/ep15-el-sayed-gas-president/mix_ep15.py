"""EP15 mix (hook): voice + air bed + SFX on the words -> render-kit/mix_ep15.wav.
Run from videos/inside-money: ~/kokoro-tts/venv/bin/python ep15-el-sayed-gas-president/mix_ep15.py [voice.wav]"""
import json, re, subprocess, sys, wave, numpy as np, tempfile
SR = 48000; RK = 'render-kit'; SFX = '/Users/User/benny-bucks/studio/public/sfx'; TMP = tempfile.gettempdir()
def load(p):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', p, '-ac', '1', '-ar', str(SR), f'{TMP}/_l15.wav'], check=True)
    w = wave.open(f'{TMP}/_l15.wav'); return np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768
tl = json.load(open(f'{RK}/timeline_ep15.json')); WD = tl['words']; DUR = tl['dur']
W = lambda w, n=0: [x['s'] for x in WD if re.sub(r'[^a-z0-9]', '', x['w'].lower()) == w][n]
VO = sys.argv[1] if len(sys.argv) > 1 else 'ep15-el-sayed-gas-president/vo_hook_temp.wav'
voice = load(VO); N = int(DUR * SR); out = np.zeros(N, np.float32); out[:min(N, len(voice))] += voice[:N]
rng = np.random.default_rng(15); b = np.cumsum(rng.standard_normal(N).astype(np.float32)); b -= np.convolve(b, np.ones(4800) / 4800, 'same'); b /= np.abs(b).max(); out += b * .05
def put(sig, t, g):
    i = int(max(0, t) * SR); j = min(N, i + len(sig))
    if i < N: out[i:j] += sig[:j - i] * g
def cut(sig, dur, fade=.12):
    n = int(dur * SR); x = sig[:n].copy(); f = int(min(fade, dur / 2) * SR); x[-f:] *= np.linspace(1, 0, f); return x
S = {k: load(f'{SFX}/user-{k}.wav') for k in ['ting', 'whoosh', 'boom', 'pop', 'money', 'cash-register', 'wrong']}
put(cut(S['ting'], .3, .15), 0.0, .14)                                    # ting at 0 s
put(cut(S['pop'], .22), W('gas'), .4)                                     # the pump bounces
put(cut(S['whoosh'], .4), W('prices') - .2, .28)                          # push to the pump
put(cut(S['cash-register'], .5), W('prices') + .05, .32)                  # $100 bills circle
put(cut(S['whoosh'], .4), W('if') - .05, .3)                              # fly to DC
put(cut(S['pop'], .25), W('elsayed'), .42); put(cut(S['ting'], .35), W('elsayed') + .08, .22)   # the head badge pops
put(cut(S['whoosh'], .7, .3), W('president'), .38)                        # the map wipes red -> blue
put(cut(S['ting'], .35), W('today'), .32); put(cut(S['pop'], .2), W('today') + .12, .3)   # '?' + arrows
put(cut(S['whoosh'], .45), W('meet') - .12, .32)                          # white flash -> Mike
put(cut(S['pop'], .22), W('mike'), .3)
for i in range(5): put(cut(S['money'], .22), W('paid') + i * .1, .2)      # bills fly into the pump
put(cut(S['cash-register'], .5), W('four') if any(x['w'].lower()=='four' for x in WD) else W('paid') + .4, .3)
out /= max(1, np.abs(out).max() / .95)
w = wave.open(f'{RK}/mix_ep15.wav', 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((out * 32767).astype(np.int16).tobytes()); w.close()
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f'{RK}/mix_ep15.wav', '-af', 'loudnorm=I=-11:TP=-1', '-ar', str(SR), f'{TMP}/_m15.wav'], check=True)
subprocess.run(['mv', f'{TMP}/_m15.wav', f'{RK}/mix_ep15.wav'], check=True); print('mix_ep15.wav', DUR)
