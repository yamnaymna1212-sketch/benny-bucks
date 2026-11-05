---
name: token-saving-without-quality-loss
description: "User rule 2026-11-02 - save tokens by cutting useless actions, never by lowering video quality; warn the user when I drift or repeat errors that burn tokens"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 0b3e682e-bdcd-54af-ba3a-d5615c8ae985
  modified: 2026-11-04T08:19:19.081Z
---

Drop every action that does not clearly improve the video or burns tokens: no reading big files whole (grep/offset the needed section), no reading "just in case", no repeated debug rounds, no extra stills/contact sheets beyond what a fix needs, no unrequested model-switch churn.

**Why:** EP5 build session (2026-11-02) burned a day's tokens: whole-file reads of ep5.html/ep4.html, 15+ image batches, repeated avoidable errors (macOS sed, unbalanced brackets, camera spline overshoot), no warning before the full render.

**How to apply:** Never lower video quality to save tokens (resolution, cast, glow, SFX, camera polish stay). Save instead by: targeted greps, one fix pass per feedback batch, 3-4 stills per check, one episode per session. WARN the user (Arabic, 1-2 lines) as soon as I notice I am looping, repeating an error, or the session is long (>~50% context), and suggest a new session. See [[inside-money-latest-rules]] and TOKEN GUARD in CLAUDE.md.

EP10 lessons (2026-11-04, user asked again why tokens burn): (1) voice re-recorded 4x - estimate first: Kokoro am_liam .95 = ~2.85 words/s, so 61-65 s needs ~185-190 spoken words; (2) 5 still rounds for framing - compute fit first: 9:16 frame at vertical fov F has horizontal fov ~2*atan(tan(F/2)*.5625); distance to fit width w = (w/2)/tan(hfov/2); keep key text above the caption line (74 %); (3) the long chat itself is the biggest cost (every turn re-sends history) - start the full build of an episode in a NEW session after the hook is approved.
