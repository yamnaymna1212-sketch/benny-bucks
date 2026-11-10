"""EP18 FULL mix: one-take voice (vo_full.wav) + air bed + few SFX synced to words -> render-kit/mix_ep18full.wav (~-11.5 LUFS).
Usage (from videos/inside-money): python3 ep18-pool-million/mix_ep18full.py   (SFX: studio/public/sfx, user library)"""
import json,re,subprocess,wave,os,numpy as np,tempfile
SR=48000;RK='render-kit';SFX=os.path.join(os.path.dirname(os.path.abspath(__file__)),'../../../studio/public/sfx');TMP=tempfile.gettempdir()
def load(p):
    subprocess.run(['ffmpeg','-v','error','-y','-i',p,'-ac','1','-ar',str(SR),f'{TMP}/_l18f.wav'],check=True)
    w=wave.open(f'{TMP}/_l18f.wav');return np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)/32768
tl=json.load(open(f'{RK}/timeline_ep18full.json'));WD=tl['words'];DUR=tl['dur']
n=lambda x:re.sub(r'[^a-z0-9]','',x.lower())
def T(ph,occ=0):
    p=[n(x) for x in ph.split()];c=0
    for i in range(len(WD)-len(p)+1):
        if all(n(WD[i+j]['w'])==w for j,w in enumerate(p)):
            if c==occ:return WD[i]['s']
            c+=1
    raise SystemExit('phrase not found: '+ph)
voice=load('ep18-pool-million/vo_full.wav')
# first word "You" clearer + louder (user rule): presence lift + soft clip, crossfade into the rest
e=int(T('dug')*SR);seg=voice[:e].copy();lo=np.convolve(seg,np.ones(12)/12,'same');seg=seg+.9*(seg-lo)
seg=np.tanh(seg*2.3)/np.tanh(2.3)*.98;f=int(.03*SR);seg[-f:]=seg[-f:]*np.linspace(1,0,f)+voice[e-f:e]*np.linspace(0,1,f);voice[:e]=seg
N=int(DUR*SR);out=np.zeros(N,np.float32);out[:min(N,len(voice))]+=voice[:N]
rng=np.random.default_rng(18);b=np.cumsum(rng.standard_normal(N).astype(np.float32));b-=np.convolve(b,np.ones(4800)/4800,'same');b/=np.abs(b).max();b[:int(T('dug')*SR)]*=.3;out+=b*.035
def put(sig,t,g):
    i=int(max(0,t)*SR);j=min(N,i+len(sig))
    if i<N:out[i:j]+=sig[:j-i]*g
def cut(sig,dur,fade=.12):
    k=int(dur*SR);x=sig[:k].copy();f=int(min(fade,dur/2)*SR);x[-f:]*=np.linspace(1,0,f);return x
S={k:load(f'{SFX}/user-{k}.wav') for k in['ting','whoosh','cash-register','slap','money','boom','pop','shock','wrong','timer','notif']}
# ---- hook (same cues as the approved hook mix) ----
put(cut(S['ting'],.25,.12),0,.05)
tDig=T('filled')+.3;k=0
while (k+.88)/1.55<tDig:put(cut(S['slap'],.25),(k+.88)/1.55,.16);put(cut(S['boom'],.3,.15),(k+.9)/1.55,.08);k+=1
put(S['pop'],T('pool')+.02,.3);put(cut(S['money'],1.0),T('filled')+.25,.24);put(cut(S['cash-register'],.8),T('million')+.02,.3)
put(cut(S['whoosh'],.7),T('put')-.25,.25);put(S['boom'],T('armor')+.05,.42);put(cut(S['slap'],.3),T('armor')+.05,.32)
put(cut(S['timer'],.5),T('world'),.18);put(cut(S['ting'],.4),T('top')+.1,.2)
put(cut(S['whoosh'],.9),T('will')-.45,.32);put(cut(S['wrong'],.5),T('will')+.05,.2);put(cut(S['shock'],.6),T('irs')+.02,.24);put(cut(S['notif'],.4),T('find'),.22)
# ---- story: whoosh on every change of place, few hits ----
for w in[T('in real life')+1.4,T('so they open')-.2,T('two weeks')-.2,T('now youre')-.2,T('and the lid')-.25]:put(cut(S['whoosh'],.7),w,.26)
put(cut(S['pop'],.4),T('day two')+.3,.25)                       # truck lands
put(cut(S['ting'],.35),T('excavator'),.14);put(cut(S['money'],.6),T('cash'),.16);put(cut(S['ting'],.35),T('steel lid'),.14)
put(cut(S['notif'],.4),T('and the irs pays')+.2,.2)            # the tip call
put(cut(S['wrong'],.45),T('red flag'),.24)
put(cut(S['boom'],.5,.2),T('suvs'),.22);put(cut(S['wrong'],.5),T('police cars'),.16)
put(cut(S['timer'],.4),T('you type'),.16);put(cut(S['wrong'],.45),T('wrong'),.3);put(cut(S['timer'],.4),T('try again'),.14);put(cut(S['wrong'],.45),T('wrong',1),.3)
put(cut(S['slap'],.35),T('give us'),.4);put(S['boom'],T('prison'),.35);put(cut(S['ting'],.4),T('legal'),.18);put(cut(S['wrong'],.45),T('tax evasion'),.18)
put(cut(S['cash-register'],.7),T('seventyfive'),.22);put(cut(S['money'],.8),T('your million',1),.2)
put(cut(S['pop'],.35),T('the tax and sleep')+.1,.22);put(cut(S['pop'],.35),T('keep the pool')+.15,.22)
x=out/np.abs(out).max()*.9
subprocess.run(['ffmpeg','-v','error','-y','-f','f32le','-ar',str(SR),'-ac','1','-i','-','-af','loudnorm=I=-11.5:TP=-1.0:LRA=9,volume=2.2dB,alimiter=limit=0.89:level=false','-ar',str(SR),f'{RK}/mix_ep18full.wav'],input=x.astype(np.float32).tobytes(),check=True)
print('mix ->',f'{RK}/mix_ep18full.wav',round(DUR,2),'s')
