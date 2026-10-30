"""EP2 v2 mix: voice + air bed + SFX synced to words/cuts -> render-kit/mix_ep2v2.wav (-14 LUFS).
Run from videos/inside-money: ~/kokoro-tts/venv/bin/python ep2-dig-200m/v2/mix_ep2v2.py"""
import json,subprocess,wave,numpy as np
SR=48000;RK='render-kit';SFX='/Users/User/benny-bucks/studio/public/sfx'
def load(p):
    subprocess.run(['ffmpeg','-v','error','-y','-i',p,'-ac','1','-ar',str(SR),'/tmp/_l.wav'],check=True)
    w=wave.open('/tmp/_l.wav');return np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)/32768
tl=json.load(open(f'{RK}/timeline_ep2v2.json'));WD=tl['words'];DUR=tl['dur']
def W(w,n=1):
    c=0
    for x in WD:
        if x['w'].lower()==w.lower():
            c+=1
            if c==n:return x['s']
    raise KeyError(w)
voice=load(f'{RK}/vo_ep2v2.wav');N=int(DUR*SR);out=np.zeros(N,np.float32);out[:min(N,len(voice))]+=voice[:N]
rng=np.random.default_rng(3)
b=np.cumsum(rng.standard_normal(N).astype(np.float32));b-=np.convolve(b,np.ones(4800)/4800,'same');b/=np.abs(b).max();out+=b*.08
def put(sig,t,g):
    i=int(max(0,t)*SR);j=min(N,i+len(sig))
    if i<N:out[i:j]+=sig[:j-i]*g
def clink():
    t=np.arange(int(.3*SR))/SR;y=sum(np.sin(2*np.pi*f*t)*np.exp(-t*k) for f,k in[(2300,28),(3900,35),(5200,45)])*.6+np.sin(2*np.pi*90*t)*np.exp(-t*25);return (y/np.abs(y).max()).astype(np.float32)
S={k:load(f'{SFX}/user-{k}.wav') for k in['ting','whoosh','cash-register','boom','money']}
T0,CYC=.35,1.25
for i in range(60):
    th=T0+i*CYC+.66*CYC
    if 1.4<th<2.8 or 4.37<th<7.3: put(clink(),th,.18)          # pickaxe hits, only where the digger is in close-up
put(S['ting'],0.0,.5)                                          # ting at 0 s of the hook
put(S['cash-register'],W('$800')-.05,.45)
for c in [1.4,2.8,4.37,6.3]: put(S['whoosh'],c-.12,.3)         # whoosh into the first cuts
out=np.clip(out,-1,1)
with wave.open('/tmp/mix_ep2v2_raw.wav','wb') as o:o.setnchannels(1);o.setsampwidth(2);o.setframerate(SR);o.writeframes((out*32767).astype(np.int16).tobytes())
subprocess.run(['ffmpeg','-v','error','-y','-i','/tmp/mix_ep2v2_raw.wav','-af','loudnorm=I=-14:TP=-1.5:LRA=11','-ar','48000','-ac','2',f'{RK}/mix_ep2v2.wav'],check=True);print('ok',DUR)
