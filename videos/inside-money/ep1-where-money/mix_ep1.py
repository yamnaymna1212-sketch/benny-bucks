# Soft, consistent sound design: air bed (never silent) + quiet whooshes on camera moves + few accents.
import json,subprocess,wave,numpy as np,sys,os
SR=48000;HERE=os.path.dirname(os.path.abspath(__file__));SFX=sys.argv[2] if len(sys.argv)>2 else os.path.join(HERE,'../../../studio/public/sfx')
def load(p):
    subprocess.run(['ffmpeg','-v','error','-y','-i',p,'-ac','1','-ar',str(SR),'/tmp/_l.wav'],check=True)
    w=wave.open('/tmp/_l.wav');return np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)/32768
tl=json.load(open(os.path.join(HERE,'timeline.json')));A=tl['A'];DUR=tl['dur']
voice=load(os.path.join(HERE,'voice.wav'));N=int(DUR*SR);out=np.zeros(N,np.float32);out[:min(N,len(voice))]+=voice[:N]
rng=np.random.default_rng(3)
w=rng.standard_normal(N).astype(np.float32);b=np.cumsum(w);b-=np.convolve(b,np.ones(4800)/4800,'same');b/=np.abs(b).max();out+=b*.07
def put(sig,t,g):
    i=int(max(0,t)*SR);j=min(N,i+len(sig))
    if i<N:out[i:j]+=sig[:j-i]*g
def sweep(d,a0,a1,env):
    n=int(d*SR);x=rng.standard_normal(n).astype(np.float32);a=np.linspace(a0,a1,n);y=np.empty_like(x);s=0.
    for i in range(n):s+=a[i]*(x[i]-s);y[i]=s
    return y*env(np.linspace(0,1,n))/np.abs(y).max()
whoosh=lambda d=.6:sweep(d,.015,.16,lambda u:np.sin(np.pi*u)**2)
rumble=lambda d:sweep(d,.004,.01,lambda u:np.minimum(1,np.minimum(u*6,(1-u)*6)))
def sub(d=.7):
    t=np.arange(int(d*SR))/SR;return (np.sin(2*np.pi*(52-22*t)*t)*np.exp(-t*4.5)).astype(np.float32)
S={k:load(f'{SFX}/user-{k}.wav') for k in['ting','money','pop','money-transfer']}
put(S['ting'],0,.28)
for k in['lets','yes','so1','most','when','that','lends','since','wait','banks','fed1','own','so2','insured','cta']:put(whoosh(),A[k]-.25,.16)
put(sub(),A['vault1']+1.4,.32)                       # "you're wrong"
put(S['money'],A['when']+.3,.2);put(S['money-transfer'],A['changes']+.3,.2)
for k in['car','home','biz']:put(S['pop'],A[k]+.15,.18)
put(sub(),A['zero'],.3);put(S['ting'],A['zero']+.05,.28)
put(rumble(A['fed1']+.9-A['truck']+.6),A['truck']-.6,.22)
put(S['ting'],A['insured']+.6,.22);put(S['pop'],A['cta']+1.0,.15)
out=np.clip(out,-1,1)
raw=os.path.join(HERE,'mix_raw.wav')
with wave.open(raw,'wb') as o:o.setnchannels(1);o.setsampwidth(2);o.setframerate(SR);o.writeframes((out*32767).astype(np.int16).tobytes())
subprocess.run(['ffmpeg','-v','error','-y','-i',raw,'-af','loudnorm=I=-14:TP=-1.5:LRA=11','-ar','48000','-ac','2',os.path.join(HERE,'mix.wav')],check=True);os.remove(raw);print('mix ok',DUR)
