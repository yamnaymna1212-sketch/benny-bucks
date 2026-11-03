"""EP8 mix: voice + air bed + SFX synced to words -> render-kit/mix_ep8.wav (-14 LUFS). Hook SFX for now; story SFX after hook approval.
Usage (from videos/inside-money): ~/kokoro-tts/venv/bin/python ep8-trump-income-tax/mix_ep8.py"""
import json,subprocess,wave,numpy as np,tempfile
SR=48000;RK='render-kit';SFX='/Users/User/benny-bucks/studio/public/sfx';TMP=tempfile.gettempdir()
def load(p):
    subprocess.run(['ffmpeg','-v','error','-y','-i',p,'-ac','1','-ar',str(SR),f'{TMP}/_l6.wav'],check=True)
    w=wave.open(f'{TMP}/_l6.wav');return np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)/32768
tl=json.load(open(f'{RK}/timeline_ep8.json'));WD=tl['words'];DUR=tl['dur']
def Wn(w,n=0):
    k=[x['s'] for x in WD if x['w'].lower().strip('?.,!')==w.lower()];return k[min(n,len(k)-1)]
voice=load('ep8-trump-income-tax/vo.wav');N=int(DUR*SR);out=np.zeros(N,np.float32);out[:min(N,len(voice))]+=voice[:N]   # timeline dur is video time (scene minus T0)
rng=np.random.default_rng(6)
b=np.cumsum(rng.standard_normal(N).astype(np.float32));b-=np.convolve(b,np.ones(4800)/4800,'same');b/=np.abs(b).max();out+=b*.05
def put(sig,t,g):
    i=int(max(0,t)*SR);j=min(N,i+len(sig))
    if i<N:out[i:j]+=sig[:j-i]*g
S={k:load(f'{SFX}/user-{k}.wav') for k in['ting','whoosh','cash-register','slap','money','boom','wow','yeah','notif']}
def cut(sig,dur,fade=.12):   # trim a long SFX so it never bleeds into the next beat
    n=int(dur*SR);x=sig[:n].copy();f=int(min(fade,dur/2)*SR);x[-f:]*=np.linspace(1,0,f);return x
for k in['fahh','pop','notif2']:S[k]=load(f'{SFX}/user-{k}.wav')
for k in['fahh','pop','notif2']:S[k]=load(f'{SFX}/user-{k}.wav')
W=lambda w,n=0:Wn(w,n)
def rip(dur=.42):   # paper tear (no tear in the library): crackly band-passed noise with a fast attack
    n=int(dur*SR);x=rng.standard_normal(n).astype(np.float32);x=np.diff(x,prepend=0);cr=(rng.random(n)<.02).astype(np.float32)*rng.standard_normal(n).astype(np.float32)*3
    x=np.convolve(x+cr,np.ones(6)/6,'same');env=np.minimum(1,np.arange(n)/(.01*SR))*np.exp(-np.arange(n)/(.25*SR));return x*env/np.abs(x).max()
put(cut(S['ting'],.3,.15),0.0,.14)                                           # soft ting under the first word
put(rip(),W('cancel')+.02,.5)                                                 # he rips the Form 1040
put(cut(S['whoosh'],.5),W('tax')+.15,.16)                                     # halves thrown away
put(S['ting'],W('tax')+.06,.3);put(S['pop'],W('tax')+.06,.2)                  # $0 TAX
put(S['boom'],W('forever'),.3);put(cut(S['yeah'],.7),W('forever')+.05,.22);put(cut(S['wow'],.6),W('forever')+.3,.16)   # FOREVER: crowd cheers
put(cut(S['whoosh'],.8),W('tariffs')-.05,.22)                                 # camera flies back
for i in range(3):t0=W('tariffs')+i*.28+.35;put(cut(S['slap'],.3),t0,.3-.05*i);put(cut(S['boom'],.5,.2),t0,.16)   # containers land
put(cut(S['cash-register'],.7),W('money')+.05,.26);put(cut(S['money'],.9),W('money')+.15,.16)   # money pours out
pk=np.abs(out).max();out/=max(1,pk/.95)
pcm=(out*32767).astype(np.int16);w=wave.open(f'{TMP}/_m8.wav','wb');w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes(pcm.tobytes());w.close()
subprocess.run(['ffmpeg','-v','error','-y','-i',f'{TMP}/_m8.wav','-af','loudnorm=I=-14:TP=-1.5:LRA=11','-ar','48000','-ac','2',f'{RK}/mix_ep8.wav'],check=True);print('mix ok')
