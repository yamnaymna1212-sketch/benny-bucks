"""EP3 hook-preview mix: voice + air bed + SFX synced to words -> render-kit/mix_ep3.wav (-14 LUFS).
Usage (from videos/inside-money): ~/kokoro-tts/venv/bin/python ep3-1m-cash/mix_ep3.py"""
import json,subprocess,wave,numpy as np,tempfile,os
SR=48000;RK='render-kit';SFX='/Users/User/benny-bucks/studio/public/sfx';TMP=tempfile.gettempdir()
def load(p):
    subprocess.run(['ffmpeg','-v','error','-y','-i',p,'-ac','1','-ar',str(SR),f'{TMP}/_l3.wav'],check=True)
    w=wave.open(f'{TMP}/_l3.wav');return np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)/32768
tl=json.load(open(f'{RK}/timeline_ep3.json'));WD=tl['words'];DUR=tl['dur']
def W(w):
    for x in WD:
        if x['w'].lower()==w.lower():return x['s']
    raise KeyError(w)
voice=load(f'{RK}/vo_ep3.wav');N=int(DUR*SR);out=np.zeros(N,np.float32);out[:min(N,len(voice))]+=voice[:N]
rng=np.random.default_rng(5)
b=np.cumsum(rng.standard_normal(N).astype(np.float32));b-=np.convolve(b,np.ones(4800)/4800,'same');b/=np.abs(b).max();out+=b*.07   # air bed
def put(sig,t,g):
    i=int(max(0,t)*SR);j=min(N,i+len(sig))
    if i<N:out[i:j]+=sig[:j-i]*g
S={k:load(f'{SFX}/user-{k}.wav') for k in['ting','whoosh','slap','cash-register']}
put(S['ting'],0.0,.45)                  # ting at 0 s (channel rule)
put(S['whoosh'],0.05,.35)               # camera move
put(S['slap'],1.72,.55)                 # the note hits the counter
put(S['ting'],W('$1')+.05,.5)           # key number
put(S['cash-register'],W('million')+.1,.3)
put(S['whoosh'],2.1,.3)                 # swing to the side
out=np.clip(out,-1,1)
with wave.open(f'{TMP}/mix_ep3_raw.wav','wb') as o:o.setnchannels(1);o.setsampwidth(2);o.setframerate(SR);o.writeframes((out*32767).astype(np.int16).tobytes())
subprocess.run(['ffmpeg','-v','error','-y','-i',f'{TMP}/mix_ep3_raw.wav','-af','loudnorm=I=-14:TP=-1.5:LRA=11','-ar','48000','-ac','2',f'{RK}/mix_ep3.wav'],check=True);print('ok',DUR)
