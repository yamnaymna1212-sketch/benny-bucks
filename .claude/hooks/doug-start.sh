#!/bin/bash
# SessionStart: remind every new session which channel is active (user asked for this to be automatic).
cat <<'MSG'
ACTIVE CHANNEL = "Doug the Penguin". For any video idea, script, voice, hook or render: use the `doug-episode` skill,
read only the last 20 lines of PROJECT_LOG.md, follow the TOKEN GUARD in CLAUDE.md (warn before expensive steps, offer the cheaper option).
Talk to the user in Arabic. Ignore references/monkey unless asked (style study only).
تذكير: قاعدة الحلقات = videos/penguin-series/style-v2-3-reasons.md (صوت am_fenrir 1.22، بلا am_michael، بلا كلام بدائي، بلا وسوم RECORD/TODAY). اكتب: Use the doug-episode skill + فكرة الحلقة.
MSG
