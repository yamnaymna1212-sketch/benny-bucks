import json,sys
from faster_whisper import WhisperModel
m=WhisperModel("base.en",device="cpu",compute_type="int8")
import soundfile as sf
a,_sr=sf.read(sys.argv[1],dtype="float32")
segs,_=m.transcribe(a,word_timestamps=True,language="en",beam_size=5)
out=[]
for s in segs:
    for w in s.words: out.append({"w":w.word.strip(),"s":round(w.start,3),"e":round(w.end,3)})
json.dump(out,open(sys.argv[2],"w"),indent=0);print(len(out),' '.join(x['w'] for x in out))
