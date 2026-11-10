"""EP7 mix: voice + air bed + SFX synced to words -> render-kit/mix_ep7.wav (-14 LUFS). Hook SFX for now; story SFX after hook approval.
Usage (from videos/inside-money): ~/kokoro-tts/venv/bin/python ep7-1m-month/mix_ep7.py"""
import json,subprocess,wave,numpy as np,tempfile
SR=48000;RK='render-kit';SFX='/Users/User/benny-bucks/studio/public/sfx';TMP=tempfile.gettempdir()
def load(p):
    subprocess.run(['ffmpeg','-v','error','-y','-i',p,'-ac','1','-ar',str(SR),f'{TMP}/_l6.wav'],check=True)
    w=wave.open(f'{TMP}/_l6.wav');return np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)/32768
tl=json.load(open(f'{RK}/timeline_ep7.json'));WD=tl['words'];DUR=tl['dur']
def Wn(w,n=0):
    k=[x['s'] for x in WD if x['w'].lower().strip('?.,!')==w.lower()];return k[min(n,len(k)-1)]
voice=load('ep7-1m-month/vo.wav');N=int(DUR*SR);out=np.zeros(N,np.float32);out[:min(N,len(voice))]+=voice[:N]   # timeline dur is video time (scene minus T0)
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
put(cut(S['ting'],.3,.15),0.0,.14)                                          # soft ting under the first word
for t0 in(0.05,1.3,1.9):put(cut(S['money'],.6),t0,.12)                       # bill counter whirring
put(cut(S['cash-register'],.7),W('$1')+.02,.26);put(cut(S['money'],.8),W('$1')+.08,.14)
for i in range(11):put(S['pop'],W('month')+.05+i*((W('$0')-W('month')-.2)/11),.16)   # a brick lands every month
put(cut(S['whoosh'],.8),1.35,.2)
put(S['boom'],W('$0')-.02,.34);put(cut(S['fahh'],.9,.25),W('$0')+.02,.3)    # DAY 365: $0
put(cut(S['whoosh'],.6),W('meet')-.15,.2);put(S['ting'],W('mike'),.3)
put(cut(S['notif'],.5),W('lands'),.3);put(cut(S['cash-register'],.7),W('lands')+.08,.24)
# ---------- story SFX: every event has a sound, trimmed so nothing bleeds over the next word ----------
for k in['wow','yeah','horn','wrong','shock','money-transfer','notif2','slap']:S[k]=load(f'{SFX}/user-{k}.wav')
for t0 in(3.55,25.85,37.0,40.0,41.9,47.8,50.6):put(cut(S['whoosh'],.8),t0,.2)           # camera flights between places
put(cut(S['yeah'],.7),W('rich'),.2);put(S['pop'],W('rich')+.1,.25)                          # the pallet appears
put(cut(S['horn'],.4),W('irs')-.25,.2);put(S['boom'],W('irs'),.28)                         # IRS pulls up
put(cut(S['cash-register'],.7),W('12'),.24);put(cut(S['money-transfer'],1.0),W('$4.7'),.3);put(cut(S['wrong'],.5),W('$4.7')+.4,.2)
put(cut(S['wrong'],.5),W('$4'),.22);put(cut(S['whoosh'],.6),14.5,.18)                        # 4 of 10 bills fly off
put(S['pop'],W('texas'),.3);put(cut(S['cash-register'],.7),W('$7.3'),.26)
put(cut(S['horn'],.5),W('$400,000')-.2,.24);put(S['pop'],W('$400,000'),.25);put(cut(S['horn'],.4),W('second'),.2);put(S['pop'],W('second'),.22)
put(cut(S['cash-register'],.7),W('$100,000'),.26);put(cut(S['whoosh'],1.2),W('jet'),.3)
for w in('watches','chains','shoes'):put(S['pop'],W(w),.25)
put(cut(S['wow'],.6),W('bro')-.1,.22)
put(cut(S['cash-register'],.7),W('dinner'),.24);put(cut(S['yeah'],.7),W('birthday'),.22)
for w in('insurance','staff','security','bills'):put(cut(S['notif'],.4),W(w),.24)
put(cut(S['wrong'],.5),W('yellow'),.24);put(S['boom'],W('red'),.26)
put(cut(S['wrong'],.6),W('declined'),.3);put(S['boom'],W('$0',1),.32);put(cut(S['fahh'],1.0,.25),W('$0',1)+.03,.3)
put(S['ting'],W('$12'),.25);put(S['boom'],W('zero'),.25)
for i,w in enumerate(('lose','money','spent')):put(S['pop'],W(w,1 if w=='money' else 0),.22)
put(S['ting'],W('keep'),.3);put(S['pop'],W('spend'),.28);put(S['pop'],W('keep',1),.28);put(S['ting'],W('follow'),.3)
pk=np.abs(out).max();out/=max(1,pk/.95)
pcm=(out*32767).astype(np.int16);w=wave.open(f'{TMP}/_m6.wav','wb');w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes(pcm.tobytes());w.close()
subprocess.run(['ffmpeg','-v','error','-y','-i',f'{TMP}/_m6.wav','-af','loudnorm=I=-14:TP=-1.5:LRA=11','-ar','48000','-ac','2',f'{RK}/mix_ep7.wav'],check=True);print('mix ok')
