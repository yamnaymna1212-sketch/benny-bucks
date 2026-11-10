"""EP11 mix: voice + air bed + SFX synced to words -> render-kit/mix_ep11.wav (-11 LUFS).
Usage (from videos/inside-money): ~/kokoro-tts/venv/bin/python ep11-bank-owns-cash/mix_ep11.py"""
import json,subprocess,wave,numpy as np,tempfile
SR=48000;RK='render-kit';SFX='/Users/User/benny-bucks/studio/public/sfx';TMP=tempfile.gettempdir()
def load(p):
    subprocess.run(['ffmpeg','-v','error','-y','-i',p,'-ac','1','-ar',str(SR),f'{TMP}/_l11.wav'],check=True)
    w=wave.open(f'{TMP}/_l11.wav');return np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)/32768
tl=json.load(open(f'{RK}/timeline_ep11.json'));WD=tl['words'];DUR=tl['dur']
def W(w,n=0):
    k=[x['s'] for x in WD if x['w'].lower().replace('.','').strip('?,!')==w.lower().replace('.','')];return k[min(n,len(k)-1)]
voice=load('ep11-bank-owns-cash/vo.wav');_c=int((WD[-1]['e'])*SR);f=int(.06*SR);voice[_c:_c+f]*=np.linspace(1,0,f)[:len(voice[_c:_c+f])];voice[_c+f:]=0
N=int(DUR*SR);out=np.zeros(N,np.float32);out[:min(N,len(voice))]+=voice[:N]
rng=np.random.default_rng(11)
b=np.cumsum(rng.standard_normal(N).astype(np.float32));b-=np.convolve(b,np.ones(4800)/4800,'same');b/=np.abs(b).max();out+=b*.05
def put(sig,t,g):
    i=int(max(0,t)*SR);j=min(N,i+len(sig))
    if i<N:out[i:j]+=sig[:j-i]*g
S={k:load(f'{SFX}/user-{k}.wav') for k in['ting','whoosh','cash-register','slap','money','boom','pop','shock','money-transfer','notif']}
def cut(sig,dur,fade=.12):
    n=int(dur*SR);x=sig[:n].copy();f=int(min(fade,dur/2)*SR);x[-f:]*=np.linspace(1,0,f);return x
# ---- hook ----
put(cut(S['ting'],.3,.15),0.0,.14)                                          # soft ting under the first word
put(cut(S['cash-register'],.6),W('$50,000'),.2)                              # $50,000 pops
bk=W('backyard')
for i in range(5):put(cut(S['money'],.2),.12+i*(bk+.5-.12)/5+.28,.09)         # each $20 strap lands in the hole
put(S['ting'],W('yours'),.22)                                                # YOURS
put(cut(S['whoosh'],.5),W('put')-.12,.26)                                    # whip over the roof to the bank
put(cut(S['money-transfer'],.6),W('bank')-.1,.16)                             # the stack flies through the door
put(cut(S['slap'],.3),W('legally')+.18,.3)                                    # doors slam
put(S['boom'],W('theirs'),.34)                                               # THEIRS
put(cut(S['whoosh'],.45),W('meet')-.15,.16);put(cut(S['shock'],.7),W('meet')-.1,.16)   # orbit to Mike's shocked face
# ---- story SFX (every event has a sound; long ones trimmed) ----
for k in['fahh','notif2','timer','yeah']:
    try:S[k]=load(f'{SFX}/user-{k}.wav')
    except Exception:pass
WH=lambda t,g=.15:put(cut(S['whoosh'],.45),t,g)
put(cut(S['pop'],.25),W('deposited'),.16);put(cut(S['notif'],.4),W('fine'),.14)              # S1 the paper, fine print
WH(W('america')+.2);put(cut(S['money'],.3),W('loan')-.25,.12);put(S['ting'],W('loan'),.2)       # S2 money pushed in, LOAN
WH(W('owns')-.05,.1);put(cut(S['money-transfer'],.6),W('owns'),.14);put(cut(S['pop'],.25),W('owns'),.14)   # S3 into the vault
put(cut(S['pop'],.25),W('owes')+.1,.16);put(S['ting'],W('amount'),.14)                        # S4 IOU
WH(W('fdic')-.1);put(cut(S['pop'],.25),W('fdic'),.18);put(cut(S['cash-register'],.6),W('$250,000'),.18);put(S['ting'],W('protected'),.16)
WH(W('those'));put(cut(S['slap'],.3),W('not')+.1,.3);put(S['boom'],W('not')+.12,.22)          # S6 vault slams
WH(W('cash',1)+.2);put(cut(S['pop'],.25),W('cash',1)+.15,.14)                                  # S7 the $100 bill
put(cut(S['whoosh'],.3),W('pays')+.25,.12);put(cut(S['cash-register'],.6),W('gets'),.18)       # S8 handed over, truck gets $100
put(cut(S['whoosh'],.5),W('pays',1),.16);put(cut(S['cash-register'],.6),W('gets',1),.18)       # S9 to the butcher
put(S['ting'],W('nobody'),.2)                                                                  # S10 NO FEES
put(cut(S['notif'],.4),W('taps'),.2)                                                           # S11 tap beep
for i in range(3):put(cut(S['pop'],.25),W('arrives')-.4+i*.12,.12)                              # booths pop
for i in range(3):put(cut(S['money'],.2),W('banks')-.3+(i+1)*(W('cut')+.9-W('banks'))/4,.12)    # a cut at each booth
put(cut(S['pop'],.25),W('average')-.15,.14);put(cut(S['slap'],.3),W('$157'),.22);put(S['ting'],W('$157')+.05,.16)   # S12 the slice
put(cut(S['pop'],.25),W('credit')-.1,.14);put(cut(S['slap'],.3),W('$2'),.22)
WH(W('never'));put(S['ting'],W('hide')+.1,.16)                                                  # S13 fees inside the menu
put(cut(S['money'],.3),W('even')+.25,.12);put(cut(S['pop'],.25),W('too'),.14)
WH(W('2024'),.2);put(cut(S['money-transfer'],1.2),W('2024')+.1,.14);put(S['boom'],W('$187'),.3)  # S14 the pile rises
put(cut(S['pop'],.25),W('$500')-.15,.14);put(S['ting'],W('day'),.16)
WH(W('follow')-.05,.2)                                                                         # S15 town
for i in range(10):put(cut(S['money'],.15),W('ten')+.3+i*.43+.4,.08)
put(S['ting'],W('$85'),.2);put(cut(S['cash-register'],.6),W('still',1),.16)                    # S16 $85 vs $100 cash
WH(W('next')-.1,.16);put(cut(S['pop'],.25),W("who's"),.16)                                     # S17 ?
put(cut(S['pop'],.25),W('cash',5),.16);put(cut(S['pop'],.25),W('card',4),.16);put(cut(S['notif'],.4),W('comment'),.14)   # S18 CTA
m=np.abs(out).max();out=out/m*.89
subprocess.run(['ffmpeg','-v','error','-y','-f','f32le','-ar',str(SR),'-ac','1','-i','-','-af','loudnorm=I=-11:TP=-1.0:LRA=11','-ar',str(SR),'-ac','2',f'{RK}/mix_ep11.wav'],input=out.tobytes(),check=True)
print('mix ok',DUR)
