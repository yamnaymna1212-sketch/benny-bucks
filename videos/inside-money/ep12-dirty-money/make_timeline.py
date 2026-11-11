"""words_raw.json (faster-whisper) -> render-kit/timeline_ep12.json: words + ONE-word caption chunks. Voice starts at t=0."""
import json,re
raw=json.load(open('ep12-dirty-money/words_raw.json'));W=[]
for w in raw:
    t=w['w']
    if W and (t.startswith(',') or t.startswith('-')):W[-1]['w']+=t;W[-1]['e']=w['e'];continue
    W.append({'w':t,'s':w['s'],'e':w['e']})
for i,w in enumerate(W):
    if w['w']=='Mike' and i+1<len(W) and W[i+1]['w']=='cash' and W[i-1]['w'].startswith('put'):w['w']='my'
    if w['w'].startswith('guests'):w['w']='guess.'
W[0]['s']=0.0
ch=[{'t':re.sub(r'[.,?!]','',w['w']),'s':w['s'],'e':(W[i+1]['s'] if i+1<len(W) else w['e']+.3)} for i,w in enumerate(W)]
dur=round(W[-1]['e']+.45,2)
json.dump({'dur':dur,'words':W,'chunks':ch},open('render-kit/timeline_ep12.json','w'),indent=0)
print(len(W),dur);print(' '.join(f"{w['w']}@{w['s']:.2f}" for w in W))
