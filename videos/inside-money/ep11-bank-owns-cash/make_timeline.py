"""words_raw.json (faster-whisper) -> render-kit/timeline_ep11.json: words + 2-3 word caption chunks. Voice starts at t=0."""
import json
raw=json.load(open('ep11-bank-owns-cash/words_raw.json'));W=[]
for w in raw:
    t=w['w']
    if W and (t.startswith(',') or t.startswith('-') or t=='%' or (t.startswith('.') and W[-1]['w'].startswith('$'))):W[-1]['w']+=t;W[-1]['e']=w['e'];continue
    W.append({'w':t,'s':w['s'],'e':w['e']})
FIX={'bury':'Bury','theirs,':'theirs.','meet':'Meet','ensures':'insures','at':'it','two.':'too.','10':'Ten','card,':'card?','comment,':'Comment','$100,':'$100.'}
out=[]
for i,w in enumerate(W):
    t=w['w']
    if t=='alone':  # whisper heard "a loan" as "alone"
        m=(w['s']+w['e'])/2;out+=[{'w':'a','s':w['s'],'e':m},{'w':'loan','s':m,'e':w['e']}];continue
    if t in FIX and not (t=='at' and W[i+1]['w']!='two.'):w['w']=FIX[t]
    out.append(w)
W=out
for i,w in enumerate(W):  # "two to three dollars" -> "$2 to $3"
    if w['w']=='two' and W[i+1]['w']=='to' and W[i+2]['w']=='three':
        w['w']='$2';W[i+2]['w']='$3.';W[i+2]['e']=W[i+3]['e'];del W[i+3];break
W[-3]['w']='CASH';W[-1]['w']='CARD.'
W[0]['s']=0.0
ch=[];cur=[]
for w in W:
    cur.append(w);end=w['w'][-1] in '.,?!'
    if len(cur)==3 or end or (len(cur)==2 and len(w['w'])>8):ch.append({'t':' '.join(x['w'].strip('.,?') for x in cur),'s':cur[0]['s'],'e':cur[-1]['e']});cur=[]
if cur:ch.append({'t':' '.join(x['w'].strip('.,?') for x in cur),'s':cur[0]['s'],'e':cur[-1]['e']})
dur=W[-1]['e']+.3
json.dump({'dur':round(dur,2),'words':W,'chunks':ch},open('render-kit/timeline_ep11.json','w'),indent=0)
print(len(W),len(ch),round(dur,2));print(' '.join(w['w'] for w in W))
