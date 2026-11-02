# EP5 build plan (cloud session 2026-11-02: script + facts only; render on the Mac)
Template: render-kit/ep4.html (copy to ep5.html). Cast: Mike (blue tee), teller (striped blouse), manager (suit), guard, couple, shop owner (see characters/cast.json).
Sets: bank LOBBY (hook + story, EP4 lobby), VAULT (new: open vault, empty shelves), STREET (house FOR SALE, shop opening), PLAZA/queue outside bank (SVB crowd with phones, CLOSED sign).
Glow: GREEN $1,000 / $18.8T tower / FDIC $250,000 shield = YELLOW; RED $42B + CLOSED; YELLOW 1:8.
Hook (0-5 s): lobby, Mike at the teller window, hand bundle on counter, floating $1,000, line of customers walking in behind him; Mike turns his head. Nothing cropped, sign BANK + flags.
NEXT: 1) user approves script + hook line 2) confirm FDIC + FRED numbers 3) voice Kokoro am_liam 1.10 (amounts in words) 4) timings 5) 5-s hook preview ON THE MAC 6) full render after approval.

## HOOK v1 BUILT (cloud, 2026-11-02) - render-kit/ep5.html
5 cuts on words (anchors read from timeline_ep5.json, so they follow the real voice automatically):
1. "Why can't you" - lobby frontal, FIRST NATIONAL BANK + flag, Mike at the window, GREEN $1,000 pops over his head.
2. "withdraw" - over Mike's shoulder, the teller slides 4 glowing bundles to him.
3. "from the bank at once?" - VAULT set (x=-22): open round door, near-empty shelves (3 bundles), RED "?" on "once".
4. "You can." - Mike turns to us and raises the fan of cash.
5. "Just not everybody..." - over Mike's shoulder: 5 customers rush in through the front doors, $1,000 over each head; teller shrugs, Mike surprised.
Cloud stills checked with SwiftShader (cast fell back to guy.glb - on the Mac the real MakeHuman cast loads).
timeline_ep5.json is PROVISIONAL (estimated word times) until the voice exists.

## ON THE MAC (in order) - from videos/inside-money
```
~/kokoro-tts/venv/bin/python ~/kokoro-tts/tts.py ep5-bank-run/lines.txt ep5-bank-run/vo am_liam 1.10 0.04
ffmpeg -y -i ep5-bank-run/vo.wav -ac 1 -ar 16000 ep5-bank-run/vo16.wav
~/kokoro-tts/venv/bin/python ep0-v2/align.py ep5-bank-run/vo16.wav ep5-bank-run/words_raw.json
python3 ep5-bank-run/make_timeline.py
~/kokoro-tts/venv/bin/python ep5-bank-run/mix_ep5.py
cd render-kit && node stills.mjs ep5.html 0.4 0.9 2.4 3.2 4.6 && npm run render -- ep5 5
```
-> render-kit/ep5-bank-run-preview-5s.mp4 : send to the user, WAIT for approval before the full build.
Check: vo duration 61-65 s (else adjust speed), whisper typos in words_raw.json (withdraw / FDIC).
