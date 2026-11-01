"""words_raw.json (faster-whisper) -> render-kit/timeline_ep5.json: words + 2-3 word caption chunks (break at punctuation)."""
import json
raw=json.load(open('ep5-tax-sofa/words_raw.json'))
W=[]
for w in raw:
    t=w['w']
    if W and (t.startswith(',') or t.startswith('-') or t=='%'):W[-1]['w']+=t;W[-1]['e']=w['e'];continue
    W.append({'w':t,'s':w['s'],'e':w['e']})
FIX={'401k':'401(k)'}
for w in W:w['w']=FIX.get(w['w'],w['w'])
ch=[];cur=[]
for i,w in enumerate(W):
    cur.append(w);end=w['w'][-1] in '.,?!'
    if len(cur)==3 or end or (len(cur)==2 and len(w['w'])>8):
        ch.append({'t':' '.join(x['w'].strip('.,') for x in cur),'s':cur[0]['s'],'e':cur[-1]['e']});cur=[]
if cur:ch.append({'t':' '.join(x['w'].strip('.,') for x in cur),'s':cur[0]['s'],'e':cur[-1]['e']})
json.dump({'dur':61.6,'words':W,'chunks':ch},open('render-kit/timeline_ep5.json','w'),indent=0)
print(len(W),len(ch));print([c['t'] for c in ch[:12]])
