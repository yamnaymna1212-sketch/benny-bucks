"""EP6 mix: voice + air bed + SFX synced to words -> render-kit/mix_ep6.wav (-14 LUFS). Hook SFX for now; story SFX after hook approval.
Usage (from videos/inside-money): ~/kokoro-tts/venv/bin/python ep6-found-10m/mix_ep6.py"""
import json,subprocess,wave,numpy as np,tempfile
SR=48000;RK='render-kit';SFX='/Users/User/benny-bucks/studio/public/sfx';TMP=tempfile.gettempdir()
def load(p):
    subprocess.run(['ffmpeg','-v','error','-y','-i',p,'-ac','1','-ar',str(SR),f'{TMP}/_l6.wav'],check=True)
    w=wave.open(f'{TMP}/_l6.wav');return np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)/32768
tl=json.load(open(f'{RK}/timeline_ep6.json'));WD=tl['words'];DUR=tl['dur']
def Wn(w,n=0):
    k=[x['s'] for x in WD if x['w'].lower().strip('?.,!')==w.lower()];return k[min(n,len(k)-1)]
voice=load('ep6-found-10m/vo.wav');N=int(DUR*SR);out=np.zeros(N,np.float32);out[:min(N,len(voice))]+=voice[:N]
rng=np.random.default_rng(6)
b=np.cumsum(rng.standard_normal(N).astype(np.float32));b-=np.convolve(b,np.ones(4800)/4800,'same');b/=np.abs(b).max();out+=b*.05
def put(sig,t,g):
    i=int(max(0,t)*SR);j=min(N,i+len(sig))
    if i<N:out[i:j]+=sig[:j-i]*g
S={k:load(f'{SFX}/user-{k}.wav') for k in['ting','whoosh','cash-register','slap','money','boom','wow','yeah','notif']}
put(S['ting'],0.0,.45)
put(S['slap'],Wn('finds')-.02,.35);put(S['boom'],Wn('finds')+.02,.3)    # shovel hits the trunk, lid bursts
put(S['cash-register'],Wn('$10')+.05,.32);put(S['money'],Wn('$10')+.1,.18)
put(S['whoosh'],1.3,.3);put(S['whoosh'],2.05,.3)                         # out of the pit / back into the room
put(S['yeah'],Wn('happy'),.28)
put(S['notif'],Wn('regret'),.32);put(S['boom'],Wn('regret')+.05,.3)
put(S['pop'] if 'pop' in S else S['ting'],Wn('danny'),.25)
pk=np.abs(out).max();out/=max(1,pk/.95)
pcm=(out*32767).astype(np.int16);w=wave.open(f'{TMP}/_m6.wav','wb');w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes(pcm.tobytes());w.close()
subprocess.run(['ffmpeg','-v','error','-y','-i',f'{TMP}/_m6.wav','-af','loudnorm=I=-14:TP=-1.5:LRA=11','-ar','48000','-ac','2',f'{RK}/mix_ep6.wav'],check=True);print('mix ok')
