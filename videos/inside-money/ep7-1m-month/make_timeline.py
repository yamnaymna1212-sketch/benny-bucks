"""words_raw.json (faster-whisper) -> render-kit/timeline_ep7.json: words + 2-3 word caption chunks + line starts. Voice starts at t=0 (no pre-roll)."""
import json,subprocess
raw=json.load(open('ep7-1m-month/words_raw.json'));W=[]
for w in raw:
    t=w['w']
    if W and (t.startswith(',') or t.startswith('-') or t=='%' or (t.startswith('.') and W[-1]['w'].startswith('$'))):W[-1]['w']+=t;W[-1]['e']=w['e'];continue
    W.append({'w':t,'s':w['s'],'e':w['e']})
for a,b in zip(W,W[1:]):
    if a['w'].lower()=='comment' and b['w'].lower().startswith('spend'):b['w']='SPEND'
    if a['w']=='or' and b['w'].lower().startswith('keep') and W.index(b)>len(W)-12:b['w']='KEEP'
W[0]['s']=0.0
ch=[];cur=[]
for w in W:
    cur.append(w);end=w['w'][-1] in '.,?!'
    if len(cur)==3 or end or (len(cur)==2 and len(w['w'])>8):ch.append({'t':' '.join(x['w'].strip('.,') for x in cur),'s':cur[0]['s'],'e':cur[-1]['e']});cur=[]
if cur:ch.append({'t':' '.join(x['w'].strip('.,') for x in cur),'s':cur[0]['s'],'e':cur[-1]['e']})
dur=float(subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0','ep7-1m-month/vo.wav'],capture_output=True,text=True).stdout)+.3
json.dump({'dur':round(dur,2),'words':W,'chunks':ch},open('render-kit/timeline_ep7.json','w'),indent=0)
print(len(W),len(ch),round(dur,2));print(' '.join(f"{w['w']}@{w['s']:.2f}" for w in W[:30]))
