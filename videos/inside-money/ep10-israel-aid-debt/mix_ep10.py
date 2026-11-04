"""EP10 mix: voice + air bed + SFX synced to words -> render-kit/mix_ep9.wav (-14 LUFS). Hook SFX for now; story SFX after hook approval.
Usage (from videos/inside-money): ~/kokoro-tts/venv/bin/python ep10-israel-aid-debt/mix_ep9.py"""
import json,subprocess,wave,numpy as np,tempfile
SR=48000;RK='render-kit';SFX='/Users/User/benny-bucks/studio/public/sfx';TMP=tempfile.gettempdir()
def load(p):
    subprocess.run(['ffmpeg','-v','error','-y','-i',p,'-ac','1','-ar',str(SR),f'{TMP}/_l6.wav'],check=True)
    w=wave.open(f'{TMP}/_l6.wav');return np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)/32768
tl=json.load(open(f'{RK}/timeline_ep10.json'));WD=tl['words'];DUR=tl['dur']
def Wn(w,n=0):
    k=[x['s'] for x in WD if x['w'].lower().replace('.','').strip('?,!')==w.lower().replace('.','')];return k[min(n,len(k)-1)]
voice=load('ep10-israel-aid-debt/vo.wav');_c=int((WD[-1]['e'])*SR);voice[_c:_c+int(.06*SR)]*=np.linspace(1,0,int(.06*SR))[:len(voice[_c:_c+int(.06*SR)])];voice[_c+int(.06*SR):]=0   # cut after 'DEBT'
N=int(DUR*SR);out=np.zeros(N,np.float32);out[:min(N,len(voice))]+=voice[:N]   # timeline dur is video time (scene minus T0)
rng=np.random.default_rng(6)
b=np.cumsum(rng.standard_normal(N).astype(np.float32));b-=np.convolve(b,np.ones(4800)/4800,'same');b/=np.abs(b).max();out+=b*.05
def put(sig,t,g):
    i=int(max(0,t)*SR);j=min(N,i+len(sig))
    if i<N:out[i:j]+=sig[:j-i]*g
S={k:load(f'{SFX}/user-{k}.wav') for k in['ting','whoosh','cash-register','slap','money','boom','wow','yeah','notif']}
def cut(sig,dur,fade=.12):   # trim a long SFX so it never bleeds into the next beat
    n=int(dur*SR);x=sig[:n].copy();f=int(min(fade,dur/2)*SR);x[-f:]*=np.linspace(1,0,f);return x
for k in['fahh','pop','notif2']:S[k]=load(f'{SFX}/user-{k}.wav')
W=lambda w,n=0:Wn(w,n)
for k in['shock','money-transfer']:S[k]=load(f'{SFX}/user-{k}.wav')
put(cut(S['ting'],.3,.15),0.0,.14)                                             # soft ting under the first word
for i in range(8):put(cut(S['money'],.22),W('send')+.05+i*(W('year')-W('send'))/8+.35,.09)   # each strap lands in the crate
put(cut(S['cash-register'],.6),W('$3.8'),.2)                                    # $3.8
put(S['ting'],W('billion'),.24)                                                 # $3.8 BILLION pops
put(cut(S['whoosh'],.5),W('with')-.08,.26)                                      # whip-pan to the debt clock
put(S['boom'],W('trillion'),.34);put(S['ting'],W('trillion')+.05,.24)           # $40 TRILLION
put(cut(S['shock'],.7),W('debt')-.1,.2)                                          # Mike's shock close-up
put(cut(S['whoosh'],.5),W('debt')-.15,.14)                                      # orbit to his face
# story SFX are added after the hook is approved

m=np.abs(out).max();out=out/m*.89
subprocess.run(['ffmpeg','-v','error','-y','-f','f32le','-ar',str(SR),'-ac','1','-i','-','-af','loudnorm=I=-11:TP=-1.0:LRA=11','-ar',str(SR),'-ac','2',f'{RK}/mix_ep10.wav'],input=out.tobytes(),check=True)
print('mix ok',DUR)
