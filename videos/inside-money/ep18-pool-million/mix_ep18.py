"""EP18 hook mix: voice + air bed + SFX synced to words -> render-kit/mix_ep18.wav (-14 LUFS).
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
e=int((W('dug'))*SR);voice[:e]=np.tanh(voice[:e]*1.6)/np.tanh(1.6)*1.0
N=int(DUR*SR);out=np.zeros(N,np.float32);out[:min(N,len(voice))]+=voice[:N]
rng=np.random.default_rng(18)
b=np.cumsum(rng.standard_normal(N).astype(np.float32));b-=np.convolve(b,np.ones(4800)/4800,'same');b/=np.abs(b).max();out+=b*.04   # air bed: never silent
def put(sig,t,g):
    i=int(max(0,t)*SR);j=min(N,i+len(sig))
    if i<N:out[i:j]+=sig[:j-i]*g
def cut(sig,dur,fade=.12):
    n=int(dur*SR);x=sig[:n].copy();f=int(min(fade,dur/2)*SR);x[-f:]*=np.linspace(1,0,f);return x
S={k:load(f'{SFX}/user-{k}.wav') for k in['ting','whoosh','cash-register','slap','money','boom','pop','shock','wrong']}
put(cut(S['ting'],.3,.15),0,.14)                                   # soft ting under the first word
for k in range(3):put(cut(S['slap'],.12,.05),.12+k*.24,.09)        # shovel scrapes while he digs
put(S['pop'],W('pool')+.05,.3)                                     # tiles + coping pop in
put(cut(S['whoosh'],.6),W('filled')-.25,.22)                       # he jumps out
put(cut(S['money'],1.0),W('filled')+.05,.22)                       # straps raining in
put(cut(S['cash-register'],.8),W('million')+.02,.3)                # cash on the price
put(cut(S['whoosh'],.7),W('put')-.2,.25)                           # the lid drops from the sky
put(S['boom'],W('armor')+.05,.4);put(cut(S['slap'],.3),W('armor')+.05,.3)   # CLANG
put(cut(S['ting'],.4),W('top')+.05,.18)                            # wheel locks
put(cut(S['whoosh'],.8),W('will')-.15,.28)                         # camera pulls back to the street
put(cut(S['shock'],.6),W('irs')+.02,.28)                           # IRS SUV
x=out/np.abs(out).max()*.9
subprocess.run(['ffmpeg','-v','error','-y','-f','f32le','-ar',str(SR),'-ac','1','-i','-','-af','loudnorm=I=-14:TP=-1.5:LRA=11','-ar',str(SR),f'{RK}/mix_ep18.wav'],input=x.astype(np.float32).tobytes(),check=True)
print('mix ->',f'{RK}/mix_ep18.wav',round(DUR,2),'s')
