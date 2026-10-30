"""EP2 v2 mix: voice + air bed + SFX synced to words/cuts -> render-kit/mix_ep2v2.wav (-14 LUFS).
Run from videos/inside-money: ~/kokoro-tts/venv/bin/python ep2-dig-200m/v2/mix_ep2v2.py"""
import json,subprocess,wave,numpy as np
SR=48000;RK='render-kit';SFX='/Users/User/benny-bucks/studio/public/sfx'
def load(p):
    subprocess.run(['ffmpeg','-v','error','-y','-i',p,'-ac','1','-ar',str(SR),'/tmp/_l.wav'],check=True)
    w=wave.open('/tmp/_l.wav');return np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)/32768
tl=json.load(open(f'{RK}/timeline_ep2v2.json'));WD=tl['words'];DUR=tl['dur']
def W(w,n=1):
    c=0
    for x in WD:
        if x['w'].lower()==w.lower():
            c+=1
            if c==n:return x['s']
    raise KeyError(w)
voice=load(f'{RK}/vo_ep2v2.wav');N=int(DUR*SR);out=np.zeros(N,np.float32);out[:min(N,len(voice))]+=voice[:N]
rng=np.random.default_rng(3)
b=np.cumsum(rng.standard_normal(N).astype(np.float32));b-=np.convolve(b,np.ones(4800)/4800,'same');b/=np.abs(b).max();out+=b*.08
def put(sig,t,g):
    i=int(max(0,t)*SR);j=min(N,i+len(sig))
    if i<N:out[i:j]+=sig[:j-i]*g
def clink():
    t=np.arange(int(.3*SR))/SR;y=sum(np.sin(2*np.pi*f*t)*np.exp(-t*k) for f,k in[(2300,28),(3900,35),(5200,45)])*.6+np.sin(2*np.pi*90*t)*np.exp(-t*25);return (y/np.abs(y).max()).astype(np.float32)
S={k:load(f'{SFX}/user-{k}.wav') for k in['ting','whoosh','cash-register','boom','money']}
LN=tl['lines'];L=lambda n:LN[n-1]['start'];LE=lambda n:LN[n-1]['end']
S.update({k:load(f'{SFX}/user-{k}.wav') for k in['notif','wrong','slap','pop','aww']})
def tone(d,f):
    t=np.arange(int(d*SR))/SR;return t,np.sin(2*np.pi*f*t)
def siren(d):      # police wail
    t=np.arange(int(d*SR))/SR;f=900+350*np.sin(2*np.pi*.9*t);ph=2*np.pi*np.cumsum(f)/SR;y=np.sin(ph)+.3*np.sin(2*ph);return (y/np.abs(y).max()*np.minimum(1,np.minimum(t*4,(d-t)*4))).astype(np.float32)
def alarm(d):      # vault alarm: beeping
    t=np.arange(int(d*SR))/SR;y=np.sign(np.sin(2*np.pi*880*t))*.5*(np.sin(2*np.pi*4.5*t)>0);return (y*np.minimum(1,(d-t)*4)).astype(np.float32)
def noise(d,k=30):
    x=rng.standard_normal(int(d*SR)).astype(np.float32);x=np.convolve(x,np.ones(k)/k,'same');return x/np.abs(x).max()
def heli(d):       # rotor thump
    t=np.arange(int(d*SR))/SR;env=np.exp(-((t*11)%1)*7);y=noise(d,80)*env;return (y*np.minimum(1,np.minimum(t*2,(d-t)*3))).astype(np.float32)
def hum(d):        # pump motor
    t=np.arange(int(d*SR))/SR;y=np.sin(2*np.pi*55*t)+.5*np.sin(2*np.pi*110*t)+.15*noise(d,20);return (y/np.abs(y).max()*np.minimum(1,np.minimum(t*5,(d-t)*3))).astype(np.float32)
def sub(d=.7):
    t=np.arange(int(d*SR))/SR;return (np.sin(2*np.pi*(55-25*t)*t)*np.exp(-t*4)).astype(np.float32)
T0,CYC=.35,1.25
dig=[(1.4,2.8),(4.37,7.3),(7.29,11.4),(L(7),L(8))]
for i in range(60):
    th=T0+i*CYC+.66*CYC
    if any(a<th<b for a,b in dig): put(clink(),th,.18 if th<L(7) else .26)
put(S['ting'],0.0,.5)                                          # ting at 0 s of the hook
put(S['cash-register'],W('$800')-.05,.45)
for c in [.75,2.55,4.3,6.2,L(5),L(8),L(11),L(12),L(13),L(14),L(15),L(18),L(20),L(21)+1.1,L(22),L(24)]: put(S['whoosh'],c-.12,.28)
for w in ['6,000','90','20','1971']: put(S['ting'],W(w)+.05,.45)
w=noise(LE(5)-L(4),12);put(w*np.linspace(.2,1,len(w)),L(4),.07)        # water hiss
put(hum(LE(6)-L(6)+.3),L(6)-.1,.12)
put(alarm(LE(10)-L(10)+.4),L(10),.1)
put(siren(LE(13)-L(11)+.6),L(11)-.3,.09)
put(heli(LE(12)-L(12)+.8),L(12)-.4,.25)
put(S['slap'],L(14)+.42,.4)
put(S['boom'],W('twist'),.55);put(sub(),W('twist'),.55)
put(S['pop'],L(16)+.2,.35)
put(S['notif'],L(19),.4);put(S['money'],L(19)+.6,.4)
put(S['wrong'],W('zero'),.4);put(S['aww'],W('muddy')+.3,.3)
out=np.clip(out,-1,1)
with wave.open('/tmp/mix_ep2v2_raw.wav','wb') as o:o.setnchannels(1);o.setsampwidth(2);o.setframerate(SR);o.writeframes((out*32767).astype(np.int16).tobytes())
subprocess.run(['ffmpeg','-v','error','-y','-i','/tmp/mix_ep2v2_raw.wav','-af','loudnorm=I=-14:TP=-1.5:LRA=11','-ar','48000','-ac','2',f'{RK}/mix_ep2v2.wav'],check=True);print('ok',DUR)
