"""EP10 mix: voice + air bed + SFX synced to words -> render-kit/mix_ep10.wav (-11 LUFS).
Usage (from videos/inside-money): ~/kokoro-tts/venv/bin/python ep10-israel-aid-debt/mix_ep10.py"""
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
for k in['shock','money-transfer','timer']:S[k]=load(f'{SFX}/user-{k}.wav')
put(cut(S['ting'],.3,.15),0.0,.14)                                             # soft ting under the first word
for i in range(8):put(cut(S['money'],.22),W('send')+.05+i*(W('year')-W('send'))/8+.35,.09)   # each strap lands in the crate
put(cut(S['cash-register'],.6),W('$3.8'),.2)                                    # $3.8
put(S['ting'],W('billion'),.24)                                                 # $3.8 BILLION pops
put(cut(S['whoosh'],.5),W('with')-.08,.26)                                      # whip-pan to the debt clock
put(S['boom'],W('trillion'),.34);put(S['ting'],W('trillion')+.05,.24)           # $40 TRILLION
put(cut(S['shock'],.7),W('debt')-.1,.2)                                          # Mike's shock close-up
put(cut(S['whoosh'],.5),W('debt')-.15,.14)                                      # orbit to his face
# ---- story SFX (every event has a sound; long ones trimmed) ----
for t in[5.65,8.15,13.85,16.35,24.4,27.15,29.0,38.0,47.7,53.7,57.5,60.1]:put(cut(S['whoosh'],.45),t,.16)   # every fly between places
put(cut(S['slap'],.3),W('taxes'),.22);put(cut(S['pop'],.25),W('looking')-.1,.16)                 # PAID stamp, magnifier
put(S['ting'],W('2016'),.18);put(cut(S['cash-register'],.6),W('$38',1),.2)                         # 2016, $38 billion
for i in range(10):put(cut(S['money'],.18),W('from')+i*(W('2028')+.3-W('from'))/10,.07)            # one stack per year
put(S['ting'],W('10'),.15);put(cut(S['cash-register'],.6),W('$317'),.18);put(cut(S['whoosh'],.3),W('month')-.3,.1)
put(cut(S['pop'],.25),W('$33')-.1,.16);put(S['ting'],W('billion',2),.16)                           # the jet, $3.3 billion
put(cut(S['whoosh'],.6),W('$500')-.05,.2);put(cut(S['pop'],.25),W('missile')-.15,.15)              # jet takes off, launcher
put(cut(S['whoosh'],.5),W('rockets')-.6,.14);put(cut(S['whoosh'],.5),W('shoots'),.2);put(S['boom'],W('down')+.05,.3)   # rocket, interceptor, hit
put(cut(S['whoosh'],.4),W('lump')-.3,.18);put(S['boom'],W('lump'),.34);put(S['ting'],W('sum'),.16) # the lump-sum tower lands
put(cut(S['notif'],.4),W('miss'),.16)
put(cut(S['money-transfer'],1.0),W('money',1)-.1,.16);put(cut(S['pop'],.25),W('made')-.15,.16)    # money into the factory, MADE IN USA
put(cut(S['pop'],.25),W('check')-.1,.16);put(cut(S['whoosh'],.4),W('but'),.14);put(cut(S['cash-register'],.6),W('paid'),.2)
put(cut(S['pop'],.25),W('workers')-.1,.14);put(cut(S['pop'],.25),W('planes')-.1,.14);put(cut(S['pop'],.25),W('missiles')-.1,.14)
put(S['boom'],W('$40',1),.26);put(S['ting'],W('trillion',1)+.05,.2)                               # $40 trillion
put(cut(S['money-transfer'],1.4),W('paid',1)+.2,.15);put(S['ting'],W('trillion',2),.18)           # interest flies into the clock
put(cut(S['timer'],1.8),W('$3'),.14);put(S['ting'],W('day'),.16)                                  # $3 billion every day
put(cut(S['pop'],.25),W('math')-.4,.14);put(S['ting'],W('32'),.2);put(S['ting'],W('32',1),.16)    # Mike's math, 32 hours
put(cut(S['pop'],.25),W('defense',1)-.1,.14);put(S['ting'],W('$965'),.16);put(cut(S['pop'],.25),W('interest',2)-.1,.14);put(S['boom'],W('more'),.28)
put(cut(S['pop'],.25),W('aid')-.1,.14);put(S['ting'],W('less'),.16)                                # the debt as 10,000 squares
put(cut(S['pop'],.25),W('aid',1)-.05,.18);put(cut(S['pop'],.25),W('debt',3)-.05,.18);put(cut(S['notif'],.4),W('comment'),.16)   # CTA

m=np.abs(out).max();out=out/m*.89
subprocess.run(['ffmpeg','-v','error','-y','-f','f32le','-ar',str(SR),'-ac','1','-i','-','-af','loudnorm=I=-11:TP=-1.0:LRA=11','-ar',str(SR),'-ac','2',f'{RK}/mix_ep10.wav'],input=out.tobytes(),check=True)
print('mix ok',DUR)
