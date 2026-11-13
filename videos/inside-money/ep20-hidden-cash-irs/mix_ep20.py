"""EP20 mix: one-take voice + air bed + few SFX on the words (hook: ting 0, cash on the amount, sirens + whoosh on the raid, boom on 'tax evasion').
Usage (from videos/inside-money): python3 ep20-hidden-cash-irs/mix_ep20.py"""
import json,re,subprocess,wave,os,numpy as np,tempfile
SR=48000;RK='render-kit';SFX=os.path.join(os.path.dirname(os.path.abspath(__file__)),'../../../studio/public/sfx');TMP=tempfile.gettempdir()
def load(p):
    subprocess.run(['ffmpeg','-v','error','-y','-i',p,'-ac','1','-ar',str(SR),f'{TMP}/_l20.wav'],check=True)
    w=wave.open(f'{TMP}/_l20.wav');return np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)/32768
tl=json.load(open(f'{RK}/timeline_ep20.json'));WD=tl['words'];DUR=tl['dur']
n=lambda x:re.sub(r'[^a-z0-9]','',x.lower())
def T(ph,occ=0):
    p=[n(x) for x in ph.split()];c=0
    for i in range(len(WD)-len(p)+1):
        if all(n(WD[i+j]['w'])==w for j,w in enumerate(p)):
            if c==occ:return WD[i]['s']
            c+=1
    raise SystemExit('phrase not found: '+ph)
voice=load('ep20-hidden-cash-irs/vo_full.wav')
N=int(DUR*SR);out=np.zeros(N,np.float32);out[:min(N,len(voice))]+=voice[:N]
rng=np.random.default_rng(20);b=np.cumsum(rng.standard_normal(N).astype(np.float32));b-=np.convolve(b,np.ones(4800)/4800,'same');b/=np.abs(b).max();out+=b*.03
def put(sig,t,g):
    i=int(max(0,t)*SR);j=min(N,i+len(sig))
    if i<N:out[i:j]+=sig[:j-i]*g
def cut(sig,dur,fade=.12):
    k=int(dur*SR);x=sig[:k].copy();f=int(min(fade,dur/2)*SR);x[-f:]*=np.linspace(1,0,f);return x
S={k:load(f'{SFX}/user-{k}.wav') for k in['ting','whoosh','cash-register','boom','money']}
# US police/IRS siren (synthetic, none in the user library): 'wail' rising-falling + 'yelp' at the end, two cars slightly detuned
def siren(d,yelp_at):
    tt=np.arange(int(d*SR))/SR;f=np.where(tt<yelp_at,750+650*(.5-.5*np.cos(2*np.pi*tt/1.6)),750+650*(.5-.5*np.cos(2*np.pi*tt*3.2)))
    x=0
    for k,dt in[(1,0),(1.03,.2)]:
        ph=2*np.pi*np.cumsum(f*k)/SR;x=x+.55*np.sin(ph+dt)+.2*np.sin(2*ph)+.08*np.sin(3*ph)
    return (x*np.minimum(1,tt/.5)*np.minimum(1,(d-tt)/.3)).astype(np.float32)
put(cut(S['ting'],.25,.12),0,.05)
put(cut(S['cash-register'],.8),T('one hundred thousand')+.05,.26)
tS=T('irs')-.35;tE=T('but cash')+.4;put(siren(tE-tS,T('you just built')-tS),tS,.11)
put(cut(S['whoosh'],.7),T('sees')-.1,.24)
put(cut(S['boom'],.5,.2),T('tax evasion'),.3)
out/=max(1,np.abs(out).max()/.97)
w=wave.open(f'{RK}/mix_ep20.wav','wb');w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes((out*32767).astype(np.int16).tobytes());w.close();print('mix ok',DUR)
