"""EP9 mix: voice + air bed + SFX synced to words -> render-kit/mix_ep9.wav (-14 LUFS). Hook SFX for now; story SFX after hook approval.
Usage (from videos/inside-money): ~/kokoro-tts/venv/bin/python ep9-trump-1cent-gas/mix_ep9.py"""
import json,subprocess,wave,numpy as np,tempfile
SR=48000;RK='render-kit';SFX='/Users/User/benny-bucks/studio/public/sfx';TMP=tempfile.gettempdir()
def load(p):
    subprocess.run(['ffmpeg','-v','error','-y','-i',p,'-ac','1','-ar',str(SR),f'{TMP}/_l6.wav'],check=True)
    w=wave.open(f'{TMP}/_l6.wav');return np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)/32768
tl=json.load(open(f'{RK}/timeline_ep9.json'));WD=tl['words'];DUR=tl['dur']
def Wn(w,n=0):
    k=[x['s'] for x in WD if x['w'].lower().replace('.','').strip('?,!')==w.lower().replace('.','')];return k[min(n,len(k)-1)]
voice=load('ep9-trump-1cent-gas/vo.wav');_c=int((WD[-1]['e'])*SR);voice[_c:_c+int(.06*SR)]*=np.linspace(1,0,int(.06*SR))[:len(voice[_c:_c+int(.06*SR)])];voice[_c+int(.06*SR):]=0   # cut after 'TAX'
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
put(cut(S['ting'],.3,.15),0.0,.14)                                            # soft ting under the first word
put(cut(S['cash-register'],.6),W('cent')+.02,.2)   # one cent
put(cut(S['whoosh'],.5),W('$4.23')-.25,.18)                                    # push toward the board
put(S['boom'],W('$4.23'),.32);put(S['ting'],W('$4.23')+.05,.26)                # the board flips to red $4.23
put(cut(S['fahh'],.8),W('$4.23')+.3,.2)                                        # the crowd's regret
# ---------- story SFX: a whoosh on every camera flight, a sound on every event ----------
for k in['wrong','shock','money-transfer','aww']:S[k]=load(f'{SFX}/user-{k}.wav')
for w,n in[('meet',0),('oil',0),("it's",0),('who',0),('americans',0),('pay',1),('government',0),('today',0),('so',3)]:put(cut(S['whoosh'],.6),W(w,n)-.6,.2)
put(cut(S['notif'],.35),W('says'),.2)                                          # pump screen shows $4.23
put(S['pop'],W('cent',1)-.15,.2);put(cut(S['wow'],.5),W('dream')-.2,.14)       # the $0.01 dream bubble
put(cut(S['wrong'],.5),W('but'),.22)                                           # bubble pops, head shake
for w in['oil','refinery','trucks','stations']:put(S['pop'],W(w)-.05,.18)       # supply chain pops in
put(S['ting'],W('$422'),.26)                                                    # $4.22
put(cut(S['boom'],.5,.2),W('difference'),.2)                                    # ?
put(cut(S['cash-register'],.6),W('$50'),.22);put(S['ting'],W('cent',2),.24)     # $50 steak -> 1 cent
put(cut(S['cash-register'],.6),W('$50',1),.2);put(cut(S['money'],.6),W('pays'),.2)   # costs $50, pays the chef
put(S['pop'],W('mike',1),.18)                                                   # Mike does
put(cut(S['money-transfer'],1.0),W('fill'),.16);put(S['boom'],W('$63'),.26);put(S['ting'],W('$63')+.05,.22)   # 15 gallons, $63 hidden
for i in range(9):put(cut(S['slap'],.2),W('burn')+i*.24,.12)                   # cans stack up
put(S['ting'],W('136'),.26)
for i in range(10):put(cut(S['money'],.25),W('$422',1)+i*.28,.1)               # money tower rises
put(S['boom'],W('$570'),.32);put(cut(S['cash-register'],.7),W('$570')+.1,.2)
put(cut(S['shock'],.8),W('catch'),.2)
put(cut(S['aww'],.8),W('money')+.1,.2)                                         # empty safe
put(S['pop'],W('taxes')-.1,.2);put(S['pop'],W('debt')-.1,.2);put(cut(S['aww'],.7),W('kids'),.18)
put(cut(S['notif2'],.5),W('today'),.18);put(S['ting'],W('tax'),.26)            # TAX 50 cents slice
put(cut(S['cash-register'],.6),W('pump',1),.2);put(cut(S['wrong'],.5),W('tax',1),.24)   # 1 cent at the pump / $4.22 on the tax bill
put(S['pop'],W('tax',2),.22);put(S['pop'],W('pump',2),.22)                     # TAX / PUMP signs

m=np.abs(out).max();out=out/m*.89
subprocess.run(['ffmpeg','-v','error','-y','-f','f32le','-ar',str(SR),'-ac','1','-i','-','-af','loudnorm=I=-14:TP=-1.5:LRA=11','-ar',str(SR),'-ac','2',f'{RK}/mix_ep9.wav'],input=out.tobytes(),check=True)
print('mix ok',DUR)
