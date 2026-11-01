"""EP5 mix: voice + air bed + SFX synced to words -> render-kit/mix_ep5.wav (-14 LUFS).
Story beats were authored on the v1 voice; O() maps a v1 time to the current voice (same map as ep5.html).
Usage (from videos/inside-money): ~/kokoro-tts/venv/bin/python ep5-tax-sofa/mix_ep5.py"""
import json,subprocess,wave,numpy as np,tempfile
SR=48000;RK='render-kit';SFX='/Users/User/benny-bucks/studio/public/sfx';TMP=tempfile.gettempdir()
def load(p):
    subprocess.run(['ffmpeg','-v','error','-y','-i',p,'-ac','1','-ar',str(SR),f'{TMP}/_l5.wav'],check=True)
    w=wave.open(f'{TMP}/_l5.wav');return np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)/32768
tl=json.load(open(f'{RK}/timeline_ep5.json'));WD=tl['words'];DUR=tl['dur']
OLDL=[0,4.39,7.59,10.72,12.66,16.57,18.96,21.71,25.1,31.69,36.02,38.11,40.81,42.76,46.25,48.28,51.98,54.04,57.09,59.03,61.6];NEWL=tl['lines']+[DUR]
def O(t):
    i=0
    while i<len(OLDL)-2 and t>=OLDL[i+1]:i+=1
    return NEWL[i]+(t-OLDL[i])*(NEWL[i+1]-NEWL[i])/(OLDL[i+1]-OLDL[i])
def Wn(w,n=0):
    k=[x['s'] for x in WD if x['w'].lower().strip('?.,!')==w.lower()];return k[min(n,len(k)-1)]
voice=load('ep5-tax-sofa/vo.wav');N=int(DUR*SR);out=np.zeros(N,np.float32);out[:min(N,len(voice))]+=voice[:N]
rng=np.random.default_rng(5)
b=np.cumsum(rng.standard_normal(N).astype(np.float32));b-=np.convolve(b,np.ones(4800)/4800,'same');b/=np.abs(b).max();out+=b*.05   # air bed
def put(sig,t,g):
    i=int(max(0,t)*SR);j=min(N,i+len(sig))
    if i<N:out[i:j]+=sig[:j-i]*g
S={k:load(f'{SFX}/user-{k}.wav') for k in['ting','whoosh','cash-register','pop','money','boom','slap','wrong','notif','money-transfer','aww']}
# hook
put(S['ting'],0.0,.45);put(S['cash-register'],Wn('$40,000')+.04,.32)
for i in range(20):put(S['pop'],O(.55+i*.05+.3),.07)                     # straps landing in the sofa
put(S['money'],O(.6),.18);put(S['boom'],Wn('evasion'),.42)
# camera flights between scenes (whoosh at every transition)
for c in [2.68,4.4,7.47,10.66,12.6,16.5,18.9,21.65,25.04,31.63,35.95,38.05,40.75,42.66,46.15,48.22,51.92,53.98,57.03,58.97]:put(S['whoosh'],O(c)-.4,.2)
for w in ['bank','car','vacations']:put(S['ting'],Wn(w),.25)
put(S['money-transfer'],O(10.85),.3);put(S['boom'],O(12.66+.25),.4)     # cash seized, bars slam
put(S['boom'],Wn('75%'),.3);put(S['ting'],Wn('five'),.35)
for k in range(3):put(S['slap'],Wn('knock')+k*.22,.22)                   # knock knock knock
put(S['pop'],Wn('same'),.2)
for i in range(6):put(S['cash-register' if i==0 else 'pop'],O(26.0+i*.5+.55),.2)
put(S['ting'],Wn('$24,500'),.4);put(S['ting'],Wn('$7,500'),.4);put(S['cash-register'],Wn('deducts'),.3);put(S['ting'],Wn('20%'),.4)
put(S['pop'],Wn('same',1),.25);put(S['pop'],Wn('same',2),.25);put(S['wrong'],Wn('totally'),.2)
put(S['boom'],Wn('crime'),.4);put(S['ting'],Wn('law'),.35);put(S['ting'],Wn('avoidance'),.3)
put(S['boom'],Wn('knock',1),.45);put(S['wrong'],Wn('knock',1)+.2,.25)
put(S['aww'],Wn('losing'),.2);put(S['notif'],Wn('reported'),.35);put(S['ting'],O(57.1),.35)
pk=np.abs(out).max();out/=max(1,pk/.95)
pcm=(out*32767).astype(np.int16);w=wave.open(f'{TMP}/_m5.wav','wb');w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes(pcm.tobytes());w.close()
subprocess.run(['ffmpeg','-v','error','-y','-i',f'{TMP}/_m5.wav','-af','loudnorm=I=-14:TP=-1.5:LRA=11','-ar','48000','-ac','2',f'{RK}/mix_ep5.wav'],check=True);print('mix ok')
