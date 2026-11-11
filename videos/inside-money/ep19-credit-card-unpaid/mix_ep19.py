"""EP19 mix: one-take voice (vo_full.wav) + air bed + few SFX synced to words -> render-kit/mix_ep18full.wav (~-11.5 LUFS).
Usage (from videos/inside-money): python3 ep19-credit-card-unpaid/mix_ep18full.py   (SFX: studio/public/sfx, user library)"""
import json,re,subprocess,wave,os,numpy as np,tempfile
SR=48000;RK='render-kit';SFX=os.path.join(os.path.dirname(os.path.abspath(__file__)),'../../../studio/public/sfx');TMP=tempfile.gettempdir()
def load(p):
    subprocess.run(['ffmpeg','-v','error','-y','-i',p,'-ac','1','-ar',str(SR),f'{TMP}/_l19.wav'],check=True)
    w=wave.open(f'{TMP}/_l19.wav');return np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)/32768
tl=json.load(open(f'{RK}/timeline_ep19full.json'));WD=tl['words'];DUR=tl['dur']
n=lambda x:re.sub(r'[^a-z0-9]','',x.lower())
def T(ph,occ=0):
    p=[n(x) for x in ph.split()];c=0
    for i in range(len(WD)-len(p)+1):
        if all(n(WD[i+j]['w'])==w for j,w in enumerate(p)):
            if c==occ:return WD[i]['s']
            c+=1
    raise SystemExit('phrase not found: '+ph)
voice=load('ep19-credit-card-unpaid/vo_full.wav')
# first word "You" clearer + louder (user rule): presence lift + soft clip, crossfade into the rest
e=int(T('if')*SR);seg=voice[:e].copy();lo=np.convolve(seg,np.ones(12)/12,'same');seg=seg+.9*(seg-lo)
seg=np.tanh(seg*2.3)/np.tanh(2.3)*.98;f=int(.03*SR);seg[-f:]=seg[-f:]*np.linspace(1,0,f)+voice[e-f:e]*np.linspace(0,1,f);voice[:e]=seg
N=int(DUR*SR);out=np.zeros(N,np.float32);out[:min(N,len(voice))]+=voice[:N]
rng=np.random.default_rng(19);b=np.cumsum(rng.standard_normal(N).astype(np.float32));b-=np.convolve(b,np.ones(4800)/4800,'same');b/=np.abs(b).max();b[:int(T('if')*SR)]*=.3;out+=b*.035
def put(sig,t,g):
    i=int(max(0,t)*SR);j=min(N,i+len(sig))
    if i<N:out[i:j]+=sig[:j-i]*g
def cut(sig,dur,fade=.12):
    k=int(dur*SR);x=sig[:k].copy();f=int(min(fade,dur/2)*SR);x[-f:]*=np.linspace(1,0,f);return x
S={k:load(f'{SFX}/user-{k}.wav') for k in['ting','whoosh','cash-register','slap','money','boom','pop','shock','wrong','timer','notif','notif2','yeah','fahh','wow','money-transfer']}
# ---- hook: few cues (ting at 0, UNPAID stamp, one cash on the amount, the bin lid slap) ----
put(cut(S['ting'],.25,.12),0,.05)
put(cut(S['wrong'],.45),T('stopped')+.05,.2)                    # red X: he stops paying
# synthetic police siren (no siren in the user library): two-tone wail, fades in as the cars arrive
def siren(d):
    tt=np.arange(int(d*SR))/SR;f=900+350*np.sin(2*np.pi*1.6*tt);ph=2*np.pi*np.cumsum(f)/SR;x=.6*np.sin(ph)+.25*np.sin(2*ph);return x*np.minimum(1,tt/.4)*np.minimum(1,(d-tt)/.15)
put(cut(S['cash-register'],.8),T('thousand'),.28)
tLand=T('he throws')+1.04;put(cut(S['slap'],.25),tLand,.26)
put(cut(S['whoosh'],.7),tLand-.15,.22);put(siren(T('day one')+.1-(T('he throws')-.2)).astype(np.float32),T('he throws')-.2,.09)                          # camera pulls back for the raid (sirens below)
put(cut(S['boom'],.4,.2),T('day one')+.1,.22)                    # poof: it was only his fear
# ---- story cues (few, on the words): whoosh on every place change, one hit per beat ----
W=lambda ph,o=0:T(ph,o)
for w in[W('day thirty')-.35,W('day one hundred')-.33,W('if he gets')-.3,W('and that late')-.28]:put(cut(S['whoosh'],.7),w,.24)
put(cut(S['ting'],.3),W('genius'),.14);put(cut(S['pop'],.3),W('he orders')+.3,.18)
put(cut(S['ting'],.3),W('day two'),.12);put(cut(S['notif'],.35),W('a late fee'),.18);put(cut(S['cash-register'],.6),W('about thirty dollars')+.1,.24)
put(cut(S['ting'],.3),W('day thirty'),.12);put(cut(S['wrong'],.45),W('falls off')+.1,.24);put(cut(S['boom'],.5,.2),W('ouch'),.22)
put(cut(S['slap'],.3),W('thirty percent'),.3);put(cut(S['pop'],.35),W('his thousand'),.2);put(cut(S['money'],.6),W('every month')+.1,.16);put(cut(S['wow'],.6),W('gets bigger'),.14)
put(cut(S['ting'],.3),W('day sixty'),.12);put(cut(S['money-transfer'],.6),W('red letters'),.16)
for k in range(4):put(cut(S['notif2'] if 'notif2' in S else S['notif'],.25),W('calls')+k*.42,.16)
put(cut(S['ting'],.3),W('day one hundred'),.12);put(cut(S['slap'],.3),W('writes it off')+.05,.32)
put(cut(S['yeah'],.6),W('mike celebrates'),.2);put(cut(S['wrong'],.45),W('big mistake')-.05,.3);put(cut(S['fahh'],.8),W('big mistake')+.2,.2)
put(cut(S['pop'],.35),W('the debt didnt'),.2);put(cut(S['cash-register'],.5),W('wants the money'),.16)
put(cut(S['slap'],.3),W('judge'),.34);put(cut(S['boom'],.4,.2),W('judge')+.02,.16);put(cut(S['wrong'],.45),W('taken'),.22)
put(cut(S['ting'],.3),W('seven years'),.16);put(cut(S['wrong'],.4),W('landlords')+.25,.18);put(cut(S['wrong'],.4),W('car lenders')+.25,.18)
put(cut(S['boom'],.4,.2),W('jail')-.1,.2);put(cut(S['ting'],.4),W('jail')+.7,.2);put(cut(S['ting'],.4),W('with lower')+.4,.18)
put(cut(S['pop'],.35),W('call the bank'),.2);put(cut(S['pop'],.35),W('hide from'),.2)
x=out/np.abs(out).max()*.9
subprocess.run(['ffmpeg','-v','error','-y','-f','f32le','-ar',str(SR),'-ac','1','-i','-','-af','loudnorm=I=-11.5:TP=-1.0:LRA=9,volume=2.2dB,alimiter=limit=0.89:level=false','-ar',str(SR),f'{RK}/mix_ep19.wav'],input=x.astype(np.float32).tobytes(),check=True)
print('mix ->',f'{RK}/mix_ep19.wav',round(DUR,2),'s')
