"""EP6 mix: voice + air bed + SFX synced to words -> render-kit/mix_ep6.wav (-14 LUFS).
Usage (from videos/inside-money): ~/kokoro-tts/venv/bin/python ep6-print-vs-debt/mix_ep6.py
Times match the beat table in render-kit/ep6.html (const T and KN)."""
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
S={k:load(f'{SFX}/user-{k}.wav') for k in['ting','whoosh','cash-register','pop','money','boom','money-transfer','wrong','aww','notif']}
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
# ---- story: whoosh on every camera flight, ting on key numbers, boom on shocks, cash on money moves
for c in [10.4,18.35,21.5,28.0,41.1,50.0,53.4,57.8,60.8]:put(S['whoosh'],c,.32)
put(S['pop'],5.78,.25);put(S['pop'],6.32,.2)                  # China, others light up
put(S['boom'],8.4,.4);put(S['ting'],9.0,.42)                  # the whole-debt tower, $40.6 trillion
put(S['ting'],11.74,.42)                                       # $119,000
put(S['pop'],13.72,.3);put(S['money'],13.96,.35);put(S['cash-register'],14.48,.3)   # print forty trillion
put(S['aww'],17.7,.28)                                         # buys less
put(S['pop'],19.7,.3)                                          # WHO IS OWED?
put(S['boom'],23.18,.35)                                       # foreign villain (red)
put(S['ting'],25.6,.4);put(S['cash-register'],27.0,.3)        # 3 of 4 dollars, inside America
put(S['money-transfer'],28.7,.25);put(S['pop'],29.5,.25)      # cash -> bond
for i in range(6):put(S['pop'],30.96+i*.12,.12)                # interest coins
put(S['notif'],32.58,.3);put(S['wrong'],34.26,.3)             # DUE, not really
put(S['money-transfer'],35.8,.25);put(S['money-transfer'],37.45,.25)   # new lender -> old lender
put(S['ting'],39.42,.3);put(S['pop'],40.46,.25)               # loop / replaced
put(S['pop'],43.82,.25);put(S['ting'],45.28,.4);put(S['boom'],47.4,.35);put(S['ting'],48.26,.4)   # scale tips, $1.8T, interest drop, $970B
put(S['pop'],51.3,.3);put(S['money'],51.54,.35)               # back to the press
for tt in [54.23,55.4,56.3]:put(S['pop'],tt,.3)                # booths
put(S['aww'],54.4,.2)                                          # weaker dollars
put(S['ting'],59.7,.4)                                         # people like you
put(S['ting'],61.2,.35);put(S['ting'],62.0,.35)               # A / B
out=np.clip(out,-1,1)
with wave.open(f'{TMP}/mix_ep6_raw.wav','wb') as o:o.setnchannels(1);o.setsampwidth(2);o.setframerate(SR);o.writeframes((out*32767).astype(np.int16).tobytes())
subprocess.run(['ffmpeg','-v','error','-y','-i',f'{TMP}/mix_ep6_raw.wav','-af','loudnorm=I=-14:TP=-1.5:LRA=11','-ar','48000','-ac','2',f'{RK}/mix_ep6.wav'],check=True);print('ok',DUR)
