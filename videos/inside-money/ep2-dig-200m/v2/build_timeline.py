"""Build render-kit/timeline_ep2v2.json from v2/words_raw.json + vo.timings.json (run from videos/inside-money)."""
import json,re
raw=json.load(open('ep2-dig-200m/v2/words_raw.json'));LN=json.load(open('ep2-dig-200m/v2/vo.timings.json'))
ws=[]
for x in raw:
    if x['w'].startswith(',') and ws: ws[-1]['w']+=x['w'];ws[-1]['e']=x['e'];continue
    ws.append(dict(x))
RED={'$800','billion','200','80','6,000','90','20','1971','alarms','police','helicopters','fbi','prison','zero','sea','atm','drops'}
SPOKEN={'6':'6,000'}
out=[]
for i,w in enumerate(ws):
    t=re.sub(r'[.,?!]+$','',w['w'])
    out.append({'w':t,'s':w['s'],'e':w['e'],'c':'red' if t.lower() in RED else ''})
for a,b in zip(out,out[1:]): a['e']=b['s']   # no gaps: caption stays until next word
dur=round(LN[-1]['end']+.5,2)
json.dump({'dur':dur,'words':out,'lines':LN},open('render-kit/timeline_ep2v2.json','w'),indent=0)
print(dur,len(out),[w['w'] for w in out if w['c']])
