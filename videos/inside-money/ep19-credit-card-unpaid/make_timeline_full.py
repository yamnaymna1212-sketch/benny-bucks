"""EP19 FULL: vo_full.wav (one Kokoro take) -> faster-whisper word times (words_full_raw.json) -> render-kit/timeline_ep19full.json (1-word captions).
Usage (from videos/inside-money): ~/kokoro-tts/venv/bin/python ep19-credit-card-unpaid/make_timeline_full.py"""
import json,os,re,subprocess,numpy as np
D='ep19-credit-card-unpaid';TXT=open(f'{D}/full.tts.txt').read().split('|')[0].replace('I.R.S.','IRS').replace('S.U.V.s','SUVs')
if not os.path.exists(f'{D}/words_full_raw.json'):
    from faster_whisper import WhisperModel
    m=WhisperModel('small.en',compute_type='int8');a=np.frombuffer(subprocess.run(['ffmpeg','-v','error','-i',f'{D}/vo_full.wav','-ac','1','-ar','16000','-f','f32le','-'],capture_output=True,check=True).stdout,np.float32)
    seg,_=m.transcribe(a,word_timestamps=True,condition_on_previous_text=False,beam_size=5)
    json.dump([{'w':w.word.strip(),'s':round(w.start,3),'e':round(w.end,3)} for s in seg for w in s.words],open(f'{D}/words_full_raw.json','w'),indent=0)
R=json.load(open(f'{D}/words_full_raw.json'))
# force the script's spelling onto whisper's times (same word count expected; report mismatches)
S=TXT.split();import difflib
n=lambda x:re.sub(r'[^a-z0-9]','',x.lower())
sm=difflib.SequenceMatcher(None,[n(x) for x in S],[n(x['w']) for x in R],autojunk=False);T=[None]*len(S)
for a,b,k in sm.get_matching_blocks():
    for j in range(k):T[a+j]=(R[b+j]['s'],R[b+j]['e'])
print('matched',sum(t is not None for t in T),'of',len(S))
i=0
while i<len(S):   # unmatched words: spread evenly between the neighbours
    if T[i] is None:
        j=i
        while j<len(S) and T[j] is None:j+=1
        t0=T[i-1][1] if i else 0.0;t1=T[j][0] if j<len(S) else t0+.3*(j-i)
        for k in range(i,j):T[k]=(t0+(t1-t0)*(k-i)/(j-i),t0+(t1-t0)*(k-i+1)/(j-i))
        i=j
    else:i+=1
W=[{'w':S[i],'s':round(T[i][0],3),'e':round(T[i][1],3)} for i in range(len(S))]
W[0]['s']=0.0
ch=[{'t':re.sub(r'[.,?!:]','',w['w']),'s':w['s'],'e':w['e']} for w in W]
dur=round(W[-1]['e']+.4,2)
json.dump({'dur':dur,'words':W,'chunks':ch},open('render-kit/timeline_ep19full.json','w'),indent=0)
print(dur);print(' '.join(f"{w['w']}@{w['s']}" for w in W))
