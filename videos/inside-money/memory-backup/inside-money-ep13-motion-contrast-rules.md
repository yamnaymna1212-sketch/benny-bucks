---
name: inside-money-ep13-motion-contrast-rules
description: "EP13 feedback for every next video - steady camera (no shake), no haze/blur, never stay in one place long, characters react visibly, subject always centred, icons crisp high-contrast like Zack"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 25d99dd0-5e3f-42fc-be3e-f83d21a312e5
  modified: 2026-11-05T11:16:21.263Z
---

User rules 2026-11-05 (after EP13 El-Sayed, with 4 Zack D. Films screenshots: big white "6:10 AM" + white sunrise/plane icons on a dark blue wall, tight face close-ups, thought bubble with a scene inside). Apply from the NEXT video (EP13 was kept as rendered):
- Camera: NO shake/jitter (turn off the handheld micro-shake in ep10_anim.js `shake()` and keep CK.boom very small or off). NO haze/fog look: no soft bloom wash, no depth-of-field blur that makes the picture misty; image crisp.
- Never stay in the same place/framing for long: something changes every ~2 s (camera move, subject moves, or an icon pops).
- Characters must move and REACT visibly (big readable gestures, head turns, surprise), never stiff/frozen.
- Camera angle: the element the voice talks about is ALWAYS centred. If that line runs long -> move the camera, move the element, or show icons.
- Icons/3D words: clear and solid, high contrast (white or saturated flat colour on a darker, simple background, like Zack), never faded/washed-out/transparent.

**Why:** the user compared EP13 with Zack's shorts (1M likes): Zack's frames are steady, crisp, centred and the icons pop against a plain dark background.
**How to apply:** check every still for: centred subject, no blur/haze, icon contrast; drop `shake()` and BokehPass blur in the next scene file. Related: [[inside-money-pacing-cta-rules]], [[inside-money-glow-highlight-style]], [[inside-money-ep12-hook-camera-rules]].
