"""EP4 mix: voice + air bed + SFX synced to words -> render-kit/mix_ep4.wav (-14 LUFS).
Usage (from videos/inside-money): ~/kokoro-tts/venv/bin/python ep4-print-million/mix_ep4.py"""
import json,subprocess,wave,numpy as np,tempfile
SR=48000;RK='render-kit';SFX='/Users/User/benny-bucks/studio/public/sfx';TMP=tempfile.gettempdir()
def load(p):
    subprocess.run(['ffmpeg','-v','error','-y','-i',p,'-ac','1','-ar',str(SR),f'{TMP}/_l4.wav'],check=True)
    w=wave.open(f'{TMP}/_l4.wav');return np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)/32768
tl=json.load(open(f'{RK}/timeline_ep4.json'));WD=tl['words'];DUR=tl['dur']
def W(w,n=0):
    k=[x for x in WD if x['w'].lower().strip('?.,!')==w.lower()]
    return k[n]['s']
voice=load('ep4-print-million/vo.wav');N=int(DUR*SR);out=np.zeros(N,np.float32);out[:min(N,len(voice))]+=voice[:N]
rng=np.random.default_rng(5)
b=np.cumsum(rng.standard_normal(N).astype(np.float32));b-=np.convolve(b,np.ones(4800)/4800,'same');b/=np.abs(b).max();out+=b*.05   # air bed
def put(sig,t,g):
    i=int(max(0,t)*SR);j=min(N,i+len(sig))
    if i<N:out[i:j]+=sig[:j-i]*g
S={k:load(f'{SFX}/user-{k}.wav') for k in['ting','whoosh','cash-register','pop','money','boom','wrong','aww']}
put(S['ting'],0.0,.45)                    # ting at 0 s (channel rule)
put(S['money'],0.0,.22)                   # the press running
put(S['whoosh'],1.0,.28)                  # cut 1: wide -> printer
put(S['whoosh'],1.66,.28)                 # cut 2: printer -> pickup
put(S['cash-register'],W('million')+.05,.32)   # price pops on the word
put(S['whoosh'],2.5,.32)                  # cut 3: pickup -> wide
for tp in [.5,1.72,2.5,3.28]:put(S['cash-register'],tp+.1,.22)   # each pickup
for tp in [.5,1.72,2.5,3.28]:put(S['pop'],tp+.12,.2)   # price pops over each person

# ---- story SFX: whoosh on every cut, boom on the shock number, ting on key numbers, cash on prices
def Wn(w,n=0):
    k=[x['s'] for x in WD if x['w'].lower().strip('?.,!')==w];return k[min(n,len(k)-1)]
for c in [4.53,6.15,9.2,12.85,16.1,19.35,21.95,22.75,23.45,24.85,28.0,29.75,30.45,31.55,34.95,40.05,42.12,45.55,47.72,51.05,53.1,56.3,59.62]:put(S['whoosh'],c-.06,.22)
put(S['ting'],Wn('342'),.4)                       # 342 million people
put(S['boom'],Wn('342',1),.5)                     # $342 TRILLION slams in
put(S['ting'],Wn('23'),.4)
for i in range(15):put(S['pop'],Wn('15')+i*.12,.12)   # x15 blocks stacking
put(S['wrong'],Wn('problem'),.3)
for w in ['raises']:put(S['cash-register'],Wn(w),.3)
put(S['cash-register'],Wn('landlord'),.25);put(S['cash-register'],Wn('gas',1),.25)
put(S['aww'],Wn('less'),.25)
put(S['boom'],Wn('100',1),.4)                     # Zimbabwe 100 trillion
put(S['ting'],Wn('4'),.4)
put(S['ting'],Wn('140'),.35);put(S['boom'],Wn('342',2),.45)
put(S['pop'],Wn('things'),.3)
put(S['wrong'],Wn('nobody'),.3)
put(S['ting'],Wn('million',6),.45)
out=np.clip(out,-1,1)
with wave.open(f'{TMP}/mix_ep4_raw.wav','wb') as o:o.setnchannels(1);o.setsampwidth(2);o.setframerate(SR);o.writeframes((out*32767).astype(np.int16).tobytes())
subprocess.run(['ffmpeg','-v','error','-y','-i',f'{TMP}/mix_ep4_raw.wav','-af','loudnorm=I=-14:TP=-1.5:LRA=11','-ar','48000','-ac','2',f'{RK}/mix_ep4.wav'],check=True);print('ok',DUR)
