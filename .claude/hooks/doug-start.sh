#!/bin/bash
# SessionStart: remind every new session which channel is active (user asked for this to be automatic).
cat <<'MSG'
ACTIVE CHANNEL = "Doug the Penguin".
- ANY request for video ideas / topics / "new video" / "strong comparison" (Arabic or English, even without naming the skill):
  invoke the `doug-ideas` skill FIRST (web research, never ideas from memory). User rule 2026-10-28.
- For a chosen idea, script, voice, hook or render: use the `doug-episode` skill.
Read only the last 20 lines of PROJECT_LOG.md, follow the TOKEN GUARD in CLAUDE.md (warn before expensive steps, offer the cheaper option).
Talk to the user in Arabic. Ignore references/monkey unless asked (style study only).
MSG
