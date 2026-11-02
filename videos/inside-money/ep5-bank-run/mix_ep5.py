"""EP5 mix: voice + air bed + SFX synced to words -> render-kit/mix_ep5.wav (-14 LUFS). HOOK part now; story SFX added after the hook is approved.
Usage (from videos/inside-money): ~/kokoro-tts/venv/bin/python ep5-bank-run/mix_ep5.py
SFX = the user's library (studio/public/sfx/user-*.wav, rebuilt by tools/import_user_sfx.py)."""
import json,subprocess,wave,numpy as np,tempfile,os
SR=48000;RK='render-kit';SFX=os.path.abspath('../../studio/public/sfx');TMP=tempfile.gettempdir()
def load(p):
    subprocess.run(['ffmpeg','-v','error','-y','-i',p,'-ac','1','-ar',str(SR),f'{TMP}/_l5.wav'],check=True)
    w=wave.open(f'{TMP}/_l5.wav');return np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)/32768
tl=json.load(open(f'{RK}/timeline_ep5.json'));WD=tl['words'];DUR=tl['dur']
def Wn(w,n=0):
    k=[x['s'] for x in WD if x['w'].lower().strip('?.,!')==w];return k[min(n,len(k)-1)]
voice=load('ep5-bank-run/vo.wav');N=int(DUR*SR);out=np.zeros(N,np.float32);out[:min(N,len(voice))]+=voice[:N]
rng=np.random.default_rng(5)
b=np.cumsum(rng.standard_normal(N).astype(np.float32));b-=np.convolve(b,np.ones(4800)/4800,'same');b/=np.abs(b).max();out+=b*.05   # air bed (never silent)
def put(sig,t,g):
    i=int(max(0,t)*SR);j=min(N,i+len(sig))
    if i<N:out[i:j]+=sig[:j-i]*g
S={k:load(f'{SFX}/user-{k}.wav') for k in['ting','whoosh','cash-register','pop','money','boom','wrong','shock']}
# ---- HOOK (same word anchors as ep5.html)
put(S['ting'],0.0,.45)                                   # ting at 0 s (channel rule)
put(S['pop'],.22,.25)                                    # $1,000 pops over Mike
put(S['whoosh'],Wn('withdraw')-.06,.28)                  # cut 1 -> over the shoulder
put(S['money'],Wn('withdraw')+.1,.25)                    # bundles slide
put(S['whoosh'],Wn('from')-.06,.3)                       # cut 2 -> vault
put(S['wrong'],Wn('once')+.05,.3)                        # red ? in the almost-empty vault
put(S['whoosh'],Wn('you',1)-.06,.28)                     # cut 3 -> Mike raises the cash
put(S['cash-register'],Wn('can')+.02,.3)
put(S['whoosh'],Wn('just')-.06,.3)                       # cut 4 -> the rush
put(S['boom'],Wn('everybody'),.45)                       # the shock: everybody at once
for i in range(5):put(S['pop'],Wn('just')+.1+i*.12,.15)  # $1,000 over each head
out=np.clip(out,-1,1)
with wave.open(f'{TMP}/mix_ep5_raw.wav','wb') as o:o.setnchannels(1);o.setsampwidth(2);o.setframerate(SR);o.writeframes((out*32767).astype(np.int16).tobytes())
subprocess.run(['ffmpeg','-v','error','-y','-i',f'{TMP}/mix_ep5_raw.wav','-af','loudnorm=I=-14:TP=-1.5:LRA=11','-ar','48000','-ac','2',f'{RK}/mix_ep5.wav'],check=True);print('ok',DUR)
