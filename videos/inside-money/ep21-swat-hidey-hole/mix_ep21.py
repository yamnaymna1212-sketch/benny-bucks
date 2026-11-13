"""EP21 mix: one-take voice + forest air bed + few SFX (hook: ting 0, soft shovel scrapes while digging, whoosh on SWAT, rain from 'rainstorm').
Usage (from videos/inside-money): python3 ep21-swat-hidey-hole/mix_ep21.py"""
import json,re,subprocess,wave,os,numpy as np,tempfile
SR=48000;RK='render-kit';SFX=os.path.join(os.path.dirname(os.path.abspath(__file__)),'../../../studio/public/sfx');TMP=tempfile.gettempdir()
def load(p):
    subprocess.run(['ffmpeg','-v','error','-y','-i',p,'-ac','1','-ar',str(SR),f'{TMP}/_l21.wav'],check=True)
    w=wave.open(f'{TMP}/_l21.wav');return np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)/32768
tl=json.load(open(f'{RK}/timeline_ep21.json'));WD=tl['words'];DUR=tl['dur']
n=lambda x:re.sub(r'[^a-z0-9]','',x.lower())
def T(ph,occ=0):
    p=[n(x) for x in ph.split()];c=0
    for i in range(len(WD)-len(p)+1):
        if all(n(WD[i+j]['w'])==w for j,w in enumerate(p)):
            if c==occ:return WD[i]['s']
            c+=1
    raise SystemExit('phrase not found: '+ph)
voice=load('ep21-swat-hidey-hole/vo_full.wav')
N=int(DUR*SR);out=np.zeros(N,np.float32);out[:min(N,len(voice))]+=voice[:N]
rng=np.random.default_rng(21)
def lp(x,fc):
    a=np.exp(-2*np.pi*fc/SR);y=np.empty_like(x);acc=0.0
    for i in range(len(x)):acc=a*acc+(1-a)*x[i];y[i]=acc
    return y
air=lp(rng.standard_normal(N).astype(np.float32),900);air/=np.abs(air).max();out+=air*.025
def put(sig,t,g):
    i=int(max(0,t)*SR);j=min(N,i+len(sig))
    if i<N:out[i:j]+=sig[:j-i]*g
def cut(sig,dur,fade=.12):
    k=int(dur*SR);x=sig[:k].copy();f=int(min(fade,dur/2)*SR);x[-f:]*=np.linspace(1,0,f);return x
S={k:load(f'{SFX}/user-{k}.wav') for k in['ting','whoosh','pop','boom']}
# shovel scrape: short band-limited noise burst with a thud
def scrape():
    d=int(.22*SR);x=rng.standard_normal(d).astype(np.float32);x=x-lp(x,1800);env=np.exp(-np.linspace(0,5,d));thud=np.sin(2*np.pi*90*np.arange(d)/SR)*np.exp(-np.linspace(0,14,d))
    return (x*env*.5+thud).astype(np.float32)
put(cut(S['ting'],.25,.12),0,.05)
tSw=T('swat team')
for k in range(int(tSw/ (2*np.pi/5.2))+1):put(scrape(),k*(2*np.pi/5.2)+.35,.10)
put(cut(S['whoosh'],.6),tSw-.25,.22)
# rain: filtered noise, fades in on 'rainstorm', ducked under the voice
tR=T('rainstorm');d=N-int(tR*SR);r=rng.standard_normal(d).astype(np.float32);r=r-lp(r,2500);r/=np.abs(r).max()
r*=np.minimum(1,np.arange(d)/(.4*SR));put(r,tR-.1,.05)
out/=max(1,np.abs(out).max()/.97)
w=wave.open(f'{RK}/mix_ep21.wav','wb');w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes((out*32767).astype(np.int16).tobytes());w.close();print('mix ok',DUR)
