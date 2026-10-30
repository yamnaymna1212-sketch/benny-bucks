---
name: inside-money-episode
description: Make an "Inside Money" 3D-cutaway TikTok episode (the ACTIVE channel): research+verify facts, script, voice, 5-s hook preview, then full render. Use for any new Inside Money video, script, voice, hook or render.
---
# Inside Money episode workflow
Read first: videos/inside-money/PROJECT_BRIEF.md, SETUP.md, the episode's PLAN.md + SCRIPT.md, REFERENCE_ANALYSIS.md. Talk to the user in Arabic; video text in English. Do NOT use doug-* skills.
1. **Facts**: web-verify every number + live prices on the day (never memory); write sources + date at the bottom of SCRIPT.md. Money-safe: no how-to-crime, no promises, "stores" not "owns".
2. **Script**: hook starts "What if"/"Why", contrast + number in first frame; 1 line = 1 shot = 1 idea; reveal at ~75%; vote question near the end + pinned comment. 214-ish words => 61-65 s.
3. **Voice**: ElevenLabs if the connector exists (generations_count=1, one take) else Kokoro (~/kokoro-tts, see SETUP.md). Energetic young American, no dead air (max_gap 0.03-0.06, pauses <=0.2). Measure duration; need 61-65 s.
4. **Word timings**: ffmpeg to 16 kHz mono, then faster-whisper (ep0-v2/align.py).
5. **Hook preview (5 s ONLY)**: build scene per the inside-3d-quality skill; render with `npm run render -- epN 5`; send preview.mp4 to the user; WAIT for approval. Never full render before it (TOKEN GUARD).
6. **Full render** only after approval; verify duration 61-65 s and the GPU line says Apple M3.
7. Save everything to git (script, timings, notes) and update PROJECT_BRIEF.md status.
