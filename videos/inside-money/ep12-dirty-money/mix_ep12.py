"""EP12 mix (hook only for now): voice + air bed + SFX synced to words/cuts -> render-kit/mix_ep12.wav (-11 LUFS).
Usage (from videos/inside-money): ~/kokoro-tts/venv/bin/python ep12-dirty-money/mix_ep12.py"""
import json,subprocess,wave,numpy as np,tempfile
SR=48000;RK='render-kit';SFX='/Users/User/benny-bucks/studio/public/sfx';TMP=tempfile.gettempdir()
def load(p):
    subprocess.run(['ffmpeg','-v','error','-y','-i',p,'-ac','1','-ar',str(SR),f'{TMP}/_l12.wav'],check=True)
    w=wave.open(f'{TMP}/_l12.wav');return np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)/32768
tl=json.load(open(f'{RK}/timeline_ep12.json'));WD=tl['words'];DUR=tl['dur']
import re
W=lambda w,n=0:[x['s'] for x in WD if re.sub(r'[^a-z0-9]','',x['w'].lower())==w][n]
voice=load('ep12-dirty-money/vo.wav');N=int(DUR*SR);out=np.zeros(N,np.float32);out[:min(N,len(voice))]+=voice[:N]
rng=np.random.default_rng(12);b=np.cumsum(rng.standard_normal(N).astype(np.float32));b-=np.convolve(b,np.ones(4800)/4800,'same');b/=np.abs(b).max();out+=b*.05
def put(sig,t,g):
    i=int(max(0,t)*SR);j=min(N,i+len(sig))
    if i<N:out[i:j]+=sig[:j-i]*g
def cut(sig,dur,fade=.12):
    n=int(dur*SR);x=sig[:n].copy();f=int(min(fade,dur/2)*SR);x[-f:]*=np.linspace(1,0,f);return x
S={k:load(f'{SFX}/user-{k}.wav') for k in['ting','whoosh','cash-register','slap','money','boom','pop','timer','shock','notif','wrong','horn']}
put(cut(S['ting'],.3,.15),0.0,.14)                                   # ting at 0 s
put(cut(S['slap'],.25),W('criminal')+.55,.35);put(cut(S['slap'],.25),W('washed')+.5,.3)   # the two dirty stacks land in the drum
put(cut(S['whoosh'],.35),W('dirty')-.3,.25)                          # door slams, camera pushes in
put(cut(S['timer'],.6,.2),W('dirty')-.05,.2)                         # machine spinning
put(cut(S['pop'],.25),W('then')+.08,.35);put(cut(S['money'],.5),W('then')+.2,.3)   # door pops open, clean money flies into the bag
put(cut(S['whoosh'],.45),W('deposited')+.2,.4)                       # pull out of the room
put(cut(S['whoosh'],.45),W('bank')-.05,.3)                           # reveal the bank
put(cut(S['notif'],.35),W('catch')-.05,.35)                          # CCTV beep, red light
put(cut(S['boom'],.9,.3),W('catch')-.02,.4)
# ---- story ----
put(cut(S['whoosh'],.4),4.85,.35)                                    # through the bank doors
put(cut(S['cash-register'],.6),W('50000')+.9,.4)                    # straps on the counter
put(cut(S['ting'],.35),W('over')+.05,.3);put(cut(S['boom'],.7,.3),W('over'),.25)
put(cut(S['timer'],.6,.2),W('files'),.18);put(cut(S['pop'],.2),W('name'),.3);put(cut(S['pop'],.2),W('address'),.3);put(cut(S['ting'],.3),W('cash',2),.3)
put(cut(S['whoosh'],.45),14.8,.35);put(cut(S['whoosh'],.4),W('mikes')-.1,.25)
put(cut(S['pop'],.25),W('customers')-.25,.3)
put(cut(S['slap'],.3),W('masked')+.4,.4);put(cut(S['cash-register'],.6),W('register')-.05,.4)
put(cut(S['wrong'],.5),W('no'),.35)
put(cut(S['money'],.6),W('bag')+.1,.3)
put(cut(S['whoosh'],.5),W('heres')+.2,.35)
for i in range(3):put(cut(S['pop'],.2),W('patterns')+i*.15,.3)
put(cut(S['whoosh'],.4),W('three')-.15,.3);put(cut(S['ting'],.4),W('three'),.35)
put(cut(S['notif'],.4),W('red'),.4);put(cut(S['boom'],.8,.3),W('red'),.4)
for i in range(4):put(cut(S['pop'],.2),W('every')+i*.15,.25)
put(cut(S['whoosh'],.4),W('splitting'),.3);put(cut(S['boom'],.9,.3),W('crime'),.5)
put(cut(S['whoosh'],.5),46.5,.35)
put(cut(S['timer'],.6,.2),W('behind'),.18);put(cut(S['whoosh'],.35),W('quiet'),.3)
put(cut(S['ting'],.35),W('prove'),.25)
put(cut(S['whoosh'],.45),54.0,.35)
put(cut(S['horn'],.5),W('stops')-.1,.25)
put(cut(S['slap'],.25),W('agents')+.4,.3);put(cut(S['boom'],.8,.3),W('irs'),.45)
put(cut(S['shock'],.6),W('straight')+.2,.4)
put(cut(S['ting'],.35),W('why'),.35);put(cut(S['pop'],.25),W('part'),.3)
out/=max(1,np.abs(out).max()/.95)
wave_out=f'{TMP}/_m12.wav';w=wave.open(wave_out,'wb');w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes((out*32767).astype(np.int16).tobytes());w.close()
subprocess.run(['ffmpeg','-v','error','-y','-i',wave_out,'-af','loudnorm=I=-11:TP=-1:LRA=7','-ar',str(SR),'-ac','2',f'{RK}/mix_ep12.wav'],check=True);print('mix_ep12.wav',DUR)
