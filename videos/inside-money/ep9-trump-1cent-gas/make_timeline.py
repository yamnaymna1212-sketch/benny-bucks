"""words_raw.json (faster-whisper) -> render-kit/timeline_ep9.json: words + 2-3 word caption chunks + line starts. Voice starts at t=0 (no pre-roll)."""
import json,subprocess
raw=json.load(open('ep9-trump-1cent-gas/words_raw.json'));W=[]
for w in raw:
    t=w['w']
    if W and (t.startswith(',') or t.startswith('-') or t=='%' or (t.startswith('.') and W[-1]['w'].startswith('$'))):W[-1]['w']+=t;W[-1]['e']=w['e'];continue
    W.append({'w':t,'s':w['s'],'e':w['e']})
for a,b in zip(W,W[1:]):
    if a['w'].lower()=='comment' and b['w'].lower().startswith('pump'):b['w']='PUMP'
    if a['w']=='or' and b['w'].lower().startswith('tax') and W.index(b)>len(W)-12:b['w']='TAX'
W[0]['s']=0.0
# CTA trimmed (user 2026-11-03): the video ends on 'Comment PUMP or TAX'
W=W[:[i for i,w in enumerate(W) if w['w']=='TAX'][-1]+1]
ch=[];cur=[]
for w in W:
    cur.append(w);end=w['w'][-1] in '.,?!'
    if len(cur)==3 or end or (len(cur)==2 and len(w['w'])>8):ch.append({'t':' '.join(x['w'].strip('.,') for x in cur),'s':cur[0]['s'],'e':cur[-1]['e']});cur=[]
if cur:ch.append({'t':' '.join(x['w'].strip('.,') for x in cur),'s':cur[0]['s'],'e':cur[-1]['e']})
dur=W[-1]['e']+.35
json.dump({'dur':round(dur,2),'words':W,'chunks':ch},open('render-kit/timeline_ep9.json','w'),indent=0)
print(len(W),len(ch),round(dur,2));print(' '.join(f"{w['w']}@{w['s']:.2f}" for w in W[:30]))
