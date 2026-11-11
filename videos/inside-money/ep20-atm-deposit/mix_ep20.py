"""EP20 mix: one-take voice (vo_full.wav) + air bed + few SFX synced to words -> render-kit/mix_ep20.wav (~-11.5 LUFS).
Usage (from videos/inside-money): python3 ep20-atm-deposit/mix_ep20.py   (SFX: studio/public/sfx, user library)"""
import json,re,subprocess,wave,os,numpy as np,tempfile
SR=48000;RK='render-kit';SFX=os.path.join(os.path.dirname(os.path.abspath(__file__)),'../../../studio/public/sfx')
if not os.path.isdir(SFX):SFX=os.path.expanduser('~/benny-bucks/studio/public/sfx');TMP=tempfile.gettempdir()
def load(p):
    subprocess.run(['ffmpeg','-v','error','-y','-i',p,'-ac','1','-ar',str(SR),f'{TMP}/_l20.wav'],check=True)
    w=wave.open(f'{TMP}/_l20.wav');return np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)/32768
tl=json.load(open(f'{RK}/timeline_ep20full.json'));WD=tl['words'];DUR=tl['dur']
n=lambda x:re.sub(r'[^a-z0-9]','',x.lower())
def T(ph,occ=0):
    p=[n(x) for x in ph.split()];c=0
    for i in range(len(WD)-len(p)+1):
        if all(n(WD[i+j]['w'])==w for j,w in enumerate(p)):
            if c==occ:return WD[i]['s']
            c+=1
    raise SystemExit('phrase not found: '+ph)
voice=load('ep20-atm-deposit/vo_full.wav')
# first word "You" clearer + louder (user rule): presence lift + soft clip, crossfade into the rest
e=int(T('if')*SR);seg=voice[:e].copy();lo=np.convolve(seg,np.ones(12)/12,'same');seg=seg+.9*(seg-lo)
seg=np.tanh(seg*2.3)/np.tanh(2.3)*.98;f=int(.03*SR);seg[-f:]=seg[-f:]*np.linspace(1,0,f)+voice[e-f:e]*np.linspace(0,1,f);voice[:e]=seg
N=int(DUR*SR);out=np.zeros(N,np.float32);out[:min(N,len(voice))]+=voice[:N]
rng=np.random.default_rng(20);b=np.cumsum(rng.standard_normal(N).astype(np.float32));b-=np.convolve(b,np.ones(4800)/4800,'same');b/=np.abs(b).max();b[:int(T('if')*SR)]*=.3;out+=b*.035
def put(sig,t,g):
    i=int(max(0,t)*SR);j=min(N,i+len(sig))
    if i<N:out[i:j]+=sig[:j-i]*g
def cut(sig,dur,fade=.12):
    k=int(dur*SR);x=sig[:k].copy();f=int(min(fade,dur/2)*SR);x[-f:]*=np.linspace(1,0,f);return x
S={k:load(f'{SFX}/user-{k}.wav') for k in['ting','whoosh','cash-register','slap','money','boom','pop','shock','wrong','timer','notif','notif2','yeah','fahh','wow','money-transfer']}
# ---- hook: few cues (ting at 0, cash as the bills feed in, whoosh as he is sucked in, whoosh on the dive/flash, whoosh as the raft speeds up) ----
put(cut(S['ting'],.25,.12),0,.05)
put(cut(S['cash-register'],.8),T('thousand dollars')+.05,.26)
put(cut(S['whoosh'],.7),T('inside the'),.24)
put(cut(S['whoosh'],.6),T('atm')+.18,.2)
put(cut(S['whoosh'],.6),T('sucks him')-.05,.2)
# ---- story cues (on the words): whoosh on every place change, one hit per beat ----
W=lambda ph,o=0:T(ph,o)
put(cut(S['cash-register'],.6),W('about a second')+.1,.22)                                   # count done
put(cut(S['whoosh'],.5),W('then scanners')+.1,.18)                                           # drop to track 2
for ph in['ink','size','hidden marks']:put(cut(S['pop'],.3),W(ph)+.25,.16)                  # checks turn green
put(cut(S['wrong'],.45),W('no fakes'),.2)
put(cut(S['ting'],.35),W('clean'),.2)
put(cut(S['wrong'],.45),W('rejected'),.22)
put(cut(S['whoosh'],.5),W('the rest')+.3,.18)
put(cut(S['slap'],.3),W('locked steel')+.38,.3);put(cut(S['boom'],.4,.2),W('locked steel')+.38,.14)   # shutter slams
put(cut(S['boom'],.4,.2),W('bad news'),.16)
put(cut(S['timer'],.5),W('after the')+.3,.14)
for k in range(3):put(cut(S['pop'],.25),W('so the bank')+.3+.35*k,.12)                       # calendar flips
put(cut(S['slap'],.25),W('his rent')+.3,.24)
put(cut(S['whoosh'],.5),W('heres the twist')-.15,.16)
put(cut(S['notif'],.5),W('his app'),.2)
put(cut(S['slap'],.3),W('locked',1),.3)
put(cut(S['whoosh'],.6),W('your own')-.05,.2)
put(cut(S['ting'],.35),W('two business'),.16);put(cut(S['ting'],.35),W('five'),.16)
put(cut(S['whoosh'],.6),W('armored truck')-.1,.18)
for k in range(3):put(cut(S['pop'],.2),W('armored truck')+.6+.4*k,.08)                     # camera flashes
put(cut(S['whoosh'],.6),W('a vault')-.05,.2)
put(cut(S['money'],.6),W('federal reserve'),.16)
put(cut(S['wow'],.6),W('confetti'),.18)
put(cut(S['yeah'],.6),W('mike throws'),.2)
put(cut(S['whoosh'],.6),W('wednesday')-.12,.2)
put(cut(S['ting'],.4),W('hold lifts')+.1,.22);put(cut(S['cash-register'],.6),W('ready to spend'),.2)
put(cut(S['pop'],.35),W('mike pops'),.24)
put(cut(S['ting'],.3),W('before the cutoff')+.5,.16);put(cut(S['ting'],.3),W('and use your')+.6,.16)
put(cut(S['notif2'],.4),W('keep the receipt'),.16);put(cut(S['ting'],.3),W('your proof'),.18)
put(cut(S['pop'],.35),W('deposit cash'),.2);put(cut(S['pop'],.35),W('your phone'),.2)
x=out/np.abs(out).max()*.9
subprocess.run(['ffmpeg','-v','error','-y','-f','f32le','-ar',str(SR),'-ac','1','-i','-','-af','loudnorm=I=-11.5:TP=-1.0:LRA=9,volume=2.2dB,alimiter=limit=0.89:level=false','-ar',str(SR),f'{RK}/mix_ep20.wav'],input=x.astype(np.float32).tobytes(),check=True)
print('mix ->',f'{RK}/mix_ep20.wav',round(DUR,2),'s')
