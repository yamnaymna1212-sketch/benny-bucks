# Voice made louder and fuller (EQ + compressor + limiter). Optional 4th arg = pitch factor for am_liam lines (1 = off).
import json, subprocess, sys, numpy as np, soundfile as sf, tempfile, os
wav, tim, out = sys.argv[1:4]
pitch = float(sys.argv[4]) if len(sys.argv) > 4 else 1.0
a, sr = sf.read(wav); T = json.load(open(tim)); d = tempfile.mkdtemp()
for k, l in enumerate(T):
    if l['voice'] != 'am_liam' or pitch == 1.0: continue
    i0, i1 = int(l['start'] * sr), int(l['end'] * sr)
    sf.write(f'{d}/i.wav', a[i0:i1], sr)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f'{d}/i.wav', '-af', f'rubberband=pitch={pitch}:formant=preserved', f'{d}/o.wav'], check=True)
    b, _ = sf.read(f'{d}/o.wav'); n = min(len(b), i1 - i0); a[i0:i0 + n] = b[:n]
sf.write(f'{d}/mix.wav', a, sr)
chain = ('highpass=f=70,equalizer=f=180:t=q:w=1:g=3,equalizer=f=3200:t=q:w=1.2:g=5,'
         'acompressor=threshold=-26dB:ratio=4:attack=4:release=60:makeup=12,alimiter=limit=0.95:level=false')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f'{d}/mix.wav', '-af', chain, '-ar', '48000', '-b:a', '192k', out], check=True)
