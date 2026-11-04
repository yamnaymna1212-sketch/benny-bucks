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
# ---- story SFX: stage 2 ----
m=np.abs(out).max();out=out/m*.89
subprocess.run(['ffmpeg','-v','error','-y','-f','f32le','-ar',str(SR),'-ac','1','-i','-','-af','loudnorm=I=-11:TP=-1.0:LRA=11','-ar',str(SR),'-ac','2',f'{RK}/mix_ep11.wav'],input=out.tobytes(),check=True)
print('mix ok',DUR)
