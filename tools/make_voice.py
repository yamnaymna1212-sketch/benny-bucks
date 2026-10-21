"""Doug voice pipeline (user rule 2026-10-21: never ask the user about the voice).
edge-tts en-US-AndrewNeural, ONE take -> pauses 0.07 s (0.35 s after "Doug <state>.") -> atempo if long -> comma pauses 0.10 s.
Usage: python3 tools/make_voice.py <slug> [--no-tts]
  reads  videos/<slug>/vo/lines.txt (the script; sentences split on . ? ! :)
  writes videos/<slug>/vo/{raw.mp3,raw.words.json,raw.wav,segments.json,voice.mp3}, studio/public/<slug>-voice.mp3,
         studio/src/data/<slug>.json [{start,end,text}] (one entry per phrase).
--no-tts re-uses the existing raw take (never generate a second take just to re-tighten).
Needs: pip install edge-tts numpy soundfile. Proxy CA: /root/.ccr/ca-bundle.crt (cloud sessions).
"""
import asyncio, json, os, re, shutil, ssl, subprocess, sys
import numpy as np, soundfile as sf

VOICE, GAP, GAG_GAP, COMMA, TARGET = 'en-US-AndrewNeural', 0.07, 0.35, 0.10, 60.5
slug = sys.argv[1]; root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
vo = f'{root}/videos/{slug}/vo'
text = " ".join(l.strip() for l in open(f'{vo}/lines.txt') if l.strip())
phrases = [p.strip() for p in re.split(r'(?<=[.?!:])\s+', text) if p.strip()]
run = lambda *a: subprocess.run(list(a), check=True, capture_output=True, text=True)
silences = lambda f, d: (lambda log: ([float(x) for x in re.findall(r'silence_start: ([\d.]+)', log)], [float(x) for x in re.findall(r'silence_end: ([\d.]+)', log)]))(
    subprocess.run(['ffmpeg', '-i', f, '-af', f'silencedetect=n=-38dB:d={d}', '-f', 'null', '-'], capture_output=True, text=True).stderr)

# 1. one take
if '--no-tts' not in sys.argv:
    import edge_tts, edge_tts.communicate as ec
    if os.path.exists('/root/.ccr/ca-bundle.crt'): ec._SSL_CTX = ssl.create_default_context(cafile='/root/.ccr/ca-bundle.crt')
    async def tts():
        words = []
        with open(f'{vo}/raw.mp3', 'wb') as f:
            async for ch in edge_tts.Communicate(text, VOICE, boundary='WordBoundary').stream():
                if ch['type'] == 'audio': f.write(ch['data'])
                elif ch['type'] == 'WordBoundary': words.append({'start': ch['offset'] / 1e7, 'end': (ch['offset'] + ch['duration']) / 1e7, 'text': ch['text']})
        json.dump(words, open(f'{vo}/raw.words.json', 'w'), indent=0)
    asyncio.run(tts())
run('ffmpeg', '-v', 'error', '-y', '-i', f'{vo}/raw.mp3', '-ac', '1', '-ar', '48000', '-c:a', 'pcm_s16le', f'{vo}/raw.wav')

# 2. phrase segments: word boundaries snapped to the real silences
w = json.load(open(f'{vo}/raw.words.json')); ss, se = silences(f'{vo}/raw.wav', 0.12)
segs, i = [], 0
for k, p in enumerate(phrases):
    n = len(re.findall(r"[A-Za-z0-9']+", p)); seg = w[i:i + n]; i += n
    assert seg and seg[0]['text'].lower()[:2] == p.lower()[:2], f'word/phrase mismatch at "{p}" (avoid hyphens and digits in lines.txt)'
    a = max([e for e in se if seg[0]['start'] - 0.25 <= e <= seg[0]['start'] + 0.05], default=seg[0]['start'])
    b = min([s for s in ss if seg[-1]['end'] - 0.05 <= s <= seg[-1]['end'] + 0.35], default=seg[-1]['end'])
    segs.append({'a': round(a, 3), 'b': round(b, 3), 'text': p, 'line': k, 'gap_after': GAG_GAP if re.fullmatch(r'Doug \w+\.', p) else GAP})
assert i == len(w), 'words left over: check lines.txt'
json.dump(segs, open(f'{vo}/segments.json', 'w'), indent=1)

# 3. tighten (tools/tighten_vo.py), then speed up only if too long
run('python3', f'{root}/tools/tighten_vo.py', f'{vo}/raw.wav', f'{vo}/segments.json', f'{vo}/tight')
T = json.load(open(f'{vo}/tight.timings.json'))
dur = float(run('ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f'{vo}/tight.wav').stdout)
x = max(1.0, min(1.25, dur / (TARGET + 1.5)))  # comma squeeze below removes ~1.5 s more
run('ffmpeg', '-v', 'error', '-y', '-i', f'{vo}/tight.wav', '-af', f'atempo={x:.3f}', '-ac', '1', '-ar', '48000', f'{vo}/fast.wav')
T = [{'start': p['start'] / x, 'end': p['end'] / x, 'text': p['text']} for p in T]

# 4. cut remaining pauses inside sentences (commas) to COMMA s, keep the gag pause
y, sr = sf.read(f'{vo}/fast.wav'); ss, se = silences(f'{vo}/fast.wav', 0.15)
gags = [p['end'] for p in T if re.fullmatch(r'Doug \w+\.', p['text'])]
cuts = []
for a, b in zip(ss, se):
    if b - a <= COMMA + 0.03 or any(abs(a - g) < 0.15 for g in gags) or b >= len(y) / sr - 0.01: continue
    m = (a + b) / 2; cuts.append((m - (b - a - COMMA) / 2, m + (b - a - COMMA) / 2))
keep, prev = [], 0.0
for a, b in cuts: keep.append(y[int(prev * sr):int(a * sr)]); prev = b
keep.append(y[int(prev * sr):]); sf.write(f'{vo}/final.wav', np.concatenate(keep), sr)
remap = lambda t: t - sum(min(b, max(a, t)) - a for a, b in cuts)
out = [{'start': round(remap(p['start']), 2), 'end': round(remap(p['end']), 2), 'text': p['text']} for p in T]
run('ffmpeg', '-v', 'error', '-y', '-i', f'{vo}/final.wav', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-ar', '48000', '-b:a', '192k', f'{vo}/voice.mp3')
for f in ['tight.wav', 'tight.mp3', 'tight.timings.json', 'fast.wav', 'final.wav']:
    if os.path.exists(f'{vo}/{f}'): os.remove(f'{vo}/{f}')
json.dump(out, open(f'{root}/studio/src/data/{slug}.json', 'w'), indent=1)
shutil.copy(f'{vo}/voice.mp3', f'{root}/studio/public/{slug}-voice.mp3')
print(f'{len(out)} phrases, atempo {x:.3f}, {len(cuts)} comma cuts, voice ends {out[-1]["end"]} s (video = +1.2 s tail)')
if out[-1]['end'] < 59.8: print('WARNING: under 61 s video -> add script lines (one idea each) and make ONE new take')
