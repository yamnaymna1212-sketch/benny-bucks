"""EP18 hook mix: voice + air bed + SFX synced to words -> render-kit/mix_ep18.wav (-11 LUFS, louder: user 2026-11-10).
Usage (from videos/inside-money): python3 ep18-pool-million/mix_ep18.py   (needs studio/public/sfx: python3 tools/import_user_sfx.py from the repo root)"""
import json,subprocess,wave,os,numpy as np,tempfile
SR=48000;RK='render-kit';SFX=os.path.join(os.path.dirname(os.path.abspath(__file__)),'../../../studio/public/sfx');TMP=tempfile.gettempdir()
def load(p):
    subprocess.run(['ffmpeg','-v','error','-y','-i',p,'-ac','1','-ar',str(SR),f'{TMP}/_l18.wav'],check=True)
    w=wave.open(f'{TMP}/_l18.wav');return np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)/32768
tl=json.load(open(f'{RK}/timeline_ep18.json'));WD=tl['words'];DUR=tl['dur']
def W(w,n=0):
    k=[x['s'] for x in WD if x['w'].lower().strip('?.,!').replace('.','')==w.lower()];return k[min(n,len(k)-1)]
voice=load('ep18-pool-million/vo_hook.wav')
# first word louder + clearer (user rule EP6-gas): +4 dB with a soft clip on "You"
# FIRST WORD "You" (user 2026-11-10: clear + louder): presence boost (high-frequency lift) + ~+7 dB with a soft clip, a short crossfade into the rest
e=int(W('dug')*SR);seg=voice[:e].copy();lo=np.convolve(seg,np.ones(12)/12,'same');seg=seg+.9*(seg-lo)   # brighter consonants
seg=np.tanh(seg*2.3)/np.tanh(2.3)*.98;f=int(.03*SR);seg[-f:]=seg[-f:]*np.linspace(1,0,f)+voice[e-f:e]*np.linspace(0,1,f);voice[:e]=seg
voice=voice*1.0
N=int(DUR*SR);out=np.zeros(N,np.float32);out[:min(N,len(voice))]+=voice[:N]
rng=np.random.default_rng(18)
b=np.cumsum(rng.standard_normal(N).astype(np.float32));b-=np.convolve(b,np.ones(4800)/4800,'same');b/=np.abs(b).max();b[:int(W('dug')*SR)]*=.3;out+=b*.04   # air bed: never silent
def put(sig,t,g):
    i=int(max(0,t)*SR);j=min(N,i+len(sig))
    if i<N:out[i:j]+=sig[:j-i]*g
def cut(sig,dur,fade=.12):
    n=int(dur*SR);x=sig[:n].copy();f=int(min(fade,dur/2)*SR);x[-f:]*=np.linspace(1,0,f);return x
S={k:load(f'{SFX}/user-{k}.wav') for k in['ting','whoosh','cash-register','slap','money','boom','pop','shock','wrong']}
for k in['timer','notif','horn']:S[k]=load(f'{SFX}/user-{k}.wav')
put(cut(S['ting'],.25,.12),0,.05)                                   # very soft ting: nothing covers the first word
tDig=W('filled')+.3
k=0
while (k+.88)/1.55<tDig:put(cut(S['slap'],.25),(k+.88)/1.55,.16);put(cut(S['boom'],.3,.15),(k+.9)/1.55,.08);k+=1   # excavator bucket dumps
put(S['pop'],W('pool')+.02,.3)                                     # yellow ring pops on
put(cut(S['money'],1.0),W('filled')+.25,.24)                       # straps raining in
put(cut(S['cash-register'],.8),W('million')+.02,.3)                # cash on the number
put(cut(S['whoosh'],.7),W('put')-.25,.25)                          # the lid drops from the sky
put(S['boom'],W('armor')+.05,.42);put(cut(S['slap'],.3),W('armor')+.05,.32)   # CLANG
put(cut(S['timer'],.5),W('world'),.18);put(cut(S['ting'],.4),W('top')+.1,.2)  # the vault wheel turns, locks
put(cut(S['whoosh'],.9),W('will')-.45,.32)                         # straight up to the satellite view -> into the IRS screen
put(cut(S['wrong'],.5),W('will')+.05,.22);put(cut(S['wrong'],.5),W('will')+.62,.18)   # alarm in the IRS room (strobes)
put(cut(S['shock'],.6),W('irs')+.02,.26);put(cut(S['notif'],.4),W('find'),.25)        # target locked on the pool
x=out/np.abs(out).max()*.9
subprocess.run(['ffmpeg','-v','error','-y','-f','f32le','-ar',str(SR),'-ac','1','-i','-','-af','loudnorm=I=-11:TP=-1.0:LRA=9,volume=3.6dB,alimiter=limit=0.89:level=false','-ar',str(SR),f'{RK}/mix_ep18.wav'],input=x.astype(np.float32).tobytes(),check=True)
print('mix ->',f'{RK}/mix_ep18.wav',round(DUR,2),'s')
