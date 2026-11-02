# EP6 "Why can the U.S. government print money, but still can't pay off its debt?" - build plan
## STATUS 2026-11-02
- Script v3 approved (lines.txt / SCRIPT.md / facts.md).
- Voice: Kokoro am_liam ONE continuous take (all lines joined = lines_one.txt, speed 0.80, max_gap .12) -> vo.wav/vo.mp3 = 64.8 s, 224 words = 3.46 w/s, no silence > 0.12 s.
  (speed 0.95/1.0 gave 53-54 s = under 60 -> rejected; per-line 1.10 take kept in voice-test/ for reference only.)
- Word timings: words_raw.json (faster-whisper) -> make_timeline.py -> render-kit/timeline_ep6.json (captions 2-3 words, $40.6 / $119,000 merged).
- Scene: render-kit/ep6.html (from ep4.html). ONE continuous camera (Catmull-Rom knots KN, no cuts).
  Hook: U.S. GOVERNMENT building, giant U.S. NATIONAL DEBT LED board (real 2026-10-29 figure, ticking up), MONEY PRINTER left, worker carries cash to the payment pile right,
  official at the podium, Mike walks in (foreground right), looks up on "debt", hands up on "$40.6 trillion" (red floating number).
- Mix: mix_ep6.py (hook SFX only so far). Preview: hook-preview-5s-v1.mp4 (`npm run render -- ep6 5`). WAITING for user approval.
## NEXT
1. User feedback on hook v1 -> fix in one batch.
2. Build story 5-65 s (one continuous camera flying between places, Mike acts every line), story SFX, stills per beat, full render, phone copy < 30 MB, PUBLISH.md.
3. Re-check the debt figure (fiscaldata debt_to_penny) on render day.

## UPDATE hook v2 (2026-11-02, after user feedback on v1)
User v1 feedback: pale fake building, black board pointless, big number pointless, nobody runs the printer, Mike/people without a role, hook unclear, static camera, choppy boring voice, no big printing scene, drop "U.S." from the voice; camera should go government man printing -> map of a country America owes.
v2: real U.S. Capitol shape (white dome + peristyle + wings) in daylight, Mike runs the MONEY PRINTER (red button -> celebrates in a cash fountain -> cash mountain -> shrugs on "can't pay off"), camera flies (monotone spline, no overshoot) to a Natural Earth world map: Japan lights up, cash arc Japan -> America, "$1.1 TRILLION". No other people. Preview: hook-preview-5s-v2.mp4. Waiting for approval.

## FULL v1 RENDERED (2026-11-02)
- User on hook v2: Mike + press centred, cash clearly coming out, U.S. GOVERNMENT + one U.S. flag on the Capitol, no side flags -> then build the whole video. Done.
- render-kit/ep6-print-vs-debt.mp4 (64.68 s, GPU Apple M3, not in git) + ep6-print-vs-debt-phone.mp4 here (7.6 MB). Mix: mix_ep6.py (full story SFX).
- Sets (one continuous camera, monotone spline KN in ep6.html): PLAZA x=0 (press, cash piles, booths BANKS/PENSION FUNDS/SOCIAL SECURITY at x 3.5-6.5), WORLD MAP X0=60 (Japan, China/Canada/Taiwan/India arcs, $40.6T tower on the US, villain red, 3 of 4 bills), BANK LOBBY LX=-50 (EP4 lobby: bond, interest coins, DUE, new lender pays old, REPLACED loop), BUDGET SCALE x=-30 (TAKES IN vs SPENDS, $1.8T more, $970B interest).
- Story beat times: const T in ep6.html (from whisper words). Floating texts have a dark backing panel for contrast.
- Known weak spots: ~0.5 s flights over lawn at 28.0-28.9 and 50.0-50.4; WHO IS OWED? cropped while the camera rises (~21 s); faces have no expressions; the 4-bills beat (~27 s) frames the US low.
