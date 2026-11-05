"""EP14 mix (hook SFX for now): the user's own ElevenLabs Zack voice (pauses trimmed, atempo 1.098) + air bed + SFX on the words -> render-kit/mix_ep13.wav (-11 LUFS).
Run from videos/inside-money: ~/kokoro-tts/venv/bin/python ep14-trump-iran-nuclear-whatif/mix_ep14.py"""
import json, re, subprocess, wave, numpy as np, tempfile
SR = 48000; RK = 'render-kit'; SFX = '/Users/User/benny-bucks/studio/public/sfx'; TMP = tempfile.gettempdir()
def load(p):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', p, '-ac', '1', '-ar', str(SR), f'{TMP}/_l14.wav'], check=True)
    w = wave.open(f'{TMP}/_l14.wav'); return np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768
tl = json.load(open(f'{RK}/timeline_ep14.json')); WD = tl['words']; DUR = tl['dur']
W = lambda w, n=0: [x['s'] for x in WD if re.sub(r'[^a-z0-9]', '', x['w'].lower()) == w][n]
voice = load('ep14-trump-iran-nuclear-whatif/vo.wav'); N = int(DUR * SR); out = np.zeros(N, np.float32); out[:min(N, len(voice))] += voice[:N]
rng = np.random.default_rng(14); b = np.cumsum(rng.standard_normal(N).astype(np.float32)); b -= np.convolve(b, np.ones(4800) / 4800, 'same'); b /= np.abs(b).max(); out += b * .05
def put(sig, t, g):
    i = int(max(0, t) * SR); j = min(N, i + len(sig))
    if i < N: out[i:j] += sig[:j - i] * g
def cut(sig, dur, fade=.12):
    n = int(dur * SR); x = sig[:n].copy(); f = int(min(fade, dur / 2) * SR); x[-f:] *= np.linspace(1, 0, f); return x
S = {k: load(f'{SFX}/user-{k}.wav') for k in ['ting', 'whoosh', 'boom', 'pop', 'shock', 'money', 'fahh']}
put(cut(S['ting'], .3, .15), 0.0, .14)                                   # ting at 0 s
put(cut(S['whoosh'], .35), W('trump') - .15, .3)                         # push to Trump's face
put(cut(S['pop'], .22), W('button') + .02, .45)                          # click: the red button
put(cut(S['whoosh'], .6, .3), W('button') + .12, .45)                    # missile launch
put(cut(S['whoosh'], .5, .25), W('nuclear') - .1, .3)                    # the chase
put(cut(S['boom'], 1.2, .5), W('iran') + .05, .7)                        # the blast
put(cut(S['shock'], .5), W('what', 1), .3)                               # "What happens..."
put(cut(S['money'], .45), W('wallet'), .3); put(cut(S['ting'], .35), W('wallet') + .1, .25)
# ---- story ----
S.update({k: load(f'{SFX}/user-{k}.wav') for k in ['cash-register', 'wrong', 'notif', 'slap', 'wow', 'money-transfer']})
for w, n, d in [('meet',0,-.15), ('heres',0,-.15), ('but',0,-.15), ('before',0,-.2), ('march',0,-.2), ('why',0,-.15), ('last',0,-.15), ('stocks',0,-.15), ('now',0,-.1), ('january',0,-.2), ('thats',0,-.2), ('trucks',0,-.4), ('price',0,-.35), ('and',3,-.15), ('drop',0,-.3), ('fear',0,-.2), ('so',2,-.35)]:
    put(cut(S['whoosh'], .45), W(w, n) + d, .3)                          # every white-flash change of place + camera moves
put(cut(S['pop'], .22), W('mike'), .35); put(cut(S['ting'], .3), W('1945'), .3)
for i in range(3): put(cut(S['pop'], .2), W('nobody') + i * .15, .28)   # ? ? ?
put(cut(S['pop'], .25), W('oil') - .25, .35)                             # the barrel appears
put(cut(S['cash-register'], .5), W('70'), .35)
put(cut(S['boom'], .8, .3), W('125'), .45); put(cut(S['cash-register'], .5), W('125') + .05, .3)
put(cut(S['ting'], .35), W('strait'), .28); put(cut(S['ting'], .35), W('onefifth'), .35)
put(cut(S['boom'], .7, .3), W('strike'), .45)
put(cut(S['ting'], .35), W('7'), .35); put(cut(S['pop'], .22), W('single'), .28)
put(cut(S['wrong'], .45), W('fell'), .32)
for i in range(6): put(cut(S['money'], .2), W('ran') + i * .08, .18)   # gold bars stack
put(cut(S['cash-register'], .5), W('282'), .3)
put(cut(S['boom'], .7, .3), W('427'), .45); put(cut(S['wrong'], .45), W('427') + .05, .3)
put(cut(S['ting'], .35), W('22'), .35)
for i in range(8): put(cut(S['money'], .25), W('thats') + .35 + i * .18, .2)   # bills fly into the pump
put(cut(S['pop'], .22), W('15gallon'), .28)
for i in range(3): put(cut(S['pop'], .2), W('price') + i * .12, .28)   # price tags on the trucks
put(cut(S['pop'], .25), W('peace'), .3); put(cut(S['ting'], .35), W('drop'), .3)
put(cut(S['ting'], .35), W('days'), .3)
put(cut(S['pop'], .25), W('so', 2) + .1, .35); put(cut(S['pop'], .25), W('so', 2) + .3, .35)
put(cut(S['notif'], .4), W('comment'), .35)
out /= max(1, np.abs(out).max() / .95)
wo = f'{TMP}/_m14.wav'; w = wave.open(wo, 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((out * 32767).astype(np.int16).tobytes()); w.close()
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', wo, '-af', 'loudnorm=I=-11:TP=-1:LRA=7', '-ar', str(SR), '-ac', '2', f'{RK}/mix_ep14.wav'], check=True); print('mix_ep14.wav', DUR)
