"""EP6 mix: voice + air bed + SFX synced to words -> render-kit/mix_ep6.wav (-14 LUFS).
Usage (from videos/inside-money): ~/kokoro-tts/venv/bin/python ep6-print-vs-debt/mix_ep6.py
Hook SFX only so far (0-5 s); story SFX get added when the full scene is built."""
import json,subprocess,wave,numpy as np,tempfile
SR=48000;RK='render-kit';SFX='/Users/User/benny-bucks/studio/public/sfx';TMP=tempfile.gettempdir()
def load(p):
    subprocess.run(['ffmpeg','-v','error','-y','-i',p,'-ac','1','-ar',str(SR),f'{TMP}/_l6.wav'],check=True)
    w=wave.open(f'{TMP}/_l6.wav');return np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)/32768
tl=json.load(open(f'{RK}/timeline_ep6.json'));WD=tl['words'];DUR=tl['dur']
def Wn(w,n=0):
    k=[x['s'] for x in WD if x['w'].lower().rstrip('?.,!')==w];return k[min(n,len(k)-1)]
voice=load('ep6-print-vs-debt/vo.wav');N=int(DUR*SR);out=np.zeros(N,np.float32);out[:min(N,len(voice))]+=voice[:N]
rng=np.random.default_rng(6)
b=np.cumsum(rng.standard_normal(N).astype(np.float32));b-=np.convolve(b,np.ones(4800)/4800,'same');b/=np.abs(b).max();out+=b*.05   # air bed
def put(sig,t,g):
    i=int(max(0,t)*SR);j=min(N,i+len(sig))
    if i<N:out[i:j]+=sig[:j-i]*g
S={k:load(f'{SFX}/user-{k}.wav') for k in['ting','whoosh','cash-register','pop','money','boom','money-transfer']}
# ---- hook (0-5 s): Mike hits the button, the press roars, cash showers; fly to the map; Japan lights up; number
put(S['ting'],0.0,.45)                     # ting at 0 s (channel rule)
put(S['pop'],0.14,.35)                     # the red button
put(S['money'],0.3,.32);put(S['money'],1.3,.25)   # the press + cash shower
put(S['cash-register'],Wn('print'),.3)     # "print money"
put(S['whoosh'],2.55,.4)                   # camera flies to the world map
put(S['boom'],Wn('debt'),.45)              # "...pay off its DEBT?"
put(S['pop'],Wn('japan'),.3)               # Japan lights up
put(S['money-transfer'],Wn('owed'),.25)    # cash flows along the arc
put(S['ting'],Wn('$1'),.45)                # key number
out=np.clip(out,-1,1)
with wave.open(f'{TMP}/mix_ep6_raw.wav','wb') as o:o.setnchannels(1);o.setsampwidth(2);o.setframerate(SR);o.writeframes((out*32767).astype(np.int16).tobytes())
subprocess.run(['ffmpeg','-v','error','-y','-i',f'{TMP}/mix_ep6_raw.wav','-af','loudnorm=I=-14:TP=-1.5:LRA=11','-ar','48000','-ac','2',f'{RK}/mix_ep6.wav'],check=True);print('ok',DUR)
