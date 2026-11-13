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

# ---------- story SFX (few, on the words / big moves) ----------
S.update({k:load(f'{SFX}/user-{k}.wav') for k in['slap','yeah','wow','notif','money']})
def noise(d,fc_hi,fc_lo=0,env=None):
    k=int(d*SR);x=rng.standard_normal(k).astype(np.float32);x=lp(x,fc_hi)
    if fc_lo:x=x-lp(x,fc_lo)
    x/=np.abs(x).max()+1e-6;e=np.ones(k,np.float32) if env is None else env(np.linspace(0,1,k)).astype(np.float32);return x*e
def digs(t0,t1):
    k=t0
    while k<t1:put(scrape(),k,.09);k+=2*np.pi/6.5/2
digs(T('so you dig sideways'),T('runs right back')+.4);digs(T('so you make'),T('so you make')+1.15);digs(T('so you dip'),T('so you dip')+1.3);digs(T('dig a fake')-.4,T('dig a fake')+1.6);digs(T('so you dig one'),T('so you dig one')+1.6)
for ph in['this is your tunnel','this is your water','this is your maze','this is your camouflage']:put(cut(S['ting'],.3,.1),T(ph)+.35,.07)
put(cut(S['whoosh'],.5),T('swat finds')-.15,.18)
put(cut(S['slap'],.18),T('drops a flashbang')+.85,.12)                                    # can hits the hole floor
put(cut(S['boom'],.7,.25),T('flash hits'),.32)
put(noise(2.6,3000,400,lambda u:np.minimum(1,u*6)*(1-u)**.6),T('pump tear gas')+.2,.06)        # gas hiss
put(noise(.7,1500,0,lambda u:np.exp(-u*5)),T('so you dip')+1.3,.12)                        # water splash
put(cut(S['whoosh'],.5),T('crawl in with')-.2,.16);put(cut(S['wow'],.6),T('scratching'),.10)
# drone buzz
d=T('this is your camouflage')-T('fly a drone')+.6;k=int(d*SR);tt=np.arange(k)/SR;bz=(np.sign(np.sin(2*np.pi*(190+6*np.sin(tt*3))*tt))*.5+np.sin(2*np.pi*380*tt)*.3).astype(np.float32)
bz=lp(bz,1800)*np.minimum(1,np.minimum(tt/.4,(d-tt)/.4)).astype(np.float32);put(bz,T('fly a drone')-.2,.05)
put(cut(S['whoosh'],.6),T('their dogs')-.3,.2)
for j in range(6):put(noise(.12,4000,800,lambda u:np.sin(u*np.pi)),T('sniff')+.15+j*.22,.07)   # sniffs
put(cut(S['whoosh'],.6),T('but sooner')-.2,.2);put(cut(S['whoosh'],.5),T('so you dig one')-.1,.16)
put(cut(S['boom'],.6,.2),T('and that entrance')+.2,.2);put(cut(S['whoosh'],.5),T('they search')-.2,.16)
put(noise(.9,1500,0,lambda u:np.exp(-u*4)),T('nobody searches')+.6,.1)                    # dive splash
for ph in['add a hammock','a lantern']:put(cut(S['pop'],.3),T(ph)+.3,.13)
put(cut(S['pop'],.3),T('raccoon'),.12);put(cut(S['slap'],.18),T('stealing your')+.2,.1)
put(cut(S['yeah'],.7),T('congratulations')+.1,.14);put(cut(S['ting'],.3,.1),T('you built')+.3,.07)
put(cut(S['pop'],.3),T('comment yes'),.13);put(cut(S['pop'],.3),T('comment yes')+.3,.13)
out/=max(1,np.abs(out).max()/.97)
w=wave.open(f'{RK}/mix_ep21.wav','wb');w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes((out*32767).astype(np.int16).tobytes());w.close();print('mix ok',DUR)
