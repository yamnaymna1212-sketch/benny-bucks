# EP6 "He finds $10 million under his house" (Danny) - plan + STATUS 2026-11-01
Idea = the user's: a naive, honest guy digs under his house at 3 AM, finds a trunk with $10M, two friends give opposite advice (Rick = scared "bank = SWAT + helicopter", Tara = tempter "keep it, buy a Ferrari"), he takes it to the bank (no SWAT, routine form, certificate, photos, coffee), goes home, the IRS letter: found treasure = income (Cesarini piano case 1964) -> ~ $3.65M federal, he keeps ~ $6.35M. Regret payoff: "His only regret? Telling Tara." Vote: Rick / Tara / Danny.
- Hook (user's words, grammar fixed): "He finds ten million dollars under his house, and he's so happy he does something he'll regret for life." then "His name is Danny, and he wakes up two friends."
- Script: lines.txt (247 words). Facts + sources + numbers to re-check: facts.md. PUBLISH.md NOT written yet (do it with the render).
## DONE
- Voice: Kokoro am_liam speed 1.0, ONE continuous take (one.tts.txt -> vo.wav), 64.6 s, 4 pauses (longest 0.13 s). Word timings words_raw.json (faster-whisper) -> make_timeline.py -> render-kit/timeline_ep6.json (words, 2-3-word caption chunks, per-line start times).
- Scene render-kit/ep6.html = ep5's Maple Street at NIGHT (moon light, lit windows): pit through floor/foundation/ground (ringBox helper), plank rim, dirt pile, shovel, ladder, work lamp, 3:00 AM red clock, trunk with 30 straps of $100s (1,000 straps = $10M; real size scaled up 1.25), Danny (cast guard.glb recoloured to pajamas), phone, floating GREEN $10,000,000 + white DANNY. ONE continuous Catmull-Rom camera through KEYS (no cuts).
- Hook mix ep6-found-10m/mix_ep6.py -> render-kit/mix_ep6.wav. Hook preview ep6-found-10m/hook-preview-5s-v1.mp4 (rendered `node render.mjs ep6 5` from render-kit). Awaiting user feedback on the hook.
## HOOK v2/v3 (user feedback 2026-11-01)
- v2: Danny = Mike (cast mike.glb, the channel hero; never another model), brighter night, digging + mound + dirt, real heaped cash, glow.
- v3: deep shaft (PIT.y -2.6, 3 m), everything in the shaft (dig -> clink HIT .5 -> shock -> jump with strap -> phone at the RIGHT ear via a one-time arm solver); time-aware Hermite camera (no jerks); soil walls inset .01 (z-fight flicker fixed); lid latch was glowing on his chest (dimmed, Danny moved back).
- Voice re-made for natural human pacing: speed 1.0, max_gap 0.26 (pauses <= ~0.58 s at sentence ends), 0.45 s pre-roll baked into vo.wav, 62.67 s total. Cut 'The whole bank stops to look.' to stay <= 65 s.
- SFX rule (user): joy SFX ONLY inside the joy words (trimmed with cut()), regret = boom + fahh; fill pauses with SFX.
- Preview: hook-preview-5s-v3.mp4. APPROVED by the user 2026-11-01.
## STORY v1 (2026-11-01)
- ep6.html: Rick = guard.glb in pajamas (west house x=-27, cutaway), Tara = printer.glb (glasses hidden, pink tee; east house x=11), teller/manager in a hollow bank at (-20,22.8); SWAT = guard.glb in black + helmet/vest. Night -> sunrise lerp 21.3-24.2 s.
- One camera through ~50 keys (monotone Hermite). Bank exit: teller waves goodbye while Danny's position jumps to the street (camera looking away).
- Cut 'The whole bank stops to look.' (lines.txt, one.tts.txt) to keep 62.7 s.
- Mix: story SFX block in mix_ep6.py. Captions: make_timeline.py fixes ("We'll", "$3.65", "$6.35").
- Outputs: render-kit/ep6-found-10m.mp4 (git-ignored), ep6-found-10m/ep6-found-10m-phone.mp4, PUBLISH.md.
## NEXT (in order)
1. Apply the user's hook feedback (known weak spots: phone is held at the shoulder not the ear; Danny at the edge of the pit shot; dark exposure; face expression limited). Re-render the 5-s preview ONLY. Wait for approval.
2. Build the story in ep6.html with the SAME rules as EP5 (see PROJECT_BRIEF "EP5/EP6 feedback rules"): continuous camera flying between scenes, idle motion on every character, a prop/pop/event every 2 s, nothing static. Beats per line: Rick (helicopter + SWAT in his imagination bubble over Maple St), Tara (mansion/Ferrari bubble), Danny loads the trunk on the pickup, drives to FIRST NATIONAL BANK (shop() exists), lobby scene (new set: teller, manager = cast teller/manager GLBs, certificate, photographer, coffee), routine form (CTR) pop, walk home, mailbox, IRS letter, Cesarini piano + $4,467 pop, tax split visual ($10M stack -> 36.5% taken by IRS agents -> $6.35M left), Tara knocks on the door (payoff), vote signs Rick/Tara/Danny.
3. Add story SFX to mix_ep6.py, make stills sheets (sh sheet6.sh out.jpg t1 t2 ...) for every beat, then full render `node render.mjs ep6` FROM render-kit (npm run only works inside render-kit), phone copy crf 26, ep6-found-10m/PUBLISH.md (rule in PROJECT_BRIEF section 0).
4. Before posting: re-verify facts.md numbers on primary sites; 'Education only, not legal or tax advice'; AI label.
