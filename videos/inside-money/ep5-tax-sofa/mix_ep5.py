"""EP5 mix: voice + air bed + SFX synced to words -> render-kit/mix_ep5.wav (-14 LUFS). Hook SFX only so far (story SFX added after hook approval).
Usage (from videos/inside-money): ~/kokoro-tts/venv/bin/python ep5-tax-sofa/mix_ep5.py"""
import json,subprocess,wave,numpy as np,tempfile
SR=48000;RK='render-kit';SFX='/Users/User/benny-bucks/studio/public/sfx';TMP=tempfile.gettempdir()
def load(p):
    subprocess.run(['ffmpeg','-v','error','-y','-i',p,'-ac','1','-ar',str(SR),f'{TMP}/_l5.wav'],check=True)
    w=wave.open(f'{TMP}/_l5.wav');return np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)/32768
tl=json.load(open(f'{RK}/timeline_ep5.json'));WD=tl['words'];DUR=tl['dur']
def Wn(w,n=0):
    k=[x['s'] for x in WD if x['w'].lower().strip('?.,!')==w.lower()];return k[min(n,len(k)-1)]
voice=load('ep5-tax-sofa/vo.wav');N=int(DUR*SR);out=np.zeros(N,np.float32);out[:min(N,len(voice))]+=voice[:N]
rng=np.random.default_rng(5)
b=np.cumsum(rng.standard_normal(N).astype(np.float32));b-=np.convolve(b,np.ones(4800)/4800,'same');b/=np.abs(b).max();out+=b*.05   # air bed
def put(sig,t,g):
    i=int(max(0,t)*SR);j=min(N,i+len(sig))
    if i<N:out[i:j]+=sig[:j-i]*g
S={k:load(f'{SFX}/user-{k}.wav') for k in['ting','whoosh','cash-register','pop','money','boom']}
put(S['ting'],0.0,.45)                                   # ting at 0 s (channel rule)
put(S['cash-register'],Wn('$40,000')+.04,.32)            # $40,000 pops
for tb in [.25,.55,.85,1.15]:put(S['pop'],tb+.45,.16)    # each bundle lands in the sofa
put(S['money'],1.3,.15)
put(S['whoosh'],1.12-.06,.24);put(S['whoosh'],2.68-.06,.3);put(S['whoosh'],4.4-.06,.26)   # cuts
put(S['boom'],Wn('evasion'),.42)                          # "tax evasion"
pk=np.abs(out).max();out/=max(1,pk/.95)
pcm=(out*32767).astype(np.int16);w=wave.open(f'{TMP}/_m5.wav','wb');w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes(pcm.tobytes());w.close()
subprocess.run(['ffmpeg','-v','error','-y','-i',f'{TMP}/_m5.wav','-af','loudnorm=I=-14:TP=-1.5:LRA=11','-ar','48000','-ac','2',f'{RK}/mix_ep5.wav'],check=True);print('mix ok')
