"""EP3 mix (Zack-style: never quiet): voice + room tone + SFX on every move/number, gaps filled -> render-kit/mix_ep3.wav at -11 LUFS.
Run from videos/inside-money: ~/kokoro-tts/venv/bin/python ep3-bank-mistake/mix_ep3.py"""
import json,subprocess,wave,numpy as np
SR=48000;RK='render-kit';SFX='/Users/User/benny-bucks/studio/public/sfx'
def load(p):
    subprocess.run(['ffmpeg','-v','error','-y','-i',p,'-ac','1','-ar',str(SR),'/tmp/_l3.wav'],check=True)
    w=wave.open('/tmp/_l3.wav');return np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)/32768
tl=json.load(open(f'{RK}/timeline_ep3.json'));WD=tl['words'];DUR=tl['dur'];LN=tl['lines'];L=lambda n:LN[n-1]['start']
def W(w,n=1):
    c=0
    for x in WD:
        if x['w']==w:
            c+=1
            if c==n:return x['s']
    raise KeyError(w)
voice=load(f'{RK}/vo_ep3.wav');N=int(DUR*SR);out=np.zeros(N,np.float32);out[:min(N,len(voice))]+=voice[:N]
rng=np.random.default_rng(5)
def noise(d,k):
    x=rng.standard_normal(int(d*SR)).astype(np.float32);x=np.convolve(x,np.ones(k)/k,'same');return x/np.abs(x).max()
t=np.arange(N)/SR;room=noise(DUR,40)*.5+.5*np.sin(2*np.pi*60*t)*(1+.2*np.sin(2*np.pi*.3*t));out+=room.astype(np.float32)*.035   # room tone: air + fridge hum
def put(sig,t0,g):
    i=int(max(0,t0)*SR);j=min(N,i+len(sig))
    if i<N:out[i:j]+=sig[:j-i]*g
S={k:load(f'{SFX}/user-{k}.wav') for k in['ting','whoosh','cash-register','notif','pop','money','wrong','horn','yeah','timer','shock','money-transfer','boom','notif2','slap','wow']}
put(S['ting'],0.0,.45);put(S['notif'],0.05,.5)                         # ting at 0 s + phone notification on frame 1
put(S['cash-register'],W('$120,000')-.05,.5)
for c in [1.3,2.75,L(2)]: put(S['whoosh'],c-.12,.32)                     # whoosh on every camera move
r=S['whoosh'][::-1].copy();put(r,L(2)-.35,.3)                             # reverse whoosh = flashback
put(S['ting'],W('$1,100')+.05,.4)
# ---- lines 3-24 (story): whoosh on every shot change + one SFX per action ----
for c in [6.83,7.62,8.75,9.98,11.55,12.77,13.62,14.73,15.95,17.23,17.95,18.5,19.4,20.55,21.91,23.25,25.11,26.5,28.58,30.3,32.01,32.85,33.9,36.05,37.62,38.55,39.69,42.05,42.95,43.95,45.2,46.46,49.23,52.17,54.95,58.52]:
    put(S['whoosh'],c-.12,.3)
put(S['pop'],W('mistake')-.12,.45);put(S['wrong'],W('business')-.25,.35)          # DEPOSIT click, MEANT FOR tag
put(S['pop'],11.65,.45);put(S['wrong'],W("didn't"),.4)                           # red ?, Call bank crossed out
put(S['cash-register'],W('$15,000',1)-.05,.5);put(S['money'],16.2,.45);put(S['horn'],16.45,.22)
for w in ['four-wheelers','camper','race']: put(S['pop'],W(w)-.03,.45)
put(S['wow'],W('car')+.1,.3)
put(S['cash-register'],W('$15,000',2)-.05,.5);put(S['money'],20.1,.5);put(S['yeah'],20.5,.25)
put(S['timer'],L(9)+.05,.35);put(S['ting'],W('$100,000')-.03,.45)
put(S['shock'],W('noticed'),.4);put(S['money-transfer'],L(11)+.1,.45);put(S['boom'],W('$107,000')-.05,.55)
for k in range(3): put(S['notif2'],L(13)-.1+k*.45,.4)
put(S['pop'],W('picked'),.4)
for k in range(4): put(S['notif'],L(15)+k*.35,.38)
put(S['boom'],W('police',1)-.05,.4)
for k in range(3): put(S['slap'],42.47+k*.314,.45)                              # knocks
put(S['slap'],W('theft')-.08,.55);put(S['money'],L(21)+.1,.45);put(S['slap'],W('not')-.05,.5)
put(S['ting'],W('2019')-.05,.45)
for c in [L(24)+.25,L(24)+.55,W('gone',2)-.1]: put(S['pop'],c,.4)
# fill every voice gap > 0.1 s with a soft texture so nothing is ever silent
for a,b in zip(WD,WD[1:]):
    g=b['s']-a['e'] if 'e' in a else 0
    if b['s']-a['s']>.6: put(noise(.25,8)*np.hanning(int(.25*SR)).astype(np.float32),a['s']+.3,.025)
out=np.clip(out,-1,1)
with wave.open('/tmp/mix_ep3_raw.wav','wb') as o:o.setnchannels(1);o.setsampwidth(2);o.setframerate(SR);o.writeframes((out*32767).astype(np.int16).tobytes())
subprocess.run(['ffmpeg','-v','error','-y','-i','/tmp/mix_ep3_raw.wav','-af','alimiter=level_in=2.4:limit=0.89:attack=2:release=60:level=false','-ar','48000','-ac','2',f'{RK}/mix_ep3.wav'],check=True)   # limiter -> -10.9 LUFS (loudnorm alone stayed at -13.7)
print('ok',DUR)
