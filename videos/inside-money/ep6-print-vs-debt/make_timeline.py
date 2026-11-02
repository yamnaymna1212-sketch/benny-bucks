"""EP6 timeline: whisper words -> render-kit/timeline_ep6.json (words + 2-3 word caption chunks).
Usage (from videos/inside-money): python3 ep6-print-vs-debt/make_timeline.py"""
import json,re
W=json.load(open('ep6-print-vs-debt/words_raw.json'))
FIX={'US':'U.S.',"Bank's":'Banks.','treasury':'Treasury','social':'Social','security.':'Security.'}
ws=[]
for x in W:
    w=FIX.get(x['w'],x['w'])
    if ws and re.match(r'^[.,]\d',w):ws[-1]['w']+=w;ws[-1]['e']=x['e'];continue   # "$40" ".6" -> "$40.6"
    ws.append({'w':w,'s':x['s'],'e':x['e']})
ch,cur=[],[]
for i,x in enumerate(ws):
    cur.append(x);end=re.search(r'[.?!,]$',x['w'])
    if len(cur)==3 or (end and len(cur)>=2) or (end and len(cur)==1 and len(x['w'])>6):
        ch.append({'t':' '.join(c['w'] for c in cur).rstrip(','),'s':cur[0]['s'],'e':cur[-1]['e']});cur=[]
if cur:ch.append({'t':' '.join(c['w'] for c in cur),'s':cur[0]['s'],'e':cur[-1]['e']})
dur=round(ws[-1]['e']+.5,2)
json.dump({'dur':dur,'words':ws,'chunks':ch},open('render-kit/timeline_ep6.json','w'),indent=0)
print(dur,len(ws),len(ch));print(' | '.join(c['t'] for c in ch[:14]))
