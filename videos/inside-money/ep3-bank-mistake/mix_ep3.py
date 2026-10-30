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
S={k:load(f'{SFX}/user-{k}.wav') for k in['ting','whoosh','cash-register','notif','pop','money']}
put(S['ting'],0.0,.45);put(S['notif'],0.05,.5)                         # ting at 0 s + phone notification on frame 1
put(S['cash-register'],W('$120,000')-.05,.5)
for c in [1.3,2.75,L(2)]: put(S['whoosh'],c-.12,.32)                     # whoosh on every camera move
r=S['whoosh'][::-1].copy();put(r,L(2)-.35,.3)                             # reverse whoosh = flashback
put(S['ting'],W('$1,100')+.05,.4)
# fill every voice gap > 0.1 s with a soft texture so nothing is ever silent
for a,b in zip(WD,WD[1:]):
    g=b['s']-a['e'] if 'e' in a else 0
    if b['s']-a['s']>.6: put(noise(.25,8)*np.hanning(int(.25*SR)).astype(np.float32),a['s']+.3,.025)
out=np.clip(out,-1,1)
with wave.open('/tmp/mix_ep3_raw.wav','wb') as o:o.setnchannels(1);o.setsampwidth(2);o.setframerate(SR);o.writeframes((out*32767).astype(np.int16).tobytes())
subprocess.run(['ffmpeg','-v','error','-y','-i','/tmp/mix_ep3_raw.wav','-af','loudnorm=I=-11:TP=-1:LRA=6','-ar','48000','-ac','2',f'{RK}/mix_ep3.wav'],check=True);print('ok',DUR)
