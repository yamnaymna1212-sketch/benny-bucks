"""EP22: vo_full.wav one take -> words_full_raw.json (faster-whisper) -> render-kit/timeline_ep22.json. Run from videos/inside-money with ~/kokoro-tts/venv/bin/python"""
import json,re,difflib
D='ep22-tips-tax';TXT=open(f'{D}/full.tts.txt').read().strip()
R=json.load(open(f'{D}/words_full_raw.json'))
S=TXT.split();n=lambda x:re.sub(r'[^a-z0-9]','',x.lower())
sm=difflib.SequenceMatcher(None,[n(x) for x in S],[n(x['w']) for x in R],autojunk=False);T=[None]*len(S)
for a,b,k in sm.get_matching_blocks():
    for j in range(k):T[a+j]=(R[b+j]['s'],R[b+j]['e'])
print('matched',sum(t is not None for t in T),'of',len(S))
i=0
while i<len(S):
    if T[i] is None:
        j=i
        while j<len(S) and T[j] is None:j+=1
        t0=T[i-1][1] if i else 0.0;t1=T[j][0] if j<len(S) else t0+.3*(j-i)
        for k in range(i,j):T[k]=(t0+(t1-t0)*(k-i)/(j-i),t0+(t1-t0)*(k-i+1)/(j-i))
        i=j
    else:i+=1
W=[{'w':S[i],'s':round(T[i][0],3),'e':round(T[i][1],3)} for i in range(len(S))];W[0]['s']=0.0
ch=[{'t':re.sub(r'[.,?!:]','',w['w']),'s':w['s'],'e':w['e']} for w in W]
# amounts on captions: digits for the key numbers
def sub(ph,txt):
    p=[n(x) for x in ph.split()]
    for i in range(len(W)-len(p)+1):
        if [n(W[i+j]['w']) for j in range(len(p))]==p:
            for j in range(len(p)):ch[i+j]['t']=txt
            return
    print('MISSING',ph)
sub('twenty-five thousand dollars','$25,000')
dur=round(W[-1]['e']+.4,2)
json.dump({'dur':dur,'words':W,'chunks':ch},open('render-kit/timeline_ep22.json','w'),indent=0)
print(dur,' '.join(f"{w['w']}@{w['s']}" for w in W[:22]))
