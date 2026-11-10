---
name: inside-money-single-delivery-file
description: "Always deliver ONE video file per episode — best quality for TikTok, plays on phone and desktop; no separate low-quality phone copy"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 3f195a5f-0ddb-43fb-9858-f32eaa2b5576
  modified: 2026-11-03T20:47:36.027Z
---

Always give the user ONE final file per episode: the highest-quality render, H.264 High + AAC, yuv420p (plays on iPhone/Android/desktop and is the best source for TikTok). Do NOT make or offer a separate small "phone copy".

**Why:** user said (2026-11-03) "always give me one version that opens on phone and desktop and best quality for TikTok". The old ~7 MB phone copy (0.8 Mbps) looked worse than the full render (~4.9 Mbps).

**How to apply:** after the full render, name it clearly (e.g. ep<N>-<slug>.mp4), verify with ffprobe (h264, yuv420p, aac), send/point to that one file only. If a git-size limit needs a smaller copy, keep it internal and never present it as the deliverable. Related: [[inside-money-publish-kit-rule]], [[token-saving-without-quality-loss]].
