"""EP20 mix: one-take voice + air bed + few SFX on the words (hook: ting 0, cash on the amount, sirens + whoosh on the raid, boom on 'tax evasion').
Usage (from videos/inside-money): python3 ep20-hidden-cash-irs/mix_ep20.py"""
import json,re,subprocess,wave,os,numpy as np,tempfile
SR=48000;RK='render-kit';SFX=os.path.join(os.path.dirname(os.path.abspath(__file__)),'../../../studio/public/sfx');TMP=tempfile.gettempdir()
def load(p):
    subprocess.run(['ffmpeg','-v','error','-y','-i',p,'-ac','1','-ar',str(SR),f'{TMP}/_l20.wav'],check=True)
    w=wave.open(f'{TMP}/_l20.wav');return np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)/32768
tl=json.load(open(f'{RK}/timeline_ep20.json'));WD=tl['words'];DUR=tl['dur']
n=lambda x:re.sub(r'[^a-z0-9]','',x.lower())
def T(ph,occ=0):
    p=[n(x) for x in ph.split()];c=0
    for i in range(len(WD)-len(p)+1):
        if all(n(WD[i+j]['w'])==w for j,w in enumerate(p)):
            if c==occ:return WD[i]['s']
            c+=1
    raise SystemExit('phrase not found: '+ph)
voice=load('ep20-hidden-cash-irs/vo_full.wav')
N=int(DUR*SR);out=np.zeros(N,np.float32);out[:min(N,len(voice))]+=voice[:N]
rng=np.random.default_rng(20);b=np.cumsum(rng.standard_normal(N).astype(np.float32));b-=np.convolve(b,np.ones(4800)/4800,'same');b/=np.abs(b).max();out+=b*.03
def put(sig,t,g):
    i=int(max(0,t)*SR);j=min(N,i+len(sig))
    if i<N:out[i:j]+=sig[:j-i]*g
def cut(sig,dur,fade=.12):
    k=int(dur*SR);x=sig[:k].copy();f=int(min(fade,dur/2)*SR);x[-f:]*=np.linspace(1,0,f);return x
S={k:load(f'{SFX}/user-{k}.wav') for k in['ting','whoosh','cash-register','boom','money','slap','notif','wrong','pop','yeah','money-transfer']}
# --- realistic US siren (none in the user library): electronic 'wail' (square wave, low-passed) 650->1450 Hz, then fast 'yelp' when they stop;
#     two cars detuned, volume grows as they approach (doppler-ish pitch drop on arrival), ducked under the voice
def lp(x,fc):
    a=np.exp(-2*np.pi*fc/SR);y=np.empty_like(x);acc=0.0
    y=np.empty_like(x);acc=0.0;b=1-a
    for i,v in enumerate(x.tolist()):acc=b*v+a*acc;y[i]=acc
    return y
def siren(d,yelp_at,arrive):
    tt=np.arange(int(d*SR))/SR;x=np.zeros_like(tt)
    for k,(det,off) in enumerate([(1.0,0.0),(1.045,.55)]):
        w=650+800*(.5-.5*np.cos(2*np.pi*(tt+off)/2.6));y=650+800*(.5-.5*np.cos(2*np.pi*(tt+off)*3.4));f=np.where(tt<yelp_at,w,y)*det
        f*=1-.05*np.clip((tt-arrive)/.3,0,1)                      # small doppler drop as they pull up
        ph=2*np.pi*np.cumsum(f)/SR;x+=np.sign(np.sin(ph))*.5+.25*np.sin(ph)
    x=lp(lp(x.astype(np.float32),2600),3400)
    env=np.clip(.25+.75*tt/max(arrive,.1),0,1)*np.minimum(1,(d-tt)/.35)
    return (x*env/np.abs(x).max()).astype(np.float32)
def screech(d=.55):
    tt=np.arange(int(d*SR))/SR;nz=rng.standard_normal(len(tt)).astype(np.float32)
    bp=lp(nz,3600)-lp(nz,1500);tone=np.sin(2*np.pi*np.cumsum(1900+180*np.sin(2*np.pi*23*tt))/SR)
    x=bp/np.abs(bp).max()*.7+tone*.35;return (x*np.minimum(1,tt/.03)*np.exp(-tt*2.2)*np.minimum(1,(d-tt)/.08)).astype(np.float32)
# voice envelope for ducking
venv=np.convolve(np.abs(out),np.ones(2400)/2400,'same');duck=1-.45*np.clip(venv/ (venv.max()*.25),0,1)
put(cut(S['ting'],.25,.12),0,.05)
put(cut(S['money'],.7),T('one hundred thousand')+.05,.3)
tS=T('irs')-.4;tE=T('but cash')+.5;tArr=T('sees')-.1
sr_=siren(tE-tS,T('you just built')-tS,tArr-tS);i=int(tS*SR);out[i:i+len(sr_)]+=sr_[:N-i]*.16*duck[i:i+len(sr_)][:N-i]
for k in range(2):put(screech(),tArr+k*.1,.13)
put(cut(S['whoosh'],.7),T('sees')-.15,.22)
put(cut(S['slap'],.2),tArr+.35,.14)                               # car doors
put(cut(S['boom'],.6,.2),T('tax evasion'),.34)

# ---- story cues (few, on the words): whoosh on every place change, one hit per beat ----
for ph in['buy a car','deposit it','even your neighbor','get caught']:put(cut(S['whoosh'],.6),T(ph)-.2,.2)
put(cut(S['money'],.6),T('ten thousand'),.22);put(cut(S['slap'],.2),T('the dealer')+.1,.16);put(cut(S['whoosh'],.5),T('report it'),.14)
put(cut(S['slap'],.2),T('the bank')+.05,.14);put(cut(S['whoosh'],.5),T('report it too'),.14)
put(cut(S['notif'],.5),T('without giving')+.6,.2)
put(cut(S['cash-register'],.6),T('all back'),.18);put(cut(S['wrong'],.5),T('seventy five'),.2);put(cut(S['boom'],.6,.2),T('prison'),.3)
w=cut(S['whoosh'],.9)[::-1].copy();put(np.interp(np.arange(0,len(w),1.6),np.arange(len(w)),w).astype(np.float32),T('rewind')-.25,.26)   # tape rewind
put(cut(S['money-transfer'],.6),T('twenty four thousand'),.2)
for ph in['going in','while it grows','medical bills']:put(cut(S['ting'],.25,.1),T(ph)+.05,.06)
put(cut(S['pop'],.3),T('in a roth')+.3,.14);put(cut(S['ting'],.25,.1),T('never taxed'),.07)
put(cut(S['pop'],.3),T('fourteen days'),.14);put(cut(S['money'],.5),T('that rent'),.18)
put(cut(S['yeah'],.6),T('nineteen thousand')+.4,.16)
put(cut(S['whoosh'],.5),T('and watch')-.1,.16);put(cut(S['pop'],.3),T('twist'),.16)
put(cut(S['money-transfer'],.6),T('two hundred fifty'),.2)
put(cut(S['boom'],.6,.2),T('five years',2),.3);put(cut(S['ting'],.3,.1),T('prison sentence'),.08)
put(cut(S['wrong'],.5),T('one is a crime')+.1,.18);put(cut(S['ting'],.3,.1),T('reading the rules'),.08)
for ph,o in[('under the floor',0),('four oh one k',1),('a roth',1),('an hsa',1)]:put(cut(S['pop'],.25),T(ph,o),.12)
out/=max(1,np.abs(out).max()/.97)
w=wave.open(f'{RK}/mix_ep20.wav','wb');w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes((out*32767).astype(np.int16).tobytes());w.close();print('mix ok',DUR)
