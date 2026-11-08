"""EP6 mix: voice + air bed + FEW SFX (hook: ting 0 s, one whoosh on "Iran", one cash on "$0.11") -> render-kit/mix_ep6.wav (-14 LUFS).
Usage (from videos/inside-money): ~/kokoro-tts/venv/bin/python ep6-gas-iran-usa/mix_ep6.py"""
import json,subprocess,wave,numpy as np,tempfile
SR=48000;RK='render-kit';SFX='/Users/User/benny-bucks/studio/public/sfx';TMP=tempfile.gettempdir()
def load(p):
    subprocess.run(['ffmpeg','-v','error','-y','-i',p,'-ac','1','-ar',str(SR),f'{TMP}/_l6.wav'],check=True)
    w=wave.open(f'{TMP}/_l6.wav');return np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)/32768
tl=json.load(open(f'{RK}/timeline_ep6.json'));WD=tl['words'];DUR=tl['dur']
def Wn(w,n=0):
    k=[x['s'] for x in WD if x['w'].lower().strip('?.,!')==w];return k[min(n,len(k)-1)]
voice=load('ep6-gas-iran-usa/vo.wav')
# user 2026-11-08: first word "Trump" clearer + louder: presence EQ + ~+6 dB on 0..'pays', smooth 30 ms fade back
subprocess.run(['ffmpeg','-v','error','-y','-i','ep6-gas-iran-usa/vo.wav','-t','0.4','-af','highpass=f=110,equalizer=f=3200:t=q:w=1.2:g=6,equalizer=f=250:t=q:w=1:g=-3','-ac','1','-ar',str(SR),f'{TMP}/_tr.wav'],check=True)
w=wave.open(f'{TMP}/_tr.wav');tr=np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)/32768
pk=np.abs(voice[:int(2*SR)]).max();tr=np.tanh(tr*2.6/pk)*pk*1.05   # louder than the next words, soft-clipped to the voice peak
e=int((Wn('pays')+.0)*SR);f=int(.03*SR);m=np.zeros(len(voice),np.float32);m[:e]=1;m[e:e+f]=np.linspace(1,0,f)
voice=voice.copy();n=min(len(tr),e+f);voice[:n]=voice[:n]*(1-m[:n])+tr[:n]*m[:n]
N=int(DUR*SR);out=np.zeros(N,np.float32);out[:min(N,len(voice))]+=voice[:N]
rng=np.random.default_rng(6)
b=np.cumsum(rng.standard_normal(N).astype(np.float32));b-=np.convolve(b,np.ones(4800)/4800,'same');b/=np.abs(b).max();out+=b*.05
def put(sig,t,g):
    i=int(max(0,t)*SR);j=min(N,i+len(sig))
    if i<N:out[i:j]+=sig[:j-i]*g
S={k:load(f'{SFX}/user-{k}.wav') for k in['ting','whoosh','cash-register']}
put(S['ting'],0.0,.28)                       # ting at 0 s (channel rule)
put(S['whoosh'],Wn('iran')-.25,.32)          # camera flies US -> Iran
put(S['cash-register'],Wn('$0')+.03,.3)      # $0.11 key number
# story (few SFX): whoosh on each change of place, one cash on the $1 import price, a ting on 'doubled'
for c in [7.38,22.96,27.82,28.9,35.92,40.5,45.76,48.34,52.34,Wn('so',3),Wn('which')]:put(S['whoosh'],c-.12,.2)
put(S['cash-register'],Wn('$1')+.03,.26)
put(S['ting'],Wn('doubled')+.02,.26)
out=np.clip(out,-1,1)
with wave.open(f'{TMP}/mix_ep6_raw.wav','wb') as o:o.setnchannels(1);o.setsampwidth(2);o.setframerate(SR);o.writeframes((out*32767).astype(np.int16).tobytes())
subprocess.run(['ffmpeg','-v','error','-y','-i',f'{TMP}/mix_ep6_raw.wav','-af','loudnorm=I=-14:TP=-1.5:LRA=11','-ar','48000','-ac','2',f'{RK}/mix_ep6.wav'],check=True);print('ok',DUR)
