"""EP3 FULL mix: voice + air bed + SFX synced to the scene timeline -> render-kit/mix_ep3_full.wav (-14 LUFS).
Usage (from videos/inside-money): ~/kokoro-tts/venv/bin/python ep3-1m-cash/mix_ep3_full.py"""
import json,subprocess,wave,numpy as np,tempfile
SR=48000;RK='render-kit';SFX='/Users/User/benny-bucks/studio/public/sfx';TMP=tempfile.gettempdir()
def load(p):
    subprocess.run(['ffmpeg','-v','error','-y','-i',p,'-ac','1','-ar',str(SR),f'{TMP}/_l3f.wav'],check=True)
    w=wave.open(f'{TMP}/_l3f.wav');return np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)/32768
tl=json.load(open(f'{RK}/timeline_ep3_full.json'));WD=tl['words'];DUR=tl['dur']
def W(w,n=0):
    k=0
    for x in WD:
        if x['w'].lower().strip('.,?!')==w.lower():
            if k==n:return x['s']
            k+=1
    raise KeyError(w)
voice=load(f'{RK}/vo_ep3_full.wav');N=int(DUR*SR);out=np.zeros(N,np.float32);out[:min(N,len(voice))]+=voice[:N]
rng=np.random.default_rng(5)
b=np.cumsum(rng.standard_normal(N).astype(np.float32));b-=np.convolve(b,np.ones(4800)/4800,'same');b/=np.abs(b).max();out+=b*.07   # air bed
def put(sig,t,g,dur=None):
    if dur:sig=sig[:int(dur*SR)]*np.linspace(1,0,min(len(sig),int(dur*SR)))**.5
    i=int(max(0,t)*SR);j=min(N,i+len(sig))
    if i<N:out[i:j]+=sig[:j-i]*g
S={k:load(f'{SFX}/user-{k}.wav') for k in['ting','whoosh','slap','cash-register','pop','boom','notif','horn','money','shock']}
put(S['ting'],0.0,.45);put(S['whoosh'],0.05,.35);put(S['slap'],1.72,.55);put(S['ting'],W('one')+.05,.5)
put(S['whoosh'],2.1,.3)
put(S['whoosh'],4.7,.3)                       # crane over the counter
put(S['pop'],5.75,.5)                         # drawer opens
put(S['whoosh'],7.6,.3)                       # follow the teller to the vault
put(S['boom'],8.35,.22,1.0)                   # vault clank
put(S['pop'],9.25,.4)                         # grabs the one bundle
put(S['ting'],10.6,.45)                       # monitor turns: the balance
put(S['whoosh'],12.2,.4)                      # crane up, roof gone
put(S['whoosh'],14.6,.35)                     # back down
for k in range(6):put(S['pop'],14.1+k*.25,.12)   # cash turns into digits
put(S['whoosh'],16.2,.3)                      # dive into the screen
put(S['whoosh'],17.6,.25);put(S['notif'],19.9,.35);put(S['notif'],20.25,.3)   # teller calls the manager
put(S['whoosh'],21.6,.25);put(S['slap'],22.2,.55)    # Mike slams the counter
put(S['pop'],26.5,.5);put(S['whoosh'],28.4,.45)       # form prints and flies
put(S['ting'],31.4,.5)                               # reaches the building
for k in range(12):put(S['pop'],31.5+k*.2,.12)       # routine: more forms arrive
put(S['whoosh'],33.6,.45)                            # camera drops
put(S['boom'],34.9,.3,1.2)                           # through the floor
put(S['cash-register'],36.0,.3)
put(S['whoosh'],37.2,.4)                             # back up to the street
put(S['notif'],42.3,.55);put(S['notif'],42.7,.45)    # phone rings
put(S['whoosh'],42.6,.35);put(S['horn'],43.6,.25)    # truck arrives
put(S['pop'],45.4,.5)                                # case set down
for k in range(5):put(S['pop'],45.8+k*.25,.18)       # bills stacking
put(S['cash-register'],47.0,.45)
put(S['whoosh'],49.3,.35);put(S['money'],49.6,.4)    # bundles into the backpack
put(S['ting'],W('yes')+.0 if False else 52.64,.5)
put(S['boom'],W('government',1)-.02,.9,1.6);put(S['shock'],W('government',1)+.02,.25)  # "the government already knew"
put(S['whoosh'],59.55,.3)
out=np.clip(out,-1,1)
with wave.open(f'{TMP}/mix_ep3f_raw.wav','wb') as o:o.setnchannels(1);o.setsampwidth(2);o.setframerate(SR);o.writeframes((out*32767).astype(np.int16).tobytes())
subprocess.run(['ffmpeg','-v','error','-y','-i',f'{TMP}/mix_ep3f_raw.wav','-af','loudnorm=I=-14:TP=-1.5:LRA=11','-ar','48000','-ac','2',f'{RK}/mix_ep3_full.wav'],check=True);print('ok',DUR)
