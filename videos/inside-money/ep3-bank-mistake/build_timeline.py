"""Build render-kit/timeline_ep3.json from ep3-bank-mistake/words_raw.json + vo.timings.json (run from videos/inside-money)."""
import json,re
D='ep3-bank-mistake/';raw=json.load(open(D+'words_raw.json'));LN=json.load(open(D+'vo.timings.json'))
ws=[]
for x in raw:
    if x['w'][:1] in ',-' and ws: ws[-1]['w']+=x['w'];ws[-1]['e']=x['e'];continue
    ws.append(dict(x))
out=[]
for w in ws:
    t=re.sub(r'[.,?!]+$','',w['w'])
    if re.fullmatch(r'\d{1,3}(,\d{3})+',t): t='$'+t                      # "15,000" -> "$15,000"
    if t.lower()=='banks': t='bank'                                       # whisper mishear
    red=t.startswith('$') or t.lower() in {'minus','theft','police','stolen','mistake','gone','error'}
    out.append({'w':t,'s':w['s'],'e':w['e'],'c':'red' if red else ''})
for a,b in zip(out,out[1:]): a['e']=b['s']
dur=round(LN[-1]['end']+.5,2)
json.dump({'dur':dur,'words':out,'lines':LN},open('render-kit/timeline_ep3.json','w'),indent=0)
print(dur,len(out),[w['w'] for w in out if w['c']])
