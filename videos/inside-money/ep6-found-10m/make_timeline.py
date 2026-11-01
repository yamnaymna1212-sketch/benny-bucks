"""words_raw.json (faster-whisper) -> render-kit/timeline_ep6.json: words + 2-3 word caption chunks (break at punctuation)."""
import json
raw=json.load(open('ep6-found-10m/words_raw.json'))
W=[]
for w in raw:
    t=w['w']
    if W and (t.startswith(',') or t.startswith('-') or t=='%' or (t.startswith('.') and W[-1]['w'].startswith('$'))):W[-1]['w']+=t;W[-1]['e']=w['e'];continue
    W.append({'w':t,'s':w['s'],'e':w['e']})
FIX={'401k':'401(k)','Screams':'screams','Whispers':'whispers','Keep':'keep','It':'it.'}
for w in W:w['w']=FIX.get(w['w'],w['w'])
for a,b in zip(W,W[1:]):
    if a['w']=='it.' and b['w']=='will':b['w']="We'll"   # whisper hears "We'll" as "will"
    if a['w']=='Rick' and b['w']=='screams':a['w']='Rick,'
    if a['w']=='Tara' and b['w']=='whispers':a['w']='Tara,'
ch=[];cur=[]
for i,w in enumerate(W):
    cur.append(w);end=w['w'][-1] in '.,?!'
    if len(cur)==3 or end or (len(cur)==2 and len(w['w'])>8):
        ch.append({'t':' '.join(x['w'].strip('.,') for x in cur),'s':cur[0]['s'],'e':cur[-1]['e']});cur=[]
if cur:ch.append({'t':' '.join(x['w'].strip('.,') for x in cur),'s':cur[0]['s'],'e':cur[-1]['e']})
import subprocess
dur=float(subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0','ep6-found-10m/vo.wav'],capture_output=True,text=True).stdout)+.3
# line starts: first word of each spoken line, matched in order
n=lambda x:x.lower().strip('.,?')
L=[[n(w) for w in l.split()[:2]] for l in open('ep6-found-10m/lines.txt') if l.strip()];starts=[];j=0
for f in L:
    k=j
    while k<len(W)-1 and not (n(W[k]['w'])==f[0] and n(W[k+1]['w'])==f[1]):k+=1
    if k>=len(W)-1 or k-j>60:   # number words get merged by whisper ('ten million' -> '$10 million'): match on the 2nd word
        k=j
        while n(W[k+1]['w'])!=f[1]:k+=1
    starts.append(W[k]['s']);j=k+1
json.dump({'dur':round(dur,2),'lines':starts,'words':W,'chunks':ch},open('render-kit/timeline_ep6.json','w'),indent=0)
print(len(W),len(ch),round(dur,2),starts);print([c['t'] for c in ch[:12]])
