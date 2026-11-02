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
