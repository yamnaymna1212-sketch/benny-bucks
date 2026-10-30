#!/bin/bash
# SessionStart: remind every new session which channel is active (phone or desktop).
cat <<'MSG'
ACTIVE CHANNEL = "Inside Money" (3D cutaway videos, how money/banks/finance work). Doug the Penguin is LEGACY.
- FIRST read videos/inside-money/PROJECT_BRIEF.md, then the episode folder (e.g. videos/inside-money/ep2-dig-200m/PLAN.md + SCRIPT.md). Setup of a new machine: videos/inside-money/SETUP.md.
- Do NOT use the doug-episode / doug-ideas skills unless the user asks to resume Doug.
- Reference videos (style): references/inside-money/examples + zack, analysis in videos/inside-money/REFERENCE_ANALYSIS.md.
- Rules: 61-65 s (under 60 rejected), captions 1 word, hook = 5-s preview BEFORE any full render (TOKEN GUARD in CLAUDE.md), re-verify every fact + live prices before final, voice = one take.
Talk to the user in Arabic. Phone/cloud sessions cannot render on the Mac GPU: write scripts/plans/code there, render on the Mac.
MSG
