"""EP5 mix: voice + air bed + SFX synced to words and to the 3D labels/camera keys of ep5.html -> render-kit/mix_ep5.wav (-14 LUFS).
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
for i in range(4):put(S['pop'],Wn('everybody')+.55+i*.1,.15)   # $1,000 over each customer
# ---- STORY (times = the 3D labels / camera keys in ep5.html)
put(S['pop'],5.88,.25)                                           # $1,000 in your account
put(S['money'],6.0,.22)                                          # Mike hands the cash over
put(S['pop'],8.72,.2)                                            # MIKE box in the vault
put(S['wrong'],10.36,.3)                                         # "No." + red X
put(S['whoosh'],10.8,.28);put(S['money'],11.0,.22)               # the bills leave the vault, out the door
put(S['whoosh'],11.4,.22)
put(S['cash-register'],12.95,.28)                                # house SOLD
put(S['ting'],15.05,.3)                                          # bakery OPEN
put(S['whoosh'],14.85,.28)                                       # camera rushes back into the bank
put(S['pop'],16.72,.25)                                          # balance $1,000
put(S['wrong'],17.95,.3)                                         # the cash isn't there (red ?)
put(S['whoosh'],18.8,.3)                                         # out to the street
for l in range(8):put(S['pop'],20.15+l*.22,.1)                   # the deposit tower grows layer by layer
put(S['ting'],20.5,.35)                                          # $20 trillion
put(S['pop'],24.55,.2);put(S['ting'],24.62,.3)                   # $2.5 trillion
put(S['ting'],26.64,.3)                                          # 1 : 8
put(S['whoosh'],28.6,.3)                                         # towers sink, the queue forms
put(S['wrong'],31.95,.3)                                         # "the vault runs empty"
put(S['whoosh'],32.8,.28)
put(S['boom'],37.36,.45)                                         # $42 billion
put(S['whoosh'],39.5,.25)
put(S['boom'],41.68,.4)                                          # 81 %
put(S['boom'],44.46,.5);put(S['shock'],44.5,.3)                  # CLOSED
put(S['whoosh'],46.6,.22)
put(S['ting'],49.7,.35)                                          # the FDIC shield
put(S['cash-register'],50.72,.3)                                 # $250,000
put(S['pop'],52.8,.2);put(S['money'],53.3,.25)                   # doors open, the bills circulate
put(S['whoosh'],55.4,.3)                                         # camera rises over the neighbourhood
put(S['whoosh'],58.9,.28)                                        # ...and drops in on Mike
put(S['ting'],61.92,.4)                                          # YES or NO?
out=np.clip(out,-1,1)
with wave.open(f'{TMP}/mix_ep5_raw.wav','wb') as o:o.setnchannels(1);o.setsampwidth(2);o.setframerate(SR);o.writeframes((out*32767).astype(np.int16).tobytes())
subprocess.run(['ffmpeg','-v','error','-y','-i',f'{TMP}/mix_ep5_raw.wav','-af','loudnorm=I=-14:TP=-1.5:LRA=11','-ar','48000','-ac','2',f'{RK}/mix_ep5.wav'],check=True);print('ok',DUR)
