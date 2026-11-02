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

## HOOK v2 (user feedback 2026-11-02)
- Banker behind the window + in the vault = `manager` cast (dark suit, tie, glasses), not the teller in casual clothes.
- SERVICES board behind the banker removed.
- Big hook title on top (Money-Stories style, readable in 1 s): "Banks: $20 TRILLION" (green) / "Cash: $2.5 TRILLION" (red) / black box "So where is it?". Shown until the word "Say" (end of the hook).

## HOOK v3 (user feedback 2026-11-02)
- No look-alikes: the crowd = landlord, teller, printer, seller (the banker/manager and the guard are not repeated; nobody dressed like Mike). In cloud stills each role gets its own outfit colour (faces only differ on the Mac cast).
- Title = the video's point, not a summary: "Your $1,000 / is NOT in the vault" (green / red), 2 lines at the very top; every shot framed so the title never covers the bank sign, the vault sign, a $ number or a character.

## VOICE + TIMELINE DONE (cloud, 2026-11-02)
Kokoro am_liam speed 1.0, max_gap 0.04, one take -> vo.wav/mp3 **62.8 s** (speed 1.10 gave 55.5 s, too short; added line 12b "eighty-one percent" from Barr testimony). words_raw.json (whisper) -> timeline_ep5.json (typos fixed: eight, $1,000, $2.5). mix_ep5.wav = hook SFX only (story SFX after hook approval).
5-s hook preview rendered in the cloud (SwiftShader, ~20 min; the Mac M3 takes seconds): render-kit/ep5-bank-run-preview-5s.mp4.

## HOOK v4 - ONE CONTINUOUS CAMERA (Mac session 2026-11-02, brief rules 0-NEW)
No cuts, no separate vault set: the round vault door is cut into the lobby back wall behind the teller line (x=2.35) with the near-empty vault room behind it.
Camera spline (keys on the words): wide bank (sign + flag + open vault, Mike at the window) -> push in beside Mike while he asks -> glide right into the open vault (3 bundles, red ?) on "at once?" -> swing back to Mike's face as he gets the cash and raises it on "You can" -> pull back + up while 4 different customers walk in around him on "everybody at the same time"; Mike: hands-up "whoa", banker shrugs.
Fixes: Mike's zombie-arms shock pose -> hands-up (PS.shock tuned with `--q ps=...`), banker gives with one hand, seller suit recoloured mustard (blue looked like Mike), $1,000 labels fade/pop only when fully in frame, guard head turn animated, no Math.random (deterministic frames).
NaN guard pass before bloom (a single NaN pixel made a black block at t=1.0); flag sheen + sign clearcoat removed.
Preview rendered on the M3 in ~15 s: render-kit/ep5-bank-run-preview-5s.mp4 (not in git). WAIT for user approval before the full build.
