import json,subprocess,wave,numpy as np,sys
SR=48000
def load(p):
    subprocess.run(['ffmpeg','-v','error','-y','-i',p,'-ac','1','-ar',str(SR),'/tmp/_l.wav'],check=True)
    w=wave.open('/tmp/_l.wav');return np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)/32768
tl=json.load(open('timeline.json'));P=[p['start'] for p in tl['phrases']];DUR=tl['dur']
voice=load(sys.argv[1]);N=int(DUR*SR);out=np.zeros(N,np.float32)
out[:min(N,len(voice))]+=voice[:N]
rng=np.random.default_rng(3)
def lp(x,a):  # one-pole lowpass
    y=np.empty_like(x);s=0.
    for i in range(len(x)):s+=a*(x[i]-s);y[i]=s
    return y
# ambience bed (outdoor air, not music), continuous so there is never silence
w=rng.standard_normal(N).astype(np.float32);b=np.cumsum(w);b-=np.convolve(b,np.ones(4800)/4800,'same');b/=np.abs(b).max()
amb=b*.1+lp(w[:N],.02)*.06
out+=amb.astype(np.float32)
def put(sig,t,g):
    i=int(t*SR);j=min(N,i+len(sig))
    if i<N:out[i:j]+=sig[:j-i]*g
def whoosh(d=.5):
    n=int(d*SR);x=rng.standard_normal(n).astype(np.float32);env=np.sin(np.linspace(0,np.pi,n))**2
    a=np.linspace(.02,.25,n);y=np.empty_like(x);s=0.
    for i in range(n):s+=a[i]*(x[i]-s);y[i]=s
    return y*env/np.abs(y).max()
def clink():
    t=np.arange(int(.35*SR))/SR;y=sum(np.sin(2*np.pi*f*t)*np.exp(-t*k) for f,k in[(3200,18),(4700,24),(6100,30)])
    return (y/np.abs(y).max()).astype(np.float32)
S={k:load(f'/home/user/benny-bucks/studio/public/sfx/user-{k}.wav') for k in['ting','whoosh','money','money-transfer','pop','boom','cash-register']}
# camera-move whooshes (synced to camera keys) + user's sound library
put(S['ting'],0.0,.55)
for t in [P[1]-.05,P[1]+(P[2]-P[1])*.55,P[2]+.1,P[3]-.1,P[4]-.1,P[5]-.1,P[6]-.05,P[7]+.2]:put(whoosh(.55),t,.32)
put(S['money'],P[1]+.35,.5)              # bundle appears at ATM
put(clink(),P[1]+.4,.25)
put(S['money-transfer'],P[2]-.25,.45)    # lands in vault
for i in range(3):put(S['pop'],P[3+i]+.05,.5);put(clink(),P[3+i]+.08,.2)
put(S['boom'],tl['zeroAt']-.02,.6);put(whoosh(.7),DUR-.75,.35);put(S['ting'],tl['zeroAt']+.02,.6)
out=np.clip(out,-1,1)
with wave.open('mix_raw.wav','wb') as o:o.setnchannels(1);o.setsampwidth(2);o.setframerate(SR);o.writeframes((out*32767).astype(np.int16).tobytes())
subprocess.run(['ffmpeg','-v','error','-y','-i','mix_raw.wav','-af','loudnorm=I=-14:TP=-1.5:LRA=11','-ar','48000','-ac','2','mix.wav'],check=True)
print('mix ok',DUR)
