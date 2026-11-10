"""EP13 mix (hook SFX for now): the user's own ElevenLabs voice (1.15x) + air bed + SFX on the words -> render-kit/mix_ep13.wav (-11 LUFS).
Run from videos/inside-money: ~/kokoro-tts/venv/bin/python ep13-el-sayed-president/mix_ep13.py"""
import json, re, subprocess, wave, numpy as np, tempfile
SR = 48000; RK = 'render-kit'; SFX = '/Users/User/benny-bucks/studio/public/sfx'; TMP = tempfile.gettempdir()
def load(p):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', p, '-ac', '1', '-ar', str(SR), f'{TMP}/_l13.wav'], check=True)
    w = wave.open(f'{TMP}/_l13.wav'); return np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768
tl = json.load(open(f'{RK}/timeline_ep13.json')); WD = tl['words']; DUR = tl['dur']
W = lambda w, n=0: [x['s'] for x in WD if re.sub(r'[^a-z0-9-]', '', x['w'].lower()) == w][n]
voice = load('ep13-el-sayed-president/vo.wav'); N = int(DUR * SR); out = np.zeros(N, np.float32); out[:min(N, len(voice))] += voice[:N]
rng = np.random.default_rng(13); b = np.cumsum(rng.standard_normal(N).astype(np.float32)); b -= np.convolve(b, np.ones(4800) / 4800, 'same'); b /= np.abs(b).max(); out += b * .05
def put(sig, t, g):
    i = int(max(0, t) * SR); j = min(N, i + len(sig))
    if i < N: out[i:j] += sig[:j - i] * g
def cut(sig, dur, fade=.12):
    n = int(dur * SR); x = sig[:n].copy(); f = int(min(fade, dur / 2) * SR); x[-f:] *= np.linspace(1, 0, f); return x
S = {k: load(f'{SFX}/user-{k}.wav') for k in ['ting', 'whoosh', 'money', 'boom', 'pop', 'cash-register']}
put(cut(S['ting'], .3, .15), 0.0, .14)                                   # ting at 0 s
put(cut(S['whoosh'], .35), W('president') - .2, .3)                      # push to the board
put(cut(S['boom'], .8, .3), W('president'), .4)                          # PRESIDENT lights up
for i in range(3): put(cut(S['pop'], .2), W('president') + .08 + i * .12, .25)   # confetti
put(cut(S['whoosh'], .4), W('what') - .1, .35)                           # whip to Mike
put(cut(S['money'], .5), W('what') + .2, .3)                             # he raises the fan of $100s
put(cut(S['cash-register'], .5), W('your') - .1, .3)                     # "?" pops by the money
put(cut(S['ting'], .35), W('money'), .3); put(cut(S['boom'], .7, .3), W('money'), .3)
# ---- story ----
S.update({k: load(f'{SFX}/user-{k}.wav') for k in ['slap', 'wrong', 'notif', 'shock', 'timer']})
for t in [4.85, W('but') - .3, W('income') + .6, W('rent') - .5, W('wealthy') - .45, W('careful') - .2, W('no', 4) - .6]: put(cut(S['whoosh'], .45), t, .32)   # every flight
put(cut(S['pop'], .25), W('medicare') - .1, .35)
for w in ['vision', 'dental', 'hearing']: put(cut(S['pop'], .22), W(w) - .05, .3)
for w in ['premiums', 'copays', 'deductibles']: put(cut(S['ting'], .3), W(w), .28); put(cut(S['slap'], .2), W(w) + .02, .25)   # $0 stamps
put(cut(S['wrong'], .45), W('paid'), .3)
for w in ['wealth', 'corporate', 'investment']:
    for k in range(3): put(cut(S['money'], .3), W(w) + .1 + k * .14, .22)   # straps fly into the jar
put(cut(S['cash-register'], .6), W('around') + .1, .38)                  # $100,000
put(cut(S['pop'], .22), W('hopes'), .3)
put(cut(S['boom'], .7, .3), W('higher', 1), .4); put(cut(S['whoosh'], .35), W('ordinary') - .6, .22)
put(cut(S['notif'], .35), W('ban'), .35); put(cut(S['wrong'], .45), W('ban') + .05, .3)
put(cut(S['pop'], .25), W('corporations') - .05, .3); put(cut(S['wrong'], .45), W('owning'), .3)
for i in range(4): put(cut(S['pop'], .2), W('boom') - .25 + i * .13, .28)
put(cut(S['ting'], .35), W('prices'), .3)
put(cut(S['pop'], .25), W('business'), .3); put(cut(S['boom'], .7, .3), W('expect') + .2, .4); put(cut(S['whoosh'], .4), W('expect') + .15, .25)
put(cut(S['wrong'], .45), W('corporate', 1) - .1, .3)
put(cut(S['shock'], .5), W('cant'), .28)
put(cut(S['slap'], .3), W('congress') + .02, .45); put(cut(S['boom'], .8, .3), W('congress'), .45)   # gavel
put(cut(S['pop'], .25), W('spending'), .3); put(cut(S['pop'], .25), W('taxes', 5), .3)
put(cut(S['wrong'], .45), W('less') - .05, .3)
for w, n in [('income', 1), ('family', 1), ('rent', 1), ('investments', 0)]: put(cut(S['pop'], .22), W(w, n) - .05, .3)
put(cut(S['ting'], .35), W('comments'), .25); put(cut(S['pop'], .25), W('follow') + .4, .3)
put(cut(S['whoosh'], .4), W('trump') - .4, .3); put(cut(S['boom'], .7, .3), W('trump'), .35)
out /= max(1, np.abs(out).max() / .95)
wo = f'{TMP}/_m13.wav'; w = wave.open(wo, 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((out * 32767).astype(np.int16).tobytes()); w.close()
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', wo, '-af', 'loudnorm=I=-11:TP=-1:LRA=7', '-ar', str(SR), '-ac', '2', f'{RK}/mix_ep13.wav'], check=True); print('mix_ep13.wav', DUR)
