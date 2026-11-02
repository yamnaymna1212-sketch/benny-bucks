"""words_raw.json (faster-whisper, ep0-v2/align.py) -> render-kit/timeline_ep5.json {dur, words, chunks of 2-3 words}.
Usage (from videos/inside-money): python3 ep5-bank-run/make_timeline.py [dur_seconds]
Captions: 2-3 words, a chunk never crosses a sentence end. Whisper typos are fixed in FIX."""
import json,sys,re,subprocess
FIX={'aid':'eight','with draw':'withdraw','F.D.I.C.':'FDIC','FDIC.':'FDIC.'}
W=json.load(open('ep5-bank-run/words_raw.json'))
for w in W:w['w']=FIX.get(w['w'],w['w'])
M=[]   # whisper splits "$1,000" into "$1" + ",000": merge
for w in W:
    if M and (w['w'].startswith(',') or w['w'][:2] in ('.0','.1','.2','.3','.4','.5','.6','.7','.8','.9')):M[-1]['w']+=w['w'];M[-1]['e']=w['e']
    else:M.append(dict(w))
W=M
dur=float(sys.argv[1]) if len(sys.argv)>1 else float(subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0','ep5-bank-run/vo.wav'],capture_output=True,text=True).stdout)
ch=[];cur=[]
for i,w in enumerate(W):
    cur.append(w);end=bool(re.search(r'[.?!,]$',w['w']))
    if len(cur)==3 or end or (len(cur)==2 and i+1<len(W) and len(W[i+1]['w'])>8):
        ch.append({'t':' '.join(x['w'] for x in cur).rstrip(','),'s':cur[0]['s'],'e':cur[-1]['e']});cur=[]
if cur:ch.append({'t':' '.join(x['w'] for x in cur),'s':cur[0]['s'],'e':cur[-1]['e']})
json.dump({'dur':round(dur,2),'words':W,'chunks':ch},open('render-kit/timeline_ep5.json','w'),indent=0)
print('timeline_ep5.json',round(dur,2),'s',len(W),'words',len(ch),'chunks')
