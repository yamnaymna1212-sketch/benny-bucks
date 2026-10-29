import json,subprocess,wave,numpy as np,sys
SR=48000
def load(p):
    subprocess.run(['ffmpeg','-v','error','-y','-i',p,'-ac','1','-ar',str(SR),'/tmp/_l.wav'],check=True)
    w=wave.open('/tmp/_l.wav');return np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)/32768
tl=json.load(open('timeline2.json'));WD=tl['words'];DUR=tl['dur']
def W(w,n=1):
    c=0
    for x in WD:
        if x['w'].lower().strip('.,?')==w:
            c+=1
            if c==n:return x
voice=load(sys.argv[1]);N=int(DUR*SR);out=np.zeros(N,np.float32);out[:min(N,len(voice))]+=voice[:N]
rng=np.random.default_rng(3)
w=rng.standard_normal(N).astype(np.float32);b=np.cumsum(w);b-=np.convolve(b,np.ones(4800)/4800,'same');b/=np.abs(b).max()
out+=b*.11
def put(sig,t,g):
    i=int(max(0,t)*SR);j=min(N,i+len(sig))
    if i<N:out[i:j]+=sig[:j-i]*g
def noise_sweep(d,a0,a1,env):
    n=int(d*SR);x=rng.standard_normal(n).astype(np.float32);a=np.linspace(a0,a1,n);y=np.empty_like(x);s=0.
    for i in range(n):s+=a[i]*(x[i]-s);y[i]=s
    return y*env(np.linspace(0,1,n))/np.abs(y).max()
whoosh=lambda d=.55:noise_sweep(d,.02,.25,lambda u:np.sin(np.pi*u)**2)
riser=lambda d=.7:noise_sweep(d,.01,.35,lambda u:u**2.5)
def sub(d=.6):
    t=np.arange(int(d*SR))/SR;return (np.sin(2*np.pi*(55-25*t)*t)*np.exp(-t*5)).astype(np.float32)
def clink():
    t=np.arange(int(.35*SR))/SR;y=sum(np.sin(2*np.pi*f*t)*np.exp(-t*k) for f,k in[(3200,18),(4700,24),(6100,30)]);return (y/np.abs(y).max()).astype(np.float32)
S={k:load(f'/home/user/benny-bucks/studio/public/sfx/user-{k}.wav') for k in['ting','whoosh','money','money-transfer','pop','boom','cash-register']}
put(S['ting'],0,.5);put(S['money'],.35,.4);put(clink(),W('vault')['s']+.1,.3)
for t in [W('vault')['s']-.2,W('most',2)['s']+.1,W('so')['s'],W('thousand')['s']+.2,W('car')['s']-.3,W('car',2)['s'],W('lends')['s']-.2,W('moving')['s']-.3]:put(whoosh(),t,.3)
t2=W('most',2)['s'];put(riser(),t2-.7,.35);put(S['boom'],W("isn't")['s'],.55);put(sub(),W("isn't")['s'],.6)
put(S['ting'],W('zero')['s'],.65);put(sub(),W('zero')['s'],.5)
put(S['money-transfer'],W('loan')['s'],.45);put(S['cash-register'],W('deposits')['s'],.35);put(S['pop'],W('again')['s'],.45)
put(S['ting'],W('moving')['s']+.2,.4)
out=np.clip(out,-1,1)
with wave.open('mix2_raw.wav','wb') as o:o.setnchannels(1);o.setsampwidth(2);o.setframerate(SR);o.writeframes((out*32767).astype(np.int16).tobytes())
subprocess.run(['ffmpeg','-v','error','-y','-i','mix2_raw.wav','-af','loudnorm=I=-14:TP=-1.5:LRA=11','-ar','48000','-ac','2','mix2.wav'],check=True);print('ok',DUR)
