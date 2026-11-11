"""words_raw.json (faster-whisper) -> render-kit/timeline_ep10.json: words + 2-3 word caption chunks. Voice starts at t=0 (no pre-roll)."""
import json
raw=json.load(open('ep10-israel-aid-debt/words_raw.json'));W=[]
for w in raw:
    t=w['w']
    if W and (t.startswith(',') or t.startswith('-') or t=='%' or (t.startswith('.') and W[-1]['w'].startswith('$'))):W[-1]['w']+=t;W[-1]['e']=w['e'];continue
    W.append({'w':t,'s':w['s'],'e':w['e']})
FIX={'meat':'Meet','mic?':'Mike.','debt,':'debt?','Mike,':'Mike.'}
for i,w in enumerate(W):
    if w['w'] in FIX and (w['w']!='debt,' or i>8):w['w']=FIX[w['w']]
    if w['w'].lower().startswith('mic') and len(w['w'])<=5:w['w']='Mike'+w['w'][3:].replace('?','.')
W[-4]['w']='Comment';W[-3]['w']='AID'
W[-1]['w']='DEBT.'
W[0]['s']=0.0
ch=[];cur=[]
for w in W:
    cur.append(w);end=w['w'][-1] in '.,?!'
    if len(cur)==3 or end or (len(cur)==2 and len(w['w'])>8):ch.append({'t':' '.join(x['w'].strip('.,?') for x in cur),'s':cur[0]['s'],'e':cur[-1]['e']});cur=[]
if cur:ch.append({'t':' '.join(x['w'].strip('.,?') for x in cur),'s':cur[0]['s'],'e':cur[-1]['e']})
dur=W[-1]['e']+.35
json.dump({'dur':round(dur,2),'words':W,'chunks':ch},open('render-kit/timeline_ep10.json','w'),indent=0)
print(len(W),len(ch),round(dur,2));print(' '.join(f"{w['w']}@{w['s']:.2f}" for w in W[:28]));print(' '.join(w['w'] for w in W[-12:]))
