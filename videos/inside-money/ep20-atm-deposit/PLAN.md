# EP20 "What if you could ride your $1,000 inside the ATM?" (user idea 2026-11-11)
- Script v1 = SCRIPT.md, hook #1 chosen by the user. NOT voiced, NOT built.
- NEXT (new session): verify facts.md with primary sources BEFORE the voice:
  - Reg CC funds availability: cash at the bank's own ATM -> by 2nd business day (12 CFR 229.10); non-proprietary ATM -> up to 5th business day (12 CFR 229.12); many banks release sooner.
  - Cutoff time: deposits after cutoff / weekends count on the next business day (12 CFR 229.19).
  - Deposit ATMs check bills for counterfeits (sensors: size, ink, security features).
  - Banks send excess cash to the Federal Reserve; the Fed destroys unfit notes (federalreserve.gov currency processing).
  - ATM miscount -> receipt + report quickly (Reg E error resolution).
- Then: voice (Kokoro am_liam, one take) -> timeline -> copy render-kit/ep4.html style / ep19.html helpers -> 5-s hook preview -> wait for approval -> full render.
- DONE 2026-11-11 (Mac): facts.md verified (Reg CC 229.10/229.12/229.19, Fed shredding, ATM validators). Voice full.tts.txt (242 words) -> Kokoro am_liam 0.95 max_gap .08 ONE take -> vo_full.wav 64.2 s (no pause >= .12 s). Timeline make_timeline_full.py -> render-kit/timeline_ep20full.json (dur 64.42).
- Page: render-kit/ep20.html = ep19.html lines 1-112 (renderer + Maple Street helpers) + _ep20parts/hook.part.js + ep19 renderAt tail (rebuild with the cat command in the hook part header if you edit the part; or edit ep20.html directly once the story starts).
- HOOK (0-5.8 s): bank with an ATM on Maple Street, daylight; Mike feeds ten $100 bills ("$1,000" green 3D above), gets pulled into the slot shrinking (legs last) -> camera dives into the slot -> white flash -> giant ATM interior (circuit-board wall, conveyor belt, yellow/black rails, counter rollers ahead); Mike rides a raft of ten giant $100 bills (no strap band: it is $1,000, not $10,000), arms up screaming; loose bills fly behind him. Mix mix_ep20.py: ting 0, cash on "thousand", whoosh on "inside", whoosh on the flash, whoosh on "sucks".
- Preview: npm run render -- ep20 5.8 -> render-kit/ep20-atm-deposit-preview-5.8s.mp4. WAIT for approval, then build the story (SCRIPT.md beats from "First stop").
- Worktree note: render-kit node_modules / dl / frames are symlinks to ~/benny-bucks/videos/inside-money/render-kit (untracked).
- HOOK v2 (user feedback 2026-11-11: too many elements, too much glow on the money and on the first $1,000, same action too long; wanted close angle -> pull back to show the whole path in 3 ordered tracks):
  calm plain bank wall (white stucco), $1,000 low glow (ei .18), bloom .18/1.7; interior = plain navy wall + 3 stacked tracks (1 COUNT rollers / 2 SCAN gate / 3 LOCKED BOX), no circuit board, no LED strips, no flying bills;
  camera: close ride (Mike surfs) -> pull back to the wide 3-track view, labels 1-2-3 pop (Mike points down the path) -> whoosh back close on "sucks" toward the counter. Raft = ten $100 bills (GS 9).
