"""EP2 mix: voice + air bed + SFX synced to words/animation -> render-kit/mix_ep2.wav (-14 LUFS).
Usage (from videos/inside-money): ~/kokoro-tts/venv/bin/python ep2-dig-200m/mix_ep2.py"""
import json,subprocess,wave,numpy as np,os
SR=48000;RK='render-kit';SFX='/Users/User/benny-bucks/studio/public/sfx'
def load(p):
    subprocess.run(['ffmpeg','-v','error','-y','-i',p,'-ac','1','-ar',str(SR),'/tmp/_l.wav'],check=True)
    w=wave.open('/tmp/_l.wav');return np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)/32768
tl=json.load(open(f'{RK}/timeline_ep2.json'));WD=tl['words'];DUR=tl['dur'];LN=tl['lines']
def W(w,n=1):
    c=0
    for x in WD:
        if x['w'].lower().strip('.,?!')==w.lower():
            c+=1
            if c==n:return x['s']
    raise KeyError(w)
voice=load(f'{RK}/vo_ep2.wav');N=int(DUR*SR);out=np.zeros(N,np.float32);out[:min(N,len(voice))]+=voice[:N]
rng=np.random.default_rng(3)
b=np.cumsum(rng.standard_normal(N).astype(np.float32));b-=np.convolve(b,np.ones(4800)/4800,'same');b/=np.abs(b).max();out+=b*.08   # air bed
def put(sig,t,g):
    i=int(max(0,t)*SR);j=min(N,i+len(sig))
    if i<N:out[i:j]+=sig[:j-i]*g
def sub(d=.7):
    t=np.arange(int(d*SR))/SR;return (np.sin(2*np.pi*(55-25*t)*t)*np.exp(-t*4)).astype(np.float32)
def clink():   # pickaxe on rock: short metallic ping + thud
    t=np.arange(int(.3*SR))/SR;y=sum(np.sin(2*np.pi*f*t)*np.exp(-t*k) for f,k in[(2300,28),(3900,35),(5200,45)])*.6+np.sin(2*np.pi*90*t)*np.exp(-t*25);return (y/np.abs(y).max()).astype(np.float32)
S={k:load(f'{SFX}/user-{k}.wav') for k in['ting','whoosh','cash-register','boom','money']}
T0,CYC=.35,1.25
for i in range(40):
    th=T0+i*CYC+.66*CYC
    if th<12 or 28<th<31: put(clink(),th,.16)          # digging sound only where the digger is in close-up
put(S['cash-register'],W('$800')-.05,.45)               # cash on the price
put(S['ting'],W('200')+.05,.5)                          # ding on the key number
put(S['whoosh'],1.6,.35)                                # camera dive (hook)
put(S['boom'],W("isn't"),.5);put(sub(),W("isn't"),.5)   # shock: "isn't gold"
put(S['whoosh'],LN[2]['start']-.3,.3)                   # pull-out to the vault
put(S['money'],W('gold',3)-.05 if True else 0,.3)
put(S['whoosh'],LN[8]['start']-.2,.3)
r=LN[13]['start']                                       # reveal: riser before, boom on the tunnel
n=int(1.6*SR);x=rng.standard_normal(n).astype(np.float32);x=np.convolve(x,np.ones(30)/30,'same');put(x/np.abs(x).max()*np.linspace(0,1,n)**2.5,r-1.6,.35)
put(S['boom'],r,.6);put(sub(),r,.6)
put(S['ting'],W('350')+.05,.45)
out=np.clip(out,-1,1)
with wave.open('/tmp/mix_ep2_raw.wav','wb') as o:o.setnchannels(1);o.setsampwidth(2);o.setframerate(SR);o.writeframes((out*32767).astype(np.int16).tobytes())
subprocess.run(['ffmpeg','-v','error','-y','-i','/tmp/mix_ep2_raw.wav','-af','loudnorm=I=-14:TP=-1.5:LRA=11','-ar','48000','-ac','2',f'{RK}/mix_ep2.wav'],check=True);print('ok',DUR)
