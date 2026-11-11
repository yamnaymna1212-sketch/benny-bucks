"""vo_hook.wav -> faster-whisper word times (words_raw.json) -> render-kit/timeline_ep18.json (words + ONE-word caption chunks; prices shown as 3D text are blank in the captions).
Usage (from videos/inside-money): /opt/tts/venv/bin/python ep18-pool-million/make_timeline.py"""
import json,os,subprocess,numpy as np
from faster_whisper import WhisperModel
D='ep18-pool-million'
if not os.path.exists(f'{D}/words_raw.json'):
    m=WhisperModel('base.en',compute_type='int8');a=np.frombuffer(subprocess.run(['ffmpeg','-v','error','-i',f'{D}/vo_hook.wav','-ac','1','-ar','16000','-f','f32le','-'],capture_output=True,check=True).stdout,np.float32);seg,_=m.transcribe(a,word_timestamps=True,initial_prompt='You dug a pool, filled it with one million dollars, and put the strongest armor in the world on top. Will the IRS find it?')
    json.dump([{'w':w.word.strip(),'s':round(w.start,3),'e':round(w.end,3)} for s in seg for w in s.words],open(f'{D}/words_raw.json','w'),indent=0)
W=json.load(open(f'{D}/words_raw.json'))
W=W[:next(i for i,w in enumerate(W) if w['w'].endswith('?'))+1]   # whisper repeats the prompt after the end: cut at the question mark
W[0]['s']=0.0
ch=[];prev=''
for w in W:
    t=w['w'].strip('.,?!')
    price=t.startswith('$') or (prev.startswith('$') and t.lower() in('million',)) 
    ch.append({'t':'' if price else t.upper() if t.replace('.','').upper()=='IRS' else t,'s':w['s'],'e':w['e']});prev=t
dur=round(max(W[-1]['e'],6.6)+.35,2)
json.dump({'dur':dur,'words':W,'chunks':ch},open('render-kit/timeline_ep18.json','w'),indent=0)
print(dur,' '.join(f"{w['w']}@{w['s']}" for w in W))
