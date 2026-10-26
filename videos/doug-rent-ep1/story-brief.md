# EP1 Rent — NEW STORY BRIEF from the user (2026-10-26, replaces the old script.md story)
Talk to the user in Arabic. Video text/voice in English. Doug Pays · Ep. 1, 61–65 s, Night look, youthful Kokoro voice (am_puck, speed ~1.13, pauses 0.05–0.07 s; tools/tts.py).

## Hook (organized, easy, ONE look)
- Left: Doug with only $200 (green card). Right: American house + US flag, the landlord (Larry the walrus) ANGRY next to it, demanding $1,600 (red card).
- Big text on top: "IF YOU DON'T PAY RENT..." Nothing else on screen. Start from studio/src/videos/dougPaysHook.tsx (current split hook: Doug left $200 / house right $1,600) and add angry Larry + the top line.

## Story (gradual, organized escalation; must feel like a real story; viewer stays to the end)
1. Landlord demands the rent; if not paid by end of month, Doug and his family are out of the house.
2. "This is Doug. Doug has $200." His whole paycheck went on car repair, groceries, going out. Only $200 left.
3. Landlord calls: pay $1,600 NOW. Doug is shocked; thinks of his baby son, his daughter in school, his wife (user wrote "زوجته كبيرة" — ask: older wife or also an old mother?).
4. Options fail one by one: Loan? No steady job. Borrow from friends? All broke / worse off. Sell his stuff? Owns nothing — he rents everything. Doug cries.
5. Landlord calls again: "Tonight. No money, I come with the police."
6. JOKE beat (user idea): Doug wants to become a duck / wants to rage-quit the game, etc.
7. A solution -> it FAILS.
8. One hour before the landlord arrives: a very CLEVER solution, Doug gets money.
9. But that creates ANOTHER problem -> solved step by step.
10. Ending: viewer leaves with a useful takeaway + strong story + clever trick. Last line = comment question that sets up Ep. 2.

## Rules to respect (credibility, user's analytics rules)
- In the US a landlord cannot legally evict "tonight with police" — eviction needs a court order. Keep the threat as Larry's bluff/gag, and make the takeaway true (e.g., "a landlord can't throw you out without a court order" — VERIFY with sources).
- The clever solution must be real and legal; verify it (examples to check: emergency rental assistance / dial 211, asking for a payment plan in writing, partial payment). No made-up numbers; cite sources on cards.
- Cast: only Doug + family are penguins; landlord = Larry the walrus; police = another snow animal. 1 fish = $10. One idea per scene, new info every 5–8 s, strongest fact near the end.

## State (what exists)
- Old voice/script (videos/doug-rent-ep1/vo, script.md) = OLD story -> regenerate voice from the new script after the user approves it.
- Render: `cd studio && npm install`; pass `--browser-executable=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome`.
- Kokoro: `python3 -m venv /opt/tts/venv && /opt/tts/venv/bin/pip install kokoro-onnx soundfile numpy`, model files from github.com/thewh1teagle/kokoro-onnx releases model-files-v1.0 (kokoro-v1.0.onnx, voices-v1.0.bin) into /opt/tts.
- SFX: `/opt/tts/venv/bin/python tools/sfx.py && /opt/tts/venv/bin/python tools/sfx_animals.py && /opt/tts/venv/bin/python tools/import_user_sfx.py`.
- Order: script (user approves) -> voice -> hook preview (stills + ~5 s mp4) -> WAIT approval -> full build + one render.
