"""EP6 mix: voice + air bed + SFX synced to words -> render-kit/mix_ep6.wav (-14 LUFS). Hook SFX for now; story SFX after hook approval.
Usage (from videos/inside-money): ~/kokoro-tts/venv/bin/python ep6-found-10m/mix_ep6.py"""
import json,subprocess,wave,numpy as np,tempfile
SR=48000;RK='render-kit';SFX='/Users/User/benny-bucks/studio/public/sfx';TMP=tempfile.gettempdir()
def load(p):
    subprocess.run(['ffmpeg','-v','error','-y','-i',p,'-ac','1','-ar',str(SR),f'{TMP}/_l6.wav'],check=True)
    w=wave.open(f'{TMP}/_l6.wav');return np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)/32768
tl=json.load(open(f'{RK}/timeline_ep6.json'));WD=tl['words'];DUR=tl['dur']
def Wn(w,n=0):
    k=[x['s'] for x in WD if x['w'].lower().strip('?.,!')==w.lower()];return k[min(n,len(k)-1)]
voice=load('ep6-found-10m/vo.wav');N=int(DUR*SR);out=np.zeros(N,np.float32);out[:min(N,len(voice))]+=voice[:N]
rng=np.random.default_rng(6)
b=np.cumsum(rng.standard_normal(N).astype(np.float32));b-=np.convolve(b,np.ones(4800)/4800,'same');b/=np.abs(b).max();out+=b*.05
def put(sig,t,g):
    i=int(max(0,t)*SR);j=min(N,i+len(sig))
    if i<N:out[i:j]+=sig[:j-i]*g
S={k:load(f'{SFX}/user-{k}.wav') for k in['ting','whoosh','cash-register','slap','money','boom','wow','yeah','notif']}
def cut(sig,dur,fade=.12):   # trim a long SFX so it never bleeds into the next beat
    n=int(dur*SR);x=sig[:n].copy();f=int(min(fade,dur/2)*SR);x[-f:]*=np.linspace(1,0,f);return x
for k in['fahh','pop']:S[k]=load(f'{SFX}/user-{k}.wav')
HIT=.5   # shovel hits the trunk (= ep6.html HIT)
put(S['ting'],0.0,.4)
for t0 in(.0,.25):put(cut(S['slap'],.18),t0,.16)                           # shovel digs (pre-roll before the voice)
put(S['slap'],HIT-.02,.4);put(S['boom'],HIT,.32)                           # clink on the trunk, lid bursts open
put(cut(S['cash-register'],.9),Wn('$10')+.05,.3);put(cut(S['money'],1.0),Wn('$10')+.12,.16)
put(cut(S['whoosh'],.9),1.75,.28)                                          # rise out of the shaft
put(cut(S['wow'],.55),Wn('so')-.05,.22)                                    # joy, ONLY inside "so happy"
put(cut(S['yeah'],Wn('something')-Wn('happy')-.05,.15),Wn('happy'),.24)
put(cut(S['whoosh'],.7),Wn('does')-.1,.2)                                  # camera dips to his face
put(S['boom'],Wn('regret')-.02,.34);put(cut(S['fahh'],1.15,.25),Wn('regret')+.02,.3)   # regret: boom + fahh fills the pause
put(S['pop'],Wn('danny'),.25);put(S['ting'],Wn('danny')+.03,.18)
# ---------- story SFX (every event gets a sound; long SFX trimmed so nothing bleeds into the next beat) ----------
for k in['shock','horn','wrong','timer','money-transfer','notif2']:S[k]=load(f'{SFX}/user-{k}.wav')
W=lambda w,n=0:Wn(w,n)
for t0 in(5.85,9.2,11.35,17.4,22.3,36.45,37.3,46.1,59.2):put(cut(S['whoosh'],.8),t0,.22)          # camera flights
put(cut(S['notif'],.5),W('wakes'),.3);put(cut(S['notif2'],.5),W('friends'),.3)                      # two phones ring
put(cut(S['shock'],.6),W('screams'),.3);put(S['boom'],W('helicopter'),.3);put(cut(S['wrong'],.5),W('lawn'),.18)
put(S['pop'],11.0,.35)                                                                               # the nightmare poofs
put(cut(S['wow'],.6),W('mansion'),.22);put(cut(S['cash-register'],.7),W('ferrari'),.28);put(cut(S['whoosh'],.6),W('fly'),.2)
for w,n in(('picking',0),('color',0),('ferrari',1)):put(S['pop'],W(w,n),.3)                           # Ferrari colour changes
put(cut(S['timer'],.9),W('one'),.3);put(S['ting'],W('second'),.35)                                   # one second
put(cut(S['horn'],.5),W('drives'),.25)
put(cut(S['money'],.8),W('kilos'),.2);put(cut(S['cash-register'],.7),W('dollar'),.25)
put(cut(S['wrong'],.45),W('helicopter',1),.25);put(cut(S['wrong'],.45),W('swat',1),.25)
put(S['ting'],W('smiles'),.3);put(cut(S['cash-register'],.7),W('$10,000'),.25);put(S['slap'],W('routine'),.35)
put(S['pop'],W('certificate'),.3);put(S['pop'],W('photos'),.35);put(S['pop'],W('photos')+.28,.3);put(S['pop'],W('coffee'),.25)
put(cut(S['notif'],.5),W('mailbox'),.3);put(S['boom'],W('irs'),.32);put(cut(S['shock'],.6),W('irs')+.08,.25)
put(S['ting'],W('treasure'),.3);put(cut(S['cash-register'],.7),W('$4,000'),.25);put(S['slap'],W('pay'),.4);put(S['boom'],W('pay')+.02,.25)
put(cut(S['cash-register'],.7),W('$10',1),.28)
for i in range(7):put(S['pop'],46.2+i*.2,.15)
put(cut(S['money-transfer'],1.0),W('$3.65'),.3);put(cut(S['wrong'],.45),W('state'),.22)
put(cut(S['cash-register'],.7),W('$6.35'),.3);put(cut(S['yeah'],.8),W('$6.35')+.3,.22)
put(S['ting'],W('rich'),.3);put(S['ting'],W('legal'),.3)
put(S['boom'],W('tara',1)-.02,.34);put(cut(S['fahh'],1.0,.25),W('tara',1)+.02,.3)                       # the regret
for w,n in(('rick',1),('tara',2),('danny',4)):put(S['pop'],W(w,n),.3)
put(S['ting'],W('follow'),.3)
pk=np.abs(out).max();out/=max(1,pk/.95)
pcm=(out*32767).astype(np.int16);w=wave.open(f'{TMP}/_m6.wav','wb');w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes(pcm.tobytes());w.close()
subprocess.run(['ffmpeg','-v','error','-y','-i',f'{TMP}/_m6.wav','-af','loudnorm=I=-14:TP=-1.5:LRA=11','-ar','48000','-ac','2',f'{RK}/mix_ep6.wav'],check=True);print('mix ok')
